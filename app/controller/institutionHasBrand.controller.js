const Base = require('./base.controller.js')
const db = require("../model/index.js");
const Tb = db.institutionHasBrand;

class InstitutionHasBrandController extends Base {
    static async insert(ihBrand) {
        const promise = new Promise((resolve, reject) => {
            Tb.create(ihBrand)
                .then((data) => {
                    resolve(data);
                })
                .catch(err => {
                    reject("Erro:" + err);
                });
        });
        return promise;
    }

    static async update(ihBrand) {
        const promise = new Promise((resolve, reject) => {
            Tb.update(ihBrand, {
                where: {
                    tb_institution_id: ihBrand.tb_institution_id,
                    tb_payment_types_id: ihBrand.tb_payment_types_id
                }
            })
                .catch(err => {
                    reject("Erro:" + err);
                });
        });
        return promise;
    }

    static async delete(ihBrand) {
        const promise = new Promise((resolve, reject) => {
            resolve("Em Desenvolvimento");
            /*    
            Tb.delete(ihBrand)
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
module.exports = InstitutionHasBrandController;