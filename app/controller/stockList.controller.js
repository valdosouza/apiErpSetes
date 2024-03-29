const Base = require('./base.controller.js')
const db = require("../model");
const Tb = db.stockList;
const stockbalance = require("./stockBalance.controller.js");

class StockListController extends Base {

  static async getIdNext(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(id) maxID ' +
        'from tb_stock_list ' +
        'where tb_institution_id=?',
        {
          replacements: [tb_institution_id],
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

  static async sync(stocklist) {
    const promise = new Promise(async (resolve, reject) => {      
      Tb.create(stocklist)
        .then(async (data) => {
          await stockbalance.autoInsertByStokcList(stocklist.tb_institution_id, stocklist.id);
          resolve(data);
        })
        .catch(err => {
          reject("StockListController.sync:" + err);
        });
    });
    return promise;
  }

  static async insert(stocklist) {
    const idNext = await this.getIdNext(stocklist.tb_institution_id);
    const promise = new Promise((resolve, reject) => {
      stocklist.id = idNext;
      Tb.create(stocklist)
        .then(async (data) => {
          await stockbalance.autoInsertByStokcList(stocklist.tb_institution_id, data.id);
          resolve(data);
        })
        .catch(err => {
          reject("StockListController.insert:" + err);
        });
    });
    return promise;
  }


  static getList(body) {
    const promise = new Promise((resolve, reject) => {
      var description = "";
      var sqltxt =
      'select  * ' +
      'from tb_stock_list ' +
      'where tb_institution_id=?';

      if (body.description != "") {
        description = '%' + body.description + '%';
        sqltxt += ' and (description like ? ) ';
      } else {
        description = "";
        sqltxt += ' and (description <> ?) ';
      }
      sqltxt +=
        ' order by description ' +
        ' limit ' + ((body.page - 1) * 20) + ',20 ';
      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [body.tb_institution_id,description],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("stocklist.gelist:" + err));
        });
    });
    return promise;
  }

  static get(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_stock_list ' +
        'where ( tb_institution_id =? ) ' +
        ' and ( id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject('stocklist.get: ' + err);
        });
    });
    return promise;
  }

  static async update(stocklist) {
    const promise = new Promise((resolve, reject) => {
      Tb.update(stocklist, {
        where: { tb_institution_id: stocklist.tb_institution_id, id: stocklist.id }
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

  static async delete(stocklist) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(stocklist)
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
module.exports = StockListController;