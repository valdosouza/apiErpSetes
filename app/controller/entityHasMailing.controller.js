
const Base = require('./base.controller.js')
const db = require("../model");
const Tb = db.entityHasMailing;

class EntityHasMailingController extends Base {

    static async sync(entityHM) {
        const promise = new Promise((resolve, reject) => {
            try {
                this.insert(entityHM)
                    .then((data) => {
                        resolve(data);
                    })
            } catch (error) {
                reject("EntityHasMailingController.sync:" + err);
            }
        });
        return promise;
    }

    static async insert(entityHM) {
        const promise = new Promise((resolve, reject) => {
            Tb.create(entityHM)
                .then((data) => {
                    resolve(data);
                })
                .catch(err => {
                    reject("EntityHasMailingController.insert:" + err);
                });
        });
        return promise;
    }

    static async update(entityHM) {

        const promise = new Promise((resolve, reject) => {

            Tb.update(entityHM, {
                where: { tb_entity_id: tb_entity_id, tb_mailing_id: tb_mailing_id, tb_mailing_group_id: tb_mailing_group_id }
            })
                .then((data) => {
                    resolve(data);
                })
                .catch(err => {
                    reject("Erro:" + err);
                });
        });
        return promise;
    }

    static async delete(entityHM) {
        const promise = new Promise((resolve, reject) => {
            resolve("Em Desenvolvimento");
            /*
            Tb.delete(entityHM, {
                where: { tb_entity_id: tb_entity_id, tb_mailing_id:tb_mailing_id, tb_mailing_group_id:tb_mailing_group_id }
              })
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
module.exports = EntityHasMailingController;