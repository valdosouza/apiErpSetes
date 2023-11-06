const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.financialPayment;
const DateFunction = require('../util/dateFunction.js');
class FinancialPaymnetController extends Base {

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var regFinancial = await this.getById(body.tb_institution_id, body.terminal, body.id);        
        if (regFinancial.id == 0) {
          await this.insert(body);
        } else {
          await this.update(body);
        }        
        resolve({
          code: body.id,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("FinancialPaymentController.sync:" + error);
      }
    });
    return promise;
  }
  static async insert(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        Tb.create(body)
          .then((data) => {
            resolve(data);
          })
      } catch (error) {
        reject("financialPaymnent.insert:" + error);
      }
    });
    return promise;
  }

  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_financial_payment ' +
        'where (tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("financialPaymnent.getlist: " + error);
        });
    });
    return promise;
  }

  static getById(tb_institution_id, terminal, id) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'select * ' +
          'from tb_financial_payment ' +
          'where (tb_institution_id =? ) ' +
          ' and (terminal =?)'+
          ' and (id = ? )',
          {
            replacements: [tb_institution_id, terminal, id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data.length > 0) {
              resolve(data[0]);
            } else {
              resolve({ id: 0 });
            }
          })
      } catch (error) {
        reject('financialPayment.getById: ' + error);
      }
    });
    return promise;
  }

  static get(tb_institution_id, tb_order_id, parcel) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select * ' +
        'from tb_financial_payment ' +
        'where (tb_institution_id =? ) ' +
        ' and (tb_order_id =? )',
        ' and (parcel =? )',
        {
          replacements: [tb_institution_id, tb_order_id, parcel],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("financialPayment.get: " + error);
        });
    });
    return promise;
  }

  static async update(body) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.update(body, {
          where: {
            id: body.id,
            tb_institution_id: body.tb_institution_id,
            terminal: body.terminal
          }
        })
          .then(data => {
            resolve(data);
          })
      } catch (error) {
        reject("financialPaymnent.update:" + error);
      }
    });
    return promise;
  }

  static async delete(order) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(order)
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

  static getSettledCode(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select max(settled_code) settled_code ' +
        'from tb_financial_payment ' +
        'where ( tb_institution_id=? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            resolve(data[0].settled_code + 1)
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject("financialPayment.get: " + err);
        });
    });
    return promise;
  }

  static async saveByCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataFinancial = {
          tb_institution_id: body.order.tb_institution_id,
          tb_order_id: body.order.id,
          terminal: 0,
          parcel: 1,
          interest_value: 0,
          late_value: 0,
          discount_value: 0,
          tb_payment_types_id: 0,
          paid_value: 0,
          dt_payment: DateFunction.newDate(),
          dt_real_payment: DateFunction.newDate(),
          tb_financial_plans_id: 0,
          settled_code: 0,
        }
        for (var item of body.Payments) {
          if (item.value > 0) {
            dataFinancial.parcel += dataFinancial.parcel;
            dataFinancial.tb_payment_types_id = item.tb_payment_types_id;
            if ((item.name_payment_type = 'DINHEIRO') && (body.order.change_value > 0)) {
              dataFinancial.paid_value = item.value - body.order.change_value;
            } else {
              dataFinancial.paid_value = item.value;
            }
            dataFinancial.settled_code = await this.getSettledCode(body.order.tb_institution_id);
            item['settled_code'] = dataFinancial.settled_code;
            await this.insert(dataFinancial);
          }
        }
        resolve(body);
      } catch (error) {
        reject('financialPayment.SaveBycard: ' + error)
      }

    });
    return promise;
  }
}
module.exports = FinancialPaymnetController;