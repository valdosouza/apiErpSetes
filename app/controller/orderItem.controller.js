const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderitem;

class OrderItemController extends Base {
  static async getNextId(tb_institution_id, tb_order_id, kind) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(id) lastId ' +
        'from tb_order_item ' +
        'WHERE ( tb_institution_id =? ) ' +
        ' and (tb_order_id =?)' +
        ' and ( kind =? ) ',
        {
          replacements: [tb_institution_id, tb_order_id, kind],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var nextId = 1;
          if (data.length > 0) {
            nextId = data[0].lastId + 1;
          }
          resolve(nextId);
        })
        .catch(err => {
          reject('orderItem.getNexId: ' + err);
        });
    });
    return promise;
  }

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        for (var item of body) {

          if (item != null) {
            var regOrderItem = await this.getById(item.id, item.tb_order_id, item.tb_institution_id, item.terminal);
            if (regOrderItem.id == 0) {

              await Tb.create(item);
            } else {
              await Tb.update(item, {
                where: {
                  tb_institution_id: item.tb_institution_id,
                  tb_order_id: item.tb_order_id,
                  id: item.id,
                  terminal: item.terminal,
                }
              });
            }
          }
        }
        resolve({
          code: body.id,
          id: 200,
          Message: "SYNCHED"
        });

      } catch (error) {
        reject("OrderItemController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id, tb_order_id, tb_institution_id, terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_order_item ' +
          'where ( id =?) ' +
          ' and ( tb_order_id= ?) ' +
          ' and ( terminal= ?) ' +
          ' and (tb_institution_id =?) ',
          {
            replacements: [id, tb_order_id, terminal, tb_institution_id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data.length > 0)
              resolve(data[0])
            else
              resolve({ id: 0 });
          })
      } catch (error) {
        reject('OrderItemController.getById: ' + err);
      }
    });
    return promise;
  };

  static async insert(item) {
    const promise = new Promise(async (resolve, reject) => {
      const nextId = await this.getNextId(item.tb_institution_id, item.tb_order_id, item.kind);
      item.id = nextId;
      Tb.create(item)
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("item.insert:" + err);
        });
    });
    return promise;
  }

  static getList(tb_institution_id,tb_salesman_id, tb_order_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'SELECT ' +
        'ori.id, ' +
        'ori.tb_institution_id, ' +
        'ori.tb_order_id, ' +
        'ori.terminal, ' +
        'ori.kind, ' +
        'ori.tb_product_id, ' +
        'prd.description name_product, ' +
        'ori.tb_stock_list_id, ' +
        'ori.quantity, ' +
        'ori.unit_value, ' +
        'ori.discount_aliquot, ' +
        'ori.discount_value, ' +
        'ori.tb_price_list_id ' +
        'from tb_order_item  ori ' +
        '  inner join tb_order ord '+
        '  on (ord.id = ori.tb_order_id) '+
        '    and (ord.tb_institution_id = ori.tb_institution_id) '+
        '    and (ord.terminal = ori.terminal) '+             
        '  inner join tb_product prd ' +
        '  on (prd.id = ori.tb_product_id) ' +
        '  and (prd.tb_institution_id = ori.tb_institution_id) ' +
        'where ori.tb_institution_id = ? ' +
        ' and (ord.tb_user_id = ?) '+
        'and ori.tb_order_id = ?  ',
        {
          replacements: [tb_institution_id, tb_salesman_id, tb_order_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var dataResult = [];          
          for (var item of data) {
            dataResult.push({
              id: item.id,
              tb_order_id: item.tb_order_id,
              tb_product_id: item.tb_product_id,
              name_product: item.name_product,
              tb_stock_list_id: item.tb_stock_list_id,
              quantity: Number(item.quantity),
              unit_value: Number(item.unit_value),
              discount_aliquot: Number(item.discount_aliquot),
              discount_value: Number(item.discount_value),
              tb_price_list_id: item.tb_price_list_id,
              update_status: "",
            }
            );
          }
          resolve(dataResult);
        })
        .catch(err => {
          reject("item.getlist: " + err);
        });
    });
    return promise;
  }

  static get(tb_institution_id, tb_order_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select * ' +
        'from tb_order_item ' +
        'where (tb_institution_id =? ) ' +
        ' and (tb_order_id =?) ' +
        ' and (id =? )',
        {
          replacements: [tb_institution_id, tb_order_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('item.get: ' + err);
        });
    });
    return promise;
  }

  static async update(item) {
    const promise = new Promise((resolve, reject) => {
      Tb.update(item, {
        where: { id: item.id, tb_institution_id: item.tb_institution_id, tb_order_id: item.tb_order_id }
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("item.update:" + err);
        });
    });
    return promise;
  }

  static async delete(item) {
    const promise = new Promise((resolve, reject) => {
      Tb.destroy({
        where: {
          id: item.id,
          tb_institution_id: item.tb_institution_id,
          tb_order_id: item.tb_order_id,
          terminal: item.terminal,
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static async cleanUp(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.destroy({
        where: {
          tb_institution_id: tb_institution_id,
          tb_order_id: id,
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("orderItem.CleanUp:" + err);
        });
    });
    return promise;
  }
}
module.exports = OrderItemController;