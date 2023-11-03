const Base = require('./base.controller.js')
const db = require("../model/index.js");
const Tb = db.institutionHasEntity;

class InstitutionHasEntityController extends Base {
    static async sync(body) {
        const promise = new Promise(async (resolve, reject) => {
            try {

                var Iheexist = await this.getById(body.tb_institution_id, body.entity.id);
                if (Iheexist.tb_entity_id == 0) {
                    var dataReg = {
                        tb_institution_id: body.tb_institution_id,
                        tb_entity_id: body.entity.id
                    }
                    await this.insert(dataReg)
                        .then((data) => {
                            resolve(data);
                        })
                }else{
                    resolve({result:"Vinculo já existente"});
                }
            } catch (error) {
                reject("InstitutionHasEntityController.sync:" + error);
            }
        });
        return promise;
    }

    static async insert(ihEntity) {
        const promise = new Promise(async (resolve, reject) => {
            try {
                Tb.create(ihEntity)
                    .then((data) => {
                        resolve(data);
                    })
            } catch (error) {
                reject("InstitutionHasEntityController.insert:" + error);
            }
        });
        return promise;
    }

    static async getById(tb_institution_id, tb_entity_id) {
        const promise = new Promise((resolve, reject) => {
            try {
                Tb.sequelize.query(
                    'Select * ' +
                    'from tb_institution_has_entity ' +
                    'where ( tb_institution_id =?) ' +
                    ' and ( tb_entity_id =?)',
                    {
                        replacements: [tb_institution_id, tb_entity_id],
                        type: Tb.sequelize.QueryTypes.SELECT
                    }).then(data => {
                        if (data.length > 0)
                            resolve(data[0])
                        else
                            resolve({ tb_entity_id: 0 });
                    })
            } catch (error) {
                reject('InstitutionHasEntityController.getById: ' + error);
            }
        });
        return promise;
    };

}
module.exports = InstitutionHasEntityController;