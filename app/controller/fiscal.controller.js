const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.entity;
const entityController = require('./entity.controller.js');
const companyController = require('./company.controller.js');
const personController = require('./person.controller.js');
const entityExternalCodeController = require('./entityExternalCode.controller.js');
const { entity } = require('../model/index.js');

class FiscalController extends Base {

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        //Verifica se o external code existe.
        var entityExist = await entityExternalCodeController.getByExternalCode(
          body.entity_external_code.tb_institution_id,
          body.entity_external_code.reference,
          body.entity_external_code.kind);
        if (entityExist.tb_entity_id == 0) {
          //Tenta incluir PJ          
          if (body.company.cnpj.length > 0) {
            await this.createCompany(body)
              .then(async (data) => {
                body = data;
                body.entity_external_code.tb_entity_id = body.objEntity.entity.id;
                await entityExternalCodeController.insert(body.entity_external_code)
                  .then(async (data) => {
                    body.entity_external_code = data;
                    await entityController.sync(body.objEntity);
                    resolve({
                      body: body,
                      id: 200,
                      Message: "SYNCHED"
                    });
                  })
              });
          } else {
            //caso não seja PJ vai gravar um registro de PF idenpendente do CPF correto
            await this.createPerson(body)
              .then(async (data) => {
                body = data;
                body.entity_external_code.tb_entity_id = body.objEntity.entity.id;
                await entityExternalCodeController.insert(body.entity_external_code)
                  .then(async (data) => {
                    body.entity_external_code = data;
                    await entityController.sync(body.objEntity)
                      .then(() => {
                        resolve({
                          body: body,
                          id: 200,
                          Message: "SYNCHED"
                        });
                      })
                  })
              });
          }

        } else {
          //Encontrou a entidade vinculada          
          body.objEntity.entity.id = entityExist.tb_entity_id;
          //Tenta atualizar PJ
          if (body.company.cnpj.length > 0) {
            body.company.id = body.objEntity.entity.id;
            await this.updateCompany(body)
              .then(async (data) => {
                body = data;
                await entityController.update(body.objEntity);
                resolve({
                  body: body,
                  id: 200,
                  Message: "SYNCHED"
                });
              });
          } else {
            
            //caso não seja PJ vai gravar um registro de PF idenpendente do CPF correto
            body.person.id = body.objEntity.entity.id;            
            await this.updatePerson(body)
              .then(async (data) => {
                body = data;
                await entityController.sync(body.objEntity);
                resolve({
                  body: body,
                  id: 200,
                  Message: "SYNCHED"
                });
              });
          }
        }
      } catch (error) {
        reject("FiscalController.sync:" + error);
      }
    });
    return promise;
  }

  static async createPerson(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        await personController.sync(body.person)
          .then(async (data) => {
            body.person = data.body;
            body.objEntity.entity.id = body.person.id;
            body.objEntity.socialmedia.id = body.person.id;
            resolve(body);
          })

      } catch (error) {
        reject('FiscalController.createPerson: ' + error);
      }
    });
    return promise;
  };

  static async updatePerson(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        await personController.update(body.person)
          .then(() => {
            resolve(body);
          })
      } catch (error) {
        reject('FiscalController.updatePerson: ' + error);
      }
    });
    return promise;
  };

  static async createCompany(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        await companyController.sync(body.company)
          .then(async (data) => {
            body.company = data.body;
            body.objEntity.entity.id = body.company.id;
            body.objEntity.socialmedia.id = body.company.id;
            resolve(body);
          })
      } catch (error) {
        reject('FiscalController.createCompany: ' + error);
      }
    });
    return promise;
  };

  static async updateCompany(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        await companyController.update(body.company)
          .then(() => {
            resolve(body);
          })
      } catch (error) {
        reject('FiscalController.updateCompany: ' + error);
      }
    });
    return promise;
  };

  static async getByDocNumber(docNumber) {
    const promise = new Promise((resolve, reject) => {
      try {
        if (docNumber == '00000000000') {
          //Consumidor final
          resolve({ id: 2, doc: '00000000000' });
        } else {
          Tb.sequelize.query(
            'Select id, cpf doc ' +
            'from tb_person prs ' +
            'where ( prs.cpf = ?) ' +
            'union ' +
            'Select id, cnpj doc ' +
            'from tb_company cpn ' +
            'where ( cpn.cnpj = ?) ',
            {
              replacements: [docNumber, docNumber],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {
              if (data.length > 0) {
                resolve(data[0]);
              }
              else {
                resolve({ id: 0 });
              }
            })
        }
      } catch (error) {
        reject('FiscalController.getByDocNumber: ' + error);
      }
    });
    return promise;
  };

  
}
module.exports = FiscalController; 