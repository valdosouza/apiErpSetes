const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.order;

class OrderController extends Base {

  static async getNextId(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select max(id) lastId ' +
          'from tb_order ' +
          'WHERE ( tb_institution_id =? ) ',
          {
            replacements: [tb_institution_id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data) {
              var NextId = 1;
              if (data.length > 0) {
                NextId = data[0].lastId + 1;
              }
              resolve(NextId);
            } else {
              resolve(1);
            }
          })
      } catch (error) {
        reject('order.getNexId: ' + err);
      }
    });
    return promise;
  }

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var regOrder = await this.getById(body.id, body.tb_institution_id, body.terminal);
        if (regOrder.id == 0) {
          Tb.create(body);
        } else {
          Tb.update(body, {
            where: {
              tb_institution_id: body.tb_institution_id,
              id: body.id,
              terminal: body.terminal,
            }
          });


        }
        resolve({
          code: body.id,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("OrderController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id, tb_institution_id, terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_order ' +
          'where ( id =?) ' +
          ' and (terminal =?) ' +
          ' and (tb_institution_id =?) ',
          {
            replacements: [id, terminal, tb_institution_id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data.length > 0)
              resolve(data[0])
            else
              resolve({ id: 0 });
          })
      } catch (error) {
        reject('OrderController.getById: ' + err);
      }
    });
    return promise;
  };



  static async insert(order) {
    const promise = new Promise(async (resolve, reject) => {
      const nextId = await this.getNextId(order.tb_institution_id);
      order.id = nextId;
      try {
        Tb.create(order)
          .then((data) => {
            resolve(data);
          })
      } catch (error) {
        reject("order.insert:" + error);
      }
    });
    return promise;
  }

  static async update(order) {
    const promise = new Promise((resolve, reject) => {
      try {
        if (order.validity == '') delete order.validity;
        Tb.update(order, {
          where: {
            id: order.id,
            tb_institution_id: order.tb_institution_id,
            terminal: order.terminal
          }
        })
          .then(data => {
            resolve(data);
          })
      } catch (error) {
        reject("order.update:" + error);
      }
    });
    return promise;
  }

  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_order ' +
        'where (tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("order.getlist: " + err);
        });
    });
    return promise;
  }

  static get(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  ord.id, ' +
        '  ord.tb_institution_id, ' +
        '  ord.tb_user_id, ' +
        '  ord.tb_user_id,' +
        '  pusr.cpf doc_user, ' +
        '  ord.dt_record, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note, ' +
        '  ord.origin, ' +
        '  ord.status, ' +
        '  ord.being_used ' +
        'from tb_order ord  ' +
        '   inner join tb_person pusr ' +
        '   on (pusr.id = ord.tb_user_id)  ' +
        'where (ord.tb_institution_id =? ) ' +
        ' and (ord.id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            resolve(data[0]);
          } else {
            resolve("{}");
          } s
        })
        .catch(err => {
          reject('order.get: ' + err);
        });
    });
    return promise;
  }

  static async updateStatus(tb_institution_id, id, status) {
    const promise = new Promise(async (resolve, reject) => {
      Tb.update({ status: status }, {
        where: {
          id: id,
          tb_institution_id: tb_institution_id,
          terminal: 0
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("order.updateStatus:" + err);
        });
    });
    return promise;
  }

  static async updateNote(tb_institution_id, id, note) {
    const promise = new Promise(async (resolve, reject) => {
      Tb.update({ note: note }, {
        where: {
          id: id,
          tb_institution_id: tb_institution_id,
          terminal: 0
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("order.updateNote:" + err);
        });
    });
    return promise;
  }

  static async delete(tb_institution_id,id) {
    const promise = new Promise((resolve, reject) => {
      try {
        const dataSale = {
          id: id,
          tb_institution_id: tb_institution_id,
          terminal: 0,
          status: 'D',
        }
        console.log(dataSale);
        Tb.update(dataSale, {
          where: {
            id: dataSale.id,
            tb_institution_id: dataSale.tb_institution_id,
            terminal: dataSale.terminal
          }
        })
          .then(() => {
            resolve(true);
          })
      } catch (error) {
        reject("orderSale.deleteOrderSale:" + error);
      }
    });
    return promise;
  }

}
module.exports = OrderController;