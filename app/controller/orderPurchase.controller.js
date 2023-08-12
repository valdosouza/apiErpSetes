const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.orderpurchase;
const orderController = require('./order.controller.js');
const orderBilling = require('./orderBilling.controller.js');
const orderTotalizer = require('./orderTotalizer.controller.js');
const orderItemController = require('./orderItem.controller.js');
const fiscalController = require('./fiscal.controller.js');

class OrderPurchaseController extends Base {
  static async getNextNumber(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_purchase ' +
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
          reject('orderPurchase.getNexNumber: ' + err);
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
          body.order.tb_user_id = body.order_purchase.tb_institution_id;
        
        var regProvider = await fiscalController.getByDocNumber(body.order_purchase.doc_provider);
        body.order_purchase.tb_provider_id = regProvider.id;        
        delete body.order_purchase.doc_provider;
        delete body.order.doc_user;
        orderController.sync(body.order);       
        var regOrderPurchase = await this.getById(body.order_purchase.id, body.order_purchase.tb_institution_id, body.order_purchase.terminal) ;
        if (regOrderPurchase.id == 0){                           
          Tb.create(body.order_purchase);
        }else{
          Tb.update(body.order_purchase,{
            where: {
            tb_institution_id: body.order_purchase.tb_institution_id,
            id: body.order_purchase.id,
            terminal: body.order_purchase.terminal,
            }
          });
        }        
        orderBilling.sync(body.billing);
        orderTotalizer.sync(body.totalizer);
        orderItemController.sync(body.items);
        resolve({
          code: body.order.id,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("OrderPurchaseController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id, tb_institution_id,terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_order_purchase ' +
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
        reject('OrderPurchaseController.getById: ' + err);
      }
    });
    return promise;
  };

