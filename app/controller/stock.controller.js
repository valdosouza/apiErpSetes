const Base = require('./base.controller.js')
const db = require("../model/index.js");
const Tb = db.stock;
const pack = require("./package.controller.js");
const measure = require("./measure.controller.js");
//const color = require("./color.controller.js");

class StockController extends Base {

  static async sync(stock) {

    const promise = new Promise(async (resolve, reject) => {
      try {
        //Package
        var regPackage = await pack.getbyDescription(stock.name_package);

        stock.tb_package_id = regPackage.id;
        delete stock.name_package;
        //Measure
        var regMeasure = await measure.getbyDescription(stock.name_measure);
        stock.tb_measure_id = regMeasure.id;
        delete stock.name_measure;
        //Color
        //var regColor = await color.getbyDescription(stock.name_color);
        //stock.id = regColor.id;
        delete stock.name_color;
        //Sync
        var regProd = await this.getById(stock.tb_institution_id, stock.tb_merchandise_id);
        if (regProd.tb_merchandise_id == 0) {
          Tb.create(stock);
        }else{
          Tb.update(stock, {
            where: { tb_institution_id: stock.tb_institution_id, tb_merchandise_id: stock.tb_merchandise_id }
          })
        }
        resolve({
          code: stock.id,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("StockController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(tb_institution_id, tb_merchandise_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select * ' +
        'from tb_stock ' +
        'where ( tb_institution_id =? ) ' +
        ' and ( tb_merchandise_id=? )',
        {
          replacements: [tb_institution_id, tb_merchandise_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {          
          if (data.length > 0){
            resolve(data[0]);
          }else{
            resolve({tb_merchandise_id:0});
          }
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };


  static async insert(stock) {
    const promise = new Promise((resolve, reject) => {
      stock.id = idNext;
      Tb.create(stock)
        .then((data) => {
          stockbalance.autoInsertByStokcList(stock.tb_institution_id, data.id);
          resolve(data);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }


  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_stock ' +
        'where tb_institution_id=?',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("stock.gelist:" + err));
        });
    });
    return promise;
  }

  static get(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_stock ' +
        'where ( tb_institution_id =? ) ' +
        ' and ( id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject('stock.get: ' + err);
        });
    });
    return promise;
  }

  static async update(stock) {
    const promise = new Promise((resolve, reject) => {
      Tb.update(stock, {
        where: { tb_institution_id: stock.tb_institution_id, id: stock.id }
      })
        .then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static async delete(stock) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(stock)
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
module.exports = StockController;