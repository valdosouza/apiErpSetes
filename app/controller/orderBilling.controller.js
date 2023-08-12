const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.orderbilling;

class OrderBillingController extends Base {

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var regOrderBilling = await this.getById(body.id, body.tb_institution_id, body.terminal);
        if (regOrderBilling.id == 0) {
          Tb.create(body);
        } else {
          Tb.update(body, {
            where: {
              tb_institution_id: body.tb_institution_id,
              id: body.id,
              terminal: body.terminal,
            }
          });
        }
        resolve({
          code: body.id,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("OrderBillingController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id, tb_institution_id, terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_order_billing ' +
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
        reject('OrderItemController.getById: ' + err);
      }
    });
    return promise;
  };

  static async insert(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var billing = body.billing;
        billing.tb_institution_id = body.order.tb_institution_id;
        billing.id = body.order.id;
        billing.terminal = body.order.terminal;
        delete billing.name_payment;
        await Tb.create(billing)
          .then(() => {
            resolve(billing);
          });
      } catch (error) {
        reject("OrderBillingController.insert:" + error);
      }
    });
    return promise;
  }

  static async update(body) {
    const promise = new Promise((resolve, reject) => {
      try {
        var billing = body.billing;
        billing.tb_institution_id = body.order.tb_institution_id;
        billing.id = body.order.id;
        billing.terminal = body.order.terminal;
        delete billing.name_payment;
        Tb.update(billing, {
          where: {
            id: billing.id,
            tb_institution_id: billing.tb_institution_id,
            terminal: billing.terminal
          }
        })
          .then(data => {
            resolve(data);
          })
      } catch (error) {
        reject("orderBilling.update:" + error);
      }
    });
    return promise;
  }

  static get(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select ' +
        'orb.tb_payment_types_id, ' +
        'pmt.description name_payment, ' +
        'orb.task_owner, ' +
        'orb.deadline, ' +
        'orb.plots ' +
        'From tb_order_billing orb ' +
        '  inner join tb_payment_types pmt ' +
        '  on (pmt.id = orb.tb_payment_types_id) ' +
        'where (orb.tb_institution_id =? )' +
        ' and (orb.id = ?)',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            resolve({
              tb_payment_types_id: data[0].tb_institution_id,
              name_payment: data[0].name_payment,
              task_owner: data[0].task_owner,
              deadline: data[0].deadline,
              plots: parseInt(data[0].plots),
            });
          } else {
            resolve({
              tb_payment_types_id: 1,
              name_payment: 'DINHEIRO',
              task_owner: 0,
              deadline: "",
              plots: 0,
            });
          }

        })
        .catch(err => {
          reject('orderBilling.get: ' + err);
        });
    });
    return promise;
  }


}
module.exports = OrderBillingController;