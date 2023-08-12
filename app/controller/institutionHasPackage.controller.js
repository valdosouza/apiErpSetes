const Base = require('./base.controller.js')
const db = require("../model/index.js");
const Tb = db.institutionHasPackage;

class InstitutionHasPackageController extends Base {
    static async insert(ihPackage) {
        const promise = new Promise((resolve, reject) => {
            Tb.create(ihPackage)
                .then((data) => {
                    resolve(data);
                })
                .catch(err => {
                    reject("Erro:" + err);
                });
        });
        return promise;
    }

    static async update(ihPackage) {
        const promise = new Promise((resolve, reject) => {
            Tb.update(ihPackage, {
                where: {
                    tb_institution_id: ihPackage.tb_institution_id,
                    tb_payment_types_id: ihPackage.tb_payment_types_id
                }
            })
                .catch(err => {
                    reject("Erro:" + err);
                });
        });
        return promise;
    }

    static async delete(ihPackage) {
        const promise = new Promise((resolve, reject) => {
            resolve("Em Desenvolvimento");
            /*    
            Tb.delete(ihPackage)
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
module.exports = InstitutionHasPackageController;