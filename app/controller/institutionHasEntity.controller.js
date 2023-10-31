const Base = require('./base.controller.js')
const db = require("../model/index.js");
const Tb = db.institutionHasEntity;

class InstitutionHasEntityController extends Base {

    static async sync(body) {        
        const promise = new Promise((resolve, reject) => {
            var dataReg = {
                tb_institution_id : body.tb_institution_id, 
                tb_entity_id : body.entity.id
            }
            this.insert(dataReg)
                .then((data) => {
                    resolve(data);
                })
                .catch(err => {
                    reject("InstitutionHasEntityController.sync:" + err);
                });
        });
        return promise;
    }

    static async insert(ihEntity) {
        const promise = new Promise((resolve, reject) => {
            Tb.create(ihEntity)
                .then((data) => {
                    resolve(data);
                })
                .catch(err => {
                    reject("InstitutionHasEntityController.insert:" + err);
                });
        });
        return promise;
    }
}
module.exports = InstitutionHasEntityController;