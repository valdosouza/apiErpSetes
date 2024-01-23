const Base = require('../controller/base.controller.js');
const db = require("../model/index.js");
const Tb = db.orderbonus;
const stockStatement = require('../controller/stockStatement.controller.js');
const orderController = require('../controller/order.controller.js');
const orderTotalizer = require('../controller/orderTotalizer.controller.js');
const orderItemController = require('../controller/orderItem.controller.js');
const EntityExtenralCode = require('../controller/entityExternalCode.controller.js');
const entityHasStockListController = require('../controller/entityHasStockList.controller.js');

class OrderBonusController extends Base {
  static async getNextNumber(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_bonus ' +
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
          reject('orderBonus.getNexNumber: ' + err);
        });
    });
    return promise;
  }

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var regUser = await EntityExtenralCode.getByExternalCode(body.order.tb_institution_id, body.order.user_external_code, 'COLABORADOR');
        body.order.tb_user_id = regUser.tb_entity_id;
        //Caso seja zer pegar o primeiro colaborador da lista do estabelemcimento
        if (body.order.tb_user_id == 0) {
          regUser = await EntityExtenralCode.getFirstExternalCode(body.order.tb_institution_id, 'COLABORADOR');
          body.order.tb_user_id = regUser.tb_entity_id;
        }

        var regCustomer = await EntityExtenralCode.getByExternalCode(body.order_bonus.tb_institution_id, body.order_bonus.entity_external_code, 'EMPRESA');
        body.order_bonus.tb_customer_id = regCustomer.tb_customer_id;



        orderController.sync(body.order);
        var regOrderBonus = await this.getById(body.order_bonus.id, body.order_bonus.tb_institution_id, body.order_bonus.terminal);
        if (regOrderBonus.id == 0) {
          Tb.create(body.order_bonus);
        } else {
          Tb.update(body.order_bonus, {
            where: {
              tb_institution_id: body.order_bonus.tb_institution_id,
              id: body.order_bonus.id,
              terminal: body.order_bonus.terminal,
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
        reject("OrderBonusController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id, tb_institution_id, terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from  tb_order_bonus ' +
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
        reject('OrderBonus: ' + err);
      }
    });
    return promise;
  };

  static async insertOrder(body) {
    const promise = new Promise(async (resolve, reject) => {
      if (body.bonus.number == 0)
        body.bonus.number = await this.getNextNumber(body.order.tb_institution_id);
      const dataOrder = {
        id: body.order.id,
        tb_institution_id: body.order.tb_institution_id,
        terminal: 0,
        number: body.bonus.number,
        tb_customer_id: body.bonus.tb_customer_id,
        tb_salesman_id: body.bonus.tb_salesman_id,
      }
      Tb.create(dataOrder)
        .then(() => {
          resolve(body);
        })
        .catch(err => {
          reject("orderBonus.insertOrder:" + err);
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
            kind: 'Bonus',
          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await orderItemController.insert(dataItem);
        };
        resolve("Items Adicionados");
      } catch (err) {
        reject("orderBonus.insertOrderItem:" + err);
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
        reject("OrderBonus.insert:" + error);
      }
    });
    return promise;
  }

  static async insertOrder(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (body.bonus.number == 0)
          body.bonus.number = await this.getNextNumber(body.order.tb_institution_id);
        const dataOrder = {
          id: body.order.id,
          tb_institution_id: body.order.tb_institution_id,
          terminal: 0,
          tb_customer_id: body.bonus.tb_customer_id,
          number: body.bonus.number,
          tb_salesman_id: body.bonus.tb_salesman_id,
        };
        Tb.create(dataOrder)
          .then(() => {
            resolve(body);
          })
      } catch (error) {
        reject("orderBonus.insertOrder:" + error);
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
        '  orb.tb_customer_id, ' +
        '  ctm.name_company name_customer, ' +
        '  orb.tb_salesman_id, ' +
        '  slm.name_company name_salesman, ' +
        '  ord.dt_record,  ' +
        '  orb.number,  ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord ' +
        '   inner join tb_order_bonus orb ' +
        '   on (orb.id = ord.id) ' +
        '     and (orb.tb_institution_id = ord.tb_institution_id) ' +
        '     and (orb.terminal = ord.terminal) ' +
        '   inner join tb_entity ctm ' +
        '   on (ctm.id = orb.tb_customer_id)  ' +
        '   inner join tb_entity slm ' +
        '   on (slm.id = orb.tb_salesman_id)  ' +

        'where (ord.tb_institution_id =? ) ' +
        '  and (ord.terminal = ?) ' +
        ' AND (ord.tb_user_id = ?) ' +
        ' AND (ord.status <> ?) ';

      if (body.nick_trade != "") {
        nick_trade = '%' + body.nick_trade + '%';
        sqltxt += ' and (ctm.nick_trade like ? ) ';
      } else {
        nick_trade = "";
        sqltxt += ' and (ctm.nick_trade <> ?) ';
      }
      sqltxt +=
        ' order by ctm.nick_trade ' +
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
          reject("OrderBonus.getlist: " + err);
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
        '  inner join tb_order_bonus orb  ' +
        '  on (orb.id = ord.id)  ' +
        '    and (orb.tb_institution_id = ord.tb_institution_id)  ' +
        '    and (orb.terminal = ord.terminal)  ' +
        '  inner join tb_order_item ori  ' +
        '  on (orb.id = ori.tb_order_id)  ' +
        '    and (orb.tb_institution_id = ori.tb_institution_id)  ' +
        '    and (orb.terminal = ori.terminal)   ' +
        'where (ord.tb_institution_id =? )  ' +
        ' and ( orb.id = ? )  ' +
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
        '  orb.tb_customer_id, ' +
        '  ctm.name_company name_customer, ' +
        '  orb.tb_salesman_id, ' +
        '  slm.name_company name_salesman, ' +
        '  orb.number,  ' +
        '  ord.status '+
        'from tb_order ord ' +
        '   inner join tb_order_bonus orb ' +
        '   on (orb.id = ord.id) ' +
        '     and (orb.tb_institution_id = ord.tb_institution_id) ' +
        '     and (orb.terminal = ord.terminal) ' +
        '   inner join tb_entity ctm ' +
        '   on (ctm.id = orb.tb_customer_id)  ' +
        '   inner join tb_entity slm ' +
        '   on (slm.id = orb.tb_salesman_id)  ' +

        '   inner join tb_order_item ori ' +
        '   on (ori.tb_order_id = orb.id)  ' +
        '       and (ori.tb_institution_id = orb.tb_institution_id)  ' +

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
          reject('OrderBonus.getOrder: ' + err);
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

        const dataBonus = await this.getOrder(tb_institution_id, tb_user_id, tb_order_id);
        result.bonus = dataBonus;

        const dataItems = await orderItemController.getList(tb_institution_id, tb_user_id, tb_order_id);
        result.items = dataItems;

        resolve(result);
      }
      catch (err) {
        reject('OrderBonus.get: ' + err);
      }
    });
    return promise;
  }

  static async updateOrder(body) {
    const promise = new Promise(async (resolve, reject) => {
      const dataOrderBonus = {
        id: body.order.id,
        tb_institution_id: body.order.tb_institution_id,
        terminal: 0,
        number: body.bonus.number,
        tb_customer_id: body.bonus.tb_customer_id,
        tb_salesman_id: body.bonus.tb_salesman_id,
      }

      Tb.update(dataOrderBonus, {
        where: {
          id: dataOrderBonus.id,
          tb_institution_id: dataOrderBonus.tb_institution_id,
          terminal: dataOrderBonus.terminal
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("orderBonus.updateOrder:" + err);
        });
    });
    return promise;
  }

  static async updateOrderItem(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var stock = await entityHasStockListController.getByEntity(body.order.tb_institution_id, body.bonus.tb_salesman_id);
        var dataItem = {};
        for (var item of body.items) {
          dataItem = {
            id: item.id,
            tb_institution_id: body.order.tb_institution_id,
            tb_order_id: body.order.id,
            terminal: 0,
            tb_stock_list_id: stock.tb_stock_list_id,
            tb_product_id: item.tb_product_id,
            quantity: item.quantity,
            kind: "Bonus",
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
        reject("orderBonus.updateOrderItem:" + err);
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
          reject("OrderBonus.delete:" + err);
        });
    });
    return promise;
  }


  static async closure(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataOrder = await this.getOrder(body.tb_institution_id, body.tb_user_id, body.tb_order_id);
        console.log(dataOrder);
        if (dataOrder.status == 'A') {
          var items = await orderItemController.getList(body.tb_institution_id, body.tb_user_id, body.tb_order_id);

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
              operation: "Bonus"
            };
            await stockStatement.insert(dataItem);
          };
          await orderController.updateStatus(body.tb_institution_id, body.tb_user_id, body.tb_order_id, 'F');
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
          var items = await orderItemController.getList(body.tb_institution_id, body.tb_user_id, body.tb_order_id);
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
              operation: "Bonus"
            };
            if (body.direction == "E") {
              dataItem['direction'] = 'S';
            } else {
              dataItem['direction'] = 'E';
            }

            await stockStatement.insert(dataItem);
          };
          await orderController.updateStatus(body.tb_institution_id, body.tb_user_id, body.tb_order_id, 'A');
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
module.exports = OrderBonusController;