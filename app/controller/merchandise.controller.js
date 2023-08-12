const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.merchandise;
const product = require('./product.controller.js');
const stock = require('./stock.controller.js');
const brand = require('./brand.controller.js');

class MerchandiseController extends Base {
  static async sync(merchandise) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        product.sync(merchandise.product)
          .then(async () => {
            //Brand
            var regBrand = await brand.getbyDescription(merchandise.merchandise.name_brand);            
            merchandise.merchandise.tb_brand_id = regBrand.id;
            delete merchandise.merchandise.name_brand;
            var regMerch = await this.getById(merchandise.merchandise.tb_institution_id, merchandise.merchandise.id);
            if (regMerch.id == 0) {
              await Tb.create(merchandise.merchandise);
            } else {
              Tb.update(merchandise.merchandise, {
                where: { id: merchandise.merchandise.id,
                         tb_institution_id: merchandise.merchandise.tb_institution_id
                        }
              })              
            }
            resolve({
              code: merchandise.product.id,
              id: 200,
              Message: "SYNCHED"
            });
          })
      } catch (error) {
        reject("MerchandiseController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select * ' +
        'from tb_merchandise ' +
        'where ( tb_institution_id =? ) ' +
        ' and ( id=? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {          
          if (data.length > 0){
            resolve(data[0]);
          }else{
            resolve({id:0});
          }
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };



  static async getbyDescription(descripton) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select id ' +
        'from tb_merchandise ' +
        'WHERE ( description =? ) ',
        {
          replacements: [descripton],
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

  static async insert(merchandise) {

    const promise = new Promise(async (resolve, reject) => {
      Tb.create(merchandise)
        .then((data) => {
          resolve(merchandise);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static getList(institutionId) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  pt.id, ihp.tb_institution_id, pt.description, ihp.active ' +
        'from tb_merchandise pt ' +
        '  inner join tb_institution_has_merchandise ihp ' +
        '  on (pt.id = ihp.tb_merchandise_id) ' +
        'where (ihp.tb_institution_id =? ) ',
        {
          replacements: [institutionId],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Measure:" + err));
        });
    });
    return promise;
  }

  static get(institutionId, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  pt.id, ihp.tb_institution_id, pt.description, ihp.active ' +
        'from tb_merchandise pt ' +
        '  inner join tb_institution_has_merchandise ihp ' +
        '  on (pt.id = ihp.tb_merchandise_id) ' +
        'where (ihp.tb_institution_id =? ) ' +
        ' and (ihp.tb_merchandise_id =? )',
        {
          replacements: [institutionId, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject(new Error("Measure:" + err));
        });
    });
    return promise;
  }

  static async update(merchandise) {
    const promise = new Promise((resolve, reject) => {
      const dataMeasure = {
        id: merchandise.id,
        description: merchandise.description,
      }
      Tb.update(dataMeasure, {
        where: { id: merchandise.id }
      })
        .then(() => {
          const dataIhp = {
            tb_institution_id: merchandise.tb_institution_id,
            tb_merchandise_id: merchandise.id,
            active: merchandise.active
          }
          ihMeasure.update(dataIhp);
          resolve(merchandise);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static async delete(merchandise) {
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
module.exports = MerchandiseController;