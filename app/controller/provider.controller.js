const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.provider;
const fiscalController = require('./fiscal.controller.js');

class ProviderController extends Base {

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        await fiscalController.sync(body.fiscal)
          .then(async (data) => {
            if (body.fiscal.person)  body.fiscal.person = data.body.person;
            if (body.fiscal.company) body.fiscal.company = data.body.company;            
            
            var regProvider = await this.getById(body.fiscal.objEntity.tb_institution_id, body.fiscal.objEntity.entity.id);
            if (regProvider.id == 0) {
              body.provider.id = body.fiscal.objEntity.entity.id;
              
              await Tb.create(body.provider);
            } else {
              body.provider.id = body.fiscal.objEntity.entity.id;
              await Tb.update(body.provider, {
                where: {
                  tb_institution_id: body.provider.tb_institution_id,
                  id: body.provider.id
                }
              });
            }
            resolve({
              code: body.provider.id,
              id: 200,
              Message: "SYNCHED"
            });
          })
      } catch (error) {
        reject("Provider.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select ' +
        'id, ' +
        'tb_institution_id, ' +
        'active ' +
        'from tb_provider ' +
        'where ( tb_institution_id =?) ' +
        ' and  ( id =?)',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0)
            resolve(data[0])
          else
            resolve({id:0});
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };

}
module.exports = ProviderController; 