const Base = require('../controller/base.controller.js')
const db = require("../model");
const Tb = db.mailing;
const entityHasMailing = require('./entityHasMailing.controller.js');

class MailingController extends Base {

  static async getNextId() {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select max(id) lastId ' +
          'from tb_mailing ',
          {
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data) {
              const NextId = data[0].lastId + 1;
              resolve(NextId);
            } else {
              resolve(1);
            }
          })
      } catch (error) {
        reject('MailingController.getNexId: ' + err);
      }
    });
    return promise;
  }

  static sync = (body) => {
    const promise = new Promise((resolve, reject) => {
      try {
        var mailingReg = {
          id: 0,
          email: body.mailing.email,
        }
        this.insert(mailingReg)
          .then(async data => {
            console.log(data);
            var etdHasMailingReg = {
              tb_entity_id: body.entity.id,
              tb_mailing_id: data.id,
              tb_mailing_group_id: 2,
            }
            await entityHasMailing.sync(etdHasMailingReg);
            resolve(data);
          })
      } catch (error) {
        reject("MailingController.sync:" + error);
      }
    });
    return promise;
  }

  static insert = (mailing) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var emailExist = await this.getByEmail(mailing.email);
        if (emailExist.id == 0) {
          mailing.id = await this.getNextId();
          Tb.create(mailing)
            .then(data => {
              resolve(data);
            })
        } else {
          mailing.id = emailExist.id;
          this.update(mailing)
            .then(data => {
              resolve(data);
            })
        }
      } catch (error) {
        reject("MailingController.insert:" + error);
      }
    });
    return promise;
  }

  static update = (mailing) => {
    const promise = new Promise((resolve, reject) => {

      Tb.update(mailing, {
        where: { id: mailing.id }
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao atualizar o Email."));

        });
    });
    return promise;
  }

  static delete = (id) => {
    const promise = new Promise((resolve, reject) => {

      Tb.delete({
        where: { id: id }
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao Deletar o Email."));

        });
    });
    return promise;
  }


  // Retrieve all from the database.
  static findAll = () => {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_mailing  ',
        {
          type: Tb.sequelize.QueryTypes.SELECT
        }
      ).then(data => {
        resolve(data);
      })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar Email"));
        });
    });
    return promise;
  }

  static findByEntityId = (entityId) => {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_mailing m ' +
        '  inner join tb_entity_has_mailing ehm ' +
        '  on (ehm.tb_mailing_id = m.id ) ' +
        'where (ehm.tb_entity_id =?)',
        {
          replacements: [entityId],
          type: Tb.sequelize.QueryTypes.SELECT
        }
      ).then(data => {
        resolve(data);
      })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar Email"));
        });
    });
    return promise;
  }

  // Find a single mailing with an id
  static getByEmail = (email) => {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_mailing m ' +
          'where (m.email=?)',
          {
            replacements: [email],
            type: Tb.sequelize.QueryTypes.SELECT
          }
        ).then(data => {
          if (data.length > 0) {
            resolve(data[0]);
          } else {
            resolve({ id: 0 });
          }
        })
      } catch (error) {
        reject(new Error("MailingController.getByEmail:" + error));
      }
    });
    return promise;
  }

  static getlist() {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select u.id  ' +
        'from tb_mailing m ',
        {
          //replacements: [tb_institution_id],//*depois fazer certo
          type: Tb.sequelize.QueryTypes.SELECT
        }
      ).then(data => {
        resolve(data);
      })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar Email"));
        });
    });
    return promise;
  }


}


module.exports = MailingController;


