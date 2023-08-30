const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderstocktransfer;
const orderController = require('./order.controller.js');
const EntityHasStockListController = require('./entityHasStockList.controller.js');
const fiscalController = require('./fiscal.controller.js');
const stockStatement = require('./stockStatement.controller.js');
const OrderItemController = require('./orderItem.controller.js');

class OrderStockTransferController extends Base {
  static async getNextNumber(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_stock_transfer ' +
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
          reject('orderStockTransfer.getNexNumber: ' + err);
        });
    });
    return promise;
  }

  static async insertOrder(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (body.stock_transfer.number == 0)
          body.stock_transfer.number = await this.getNextNumber(body.order.tb_institution_id);

        const dataOrder = {
          id: body.order.id,
          tb_institution_id: body.order.tb_institution_id,
          terminal: 0,
          tb_entity_id: body.stock_transfer.tb_entity_id,
          number: body.stock_transfer.number,
          tb_stock_list_id_ori: 0,
          tb_stock_list_id_des: 0,
        };
        //Lembrar que desta forma é apenas para testar e atender o Rodrigo Doces
        var stockOrigem = await EntityHasStockListController.getByEntity(body.order.tb_institution_id, body.order.tb_institution_id);
        dataOrder.tb_stock_list_id_ori = stockOrigem[0].tb_stock_list_id;
        var stockDestino = await EntityHasStockListController.getByEntity(body.order.tb_institution_id, body.order.tb_user_id);
        dataOrder.tb_stock_list_id_des = stockDestino[0].tb_stock_list_id;
        stockStatement.get
        Tb.create(dataOrder)
          .then(() => {
            resolve(body);
          })

      } catch (error) {
        reject("orderSale.insertOrder:" + error);
      }
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
            tb_stock_list_id: item.tb_stock_list_id,
            tb_product_id: item.tb_product_id,
            quantity: item.quantity,
            unit_value: item.unit_value,
            kind: 'StockTransfer',
          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await OrderItemController.insert(dataItem);
        };
        resolve("Items Adicionados");
      } catch (err) {
        reject("orderStockTransfer.insertOrderItem:" + err);
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
        '  tb_stock_list_id_ori, ' +
        '  sto.description name_stock_list_ori, ' +
        '  tb_stock_list_id_des, ' +
        '  std.description name_stock_list_des,   ' +
        '  ord.dt_record,  ' +
        '  ora.number,  ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord ' +
        '   inner join tb_order_stock_transfer ora ' +
        '   on (ora.id = ord.id) ' +
        '     and (ora.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ora.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = ora.tb_entity_id)  ' +
        '   inner join tb_stock_list sto ' +
        '   on (sto.id  = ora.tb_stock_list_id_ori) ' +
        '     and (sto.tb_institution_id  = ora.tb_institution_id) ' +
        '   inner join tb_stock_list std ' +
        '   on (std.id  = ora.tb_stock_list_id_des) ' +
        '     and (std.tb_institution_id  = ora.tb_institution_id) ' +
        'where (ord.tb_institution_id =? ) ' +
        ' AND (ord.tb_user_id = ?) ';
      ' AND (ord.status <> ?) ';

      if (body.nick_trade != "") {
        nick_trade = '%' + body.nick_trade + '%';
        sqltxt += ' and (etd.nick_trade like ? ) ';
      } else {
        nick_trade = "";
        sqltxt += ' and (etd.nick_trade <> ?) ';
      }
      sqltxt +=
        ' order by number DESC ';
      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [body.tb_institution_id, body.tb_salesman_id, 'D', nick_trade],

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
          reject("orderstocktransfer.getlist: " + err);
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
        '  inner join tb_order_stock_transfer ort  ' +
        '  on (ort.id = ord.id)  ' +
        '    and (ort.tb_institution_id = ord.tb_institution_id)  ' +
        '    and (ort.terminal = ord.terminal)  ' +
        '  inner join tb_order_item ori  ' +
        '  on (ort.id = ori.tb_order_id)  ' +
        '    and (ort.tb_institution_id = ori.tb_institution_id)  ' +
        '    and (ort.terminal = ori.terminal)   ' +
        'where (ord.tb_institution_id =? )  ' +
        ' and ( ort.id = ? )  ' +
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

  static async getOrder(tb_institution_id,tb_user_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  ord.id, ' +
        '  ord.tb_institution_id, ' +
        '  ord.tb_user_id, ' +
        '  ora.tb_entity_id, ' +
        '  etd.name_company name_entity, ' +
        '  tb_stock_list_id_ori, ' +
        '  sto.description name_stock_list_ori, ' +
        '  tb_stock_list_id_des, ' +
        '  std.description name_stock_list_des,   ' +
        '  ord.dt_record,  ' +
        '  ora.number,  ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord ' +
        '   inner join tb_order_stock_transfer ora ' +
        '   on (ora.id = ord.id) ' +
        '     and (ora.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ora.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = ora.tb_entity_id)  ' +
        '   inner join tb_stock_list sto ' +
        '   on (sto.id  = ora.tb_stock_list_id_ori) ' +
        '     and (sto.tb_institution_id  = ora.tb_institution_id) ' +
        '   inner join tb_stock_list std ' +
        '   on (std.id  = ora.tb_stock_list_id_des) ' +
        '     and (std.tb_institution_id  = ora.tb_institution_id) ' +
        'where (ord.tb_institution_id =? ) ' +
        ' and (ord.tb_user_id = ?)'+
        ' and (ord.id =? )',
        {
          replacements: [tb_institution_id,tb_user_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject('orderstocktransfer.getOrder: ' + err);
        });
    });
    return promise;
  }

  static get = (tb_institution_id,tb_user_id,tb_order_id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};

        const dataOrder = await orderController.get(tb_institution_id, tb_user_id, tb_order_id);
        result.order = dataOrder;

        const dataStockTransfer = await this.getOrder(tb_institution_id, tb_user_id, tb_order_id);
        result.stock_transfer = dataStockTransfer;

        const dataItems = await OrderItemController.getList(tb_institution_id,tb_user_id, tb_order_id);
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
        tb_user_id: body.order.tb_user_id,
        tb_entity_id: body.stock_transfer.tb_entity_id,
        number : body.stock_transfer.number,
        tb_stock_list_id_ori : body.stock_transfer.tb_stock_list_id_ori,
        tb_stock_list_id_des : body.stock_transfer.tb_stock_list_id_des,
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
          reject("orderStockTransfer.updateOrder:" + err);
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
            tb_stock_list_id: item.tb_stock_list_id,
            tb_product_id: item.tb_product_id,
            quantity: item.quantity,
            unit_value: item.unit_value,
            kind: 'StockTransfer',
          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop 
          switch (item.update_status) {
            case "I":
              await OrderItemController.insert(dataItem)
                .then(data => {
                  item.id = data.id;
                });
              break;
            case "E":
              await OrderItemController.update(dataItem);
              break;
            case "D":
              await OrderItemController.delete(dataItem);
              break;
          }
          item.update_status = "";
        };
        resolve("Items Alterados");
      } catch (err) {
        reject("orderStockTransfer.updateOrderItem:" + err);
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
          reject("OrderStockTransfer.delete:" + err);
        });
    });
    return promise;
  }


  static async closure(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataOrder = await this.getOrder(body.tb_institution_id,body.tb_user_id, body.tb_order_id);
        if (dataOrder.status == 'A') {
          var items = await OrderItemController.getList(body.tb_institution_id, body.tb_user_id, body.tb_order_id);

          var dataItem = {};
          for (var item of items) {
            dataItem = {
              id: 0,
              tb_institution_id: body.tb_institution_id,
              tb_order_id: body.tB_order_id,
              terminal: 0,
              tb_order_item_id: item.id,
              tb_stock_list_id: 0,
              local: "web",
              kind: "Fechamento",
              dt_record: body.dt_record,
              direction: "S",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "StockTransfer"
            };
            //Origen
            dataItem['tb_stock_list_id'] = dataOrder.tb_stock_list_id_ori;
            dataItem['direction'] = 'S';
            await stockStatement.insert(dataItem);
            //Destiny
            dataItem['tb_stock_list_id'] = dataOrder.tb_stock_list_id_des;
            dataItem['direction'] = 'E';
            await stockStatement.insert(dataItem);
          };
          await orderController.updateStatus(body.tb_institution_id,body.tb_user_id, body.tb_order_id, 'F');
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
        var dataOrder = await this.getOrder(body.tb_institution_id, body.tb_user_id, body.tb_order_id);
        if (dataOrder.status == 'F') {
          var items = await OrderItemController.getList(body.tb_institution_id, body.tb_user_id, body.tb_order_id);
          var dataItem = {};
          for (var item of items) {
            dataItem = {
              id: 0,
              tb_institution_id: body.tb_institution_id,
              tb_order_id: body.tb_order_id,
              terminal: 0,
              tb_order_item_id: item.id,
              tb_stock_list_id: 0,
              local: "web",
              kind: "Reabertura",
              dt_record: body.dt_record,
              direction: "S",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "StockTransfer"
            };
            //Origen - Inverte direção ao reabrir
            dataItem['tb_stock_list_id'] = dataOrder.tb_stock_list_id_ori;
            dataItem['direction'] = 'E';
            await stockStatement.insert(dataItem);
            //Destiny - Inverte direção ao reabrir
            dataItem['tb_stock_list_id'] = dataOrder.tb_stock_list_id_des;
            dataItem['direction'] = 'S';
            await stockStatement.insert(dataItem);
          };
          await orderController.updateStatus(body.tb_institution_id,body.tb_user_id, body.tb_order_id, 'A');
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



  static async saveDevolutionByCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var qtde = 0;
        for (var item of body.items) {
          qtde += item.devolution;
        }
        if (qtde > 0) {
          body.order['number'] = 0;
          //Inverter direção do estoque por que o cliente vai devolver para o Vendedor
          var _order = {
            id: body.order.id,
            tb_institution_id: body.order.tb_institution_id,
            terminal: 0,
            number: body.order.number,
            tb_entity_id: body.order.tb_customer_id,
            dt_record: body.order.dt_record,
            tb_stock_list_id_ori: body.StockDestiny.tb_stock_list_id,//estoque invertiro devido a devolução
            tb_stock_list_id_des: body.StockOrigen.tb_stock_list_id,//estoque invertiro devido a devolução
          }
          body.order['tb_stock_list_id_ori'] = body.StockDestiny.tb_stock_list_id;//estoque invertiro devido a devolução
          body.order['tb_stock_list_id_des'] = body.StockOrigen.tb_stock_list_id;//estoque invertiro devido a devolução
          var _body = {};
          _body["Order"] = _order;
          await this.insertOrder(_body);
          await this.insertOrderItemDevolutionByCard(body, "StockTransfer");
          await this.closurebyCard(body, "StockTransfer");
        }
        resolve(body);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }


  static async saveLoadCardByCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var qtde = 0;
        for (var item of body.items) {
          qtde += item.new_load;
        }
        if (qtde > 0) {
          var _order = {
            id: body.order.id,
            tb_institution_id: body.order.tb_institution_id,
            terminal: 0,
            number: body.order.number,
            tb_entity_id: body.order.tb_user_id,
            dt_record: body.order.dt_record,
            number: 0,
            tb_stock_list_id_ori: body.StockOrigen.tb_stock_list_id,
            tb_stock_list_id_des: body.StockDestiny.tb_stock_list_id,
          }
          body.order['tb_stock_list_id_ori'] = body.StockOrigen.tb_stock_list_id;
          body.order['tb_stock_list_id_des'] = body.StockDestiny.tb_stock_list_id;
          var _body = {};
          _body["Order"] = _order;
          await this.insertOrder(_body);
          await this.insertOrderItemLoadCardByCard(body, "StockTransfer");
          await this.closurebyCard(body, "StockTransfer");
        }
        resolve(body);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  static async insertOrderItemDevolutionByCard(body, kind) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        for (var item of body.items) {
          if (item.devolution > 0) {
            dataItem = {
              id: 0,
              tb_institution_id: body.order.tb_institution_id,
              tb_order_id: body.order.id,
              terminal: 0,
              tb_stock_list_id: body.order.tb_stock_list_id_ori,
              tb_product_id: item.tb_product_id,
              quantity: item.devolution,
              unit_value: item.unit_value,
              kind: kind,
            };
            //Quanto o insert é mais complexo como getNext precisa do await no loop          
            await OrderItemController.insert(dataItem);
          }
        };
        resolve("Items Adicionados");
      } catch (err) {
        reject("orderTransfer.insertOrderItem:" + err);
      }

    });
    return promise;
  }

  static async insertOrderItemLoadCardByCard(body, kind) {
    const promise = new Promise(async (resolve, reject) => {
      try {

        var dataItem = {};
        var quantity = 0;
        for (var item of body.items) {
          quantity = 0;
          if (item.new_load > 0) {
            dataItem = {
              id: 0,
              tb_institution_id: body.order.tb_institution_id,
              tb_order_id: body.order.id,
              terminal: 0,
              tb_stock_list_id: body.order.tb_stock_list_id_ori,
              tb_product_id: item.tb_product_id,
              quantity: item.new_load,
              unit_value: item.unit_value,
              kind: kind,
            };
            //Quanto o insert é mais complexo como getNext precisa do await no loop          
            await OrderItemController.insert(dataItem);
          }
        };
        resolve("Items Adicionados");
      } catch (err) {
        reject("orderTransfer.insertOrderItem:" + err);
      }

    });
    return promise;
  }

  static async closurebyCard(body, operation) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var items = await this.getItemList(body.order.tb_institution_id, body.order.id, operation);
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
            operation: operation,
          };
          //Sempre sai da Origem 
          dataItem['tb_stock_list_id'] = body.order.tb_stock_list_id_ori;
          dataItem['direction'] = 'S';
          await stockStatement.insert(dataItem);
          //Sempre Entra no Destino
          dataItem['tb_stock_list_id'] = body.order.tb_stock_list_id_des;
          dataItem['direction'] = 'E';
          await stockStatement.insert(dataItem);

        };
        await order.updateStatus(body.order.tb_institution_id, body.order.id, 'F');
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
        await this.delete(order);
        resolve("clenUp executado com sucesso!");
      } catch (error) {
        reject('orderStockTransfer.cleanUp ' + error);
      }
    });
    return promise;
  }
}
module.exports = OrderStockTransferController;