  static async insertOrder(body) {
    const promise = new Promise(async (resolve, reject) => {

      if (body.order.number == 0)
        body.order.number = this.getNextNumber(body.order.tb_institution_id);

      const dataOrder = {
        id: body.order.id,
        tb_institution_id: body.order.tb_institution_id,
        terminal: 0,
        number: body.order.number,
        tb_provider_id: body.order.tb_provider_id,
        total_value: body.order.total_value,
        change_value: body.order.change_value,
      }
      Tb.create(dataOrder)
        .then((data) => {
          resolve(body);
        })
        .catch(err => {
          reject("orderPurchaseController.insertOrder:" + err);
        });
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
              this.updateOrderItem(body)
                .then(() => {
                  resolve(body);
                })
            })
            .catch(err => {
              reject("orderPurchaseController.insert:" + err);
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
        '  ors.tb_customer_id,' +
        '  etd.name_company name_entity,' +
        '  ord.dt_record, ' +
        '  ors.number, ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord  ' +
        '   inner join tb_order_purchase ors ' +
        '   on (ors.id = ord.id)  ' +
        '     and (ors.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ors.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = ors.tb_customer_id)  ' +
        'where (ord.tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("orderPurchase.getlist: " + err);
        });
    });
    return promise;
  }

  static getItemList(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'ori.* ' +
        'from tb_order ord ' +
        '  inner join tb_order_purchase ors ' +
        '  on (ors.id = ord.id) ' +
        '    and (ors.tb_institution_id = ord.tb_institution_id) ' +
        '    and (ors.terminal = ord.terminal) ' +
        '  inner join tb_order_item ori ' +
        '  on (ors.id = ori.tb_order_id) ' +
        '    and (ors.tb_institution_id = ori.tb_institution_id) ' +
        '    and (ors.terminal = ori.terminal)  ' +
        'where (ord.tb_institution_id =? ) ' +
        'and (ors.id = ?) ' +
        ' and ori.kind =? ',
        {
          replacements: [tb_institution_id, id, 'Purchase'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("orderPurchaseController.getItemlist: " + err);
        });
    });
    return promise;
  }
  static getQttyByDay(tb_institution_id, dt_record, tb_product_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select sum(quantity) total ' +
        'from tb_order_item ori ' +
        '  inner join tb_order_purchase ors ' +
        '  on (ors.id = ori.tb_order_id) ' +
        '    and (ors.tb_institution_id = ori.tb_institution_id) ' +
        '  inner join tb_order ord ' +
        '  on (ors.id = ord.id) ' +
        '    and (ors.tb_institution_id = ord.tb_institution_id) ' +
        'where ( ori.tb_institution_id = ?) ' +
        'and ( ori.kind =? )' +
        ' and (ori.tb_product_id =? )' +
        'and ( ord.dt_record = ? ) ',
        {
          replacements: [tb_institution_id, 'Purchase', tb_product_id,  dt_record],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {

          if (data.length > 0) {
            resolve(Number(data[0].total))
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject("orderPurchaseController.getItemlist: " + err);
        });
    });
    return promise;
  }
  static getOrder(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  ord.id, ' +
        '  ord.tb_institution_id, ' +
        '  ord.tb_user_id, ' +
        '  ors.tb_customer_id,' +
        '  cus.name_company name_customer,' +        
        '  ord.dt_record, ' +
        '  ors.number, ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord  ' +
        '   inner join tb_order_purchase ors ' +
        '   on (ors.id = ord.id)  ' +
        '     and (ors.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ors.terminal = ord.terminal) ' +
        '   inner join tb_entity cus ' +
        '   on (cus.id = ors.tb_customer_id)  ' +
        'where (ord.tb_institution_id =? ) ' +
        ' and (ord.id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject('orderPurchase.get: ' + err);
        });
    });
    return promise;
  }

  static async getStatus(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  ord.status ' +
        'from tb_order ord  ' +
        '   inner join tb_order_purchase ora ' +
        '   on (ora.id = ord.id)  ' +
        '     and (ora.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ora.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = ora.tb_customer_id)  ' +
        'where (ord.tb_institution_id =? ) ' +
        ' and (ord.id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0].status);
        })
        .catch(err => {
          reject('orderPurchase.getStatus: ' + err);
        });
    });
    return promise;
  }

  static get = (tb_institution_id, tb_order_id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};
        const dataOrder = this.getOrder(tb_institution_id, tb_order_id);
        result.order = dataOrder;
        const dataItems = orderItem.getList(tb_institution_id, tb_order_id);
        result.items = dataItems;

        resolve(result);
      }
      catch (err) {
        reject('orderPurchaseController.get: ' + err);
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
        tb_user_id: body.order.tb_user_id,
        dt_record: body.order.dt_record,
        note: body.order.note
      }
      Tb.update(dataOrderStockAdjust, {
        where: {
          id: dataOrderStockAdjust.id,
          tb_institution_id: dataOrderStockAdjust.tb_institution_id,
          terminal: dataOrderStockAdjust.terminal
        }

      })
        .then(() => {
          resolve(dataOrderStockAdjust);
        })
        .catch(err => {
          reject("orderPurchaseController.updateOrder:" + err);
        });
    });
    return promise;
  }

  static async updateOrderItem(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        var resultItem = {};
        for (var item of body.items) {
          if (item.updateStatus != "") {
            dataItem = {
              id: item.id,
              tb_institution_id: body.order.tb_institution_id,
              tb_order_id: body.order.id,
              terminal: 0,
              tb_stock_list_id: item.tb_stock_list_id,
              tb_price_list_id: item.tb_price_list_id,
              tb_product_id: item.tb_product_id,
              quantity: item.quantity,
              unit_value: item.unit_value,
            };
            //Quanto o insert é mais complexo como getNext precisa do no loop              
            switch (item.update_status) {
              case "I":
                orderItem.insert(dataItem)
                  .then(data => {
                    item.id = data.id;
                  });
                break;
              case "E":
                orderItem.update(dataItem);
                break;
              case "D":
                orderItem.delete(dataItem);
                break;
            }
          }
        };
        resolve("Items Alterados");
      } catch (err) {
        reject("orderPurchaseController.updateOrderItem:" + err);
      }

    });
    return promise;
  }

  static async updateStockStatement(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        var resultItem = {};
        for (var item of body.items) {
          if (item.updateStatus != "") {
            dataItem = {
              id: item.id,
              tb_institution_id: body.order.tb_institution_id,
              tb_order_id: body.order.id,
              terminal: 0,
              tb_stock_list_id: item.tb_stock_list_id,
              tb_price_list_id: item.tb_price_list_id,
              tb_product_id: item.tb_product_id,
              quantity: item.quantity,
              unit_value: item.unit_value,
            };
            //Quanto o insert é mais complexo como getNext precisa do no loop  
            if (item.updateStatus == "I") {
              orderItem.insert(dataItem);
            } else if (item.updateStatus == "U") {
              orderItem.update(dataItem);
            } else if (item.updateStatus == "D") {
              orderItem.delete(dataItem);
            }
          }
        };
        resolve("Items Alterados");
      } catch (err) {
        reject("orderPurchaseController.updateOrderItem:" + err);
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
          reject("orderPurchaseController.update:" + err);
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
          reject("OrderPurchaseController.delete:" + err);
        });
    });
    return promise;
  }

  static async closure(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var status = this.getStatus(body.tb_institution_id, body.id);
        if (status == 'A') {
          var items = orderItem.getList(body.tb_institution_id, body.id);
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
              direction: "S",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "Ajuste"
            };
            //Quanto o insert é mais complexo como create precisa do no loop          
            stockStatement.insert(dataItem);
          };
          order.updateStatus(body.tb_institution_id, body.id, 'F');
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
        var status = this.getStatus(body.tb_institution_id, body.id);
        if (status == 'F') {
          var items = orderItem.getList(body.tb_institution_id, body.id);
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
              direction: "E",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "Ajuste"
            };
            //Quanto o insert é mais complexo como create precisa do no loop          
            stockStatement.insert(dataItem);
          };
          order.updateStatus(body.tb_institution_id, body.id, 'A');
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

  static async saveCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        //Não salva tb_order por que já foi criado no attendance   
        this.insertCard(body);
        this.insertOrderPaid(body);
        resolve(body.order);
      } catch (err) {
        reject('OrderPurchaseController.saveCard: ' + err);
      }
    });
    return promise;
  }
 

  static async closurebyCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var items = this.getItemList(body.order.tb_institution_id, body.order.id);
        var dataItem = {};
        for (var item of items) {
          dataItem = {
            id: 0,
            tb_institution_id: item.tb_institution_id,
            tb_order_id: item.tb_order_id,
            terminal: 0,
            tb_order_item_id: item.id,
            tb_stock_list_id: item.tb_stock_list_id,
            local: "web",
            kind: "Fechamento",
            dt_record: body.order.dt_record,
            direction: "S",
            tb_merchandise_id: item.tb_product_id,
            quantity: item.quantity,
            operation: "Purchase"
          };
          stockStatement.insert(dataItem);

        };
        order.updateStatus(body.order.tb_institution_id, body.order.id, 'F');
        resolve("200");
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  static async cleanUp(tb_institution_id, id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const order = {
          tb_institution_id: tb_institution_id,
          id: id,
          terminal: 0,
        }
        this.delete(order);
        resolve("clenUp executado com sucesso!");
      } catch (error) {
        reject('orderPurchase.cleanUp ' + error);
      }
    });
    return promise;
  }
}
module.exports = OrderPurchaseController;