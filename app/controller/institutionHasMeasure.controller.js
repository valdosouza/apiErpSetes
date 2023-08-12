const Base = require('./base.controller.js')
const db = require("../model/index.js");
const Tb = db.institutionHasMeasure;

class InstitutionHasMeasureController extends Base {
    static async insert(ihMeasure) {
        const promise = new Promise((resolve, reject) => {
            Tb.create(ihMeasure)
                .then((data) => {
                    resolve(data);
                })
                .catch(err => {
                    reject("Erro:" + err);
                });
        });
        return promise;
    }

    static async update(ihMeasure) {
        const promise = new Promise((resolve, reject) => {
            Tb.update(ihMeasure, {
                where: {
                    tb_institution_id: ihMeasure.tb_institution_id,
                    tb_payment_types_id: ihMeasure.tb_payment_types_id
                }
            })
                .catch(err => {
                    reject("Erro:" + err);
                });
        });
        return promise;
    }

    static async delete(ihMeasure) {
        const promise = new Promise((resolve, reject) => {
            resolve("Em Desenvolvimento");
            /*    
            Tb.delete(ihMeasure)
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
module.exports = InstitutionHasMeasureController;