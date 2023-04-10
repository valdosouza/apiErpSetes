const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.stockBalance;
const product = require("./product.controller.js");

class StockBalanceController extends Base {

  static async insert(price) {
    const promise = new Promise(async (resolve, reject) => {
      Tb.create(price)
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("price.insert:" + err);
        });
    });
    return promise;
  }

  static getList(body) {
    const promise = new Promise((resolve, reject) => {
      var description = '';
      var sqltxt =
        'select ' +
        'stb.tb_institution_id, ' +
        'stb.tb_stock_list_id, ' +
        'stl.description name_stock_list, ' +
        'stb.tb_merchandise_id, ' +
        'prd.description name_merchandise, ' +
        'stb.quantity ' +
        'from tb_stock_balance stb ' +
        '  inner join tb_stock_list stl   ' +
        '  on (stl.id = stb.tb_stock_list_id) ' +
        '    and (stl.tb_institution_id = stb.tb_institution_id) ' +
        '  inner join tb_product prd ' +
        '  on (prd.id = stb.tb_merchandise_id)  ' +
        '  and (prd.tb_institution_id = stb.tb_institution_id)   '+
        'where stb.tb_institution_id =? ' +
        '  and stb.tb_stock_list_id =? ' +
        ' and (prd.active = ?)';

      if (body.name_product != "") {
        description = '%' + body.name_product + '%';
        sqltxt += ' and (prd.description like ? ) ';
      } else {
        description = '';
        sqltxt += ' and (prd.description <> ?) ';
      }


      sqltxt += ' order by prd.description ';
      if (body.page > 0) {
        sqltxt += ' limit ' + ((body.page - 1) * 20) + ',20 ';
      }
      
      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [body.tb_institution_id, body.tb_stock_list_id, 'S', description],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            var dataResult = {
              id: data[0].id,
              tb_institution_id: data[0].tb_institution_id,
              tb_stock_list_id: data[0].tb_stock_list_id,
              name_stock_list: data[0].name_stock_list,
            };
            var items = [];
            var itemResult = {};
            for (var item of data) {
              itemResult = {
                tb_merchandise_id: item.tb_merchandise_id,
                name_merchandise: item.name_merchandise,
                quantity: item.quantity
              }
              items.push(itemResult);
            }
            dataResult.items = items;
            resolve(dataResult);
          } else {
            var dataResult = {
              id: 0,
              tb_institution_id: tb_institution_id,
              tb_stock_list_id: 0,
              name_stock_list: "",
            };
            var items = [];
            dataResult.items = items;
            resolve(dataResult);

          }
        })
        .catch(err => {
          reject("StockBalance.getlist: " + err);
        });
    });
    return promise;
  }

  static getListBySalesman(body) {
    const promise = new Promise((resolve, reject) => {
      var description = "";
      var sqltxt =
        'select ' +
        'stb.tb_institution_id,' +
        'stb.tb_stock_list_id,' +
        'stl.description name_stock_list, ' +
        'stb.tb_merchandise_id, ' +
        'prd.description name_merchandise, ' +
        'stb.quantity ' +
        'from tb_stock_balance stb ' +
        '  inner join tb_stock_list stl   ' +
        '  on (stl.id = stb.tb_stock_list_id) ' +
        '    and (stl.tb_institution_id = stb.tb_institution_id) ' +
        
        '  inner join tb_product prd ' +
        '  on (prd.id = stb.tb_merchandise_id)  ' +
        '    and (prd.tb_institution_id = stb.tb_institution_id) ' +
        
        '  inner join tb_entity_has_stock_list ehs  ' +
        '  on (ehs.tb_stock_list_id = stb.tb_stock_list_id)  ' +
        '    and (ehs.tb_institution_id = stb.tb_institution_id) ' +
        
        '  inner join tb_collaborator c ' +
        '  on (c.id = ehs.tb_entity_id) ' +
        '    and (c.tb_institution_id = ehs.tb_institution_id) ' +
        'where stb.tb_institution_id =?   ' +
        'and ehs.tb_entity_id =?   ' +
        ' and (prd.active = ?)';
      if (body.name_product != "") {
        description = '%' + body.name_product + '%';
        sqltxt += ' and (prd.description like ? ) ';
      } else {
        description = "";
        sqltxt += ' and (prd.description <> ?) ';
      }


      sqltxt +=
        ' order by prd.description ' +
        ' limit ' + ((body.page - 1) * 20) + ',20 ';


      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [body.tb_institution_id, body.tb_salesman_id, 'S', description],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            var dataResult = {
              id: data[0].id,
              tb_institution_id: data[0].tb_institution_id,
              tb_stock_list_id: data[0].tb_stock_list_id,
              name_stock_list: data[0].name_stock_list,
            };
            var items = [];
            var itemResult = {};
            for (var item of data) {
              itemResult = {
                tb_merchandise_id: item.tb_merchandise_id,
                name_merchandise: item.name_merchandise,
                quantity: Number(item.quantity)
              }
              items.push(itemResult);
            }
            dataResult.items = items;
            resolve(dataResult);
          } else {
            var dataResult = {
              id: 0,
              tb_institution_id: body.tb_institution_id,
              tb_stock_list_id: 0,
              name_stock_list: "",
            };
            var items = [];
            dataResult.items = items;
            resolve(dataResult);

          }
        })
        .catch(err => {
          reject("StockBalance.getListBySalesman: " + err);
        });
    });
    return promise;
  }

  static getListAllCustomer(tb_institution_id, tb_salesman_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'stb.tb_merchandise_id, ' +
        'prd.description name_merchandise, ' +
        'sum(stb.quantity) quantity ' +
        'from tb_stock_balance stb ' +
        '  inner join tb_stock_list stl ' +
        '  on (stl.id = stb.tb_stock_list_id) ' +
        '    and (stl.tb_institution_id = stb.tb_institution_id) ' +
        '  inner join tb_product prd ' +
        '  on (prd.id = stb.tb_merchandise_id) ' +
        '  inner join tb_entity_has_stock_list ehs ' +
        '  on (ehs.tb_stock_list_id = stb.tb_stock_list_id) ' +
        '    and (ehs.tb_institution_id = stb.tb_institution_id) ' +
        '  inner join tb_customer ct ' +
        '  on (ct.id = ehs.tb_entity_id) ' +
        '    and (ct.tb_institution_id = ehs.tb_institution_id) ' +
        'where stb.tb_institution_id =?  ' +
        'and ct.tb_salesman_id =?  ' +
        'group by 1,2 ',
        {
          replacements: [tb_institution_id, tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            var dataResult = {
              id: data[0].id,
              tb_institution_id: data[0].tb_institution_id,
              tb_stock_list_id: data[0].tb_stock_list_id,
              name_stock_list: data[0].name_stock_list,
            };
            var items = [];
            var itemResult = {};
            for (var item of data) {
              itemResult = {
                tb_merchandise_id: item.tb_merchandise_id,
                name_merchandise: item.name_merchandise,
                quantity: Number(item.quantity)
              }
              items.push(itemResult);
            }
            dataResult.items = items;
            resolve(dataResult);
          } else {
            var dataResult = {
              id: 0,
              tb_institution_id: tb_institution_id,
              tb_stock_list_id: 0,
              name_stock_list: "",
            };
            var items = [];
            dataResult.items = items;
            resolve(dataResult);
          }
        })
        .catch(err => {
          reject("StockBalance.getListAllCustomer: " + err);
        });
    });
    return promise;
  }

  static getAllBySalesman(tb_institution_id, tb_salesman_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  tb_merchandise_id, ' +
        '  name_merchandise, ' +
        '  sum(quantity) quantity ' +
        'from ( ' +
        '  select  ' +
        '  stb.tb_merchandise_id,  ' +
        '  prd.description name_merchandise,  ' +
        '  sum(stb.quantity) quantity ' +
        '  from tb_stock_balance stb  ' +
        '    inner join tb_stock_list stl    ' +
        '    on (stl.id = stb.tb_stock_list_id)  ' +
        '      and (stl.tb_institution_id = stb.tb_institution_id)  ' +
        '    inner join tb_product prd  ' +
        '    on (prd.id = stb.tb_merchandise_id)   ' +
        '    inner join tb_entity_has_stock_list ehs   ' +
        '    on (ehs.tb_stock_list_id = stb.tb_stock_list_id)   ' +
        '      and (ehs.tb_institution_id = stb.tb_institution_id)  ' +
        '    inner join tb_customer ct  ' +
        '    on (ct.id = ehs.tb_entity_id)  ' +
        '      and (ct.tb_institution_id = ehs.tb_institution_id)  ' +
        '  where stb.tb_institution_id =? ' +
        '  and ct.tb_salesman_id =? ' +
        '  group by 1,2 ' +
        '   union ' +
        '   select  ' +
        '   stb.tb_merchandise_id,  ' +
        '   prd.description name_merchandise, ' +
        '   stb.quantity  ' +
        '   from tb_stock_balance stb ' +
        '     inner join tb_stock_list stl ' +
        '     on (stl.id = stb.tb_stock_list_id)  ' +
        '       and (stl.tb_institution_id = stb.tb_institution_id)  ' +
        '     inner join tb_product prd  ' +
        '     on (prd.id = stb.tb_merchandise_id)   ' +
        '     inner join tb_entity_has_stock_list ehs   ' +
        '     on (ehs.tb_stock_list_id = stb.tb_stock_list_id)   ' +
        '       and (ehs.tb_institution_id = stb.tb_institution_id)  ' +
        '     inner join tb_collaborator c  ' +
        '     on (c.id = ehs.tb_entity_id)  ' +
        '       and (c.tb_institution_id = ehs.tb_institution_id) ' +
        '   where stb.tb_institution_id =?   ' +
        '   and ehs.tb_entity_id =? ' +
        ' ) tb_stock_by_salesman ' +
        ' group by 1,2  ',
        {
          replacements: [tb_institution_id, tb_salesman_id, tb_institution_id, tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            var dataResult = {
              id: data[0].id,
              tb_institution_id: data[0].tb_institution_id,
              tb_stock_list_id: data[0].tb_stock_list_id,
              name_stock_list: data[0].name_stock_list,
            };
            var items = [];
            var itemResult = {};
            for (var item of data) {
              itemResult = {
                tb_merchandise_id: item.tb_merchandise_id,
                name_merchandise: item.name_merchandise,
                quantity: Number(item.quantity)
              }
              items.push(itemResult);
            }
            dataResult.items = items;
            resolve(dataResult);
          } else {
            var dataResult = {
              id: 0,
              tb_institution_id: tb_institution_id,
              tb_stock_list_id: 0,
              name_stock_list: "",
            };
            var items = [];
            dataResult.items = items;
            resolve(dataResult);

          }
        })
        .catch(err => {
          reject("StockBalance.getListAllCustomer: " + err);
        });
    });
    return promise;
  }

  static async delete(price) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(price)
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

  static autoInsertByStokcList(tb_institution_id, tb_stock_list_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataProduct = await this.productGetList(tb_institution_id);
        var dataPrice = {};
        for (var item of dataProduct) {
          dataPrice = {
            tb_institution_id: tb_institution_id,
            tb_stock_list_id: tb_stock_list_id,
            tb_merchandise_id: item.id,
            quantity: 0
          }
          await Tb.create(dataPrice);
        }
        resolve("Estoque adicionado");
      } catch (err) {
        reject('autoInsertByStockList: ' + err)
      }
    });
    return promise;
  }

  static productGetList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'id, ' +
        'tb_institution_id, ' +
        'description, ' +
        'active ' +
        'from tb_product p ' +
        'where (p.tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("stockBalance." + err);
        });
    });
    return promise;
  }


}
module.exports = StockBalanceController;