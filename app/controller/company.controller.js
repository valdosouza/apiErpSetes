const Base = require('../controller/base.controller.js')
const db = require("../model");
const Tb = db.company;
const entityController = require('./entity.controller.js');

class CompanyController extends Base {

  static async sync(company) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var regCompany = await this.getByCNPJ(company.cnpj);
        if (regCompany.id == 0) {
          var dataEntity = {
            id: 0,
            name_company: 'Gravando pessoa Jurídica',
            nick_trade: 'Gravando pessoa Juridica',
          }
          await entityController.insert(dataEntity)
            .then(async (data) => {
              company.id = data.id;
              await Tb.create(company)
                .then((data) => {
                  company.id = data.id;
                });
            });
        } else {
          company.id = regCompany.id;
          await Tb.update(company, {
            where: {
              cnpj: company.cnpj
            }
          });
        }
        resolve({
          body: company,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("CompanyController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_company ' +
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
          reject('Company.getById: ' + err);
        });
    });
    return promise;
  };

  static async insert(company) {
    const promise = new Promise((resolve, reject) => {


      Tb.create(company)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static getList(body) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_company ' +
        'where id is not null',
        {
          //replacements: [body.tb_institution_id ],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Entity:" + err));
        });
    });
    return promise;
  }

  static async update(company) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.update(company, {
          where: { id: company.id }
        }).then(()=>{
          resolve(company);
        })          
      } catch (error) {
        reject('Company.update:' + err);
      }      
    });
    return promise;
  }

  static async delete(company) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
        Tb.delete(company)
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

  static async getByCNPJ(cnpj) {

    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_company    ' +
        'where ( cnpj = ?) ',
        {
          replacements: [cnpj],
          type: Tb.sequelize.QueryTypes.SELECT
        })
        .then(data => {
          if (data.length > 0) {
            resolve(data[0]);
          } else {
            resolve({ id: 0 });
          }

        })
        .catch(err => {
          reject('Company.getByCNPJ:' + err);
        });
    });
    return promise;
  };

}

module.exports = CompanyController; 