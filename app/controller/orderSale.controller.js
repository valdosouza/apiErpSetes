const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.ordersale;
const orderController = require('./order.controller.js');
const orderBilling = require('./orderBilling.controller.js');
const orderTotalizer = require('./orderTotalizer.controller.js');
const orderItemController = require('./orderItem.controller.js');
const stockStatement = require('./stockStatement.controller.js');
const entityHasStockListController = require('./entityHasStockList.controller.js');
const EntityExtenralCode = require('./entityExternalCode.controller.js');

class OrderSaleController extends Base {
  static async getNextNumber(tb_institution_id,tb_salesman_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_sale ' +
        'WHERE ( tb_institution_id =? ) '+                
        ' and ( tb_salesman_id =?)',        
        {
          replacements: [tb_institution_id,tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var nextNumber = 1;
          if (data.length > 0) {
            nextNumber = data[0].lastNumber + 1;
          }
          resolve(nextNumber);
        })
        .catch(err => {
          reject('orderSale.getNexNumber: ' + err);
        });
    });
    return promise;
  }

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        
        var regSalesman = await EntityExtenralCode.getByExternalCode(body.sale.tb_institution_id,body.sale.salesman_external_code,'COLABORADOR');
        body.sale.tb_salesman_id  = regSalesman.tb_entity_id;
        //Caso seja zer pegar o primeiro colaborador da lista do estabelemcimento
        if (body.sale.tb_salesman_id == 0){
          regSalesman = await EntityExtenralCode.getFirstExternalCode(body.sale.tb_institution_id,'COLABORADOR');
          body.sale.tb_salesman_id  = regSalesman.tb_entity_id;  
        }
        
        var regCustomer = await EntityExtenralCode.getByExternalCode(body.sale.tb_institution_id,body.sale.customer_external_code,'EMPRESA');
        body.sale.tb_customer_id = regCustomer.tb_entity_id;
        body.order.tb_user_id   = body.sale.tb_salesman_id
        delete body.sale.customerExternalCode;
        delete body.sale.salesmanExternalCode;
        orderController.sync(body.order);
        var regOrderSale = await this.getById(body.sale.id, body.sale.tb_institution_id, body.sale.terminal);
        if (regOrderSale.id == 0) {
          Tb.create(body.sale);
        } else {
          Tb.update(body.sale, {
            where: {
              tb_institution_id: body.sale.tb_institution_id,
              id: body.sale.id,
              terminal: body.sale.terminal,
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
        reject("OrderSaleController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id, tb_institution_id, terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_order_sale ' +
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
        reject('OrderSaleController.getById: ' + err);
      }
    });
    return promise;
  };

  static async insertOrder(body) {
    const promise = new Promise(async (resolve, reject) => {

      if (body.sale.number == 0)
        body.sale.number = await this.getNextNumber(body.order.tb_institution_id,body.sale.tb_salesman_id);

      const dataOrder = {
        id: body.order.id,
        tb_institution_id: body.order.tb_institution_id,
        terminal: 0,
        tb_salesman_id: body.sale.tb_salesman_id,
        number: body.sale.number,
        tb_customer_id: body.sale.tb_customer_id,
        total_value: body.sale.total_value,
        change_value: body.sale.change_value,
      }
      Tb.create(dataOrder)
        .then(() => {
          resolve(body);
        })
        .catch(err => {
          reject("orderSale.insertOrder:" + err);
        });
    });
    return promise;
  }

  static async updateOrder(body) {
    const promise = new Promise((resolve, reject) => {
      try {
        const dataSale = {
          id: body.order.id,
          tb_institution_id: body.order.tb_institution_id,
          terminal: 0,
          tb_salesman_id: body.sale.tb_salesman_id,
          number: body.sale.number,
          tb_customer_id: body.sale.tb_customer_id,
          total_value: body.sale.total_value,
          change_value: body.sale.change_value,
        }
        Tb.update(dataSale, {
          where: {
            id: dataSale.id,
            tb_institution_id: dataSale.tb_institution_id,
            terminal: dataSale.terminal
          }
        })
          .then(data => {
            resolve(data);
          })
      } catch (error) {
        reject("orderSale.updateOrderSale:" + error);
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
                    await orderBilling.insert(body);
                    await orderTotalizer.insert(body);
                    resolve(body);
                  })
              });
          })
      } catch (error) {
        reject("orderSale.insert:" + error);
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
        await orderBilling.update(body);
        await orderTotalizer.update(body);
        resolve(body);
      } catch (error) {
        reject("orderSale.update:" + error);
      }
    });
    return promise;
  }


  static getList(body) {
    const promise = new Promise((resolve, reject) => {
      try {
        var nick_trade = "";
        var sqltxt =
          'select ' +
          'ord.id , ' +
          'ord.tb_institution_id , ' +
          'ors.number, ' +
          'ord.dt_record , ' +
          'ors.tb_customer_id , ' +
          'ctm.nick_trade name_customer , ' +
          'pctm.cpf doc_customer , ' +
          'ors.tb_salesman_id , ' +
          'slm.nick_trade name_salesman , ' +
          'pslm.cpf doc_salesman,  ' +
          'ord.status ' +
          'from tb_order ord   ' +
          '   inner join tb_order_sale ors  ' +
          '   on (ors.id = ord.id)   ' +
          '     and (ors.tb_institution_id = ord.tb_institution_id)  ' +
          '     and (ors.terminal = ord.terminal)  ' +
          '   inner join tb_entity ctm  ' +
          '   on (ctm.id = ors.tb_customer_id)  ' +
          '   inner join tb_person pctm ' +
          '   on (pctm.id  = ctm.id)  ' +
          '   inner join tb_entity slm  ' +
          '   on (slm.id = ors.tb_salesman_id)  ' +
          '   inner join tb_person pslm ' +
          '   on (pslm.id  = slm.id)     ' +
          'where (ord.tb_institution_id =? )  ' +
          '  and (ord.terminal = ?) '+
          'and (ors.tb_salesman_id = ?) ' +
          ' AND (ord.status <> ?) ';

        if (body.nick_trade != "") {
          nick_trade = '%' + body.nick_trade + '%';
          sqltxt += ' and (ctm.nick_trade like ? ) ';
        } else {
          nick_trade = "";
          sqltxt += ' and (ctm.nick_trade <> ?) ';
        }
        sqltxt +=
          'union ' +
          'select  ' +
          'ord.id , ' +
          'ord.tb_institution_id , ' +
          'ors.number, ' +
          'ord.dt_record , ' +
          'ors.tb_customer_id , ' +
          'ctm.nick_trade name_customer , ' +
          'cctm.cnpj doc_customer , ' +
          'ors.tb_salesman_id , ' +
          'slm.nick_trade name_salesman , ' +
          'pslm.cpf doc_salesman,  ' +
          'ord.status ' +
          'from tb_order ord   ' +
          '   inner join tb_order_sale ors  ' +
          '   on (ors.id = ord.id)   ' +
          '     and (ors.tb_institution_id = ord.tb_institution_id)  ' +
          '     and (ors.terminal = ord.terminal)  ' +
          '   inner join tb_entity ctm  ' +
          '   on (ctm.id = ors.tb_customer_id)  ' +
          '   inner join tb_company cctm ' +
          '   on (cctm.id  = ctm.id)     ' +
          '   inner join tb_entity slm  ' +
          '   on (slm.id = ors.tb_salesman_id)  ' +
          '   inner join tb_person pslm ' +
          '   on (pslm.id  = slm.id)     ' +
          'where (ord.tb_institution_id =? )  ' +
          '  and (ord.terminal = ?) '+
          'and (ors.tb_salesman_id = ?) ' +
          ' AND (ord.status <> ?) ';
        if (body.nick_trade != "") {
          sqltxt += ' and (ctm.nick_trade like ? ) ';
        } else {
          sqltxt += ' and (ctm.nick_trade <> ?) ';
        }
        sqltxt +=
          ' order by number DESC '+
          ' limit ' + ((body.page - 1) * 20) + ',20 ';   
 

        Tb.sequelize.query(
          sqltxt,
          {
            replacements: [body.tb_institution_id, 0, body.tb_salesman_id, 'D', nick_trade, body.tb_institution_id,0, body.tb_salesman_id, 'D', nick_trade],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data);
          })
      } catch (error) {
        reject("orderSale.getlist: " + error);
      }
    });
    return promise;
  }

  static getItemList(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'ori.* ' +
        'from tb_order ord ' +
        '  inner join tb_order_sale ors ' +
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
          replacements: [tb_institution_id, id, 'Sale'],
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
  static getQttyByDay(tb_institution_id, tb_salesman_id, dt_record, tb_product_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select sum(quantity) total ' +
        'from tb_order_item ori ' +
        '  inner join tb_order_sale ors ' +
        '  on (ors.id = ori.tb_order_id) ' +
        '    and (ors.tb_institution_id = ori.tb_institution_id) ' +
        '  inner join tb_order ord ' +
        '  on (ors.id = ord.id) ' +
        '    and (ors.tb_institution_id = ord.tb_institution_id) ' +
        'where ( ori.tb_institution_id = ?) ' +
        'and ( ori.kind =? )' +
        ' and (ori.tb_product_id =? )' +
        'and (ors.tb_salesman_id = ?) ' +
        'and ( ord.dt_record = ? ) ',
        {
          replacements: [tb_institution_id, 'sale', tb_product_id, tb_salesman_id, dt_record],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {

          if (data.length > 0) {
            resolve(Number(data[0].total))
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject("orderSale.getItemlist: " + err);
        });
    });
    return promise;
  }
  static getOrder(tb_institution_id, tb_salesman_id, id) {
    const promise = new Promise((resolve, reject) => {
      var sqlTxtPerson =
        'select ' +
        ' ors.number, ' +
        ' ors.tb_customer_id, ' +
        ' ctm.nick_trade name_customer, ' +
        ' pctm.cpf docCustomer, ' +
        ' ors.tb_salesman_id, ' +
        ' slm.nick_trade name_salesman, ' +
        ' pslm.cpf docSalesman, ' +
        ' ord.status ' +
        'from tb_order ord  ' +
        '   inner join tb_order_sale ors  ' +
        '   on (ord.id = ors.id)' +
        '   and (ord.tb_institution_id = ors.tb_institution_id)' +
        '   and (ord.terminal = ors.terminal)' +

        '   inner join tb_entity ctm ' +
        '   on (ctm.id = ors.tb_customer_id)  ' +
        '   inner join tb_person pctm ' +
        '   on (pctm.id = ors.tb_customer_id)  ' +

        '   inner join tb_entity slm ' +
        '   on (slm.id = ors.tb_salesman_id)  ' +

        '   inner join tb_person pslm ' +
        '   on (pslm.id = ors.tb_salesman_id)  ' +


        'where (ors.tb_institution_id =? ) ' +
        ' and (ors.tb_salesman_id = ?) ' +
        ' and (ors.id =? )';

      var sqlTxtCompany =
        'select ' +
        ' ors.number, ' +
        ' ors.tb_customer_id, ' +
        ' ctm.nick_trade name_customer, ' +
        ' cctm.cnpj doc_customer, ' +
        ' ors.tb_salesman_id, ' +
        ' slm.nick_trade name_salesman, ' +
        ' pslm.cpf doc_salesman, ' +
        ' ord.status ' +
        'from tb_order ord  ' +
        '   inner join tb_order_sale ors  ' +
        '   on (ord.id = ors.id)' +
        '   and (ord.tb_institution_id = ors.tb_institution_id)' +
        '   and (ord.terminal = ors.terminal)' +

        '   inner join tb_entity ctm ' +
        '   on (ctm.id = ors.tb_customer_id)  ' +

        '   inner join tb_company cctm ' +
        '   on (cctm.id = ors.tb_customer_id)  ' +

        '   inner join tb_entity slm ' +
        '   on (slm.id = ors.tb_salesman_id)  ' +

        '   inner join tb_person pslm ' +
        '   on (pslm.id = ors.tb_salesman_id)  ' +
        'where (ors.tb_institution_id =? ) ' +
        ' and (ors.tb_salesman_id = ?)' +
        ' and (ors.id =? )';

      try {
        Tb.sequelize.query(
          sqlTxtPerson +
          ' union ' +
          sqlTxtCompany,
          {
            replacements: [tb_institution_id, tb_salesman_id, id, tb_institution_id, tb_salesman_id, id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {

            if (data.length > 0) {
              resolve(data[0]);
            } else {
              resolve("{}");
            }
          })
      } catch (error) {
        reject('orderSaleController.getOrder: ' + error);
      }
    });
    return promise;
  }


  static async getStatus(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  ord.status ' +
        'from tb_order ord  ' +
        '   inner join tb_order_sale ora ' +
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
          reject('orderSale.getStatus: ' + err);
        });
    });
    return promise;
  }

  static get = (tb_institution_id, tb_salesman_id, tb_order_id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};

        const dataOrder = await orderController.get(tb_institution_id, tb_salesman_id, tb_order_id);
        result.order = dataOrder;

        const dataSale = await this.getOrder(tb_institution_id, tb_salesman_id, tb_order_id);
        result.sale = dataSale;

        const dataBilling = await orderBilling.get(tb_institution_id, tb_salesman_id, tb_order_id);
        result.billing = dataBilling;

        const dataTotalizer = await orderTotalizer.get(tb_institution_id, tb_salesman_id, tb_order_id);
        result.totalizer = dataTotalizer;

        const dataItems = await orderItemController.getList(tb_institution_id, tb_salesman_id, tb_order_id);
        result.items = dataItems;

        resolve(result);
      }
      catch (err) {
        reject('orderSaleController.get: ' + err);
      }
    });
    return promise;
  }



  static async updateOrderItem(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        var stock = await entityHasStockListController.getByEntity(body.order.tb_institution_id, body.sale.tb_salesman_id);
        for (var item of body.items) {
          if (item.updateStatus != "") {
            dataItem = {
              id: item.id,
              tb_institution_id: body.order.tb_institution_id,
              tb_order_id: body.order.id,
              terminal: body.order.terminal,
              tb_stock_list_id: stock.tb_stock_list_id,
              tb_price_list_id: item.tb_price_list_id,
              tb_product_id: item.tb_product_id,
              quantity: item.quantity,
              unit_value: item.unit_value,
              kind: 'Sale',
            };
            //Quanto o insert é mais complexo como getNext precisa do no loop              
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
          }
        };
        resolve("Items Alterados");
      } catch (err) {
        reject("orderSale.updateOrderItem:" + err);
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
        reject("orderSale.updateOrderItem:" + err);
      }

    });
    return promise;
  }

  static async delete(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      try {
        orderController.delete(tb_institution_id, id)
          .then(() => {
            resolve(true);
          })
      } catch (error) {
        reject("orderSale.deleteOrderSale:" + error);
      }
    });
    return promise;
  }

  static async closure(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataOrder = await this.getOrder(body.tb_institution_id, body.tb_user_id, body.tb_order_id);
        if ( (dataOrder.status == 'A') || (dataOrder.status == 'N') ) {
          var items = await orderItemController.getList(body.tb_institution_id, body.tb_user_id, body.tb_order_id);
          var dataItem = {};
          for (var item of items) {
            dataItem = {
              id: 0,
              tb_institution_id: body.tb_institution_id,
              tb_order_id: body._order_id,
              terminal: 0,
              tb_order_item_id: item.id,
              tb_stock_list_id: item.tb_stock_list_id,
              local: "web",
              kind: "Fechamento",
              dt_record: body.dt_record,
              direction: "S",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "OrderSale"
            };
            //Quanto o insert é mais complexo como create precisa do no loop          
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
              tb_order_id: body.tb_order_id,
              terminal: 0,
              tb_order_item_id: item.id,
              tb_stock_list_id: item.tb_stock_list_id,
              local: "web",
              kind: "Reabertura",
              dt_record: body.dt_record,
              direction: "E",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "OrderSale"
            };
            //Quanto o insert é mais complexo como create precisa do no loop          
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

  static async saveCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        //Não salva tb_order por que já foi criado no attendance   
        this.insertCard(body);
        this.insertOrderPaid(body);
        resolve(body.order);
      } catch (err) {
        reject('OrderSaleController.saveCard: ' + err);
      }
    });
    return promise;
  }

  static async insertCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        for (var item of body.items) {
          dataItem = {
            id: body.order.id,
            tb_institution_id: body.order.tb_institution_id,
            terminal: 0,
            tb_product_id: item.tb_product_id,
            bonus: item.bonus,
            sale: item.sale,
            unit_value: item.unit_value,
          };
          //Quanto o insert é mais complexo como getNext precisa do no loop          
          orderSaleCard.insert(dataItem);
        };
        resolve("Items Adicionados");
      } catch (err) {
        reject("OrderSaleController.insertCard:" + err);
      }

    });
    return promise;
  }

  static async insertOrderPaid(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataPayment = {};
        for (var item of body.Payments) {
          if (item.dt_expiration == "") delete item.dt_expiration;
          dataPayment = {
            id: body.order.id,
            tb_institution_id: body.order.tb_institution_id,
            terminal: 0,
            tb_payment_types_id: item.tb_payment_types_id,
            value: item.value,
            dt_expiration: item.dt_expiration,
          };
          //Quanto o insert é mais complexo como getNext precisa do no loop          
          orderPaid.insert(dataPayment);
        };
        resolve("Pagamentos Adicionados");
      } catch (err) {
        reject("OrderSaleController.insertOrderPaid:" + err);
      }

    });
    return promise;
  }
  //====================================================================================
  static async saveByCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var qtde = 0;
        for (var item of body.items) {
          qtde += item.qtty_sold;
        }
        if (qtde > 0) {
          body.order['number'] = 0;
          this.insertOrder(body);
          this.insertOrderItemByCard(body);
          this.closurebyCard(body);
        }
        resolve(body);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  static async insertOrderItemByCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        for (var item of body.items) {
          if (item.qtty_sold > 0) {
            dataItem = {
              id: 0,
              tb_institution_id: body.order.tb_institution_id,
              tb_order_id: body.order.id,
              terminal: 0,
              tb_stock_list_id: body.StockOrigen.tb_stock_list_id,//Neste caso via card na consignação deve informar o estoque do cliente 
              tb_product_id: item.tb_product_id,
              quantity: item.qtty_sold,
              unit_value: item.unit_value,
              kind: 'Sale',
            };
            //Quanto o insert é mais complexo como getNext precisa do no loop          
            orderItem.insert(dataItem);
          }
        };
        resolve("Items Adicionados");
      } catch (err) {
        reject("orderSale.insertOrderItem:" + err);
      }

    });
    return promise;
  }

  static async closurebyCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var items = await this.getItemList(body.order.tb_institution_id, body.order.id);
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
            operation: "Sale"
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
        reject('orderSale.cleanUp ' + error);
      }
    });
    return promise;
  }
}
module.exports = OrderSaleController;