const Base = require('./base.controller.js');
const ihLineBusiness = require('./institutionHasLineBusines.controller.js');
const db = require("../model");
const Tb = db.lineBusiness;

class LineBusinessController extends Base {

  static async getbyDescription(description) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select id ' +
          'from tb_linebusiness ' +
          'WHERE ( description =? ) ',
          {
            replacements: [description],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data.length > 0) {
              resolve(data[0]);
            } else {
              resolve({ id: 0 });
            }
          })

      } catch (error) {
        reject('LineBusinessController.getbyDescription: ' + error);
      }
    });
    return promise;
  }

  static async insert(lineBusiness) {

    const promise = new Promise(async (resolve, reject) => {
      const exist = await this.getbyDescription(lineBusiness.description);
      try {
        if (exist.id === 0) {
          //Se não encontrou grava o Cargo
          Tb.create(lineBusiness)
            .then((data) => {
              //com este retorno gravo a Cargo no Institution
              const dataihlineBusiness = {
                tb_institution_id: lineBusiness.tb_institution_id,
                tb_linebusiness_id: data.id,
                active: lineBusiness.active,
              };
              this.linkInstitution(dataihlineBusiness)
                .then((data) => {
                  lineBusiness.id = data.id;
                  resolve(lineBusiness);
                });
            })
        } else {
          const dataihlineBusiness = {
            tb_institution_id: lineBusiness.tb_institution_id,
            tb_linebusiness_id: exist.id,
            active: lineBusiness.active,
          };          
          lineBusiness.id = exist.id,
          this.linkInstitution(dataihlineBusiness)
            .then((data) => {
              
              resolve(lineBusiness);
            });
        }
      } catch (error) {
        reject("LineBusinessController.Insert:" + error);
      }
    });
    return promise;
  }

  static linkInstitution(data) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        ihLineBusiness.insert(data)
          .then((data) => {
            data.id = data.id;
            resolve(data);
          });
      } catch (error) {
        reject('LineBusinessController.linkInstitution: ' + error);
      }
    });
    return promise;

  }

  static getList(institutionId) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  lb.id, ihl.tb_institution_id, lb.description, ihl.active ' +
        'from tb_linebusiness lb ' +
        '  inner join tb_institution_has_linebusiness ihl ' +
        '  on (lb.id = ihl.tb_linebusiness_id) ' +
        'where (ihl.tb_institution_id =? ) ',
        {
          replacements: [institutionId],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("LineBusiness:" + err));
        });
    });
    return promise;
  }

  static get(institutionId, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  lb.id, ihl.tb_institution_id, lb.description, ihl.active ' +
        'from tb_linebusiness lb ' +
        '  inner join tb_institution_has_linebusiness ihl ' +
        '  on (lb.id = ihl.tb_linebusiness_id) ' +
        'where (ihl.tb_institution_id =? ) ' +
        ' and (ihl.tb_linebusiness_id =? )',
        {
          replacements: [institutionId, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject(new Error("LineBusiness:" + err));
        });
    });
    return promise;
  }

  static async update(lineBusiness) {
    const promise = new Promise((resolve, reject) => {
      Tb.update(lineBusiness, {
        where: { id: lineBusiness.id }
      })
        .then(data => {
          const dataihlineBusiness = {
            tb_institution_id: lineBusiness.tb_institution_id,
            tb_linebusiness_id: lineBusiness.id,
            active: lineBusiness.active,
          };
          ihLineBusiness.update(dataihlineBusiness)
            .then((_) => {
              lineBusiness.id = data.id;
              resolve(lineBusiness);
            });


          resolve(data);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static async delete(lineBusiness) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(lineBusiness)
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
module.exports = LineBusinessController;