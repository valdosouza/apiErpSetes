const Base = require('../controller/base.controller.js')
const db = require("../model");
const Tb = db.entity;
const addressController = require('./address.controller.js');
const phoneController = require('./phone.controller.js');
const mailingController = require('./mailing.controller.js');
const institutionHasEntity = require('./institutionHasEntity.controller.js');

class EntityController extends Base {

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        
        await Tb.update(body.entity, {
          where: {
            id: body.entity.id
          }
        });
        await addressController.sync(body);
        await phoneController.sync(body);
        await mailingController.sync(body);
        await institutionHasEntity.sync(body)
        resolve({
          body: body,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("EntityController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select ' +
        'e.id,  ' +
        'e.name_company,  ' +
        'e.nick_trade,  ' +
        'e.aniversary,  ' +
        'e.tb_linebusiness_id,  ' +
        'l.description name_linebusiness, ' +
        'CAST(e.note AS CHAR(1000) CHARACTER SET utf8) note, ' +
        'e.created_at,  ' +
        'e.updated_at  ' +
        'from tb_entity  e ' +
        '   left outer join tb_linebusiness l ' +
        '   on (l.id = e.tb_linebusiness_id) ' +
        'where ( e.id =?) ',
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
          reject('Entity.getById: ' + err);
        });
    });
    return promise;
  };

  static async getIdNext() {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(id) maxID ' +
        'from tb_entity ',
        {
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0].maxID + 1);
        })
        .catch(() => {
          reject(0);
        });
    });
    return promise;
  }

  static async insert(entity) {
    const promise = new Promise(async (resolve, reject) => {
      delete entity.name_linebusiness;
      if (entity.aniversary == '')
        delete entity.aniversary;
      entity.id = await this.getIdNext();
      Tb.create(entity)
        .then((data) => {
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
      var nick_trade = "";
      var sqltxt =
        'select  e.* ' +
        'from tb_entity e ' +
        '   inner join tb_institution_has_entity ihe ' +
        '   on (ihe.tb_entity_id = e.id) ' +
        'where (ihe.tb_institution_id = ?) ';

      if (body.name_entity != "") {
        nick_trade = '%' + body.name_entity + '%';
        sqltxt += ' and (e.nick_trade like ? ) ';
      } else {
        nick_trade = "";
        sqltxt += ' and (e.nick_trade <> ?) ';
      }
      sqltxt +=
        ' order by nick_trade ' +
        ' limit ' + ((body.page - 1) * 20) + ',20 ';

      try {
        Tb.sequelize.query(
          sqltxt,
          {
            replacements: [body.tb_institution_id, nick_trade],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data);
          })
      } catch (error) {
        reject('entity.controller.getList: $error');
      }
    });
    return promise;
  }

  static async update(entity) {
    const promise = new Promise((resolve, reject) => {
      delete entity.name_linebusiness;
      if (entity.aniversary == '') delete entity.aniversary;
      Tb.update(entity, {
        where: { id: entity.id }
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static async delete(entity) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(entity)
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
module.exports = EntityController;