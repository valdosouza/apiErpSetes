const Base = require('../controller/base.controller.js')
const db = require("../model");
const Tb = db.phone;

class PhoneController extends Base {
  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var regAddress = {};
        for (var item of body.phoneList) {
          item.id = body.entity.id;
          regAddress = await this.getByKey(item.id, item.kind);
          if (regAddress.id == 0) {
            await Tb.create(item);
          } else {
            await Tb.update(item, {
              where: {
                id: item.id,
                kind: item.kind
              }
            });
          }
        }
        resolve({
          body: body,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("PhoneController.sync:" + error);
      }
    });
    return promise;
  }

  static async getByKey(id, kind) {
    const promise = new Promise((resolve, reject) => {
      try {
        var sqltxt =
          'Select * ' +
          'from tb_phone ' +
          'where ( id =?) ' +
          ' and  ( kind =?)';
        Tb.sequelize.query(
          sqltxt,
          {
            replacements: [id, kind],
            type: Tb.sequelize.QueryTypes.SELECT
          })
          .then(data => {
            if (data.length > 0)
              resolve(data[0])
            else
              resolve({ id: 0 });
          })
      } catch (err) {
        reject('Phone.getById: ' + err);
      }
    });
    return promise;
  }

  static async getList(id) {
    const promise = new Promise((resolve, reject) => {
      try {
        var sqltxt =
          'Select * ' +
          'from tb_phone ' +
          'where ( id =?) ';
        Tb.sequelize.query(
          sqltxt,
          {
            replacements: [id],
            type: Tb.sequelize.QueryTypes.SELECT
          })
          .then(data => {
            resolve(data);
          })
      } catch (err) {
        reject('Phone.getList: ' + err);
      }
    });
    return promise;
  }

  static async save(phone) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var resultPhone = await this.getByKey(phone.id, phone.kind);
        if (resultPhone.id == 0) {
          this.insert(phone);
        } else {
          this.update(phone);
        }
        resolve(phone);
      } catch (err) {
        reject('Phone.save: ' + err);
      }
    });
    return promise;
  }

  static async insert(phone) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.create(phone)
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject("Phone.insert:" + err);
          });
      } catch (err) {
        reject('Phone.insert: ' + err);
      }
    });
    return promise;
  }

  static async update(phone) {
    const promise = new Promise((resolve, reject) => {
      Tb.update(phone, {
        where: { id: phone.id, kind: phone.kind }
      })
        .catch(err => {
          reject("Phone.update:" + err);
        });
    });
    return promise;
  }
}
module.exports = PhoneController;