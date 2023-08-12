const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.category;

class CategoryController extends Base {

  static async sync(category) {

    const promise = new Promise(async (resolve, reject) => {
      this.insert(category)
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("CategoryController.sync:" + err);
        });
    });
    return promise;
  }

  static async getbyDescription(descripton, tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select id ' +
        'from tb_category ' +
        'WHERE ( description =? ) ' +
        ' and (tb_institution_id = ?)',
        {
          replacements: [descripton, tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data[0] != null)
            resolve(data);
          else
            resolve('0');
        })
        .catch(err => {
          reject(new Error(err));
        });
    });
    return promise;
  }

  static async insert(category) {

    const promise = new Promise(async (resolve, reject) => {
      const exist = await this.getbyDescription(category.description,category.tb_institution_id);
      if (exist === '0') {
        //Se não encontrou grava a Forma de pagamento
        Tb.create(category)
          .then((data) => {
            resolve(category);
          })
          .catch(err => {
            reject("Erro:" + err);
          });
      } else {
        //Se a forma de pagamento já existe fazer outro tratamento
        //Finalizado 20/10/2022
        resolve(category);
      }
    });
    return promise;
  }

  static getList(institutionId) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_category  ' +
        'where (tb_institution_id =? ) ',
        {
          replacements: [institutionId],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("category:" + err));
        });
    });
    return promise;
  }

  static get(institutionId, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_category  ' +
        'where (tb_institution_id =? ) ' +
        ' and (tb_payment_types_id =? )',
        {
          replacements: [institutionId, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject(new Error("category:" + err));
        });
    });
    return promise;
  }

  static async update(category) {
    const promise = new Promise((resolve, reject) => {
      const dataPaymentType = {
        id: category.id,
        description: category.description,
      }
      Tb.update(dataPaymentType, {
        where: { id: category.id }
      })
        .then(() => {
          const dataIhp = {
            tb_institution_id: category.tb_institution_id,
            tb_payment_types_id: category.id,
            active: category.active
          }
          ihPaymentType.update(dataIhp);
          resolve(category);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static async delete(category) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(category)
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
module.exports = CategoryController;