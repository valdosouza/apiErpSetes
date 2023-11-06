const Base = require('../controller/base.controller.js');
const ihPaymentType = require('../controller/institutionHasPaymentType.controller.js');
const db = require("../model");
const Tb = db.paymentTypes;

class PaymentTypeController extends Base {

  static async sync(paymentType) {

    const promise = new Promise(async (resolve, reject) => {
      this.insert(paymentType)
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("PaymentTypeController.sync:" + err);
        });
    });
    return promise;
  }



  static async insert(paymentType) {

    const promise = new Promise(async (resolve, reject) => {
      try {
        const exist = await this.getIdByDescription(paymentType.description);
        if (exist.id === 0) {
          //Se não encontrou grava a Forma de pagamento
          paymentType.id = await this.getNextId();
          Tb.create(paymentType)
            .then(async (data) => {
              //com este retorno gravo a forma de pagamento no Institution
              const dataihpayment = {
                tb_institution_id: paymentType.tb_institution_id,
                tb_payment_types_id: data.id,
                active: paymentType.active,
              };
              await ihPaymentType.insert(dataihpayment)
                .then((data) => {
                  paymentType.id = data.id;
                  resolve(paymentType);
                });
            })
        } else {
          //Se a forma de pagamento já existe fazer outro tratamento
          //Finalizado 20/10/2022
          paymentType.id = exist.id;
          resolve(paymentType);
        }

      } catch (error) {
        reject("PaymentTypeController.insert:" + error);
      }
    });
    return promise;
  }

  static async getNextId() {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select max(id) lastId ' +
          'from tb_payment_types ',
          {
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data) {
              const NextId = data[0].lastId + 1;
              resolve(NextId);
            } else {
              resolve(1);
            }
          })

      } catch (error) {
        reject('PaymentTypeController.getNexId: ' + errorr);
      }
    });
    return promise;
  }

  static getList(institutionId) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  pt.id, ihp.tb_institution_id, pt.description, ihp.active ' +
        'from tb_payment_types pt ' +
        '  inner join tb_institution_has_payment_types ihp ' +
        '  on (pt.id = ihp.tb_payment_types_id) ' +
        'where (ihp.tb_institution_id =? ) ',
        {
          replacements: [institutionId],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("PaymentType:" + err));
        });
    });
    return promise;
  }

  static async getIdByDescription(description) {
    const promise = new Promise((resolve, reject) => {
      try {        
        Tb.sequelize.query(
          'Select id ' +
          'from tb_payment_types ' +
          'WHERE ( description =? ) ',
          {
            replacements: [description],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data.length > 0)
              resolve(data[0]);
            else
              resolve({ id: 0 });
          })
      } catch (error) {
        reject("PaymentTypeController.sync:" + error);
      }
    });
    return promise;
  }

  static get(institutionId, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  pt.id, ihp.tb_institution_id, pt.description, ihp.active ' +
        'from tb_payment_types pt ' +
        '  inner join tb_institution_has_payment_types ihp ' +
        '  on (pt.id = ihp.tb_payment_types_id) ' +
        'where (ihp.tb_institution_id =? ) ' +
        ' and (ihp.tb_payment_types_id =? )',
        {
          replacements: [institutionId, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject(new Error("PaymentType:" + err));
        });
    });
    return promise;
  }

  static async update(paymentType) {
    const promise = new Promise((resolve, reject) => {
      const dataPaymentType = {
        id: paymentType.id,
        description: paymentType.description,
      }
      Tb.update(dataPaymentType, {
        where: { id: paymentType.id }
      })
        .then(() => {
          const dataIhp = {
            tb_institution_id: paymentType.tb_institution_id,
            tb_payment_types_id: paymentType.id,
            active: paymentType.active
          }
          ihPaymentType.update(dataIhp);
          resolve(paymentType);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static async delete(paymentType) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(paymentType)
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

}
module.exports = PaymentTypeController;