const Base = require('./base.controller.js');
const ihMeasure = require('./institutionHasMeasure.controller.js');
const db = require("../model/index.js");
const Tb = db.measure;

class MeasureController extends Base {
  static async sync(measure) {    
    const promise = new Promise(async (resolve, reject) => {      
      this.insert(measure)
        .then((data) => {
              resolve(data);
        })
        .catch(err => {
          reject("MeasureController.sync:" + err);
        });
    });
    return promise;
  }

  static async getbyDescription(descripton) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select id ' +
        'from tb_measure ' +
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

  static async insert(measure) {

    const promise = new Promise(async (resolve, reject) => {
      const exist = await this.getbyDescription(measure.description);

      if (exist === '0') {
        //Se não encontrou grava a Forma de pagamento
        Tb.create(measure)
          .then((data) => {
            //com este retorno gravo a forma de pagamento no Institution
            const dataihMeasure = {
              tb_institution_id: measure.tb_institution_id,
              tb_measure_id: data.id,
              active: measure.active,
            };           
            ihMeasure.insert(dataihMeasure)
              .then((data) => {
                measure.id = data.id;
                resolve(measure);
              });
              
          })
          .catch(err => {
            reject("Erro:" + err);
          });
      } else {
        //Se a forma de pagamento já existe fazer outro tratamento
        //Finalizado 20/10/2022
        resolve(measure);
      }
    });
    return promise;
  }

  static getList(institutionId) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  pt.id, ihp.tb_institution_id, pt.description, ihp.active ' +
        'from tb_measure pt ' +
        '  inner join tb_institution_has_measure ihp ' +
        '  on (pt.id = ihp.tb_measure_id) ' +
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
        'from tb_measure pt ' +
        '  inner join tb_institution_has_measure ihp ' +
        '  on (pt.id = ihp.tb_measure_id) ' +
        'where (ihp.tb_institution_id =? ) ' +
        ' and (ihp.tb_measure_id =? )',
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

  static async update(measure) {
    const promise = new Promise((resolve, reject) => {
      const dataMeasure = {
        id: measure.id,
        description: measure.description,
      }
      Tb.update(dataMeasure, {
        where: { id: measure.id }
      })
        .then(() => {
          const dataIhp = {
            tb_institution_id: measure.tb_institution_id,
            tb_measure_id: measure.id,
            active: measure.active
          }
          ihMeasure.update(dataIhp);
          resolve(measure);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static async delete(measure) {
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
module.exports = MeasureController;