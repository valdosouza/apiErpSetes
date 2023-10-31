const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.person;
const entityController = require('./entity.controller.js');
const companyController = require('./company.controller.js');
const personController = require('./person.controller.js');
const { entity } = require('../model/index.js');

class FiscalController extends Base {

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var idEntity = 0;
        if (body.noDocNumber.id == 0) {
          var docNumber = "";
          var docKind = "";
          //Caso seja CPF
          if (body.person) {
            if (body.person.cpf != "") {
              docNumber = body.person.cpf;
              docKind = "F";
              await personController.sync(body.person)
                .then((data) => {
                  body.person = data.body;
                  idEntity = body.person.id;
                })
            }
          }
          //Caso seja CNPJ devido ao docNumber estar vazio
          if (docNumber == "") {
            if (body.company.cnpj != "") {
              docNumber = body.company.cnpj;
              docKind = "J";
              await companyController.sync(body.company)
                .then((data) => {
                  body.company = data.body;
                  idEntity = body.company.id;

                })
            }
          }
          body.objEntity.entity.id = idEntity;
          body.objEntity.socialmedia.id = idEntity;
        } else {
          //trata no sem Doc
        }
        //Sincroniza a Entidade        
        await entityController.sync(body.objEntity)
          .then(() => {
            resolve({
              body: body,
              id: 200,
              Message: "SYNCHED"
            });
          })
      } catch (error) {
        reject("FiscalController.sync:" + error);
      }
    });
    return promise;
  }


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