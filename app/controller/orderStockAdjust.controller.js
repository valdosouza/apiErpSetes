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
        var regOrderPurchase = await this.getById(body.orderStockAdjust.id, body.orderStockAdjust.tb_institution_id, body.orderStockAdjust.terminal) ;
        if (regOrderPurchase.id == 0){                           
          Tb.create(body.orderStockAdjust);
        }else{
          Tb.update(body.orderStockAdjust,{
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

  static async getById(id, tb_institution_id,terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from  tb_order_stock_adjust ' +
          'where ( id =?) ' +
          ' and ( terminal= ?) '+
          ' and (tb_institution_id =?) ',
          {
            replacements: [id, terminal, tb_institution_id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data.length > 0)
              resolve(data[0])
            else
              resolve({id:0});
          })
      } catch (error) {
        reject('StockAdjust: ' + err);
      }
    });
    return promise;
  };

  static async insertOrder(body) {
    const promise = new Promise(async (resolve, reject) => {

      if (body.order.number == 0)
        body.order.number = await this.getNextNumber(body.order.tb_institution_id);

      const dataOrder = {
        id: body.order.id,
        tb_institution_id: body.order.tb_institution_id,
        terminal: 0,
        number: body.order.number,        
        tb_entity_id: body.order.tb_entity_id,
        direction: body.order.direction,
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
            kind: 'StockAdjustment',
          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await orderItem.insert(dataItem);
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
      const dataOrder = {
        id: 0,
        tb_institution_id: body.order.tb_institution_id,
        terminal: 0,
        tb_user_id: body.order.tb_user_id,
        dt_record: body.order.dt_record,
        note: body.order.note
      }
      order.insert(dataOrder)
        .then(async (data) => {
          body.order.id = data.id;
          this.insertOrder(body)
            .then(() => {
              this.insertOrderItem(body)
                .then(() => {
                  resolve(body);
                })
            })
            .catch(err => {
              reject("orderStockAdjust.insert:" + err);
            });
        })
    });
    return promise;
  }

  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
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
        'where (ord.tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
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

  static async getOrder(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  ord.id, ' +
        '  ord.tb_institution_id, ' +
        '  ord.tb_user_id, ' +
        '  ora.tb_entity_id, ' +
        '  etd.name_company name_entity, ' +
        '  ord.dt_record,  ' +
        '  ora.number,  ' +
        '  ora.direction,'+
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
        ' and (ord.id =? )',
        {
          replacements: [tb_institution_id, id],
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

  static get = (tb_institution_id, id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};
        const dataOrder = await this.getOrder(tb_institution_id, id);
        result.order = dataOrder;
        const dataItems = await orderItem.getList(tb_institution_id, id);
        
        if (dataItems.length > 0){
        result.items = dataItems;
        result.order.tb_stock_list_id = dataItems[0].tb_stock_list_id;
        result.order.name_stock_list =  dataItems[0].name_stock_list;
        }
        resolve(result);
      }
      catch (err) {
        reject('orderstockadjust.get: ' + err);
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
        tb_entity_id: body.order.tb_entity_id,
        direction : body.order.direction,
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
            tb_stock_list_id: body.order.tb_stock_list_id,
            tb_product_id: item.tb_product_id,
            quantity: item.quantity,
            kind : "StockAdjustment",
          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop 
          switch (item.update_status) {
            case "I":
              await orderItem.insert(dataItem)
                .then(data => {
                  item.id = data.id;
                });
              break;
            case "E":
              await orderItem.update(dataItem);
              break;
            case "D":
              await orderItem.delete(dataItem);
              break;
          }
        };
        resolve("Items Alterados");
      } catch (err) {
        reject("orderStockAdjust.updateOrderItem:" + err);
      }

    });
    return promise;
  }

  static async update(body) {
    const promise = new Promise((resolve, reject) => {
      const dataOrder = {
        id: body.order.id,
        tb_institution_id: body.order.tb_institution_id,
        terminal: 0,
        tb_user_id: body.order.tb_user_id,
        dt_record: body.order.dt_record,
        note: body.order.note
      }
      order.update(dataOrder)
        .then(() => {
          this.updateOrder(body)
            .then(() => {
              this.updateOrderItem(body)
                .then(() => {
                  resolve(body);
                })
            })
          resolve(body);
        })
        .catch(err => {
          reject("orderStockAdjust.update:" + err);
        });
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
        var dataOrder = await this.getOrder(body.tb_institution_id, body.id);
        if (dataOrder.status == 'A') {
          var items = await orderItem.getList(body.tb_institution_id, body.id);

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
              operation: "StockAdjustment"
            };
            
            await stockStatement.insert(dataItem);

          };
          
          await order.updateStatus(body.tb_institution_id, body.id, 'F');
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
        var dataOrder = await this.getOrder(body.tb_institution_id, body.id);
        if (dataOrder.status == 'F') {
          var items = await orderItem.getList(body.tb_institution_id, body.id);
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
              direction: "",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "StockAdjustment"
            };
            if (body.direction == "E"){
              dataItem['direction'] = 'S';
            }else{
              dataItem['direction'] = 'E';
            }

            await stockStatement.insert(dataItem);
          };
          await order.updateStatus(body.tb_institution_id, body.id, 'A');
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