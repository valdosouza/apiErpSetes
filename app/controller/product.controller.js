const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.product;
const price = require('./price.controller.js');
const priceList = require('./priceList.controller.js');

class ProdcutController extends Base {

  static async sync(product) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        delete product.name_category;
        var regProd = await this.getById(product.tb_institution_id, product.id);
        if (regProd.id == 0) {
          await Tb.create(product);
        } else {
          Tb.update(product, {
            where: { id: product.id, tb_institution_id: product.tb_institution_id }
          })
        }
        resolve({
          code: product.id,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("ProductController.sync:" + error);
      }
    });
    return promise;
  }

  static async insert(product) {
    const promise = new Promise(async (resolve, reject) => {
      const nextId = await this.getNextId(product.tb_institution_id);
      product.id = nextId;
      if (product.validity == '') delete product.validity;
      Tb.create(product.product)
        .then((data) => {
          var dataPrice = {};
          for (var item of product.pricelist) {
            dataPrice = {
              tb_institution_id: product.tb_institution_id,
              tb_price_list_id: item.id,
              tb_product_id: data.id,
              price_tag: item.price_tag
            }
            //Quanto o insert é menos complexo insert direto não precisa do await no loop                     
            price.insert(dataPrice);
          };
          resolve(product);
        })
        .catch(err => {
          reject("product.insert:" + err);
        });
    });
    return promise;
  }

  static getList(body) {
    const promise = new Promise((resolve, reject) => {
      var description = "";
      var sqltxt = 'select ' +
        'p.id, ' +
        'p.tb_institution_id, ' +
        'p.description, ' +
        'p.active ' +
        'from tb_product p ' +
        'where (p.tb_institution_id =? ) ' +
        ' and (p.active = ?)'+
        ' and (p.published = ?) ';
      if (body.name_product != "") {
        description = '%' + body.name_product + '%';
        sqltxt += ' and (p.description like ? ) ';
      } else {
        description = "";
        sqltxt += ' and (p.description <> ?) ';
      }
      sqltxt +=
        ' order by description ' +
        ' limit ' + ((body.page - 1) * 20) + ',20 ';

      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [body.tb_institution_id, 'S','S', description],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("product.getlist: " + err);
        });
    });
    return promise;
  }

  static async getById(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'id, ' +
        'tb_institution_id, ' +
        'description, ' +
        'active ' +
        'from tb_product ' +
        'where ( tb_institution_id =? ) ' +
        ' and ( id=? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            resolve(data[0]);
          } else {
            resolve({ id: 0 });
          }
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };

  static get(tb_institution_id, id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};

        if (id > 0) {
          const dataProduct = await this.getById(tb_institution_id, id);
          result.product = dataProduct;
        } else {
          result.product = {
            id: 0,
            tb_institution_id: 1,
            description: "",
            active: "N"
          }
        }
        const dataPrice = await price.getList(tb_institution_id, id);
        result.pricelist = dataPrice;
        resolve(result);
      }
      catch (err) {
        reject('get: ' + err);
      }
    });
    return promise;
  }

  static async getPrice(tb_institution_id, tb_price_list_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select prd.id, prd.description name_product, prc.price_tag ' +
        'from tb_product prd ' +
        '  inner join tb_price prc ' +
        '  on (prd.id = prc.tb_product_id) ' +
        '  and (prd.tb_institution_id = prc.tb_institution_id) ' +
        'where (prd.tb_institution_id =? )  ' +
        'and ( prc.tb_price_list_id =? ) ',
        {
          replacements: [tb_institution_id, tb_price_list_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };

  static async getPriceByProduct(tb_institution_id, tb_product_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select prd.tb_institution_id, prd.id tb_product_id, prd.description name_product,prl.id tb_price_list_id, prl.description name_price_list, prc.price_tag ' +
        'from tb_price prc ' +
        '  inner join tb_price_list prl ' +
        '  on (prc.tb_price_list_id = prl.id) ' +
        '  and (prc.tb_institution_id = prl.tb_institution_id) ' +
        '  inner join tb_product prd  ' +
        '  on (prc.tb_product_id = prd.id)  ' +
        '  and (prc.tb_institution_id = prd.tb_institution_id)  ' +
        'where (prc.tb_institution_id =? )  ' +
        'and ( prc.tb_product_id =? ) '+
        'and ( prl.published =? ) ',
        {
          replacements: [tb_institution_id, tb_product_id,'S'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var dataResult = {};
          if (data.length > 0) {
            dataResult = {
              tb_institution_id: data[0].tb_institution_id,
              id: data[0].tb_product_id,
              name_product: data[0].name_product,
            }
            var items = [];
            var itemResult = {};
            for (var item of data) {
              itemResult = {
                id: item.tb_price_list_id,
                name_price_list: item.name_price_list,
                price_tag: Number(item.price_tag)
              }
              items.push(itemResult);
            }
            dataResult.items = items;
            resolve(dataResult);
          } else {
            resolve("Sem dados");
          }
        })
    });
    return promise;
  };

  static priceListGetAll(tb_institution_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var vetPriceList = [];
        var jsonPriceList = {};

        var vetProductPriceList = [];
        var jsonProductPrice = {};

        var dataProductPriceList = [];

        await priceList.getList(tb_institution_id)
          .then(async data => {
            for (var item of data) {
              dataProductPriceList = await this.getPrice(tb_institution_id, item.id);
              vetProductPriceList = [];
              for (var itemPrice of dataProductPriceList) {

                jsonProductPrice = {
                  id: itemPrice.id,
                  name_product: itemPrice.name_product,
                  price_tag: Number(itemPrice.price_tag),
                };
                vetProductPriceList.push(jsonProductPrice);
              }
              jsonPriceList = {
                tb_price_list_id: item.id,
                name_price_list: item.description,
                product_price: vetProductPriceList,
              }
              vetPriceList.push(jsonPriceList);
            }
          });
        resolve(vetPriceList);
      }
      catch (err) {
        reject('priceListGetAll: ' + err);
      }
    });
    return promise;
  }


  static async update(product) {
    const promise = new Promise((resolve, reject) => {

      if (product.validity == '') delete product.validity;
      Tb.update(product.product, {
        where: { id: product.id }
      })
      //grava o preço
      var pricelist = product.pricelist;
      var dataPrice = {};
      for (var item of pricelist) {

        dataPrice = {
          tb_institution_id: product.tb_institution_id,
          tb_price_list_id: item.id,
          tb_product_id: product.id,
          price_tag: item.price_tag
        }
        price.update(dataPrice);
      }
      resolve(product);
    });
    return promise;
  }

  static async delete(product) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(product)
          .then((data) => {
              resolve(data);
          })
          .catch(err => {
              reject("Erro:"+ err);
          });
      */
    });
    return promise;
  }

}
module.exports = ProdcutController;