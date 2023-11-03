const Base = require('../controller/base.controller.js')
const db = require("../model");
const Tb = db.person;
const entityController = require('./entity.controller.js');

class PersonController extends Base {

  static async sync(person) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var regPerson = await this.getByCPF(person.cpf);
        if (regPerson.id == 0) {
          var dataEntity = {
            id: 0,
            name_company: 'Gravando pessoa fisica',
            nick_trade: 'Gravando pessoa fisica',
          }
          await entityController.insert(dataEntity)
            .then((data) => {
              person.id = data.id;
              Tb.create(person)
                .then((data) => {
                  person.id = data.id;
                });
            })
        } else {
          person.id = regPerson.id;
          await Tb.update(person, {
            where: {
              cpf: person.cpf
            }
          });
        }
        resolve({
          body: person,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("PersonController.sync:" + error);
      }
    });
    return promise;
  }


  static async getById(id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_person ' +
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
          reject('Person.getById: ' + err);
        });
    });
    return promise;
  };

  static async insert(person) {
    const promise = new Promise((resolve, reject) => {
      try {
        if (person.rg_dt_emission == '')
          delete person.rg_dt_emission;
        if (person.birthday == '')
          delete person.birthday;

        Tb.create(person)
          .then(data => {
            resolve(data);
          })
      } catch (error) {
        reject("PersonController.insert:" + error);
      }      
  });
    return promise;
  }

  static getList(body) {
  const promise = new Promise((resolve, reject) => {
    Tb.sequelize.query(
      'select  * ' +
      'from tb_person ' +
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

  static async update(person) {
  const promise = new Promise((resolve, reject) => {
    try {
      if (person.rg_dt_emission == '') delete person.rg_dt_emission;
      if (person.birthday == '') delete person.birthday;
      Tb.update(person, {
        where: { id: person.id }
      })
      .then(()=>{
        resolve(person);
      })
    } catch (error) {
      reject("PersonController.update:" + error);
    }
  });
  return promise;
}

  static async delete (person) {
  const promise = new Promise((resolve, reject) => {
    resolve("Em Desenvolvimento");
    /*
      Tb.delete(person)
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

  static getByCPF(cpf) {

  const promise = new Promise((resolve, reject) => {
    Tb.sequelize.query(
      'Select * ' +
      'from tb_person    ' +
      'where ( cpf = ?) ',
      {
        replacements: [cpf],
        type: Tb.sequelize.QueryTypes.SELECT
      }).then(data => {
        if (data.length > 0) {
          resolve(data[0]);
        } else {
          resolve({ id: 0 });
        }

      })
      .catch(err => {
        reject(new Error("Algum erro aconteceu ao buscar o CNPJ"));
      });
  });
  return promise;
};

}

module.exports = PersonController; 