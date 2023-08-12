const Base = require('./base.controller.js');
const ihPackage = require('./institutionHasPackage.controller.js');
const db = require("../model/index.js");
const Tb = db.pack;

class PackageController extends Base {
  static async sync(pack) {    
    const promise = new Promise(async (resolve, reject) => {      
      this.insert(pack)
        .then((data) => {
              resolve(data);
        })
        .catch(err => {
          reject("PackageController.sync:" + err);
        });
    });
    return promise;
  }

  static async getbyDescription(descripton) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select id ' +
        'from tb_package ' +
        'WHERE ( description =? ) ',
        {
          replacements: [descripton],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data[0] != null)
            resolve(data[0]);
          else
            resolve({id:0});
        })
        .catch(err => {
          reject(new Error(err));
        });
    });
    return promise;
  }

  static async insert(pack) {

    const promise = new Promise(async (resolve, reject) => {
      const exist = await this.getbyDescription(pack.description);

      if (exist === '0') {
        //Se não encontrou grava a Forma de pagamento
        Tb.create(pack)
          .then((data) => {
            //com este retorno gravo a forma de pagamento no Institution
            const dataihPackage = {
              tb_institution_id: pack.tb_institution_id,
              tb_package_id: data.id,
              active: pack.active,
            };
           
            ihPackage.insert(dataihPackage)
              .then((data) => {
                pack.id = data.id;
                resolve(pack);
              });
              
          })
          .catch(err => {
            reject("Erro:" + err);
          });
      } else {
        //Se a forma de pagamento já existe fazer outro tratamento
        //Finalizado 20/10/2022
        resolve(pack);
      }
    });
    return promise;
  }

  static getList(institutionId) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  pt.id, ihp.tb_institution_id, pt.description, ihp.active ' +
        'from tb_package pt ' +
        '  inner join tb_institution_has_package ihp ' +
        '  on (pt.id = ihp.tb_brand_id) ' +
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

  static get(institutionId, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  pt.id, ihp.tb_institution_id, pt.description, ihp.active ' +
        'from tb_package pt ' +
        '  inner join tb_institution_has_package ihp ' +
        '  on (pt.id = ihp.tb_brand_id) ' +
        'where (ihp.tb_institution_id =? ) ' +
        ' and (ihp.tb_brand_id =? )',
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

  static async update(pack) {
    const promise = new Promise((resolve, reject) => {
      const dataPaymentType = {
        id: pack.id,
        description: pack.description,
      }
      Tb.update(dataPaymentType, {
        where: { id: pack.id }
      })
        .then(() => {
          const dataIhp = {
            tb_institution_id: pack.tb_institution_id,
            tb_brand_id: pack.id,
            active: pack.active
          }
          ihPackage.update(dataIhp);
          resolve(pack);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static async delete(brand) {
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
module.exports = PackageController;