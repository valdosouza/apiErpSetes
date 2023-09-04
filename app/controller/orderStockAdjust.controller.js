const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderstockadjust;
const stockStatement = require('./stockStatement.controller.js');
const orderController = require('./order.controller.js');
const orderTotalizer = require('./orderTotalizer.controller.js');
const orderItemController = require('./orderItem.controller.js');
const fiscalController = require('./fiscal.controller.js');


class OrderStockAdjustController extends Base {
  static async getNextNumber(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_stock_adjust ' +
        'WHERE ( tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data) {
            const nextNumber = data[0].lastNumber + 1;
            resolve(nextNumber);
          } else {
            resolve(1);
          }
        })
        .catch(err => {
          reject('orderStockAdjust.getNexNumber: ' + err);
        });
    });
    return promise;
  }

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var regUser = await fiscalController.getByDocNumber(body.order.doc_user);
        if (regUser.id > 0)
          body.order.tb_user_id = regUser.id
        else
          body.order.tb_user_id = body.orderStockAdjust.tb_institution_id;

        var regEntity = await fiscalController.getByDocNumber(body.orderStockAdjust.doc_entity);
        body.orderStockAdjust.tb_entity_id = regEntity.id;
        delete body.orderStockAdjust.doc_entity;
        delete body.order.doc_user;
        orderController.sync(body.order);
        var regOrderPurchase = await this.getById(body.orderStockAdjust.id, body.orderStockAdjust.tb_institution_id, body.orderStockAdjust.terminal);
        if (regOrderPurchase.id == 0) {
          Tb.create(body.orderStockAdjust);
        } else {
          Tb.update(body.orderStockAdjust, {
            where: {
              tb_institution_id: body.orderStockAdjust.tb_institution_id,
              id: body.orderStockAdjust.id,
              terminal: body.orderStockAdjust.terminal,
            }
          });
        }
        orderTotalizer.sync(body.totalizer);
        orderItemController.sync(body.items);
        resolve({
          code: body.order.id,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("OrderStockAdjustController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id, tb_institution_id, terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from  tb_order_stock_adjust ' +
          'where ( id =?) ' +
          ' and ( terminal= ?) ' +
          ' and (tb_institution_id =?) ',
          {
            replacements: [id, terminal, tb_institution_id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data.length > 0)
              resolve(data[0])
            else
              resolve({ id: 0 });
          })
      } catch (error) {
        reject('StockAdjust: ' + err);
      }
    });
    return promise;
  };

  static async insertOrder(body) {
    const promise = new Promise(async (resolve, reject) => {
      if (body.stock_adjust.number == 0)
        body.stock_adjust.number = await this.getNextNumber(body.order.tb_institution_id);
      const dataOrder = {
        id: body.order.id,
        tb_institution_id: body.order.tb_institution_id,
        terminal: 0,
        number: body.stock_adjust.number,
        tb_entity_id: body.stock_adjust.tb_entity_id,
        direction: body.stock_adjust.direction,
      }
      Tb.create(dataOrder)
        .then(() => {
          resolve(body);
        })
        .catch(err => {
          reject("orderStockAdjust.insertOrder:" + err);
        });
    });
    return promise;
  }

  static async insertOrderItem(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        for (var item of body.items) {
          dataItem = {
            id: 0,
            tb_institution_id: body.order.tb_institution_id,
            tb_order_id: body.order.id,
            terminal: 0,
            tb_stock_list_id: body.order.tb_stock_list_id,
            tb_product_id: item.tb_product_id,
            quantity: item.quantity,
            unit_value: item.unit_value,
            kind: 'StockAdjust',
          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await orderItemController.insert(dataItem);
        };
        resolve("Items Adicionados");
      } catch (err) {
        reject("orderStockAdjust.insertOrderItem:" + err);
      }

    });
    return promise;
  }

  static async insert(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        orderController.insert(body.order)
          .then(async (data) => {
            body.order.id = data.id;
            this.insertOrder(body)
              .then(() => {
                this.updateOrderItem(body)
                  .then(async () => {
                    resolve(body);
                  })
              });
          })
      } catch (error) {
        reject("orderStockTransfer.insert:" + error);
      }
    });
    return promise;
  }

  static async insertOrder(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (body.stock_adjust.number == 0)
          body.stock_adjust.number = await this.getNextNumber(body.order.tb_institution_id);
        const dataOrder = {
          id: body.order.id,
          tb_institution_id: body.order.tb_institution_id,
          terminal: 0,
          tb_entity_id: body.stock_adjust.tb_entity_id,
          number: body.stock_adjust.number,
          direction: body.stock_adjust.direction,
        };
        Tb.create(dataOrder)
          .then(() => {
            resolve(body);
          })
      } catch (error) {
        reject("orderStockAdjust.insertOrder:" + error);
      }
    });
    return promise;
  }


  static getList(body) {
    const promise = new Promise((resolve, reject) => {
      var nick_trade = "";
      var sqltxt =
        '  select ' +
        '  ord.id, ' +
        '  ord.tb_institution_id, ' +
        '  ord.tb_user_id, ' +
        '  ora.tb_entity_id, ' +
        '  etd.name_company name_entity, ' +
        '  ord.dt_record,  ' +
        '  ora.number,  ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord ' +
        '   inner join tb_order_stock_adjust ora ' +
        '   on (ora.id = ord.id) ' +
        '     and (ora.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ora.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = ora.tb_entity_id)  ' +
        'where (ord.tb_institution_id =? ) ' +
        '  and (ord.terminal = ?) ' +
        ' AND (ord.tb_user_id = ?) '+
        ' AND (ord.status <> ?) ';
      
      if (body.nick_trade != "") {
        nick_trade = '%' + body.nick_trade + '%';
        sqltxt += ' and (etd.nick_trade like ? ) ';
      } else {
        nick_trade = "";
        sqltxt += ' and (etd.nick_trade <> ?) ';
      }
      sqltxt +=
        ' order by nick_trade ' +
        ' limit ' + ((body.page - 1) * 20) + ',20 ';
      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [body.tb_institution_id, 0, body.tb_user_id, 'D', nick_trade],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var dataReturn = {};
          var arrayReturn = [];
          for (var item of data) {
            arrayReturn.push(item);
          }
          resolve(arrayReturn);
        })
        .catch(err => {
          reject("orderstockadjust.getlist: " + err);
        });
    });
    return promise;
  }

  static getItemList(tb_institution_id, id, kind) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'ori.* ' +
        'from tb_order ord  ' +
        '  inner join tb_order_stock_adjust ora  ' +
        '  on (ora.id = ord.id)  ' +
        '    and (ora.tb_institution_id = ord.tb_institution_id)  ' +
        '    and (ora.terminal = ord.terminal)  ' +
        '  inner join tb_order_item ori  ' +
        '  on (ora.id = ori.tb_order_id)  ' +
        '    and (ora.tb_institution_id = ori.tb_institution_id)  ' +
        '    and (ora.terminal = ori.terminal)   ' +
        'where (ord.tb_institution_id =? )  ' +
        ' and ( ora.id = ? )  ' +
        ' and ( ori.kind =? )  ',
        {
          replacements: [tb_institution_id, id, kind],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("orderSale.getItemlist: " + err);
        });
    });
    return promise;
  }

  static async getOrder(tb_institution_id, tb_user_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select distinct ' +
        '  ora.tb_entity_id, ' +
        '  etd.name_company name_entity, ' +
        '  ora.number,  ' +
        '  ora.direction, ' +
        '  ori.tb_stock_list_id,'+
        '  stl.description name_stock_list '+
        'from tb_order ord ' +
        '   inner join tb_order_stock_adjust ora ' +
        '   on (ora.id = ord.id) ' +
        '     and (ora.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ora.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = ora.tb_entity_id)  ' +

        '   inner join tb_order_item ori '+
        '   on (ori.tb_order_id = ora.id)  ' +        
        '       and (ori.tb_institution_id = ora.tb_institution_id)  ' +

        '   inner join tb_stock_list stl ' +
        '   on (stl.id = ori.tb_stock_list_id) ' +
        '       and (stl.tb_institution_id = ori.tb_institution_id) ' +

        'where (ord.tb_institution_id =? ) ' +
        ' and (tb_user_id = ?)' +
        ' and (ord.id =? )',
        {
          replacements: [tb_institution_id, tb_user_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject('orderstockadjust.getOrder: ' + err);
        });
    });
    return promise;
  }

  static get = (tb_institution_id, tb_user_id, tb_order_id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};

        const dataOrder = await orderController.get(tb_institution_id, tb_user_id, tb_order_id);
        result.order = dataOrder;

        const dataStockAdjust = await this.getOrder(tb_institution_id, tb_user_id, tb_order_id);
        result.stock_adjust = dataStockAdjust;

        const dataItems = await orderItemController.getList(tb_institution_id, tb_user_id, tb_order_id);
        result.items = dataItems;

        resolve(result);
      }
      catch (err) {
        reject('orderStockTransfer.get: ' + err);
      }
    });
    return promise;
  }

  static async updateOrder(body) {
    const promise = new Promise(async (resolve, reject) => {
      const dataOrderStockAdjust = {
        id: body.order.id,
        tb_institution_id: body.order.tb_institution_id,
        terminal: 0,
        tb_entity_id: body.stock_adjust.tb_entity_id,
        direction: body.stock_adjust.direction,
      }

      Tb.update(dataOrderStockAdjust, {
        where: {
          id: dataOrderStockAdjust.id,
          tb_institution_id: dataOrderStockAdjust.tb_institution_id,
          terminal: dataOrderStockAdjust.terminal
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("orderStockAdjust.updateOrder:" + err);
        });
    });
    return promise;
  }

  static async updateOrderItem(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
var dataItem = {};
        for (var item of body.items) {
          dataItem = {
            id: item.id,
            tb_institution_id: body.order.tb_institution_id,
            tb_order_id: body.order.id,
            terminal: 0,
            tb_stock_list_id: body.stock_adjust.tb_stock_list_id,
            tb_product_id: item.tb_product_id,
            quantity: item.quantity,
            kind: "StockAdjust",
          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop 
          switch (item.update_status) {
            case "I":
              await orderItemController.insert(dataItem)
                .then(data => {
                  item.id = data.id;
                });
              break;
            case "E":
              await orderItemController.update(dataItem);
              break;
            case "D":
              await orderItemController.delete(dataItem);
              break;
          }
          item.update_status = "";
        };
        resolve("Items Alterados");
      } catch (err) {
        reject("orderStockAdjust.updateOrderItem:" + err);
      }

    });
    return promise;
  }

  static async update(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        await orderController.update(body.order)
        await this.updateOrder(body)
        await this.updateOrderItem(body)
        resolve(body);
      } catch (error) {
        reject("orderSale.update:" + error);
      }
    });
    return promise;
  }

  static async delete(order) {
    const promise = new Promise((resolve, reject) => {
      Tb.destroy({
        where: {
          id: order.id,
          tb_institution_id: order.tb_institution_id,
          terminal: order.terminal,
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("OrderStockAdjust.delete:" + err);
        });
    });
    return promise;
  }


  static async closure(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataOrder = await this.getOrder(body.tb_institution_id, body.tb_user_id, body.id);
        if (dataOrder.status == 'A') {
          var items = await orderItemController.getList(body.tb_institution_id, body.tb_user_id, body.id);

          var dataItem = {};
          for (var item of items) {
            dataItem = {
              id: 0,
              tb_institution_id: body.tb_institution_id,
              tb_order_id: body.id,
              terminal: 0,
              tb_order_item_id: item.id,
              tb_stock_list_id: item.tb_stock_list_id,
              local: "web",
              kind: "Fechamento",
              dt_record: body.dt_record,
              direction: body.direction,
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "StockAdjust"
            };
            await stockStatement.insert(dataItem);
          };
          await orderController.updateStatus(body.tb_institution_id, body.tb_user_id, body.id, 'F');
          resolve("200");
        } else {
          resolve("201");
        }
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  static async reopen(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataOrder = await this.getOrder(body.tb_institution_id, body.tb_user_id, body.id);
        if (dataOrder.status == 'F') {
          var items = await orderItemController.getList(body.tb_institution_id, body.tb_user_id, body.id);
          var dataItem = {};
          for (var item of items) {
            dataItem = {
              id: 0,
              tb_institution_id: body.tb_institution_id,
              tb_order_id: body.id,
              terminal: 0,
              tb_order_item_id: item.id,
              tb_stock_list_id: item.tb_stock_list_id,
              local: "web",
              kind: "Reabertura",
              dt_record: body.dt_record,
              direction: "",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "StockAdjust"
            };
            if (body.direction == "E") {
              dataItem['direction'] = 'S';
            } else {
              dataItem['direction'] = 'E';
            }

            await stockStatement.insert(dataItem);
          };
          await orderController.updateStatus(body.tb_institution_id, body.tb_user_id, body.id, 'A');
          resolve("200");
        } else {
          resolve("201");
        }
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

}
module.exports = OrderStockAdjustController;