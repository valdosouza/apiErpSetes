const Base = require('./base.controller.js')
const db = require("../model/index.js");
const Tb = db.entityExternalCode;
const entityController = require('./entity.controller.js');

class EntityExternalCodeController extends Base {

  static async sync(entityExternalCode) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        entityExternalCode.id = await this.getByExternalCode(entityExternalCode.tb_institution_id, entityExternalCode.reference, entityExternalCode.kind);
        if (entityExternalCode.id == 0) {
          var dataEntity = {
            id: 0,
            name_company: 'Gravando entity external code',
            nick_trade: 'Gravando entity external code',
          }
          await entityController.insert(dataEntity)
            .then(async (data) => {
              entityExternalCode.id = data.id;
              await Tb.create(entityExternalCode)
                .then((data) => {
                  entityExternalCode.id = data.id;
                });
            });
        }
        resolve({
          body: entityExternalCode,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("EntityExternalCodeController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_entity_external_code ' +
        'where ( id =?) ',
        {
          replacements: [id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0)
            resolve(data[0])
          else
            resolve(data);
        })
        .catch(err => {
          reject('EntityExternalCodeController.getById: ' + err);
        });
    });
    return promise;
  };

  static async insert(entityExternalCode) {
    const promise = new Promise((resolve, reject) => {
      Tb.create(entityExternalCode)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("EntityExternalCodeController.insert:" + err);
        });
    });
    return promise;
  }


  static async getByExternalCode(tb_institution_id, reference, kind) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_entity_external_code  ' +
          'where ( tb_institution_id = ?) ' +
          ' and (reference =?)' +
          ' and (kind =?)',
          {
            replacements: [tb_institution_id, reference, kind],
            type: Tb.sequelize.QueryTypes.SELECT
          })
          .then(data => {
            if (data.length > 0) {
              resolve(data[0]);
            } else {
              resolve({ tb_entity_id: 0 });
            }
          })
      } catch (error) {
        reject('EntityExternalCodeController.getByExternalCode:' + err);
      }
    });
    return promise;
  };

  static async getFirstExternalCode(tb_institution_id, kind) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_entity_external_code  ' +
          'where ( tb_institution_id = ?) ' +
          ' and (kind =?)',
          {
            replacements: [tb_institution_id, kind],
            type: Tb.sequelize.QueryTypes.SELECT
          })
          .then(data => {
            if (data.length > 0) {
              resolve(data[0]);
            } else {
              resolve({ tb_entity_id: 0 });
            }
          })
      } catch (error) {
        reject('EntityExternalCodeController.getFirstExternalCode:' + error);
      }
    });
    return promise;
  };

}

module.exports = EntityExternalCodeController; 