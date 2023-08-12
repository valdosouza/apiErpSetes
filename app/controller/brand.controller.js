const Base = require('./base.controller.js');
const ihBrand = require('./institutionHasBrand.controller.js');
const db = require("../model/index.js");
const Tb = db.brand;

class BrandController extends Base {
  static async sync(brand) {    
    const promise = new Promise(async (resolve, reject) => {      
      this.insert(brand)
        .then((data) => {
              resolve(data);
        })
        .catch(err => {
          reject("BrandController.sync:" + err);
        });
    });
    return promise;
  }

  static async getbyDescription(descripton) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select id ' +
        'from tb_brand ' +
        'WHERE ( description =? ) ',
        {
          replacements: [descripton],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data[0] != null)
            resolve(data[0]);
          else
            resolve({id : 0});
        })
        .catch(err => {
          reject(new Error(err));
        });
    });
    return promise;
  }

  static async insert(brand) {

    const promise = new Promise(async (resolve, reject) => {
      const exist = await this.getbyDescription(brand.description);

      if (exist === '0') {
        //Se não encontrou grava a Forma de pagamento
        Tb.create(brand)
          .then((data) => {
            //com este retorno gravo a forma de pagamento no Institution
            const dataihbrand = {
              tb_institution_id: brand.tb_institution_id,
              tb_brand_id: data.id,
              active: brand.active,
            };
            ihBrand.insert(dataihbrand)
              .then((data) => {
                brand.id = data.id;
                resolve(brand);
              });
          })
          .catch(err => {
            reject("Erro:" + err);
          });
      } else {
        //Se a forma de pagamento já existe fazer outro tratamento
        //Finalizado 20/10/2022
        resolve(brand);
      }
    });
    return promise;
  }

  static getList(institutionId) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  pt.id, ihp.tb_institution_id, pt.description, ihp.active ' +
        'from tb_brand pt ' +
        '  inner join tb_institution_has_brand ihp ' +
        '  on (pt.id = ihp.tb_brand_id) ' +
        'where (ihp.tb_institution_id =? ) ',
        {
          replacements: [institutionId],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Brand:" + err));
        });
    });
    return promise;
  }

  static get(institutionId, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  pt.id, ihp.tb_institution_id, pt.description, ihp.active ' +
        'from tb_brand pt ' +
        '  inner join tb_institution_has_brand ihp ' +
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
          reject(new Error("Brand:" + err));
        });
    });
    return promise;
  }

  static async update(brand) {
    const promise = new Promise((resolve, reject) => {
      const dataBrand = {
        id: brand.id,
        description: brand.description,
      }
      Tb.update(dataBrand, {
        where: { id: brand.id }
      })
        .then(() => {
          const dataIhp = {
            tb_institution_id: brand.tb_institution_id,
            tb_brand_id: brand.id,
            active: brand.active
          }
          ihBrand.update(dataIhp);
          resolve(brand);
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
      Tb.delete(Brand)
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
module.exports = BrandController;