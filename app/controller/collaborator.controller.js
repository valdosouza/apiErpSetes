const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.collaborator;
const fiscalController = require('./fiscal.controller.js');
const entityController = require('./entity.controller.js');
const companyController = require('./company.controller.js');
const personController = require('./person.controller.js');
const addressController = require('./address.controller.js');
const phoneController = require('./phone.controller.js');
const userController = require('./user.controller.js');

class CollaboratorController extends Base {

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {

        await fiscalController.sync(body.fiscal)
          .then(async (data) => {

            body.fiscal.person = data.body.person;
            body.fiscal.company = data.body.company;

            var regCollaborator = await this.getById(body.fiscal.objEntity.tb_institution_id, body.fiscal.objEntity.entity.id);
            if (regCollaborator.id == 0) {
              body.collaborator.id = body.fiscal.objEntity.entity.id;
              await Tb.create(body.collaborator);
            } else {
              body.collaborator.id = body.fiscal.objEntity.entity.id;
              await Tb.update(body.collaborator, {
                where: {
                  tb_institution_id: body.collaborator.tb_institution_id,
                  id: body.collaborator.id
                }
              });
            }
            resolve({
              body: body,
              id: 200,
              Message: "SYNCHED"
            });
          })
      } catch (error) {
        reject("Collaborator.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_collaborator ' +
        'where (tb_institution_id =?) ' +
        ' and ( id =?) ',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            resolve(data[0]);
          } else {
            resolve({ id: 0 });
          }
        })
        .catch(err => {
          reject('Collaborator.getById: ' + err);
        });
    });
    return promise;
  };

  static async save(collaborator) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (collaborator.collaborator.dt_admission == '')
          delete collaborator.collaborator.dt_admission;
        if (collaborator.collaborator.dt_resignation == '')
          delete collaborator.collaborator.dt_resignation;


        var resultCollaborator = [];
        if (collaborator.collaborator.id > 0)
          resultCollaborator = await this.getById(collaborator.collaborator.tb_institution_id, collaborator.collaborator.id);
        if (resultCollaborator.length == 0) {
          this.insert(collaborator)
            .then((data) => {
              resolve(data);
            })
        } else {
          this.update(collaborator)
            .then((data) => {
              resolve(data);
            })
        }
      } catch (err) {
        reject('Collaborator.save: ' + err);
      }
    });
    return promise;
  }

  static async insert(collaborator) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var resultDoc = [];
        if (collaborator.person.cpf != "") {
          resultDoc = await person.getByCPF(collaborator.person.cpf);
        } else {
          resultDoc = await company.getByCNPJ(collaborator.company.cnpj);
        }

        if (resultDoc.length == 0) {
          this.insertComplete(collaborator)
            .then((data) => {
              resolve(data);
            })
        } else {

          collaborator.collaborator.id = resultDoc[0].id;
          this.insertParcial(collaborator)
            .then((data) => {
              resolve(data);
            })
        }
      } catch (err) {
        reject('Collaborator Insert: ' + err);
      }
    });
    return promise;
  }

  static async insertComplete(collaborator) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        entity.insert(collaborator.entity)
          .then(data => {
            const entityId = data.id;
            collaborator.entity.id = entityId;
            //Salva a pessoa Juridica                        
            if (collaborator.company.cnpj != "") {
              collaborator.company.id = entityId;
              company.insert(collaborator.company)
                .catch(err => {
                  reject("company.insert:" + err);
                });
            } else {
              collaborator.person.id = entityId;
              person.insert(collaborator.person)
                .catch(err => {
                  reject("person.insert:" + err);
                });
            }

            //Salva o endereço  
            collaborator.address.id = entityId;
            address.insert(collaborator.address)
              .catch(err => {
                reject("address.insert" + err);
              });

            //Salva o Phone
            collaborator.phone.id = entityId;
            phone.insert(collaborator.phone)
              .catch(err => {
                reject("phone.insert:" + err);
              });

            //Grava o collaborator
            collaborator.collaborator.id = entityId;
            Tb.create(collaborator.collaborator)
              .catch(err => {
                reject("Tb.create.collaborator:" + err);
              });
            //Grava Usuario
            var userModel = {
              tb_institution_id: collaborator.collaborator.tb_institution_id,
              id: collaborator.entity.id,
              nick: collaborator.entity.nick_trade,
              email: collaborator.user.email,
              password: md5('12345'),
              kind: "Sistema",
              tb_device_id: 0,
              active: "S"
            }
            user.createAuto(userModel);

            //REtornogeral              
            resolve(collaborator);
          })
          .catch(err => {
            reject('Collaborator InsertComplete: ' + err);
          });
      } catch (err) {
        reject('Collaborator InsertComplete: ' + err);
      }
    });
    return promise;
  }

  static async insertParcial(collaborator) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        //Insere o collaborator        
        const existCollaborator = await this.getById(collaborator.collaborator.tb_institution_id, collaborator.collaborator.id);

        if (existCollaborator.length == 0) {

          Tb.create(collaborator.collaborator);
        } else {
          Tb.update(collaborator.collaborator, {
            where: { id: collaborator.collaborator.id }
          });
        }
        //Atualiza Entidade    
        collaborator.entity.id = collaborator.collaborator.id;
        entity.update(collaborator.entity)
        //Atualiza  Person ou Company
        if (collaborator.person) {
          collaborator.person.id = collaborator.collaborator.id;
          person.update(collaborator.person);
        } else {
          collaborator.company.id = collaborator.collaborator.id;
          //company.update(collaborator.company);
        }
        //Atualiza o endereço  
        collaborator.address.id = collaborator.collaborator.id;
        address.save(collaborator.address);
        //Salva o Phone
        collaborator.phone.id = collaborator.collaborator.id;
        phone.save(collaborator.phone);
        //Grava Usuario
        var userModel = {
          tb_institution_id: collaborator.collaborator.tb_institution_id,
          id: collaborator.entity.id,
          nick: collaborator.entity.nick_trade,
          email: collaborator.user.email,
          password: md5('12345'),
          kind: "Sistema",
          tb_device_id: 0,
          active: "S"
        }
        user.createAuto(userModel);
        //REtornogeral              
        resolve(collaborator);
      } catch (err) {
        reject('Collaborator InsertParcial: ' + err);
      }
    });
    return promise;
  }

  static async update(collaborator) {
    const promise = new Promise((resolve, reject) => {
      try {
        entity.update(collaborator.entity);

        if (collaborator.person) {
          person.update(collaborator.person);
        } else {
          company.update(collaborator.company);
        }
        address.save(collaborator.address);
        phone.save(collaborator.phone);

        Tb.update(collaborator.collaborator, {
          where: { id: collaborator.collaborator.id }
        });
        resolve(collaborator);
      } catch (err) {
        reject('Collaborator.update: ' + err);
      }
    });
    return promise;
  }

  static get = (tb_institution_id, id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        
        var result = {};
        const dataCollaborator = await this.getById(tb_institution_id, id);
        result.collaborator = dataCollaborator;
        
        const dataEntity = await entityController.getById(id);
        result.entity = dataEntity;
        
        const dataPerson = await personController.getById(id);
        if (dataPerson.id > 0) {
          result.person = dataPerson;
        }
        const dataCompany = await companyController.getById(id);
        if (dataCompany.id > 0) {
          result.company = dataCompany;
        }
        const dataAddress = await addressController.getById(id);
        result.address = dataAddress;

        const dataPhone = await phoneController.getByKey(id, 'Comercial');
        result.phone = dataPhone;

        const userEmail = await userController.getEmailByEntity(id);
        result.user = { email: userEmail };
        
        resolve(result);
      }
      catch (err) {
        reject('collaborator.get: ' + err);
      }
    });
    return promise;
  }

  static getList = (tb_institution_id) => {

    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select ' +
        'et.id,  ' +
        'et.name_company,  ' +
        'et.nick_trade, ' +
        ' "F" doc_kind, ' +
        'pe.cpf doc_number, ' +
        ' et.tb_linebusiness_id, ' +
        ' ln.description name_linebusiness ' +
        'from tb_collaborator cl  ' +
        '  inner join tb_entity et  ' +
        '  on (cl.id = et.id)  ' +
        '  inner join tb_person pe ' +
        '  on (pe.id = et.id) ' +
        '  left outer join tb_linebusiness ln ' +
        '  on (ln.id = et.tb_linebusiness_id) ' +
        'where cl.tb_institution_id =? ' +
        'union ' +
        'Select  ' +
        'et.id,  ' +
        'et.name_company,  ' +
        'et.nick_trade, ' +
        ' "J" doc_kind, ' +
        'co.cnpj doc_number, ' +
        ' et.tb_linebusiness_id, ' +
        ' ln.description name_linebusiness ' +
        'from tb_collaborator cl  ' +
        '  inner join tb_entity et  ' +
        '  on (cl.id = et.id)  ' +
        '  inner join tb_company co ' +
        '  on (co.id = et.id) ' +
        '  left outer join tb_linebusiness ln ' +
        '  on (ln.id = et.tb_linebusiness_id) ' +
        'where cl.tb_institution_id =? ',
        {
          replacements: [tb_institution_id, tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('Colaborador: ' + err);
        });
    });
    return promise;
  }

}

module.exports = CollaboratorController; 
