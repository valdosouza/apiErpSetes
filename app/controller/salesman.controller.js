const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.salesman;
const collaboratorController = require('./collaborator.controller.js');

class SalesmanController extends Base {

  static async sync(body) {

    const promise = new Promise(async (resolve, reject) => {
      try {
        await collaboratorController.sync(body.objCollaborator)
          .then(async (data) => {
            body.objCollaborator = data.body;
            var regSalesman = await this.getById(body.objCollaborator.collaborator.tb_institution_id, body.objCollaborator.collaborator.id);
            if (regSalesman.id == 0) {
              body.salesman.id = body.objCollaborator.collaborator.id;
              await Tb.create(body.salesman);
            } else {
              body.salesman.id = body.objCollaborator.collaborator.id;
              await Tb.update(body.salesman, {
                where: {
                  tb_institution_id: body.salesman.tb_institution_id,
                  id: body.salesman.id
                }
              });
            }            
            resolve({
              code: body.salesman.id,
              id: 200,
              Message: "SYNCHED"
            });
          })
      } catch (error) {
        reject("Salesman.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_salesman  ' +
        'where ( tb_institution_id =?) ' +
        ' and  ( id =?)',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0)
            resolve(data[0])
          else
            resolve({ id: 0 });
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };

  

  static async save(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {

       
      } catch (err) {
        reject('Salesman.save: ' + err);
      }
    });
    return promise;
  }

  static async insert(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        
        
      } catch (err) {
        reject('Salesman.Insert: ' + err);
      }
    });
    return promise;
  }

  static async insertComplete(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        
      } catch (error) {
        
      }

    });
    return promise;
  }

  static async update(body) {
    const promise = new Promise((resolve, reject) => {
      try {
        resolve(body);
      } catch (err) {
        reject('Salesman.update: ' + err);
      }
    });
    return promise;
  }

  static get = (tb_institution_id, id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};
        const dataSalesman = await this.getById(tb_institution_id, id);
        result.salesman = dataSalesman;

        const dataEntity = await entity.getById(id);
        result.entity = dataEntity;

        const dataPerson = await person.getById(id);
        if (dataPerson.id) {
          result.person = dataPerson;
        }
        const dataCompany = await company.getById(id);
        if (dataCompany.id) {
          result.company = dataCompany;
        }
        const dataAddress = await address.getById(id);
        result.address = dataAddress;

        const dataPhone = await phone.getById(id, '');
        result.phone = dataPhone;

        resolve(result);
      }
      catch (err) {
        reject('Salesman.get: ' + err);
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
        'pe.cpf doc_number ' +
        'from tb_salesman ct  ' +
        '  inner join tb_entity et  ' +
        '  on (ct.id = et.id)  ' +
        '  inner join tb_person pe ' +
        '  on (pe.id = et.id) ' +
        'where ct.tb_institution_id =? ' +
        'union ' +
        'Select  ' +
        'et.id,  ' +
        'et.name_company,  ' +
        'et.nick_trade, ' +
        ' "J" doc_kind, ' +
        'co.cnpj doc_number ' +
        'from tb_salesman ct  ' +
        '  inner join tb_entity et  ' +
        '  on (ct.id = et.id)  ' +
        '  inner join tb_company co ' +
        '  on (co.id = et.id) ' +
        'where ct.tb_institution_id =? ',
        {
          replacements: [tb_institution_id, tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('Salesman.getlist: ' + err);
        });
    });
    return promise;
  }

  
 

}
module.exports = SalesmanController; 