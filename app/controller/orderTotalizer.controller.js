const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.ordertotalizer;

class OrderTotalizerController extends Base {

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var regOrderTotalizer = await this.getById(body.id, body.tb_institution_id, body.terminal);
        if (regOrderTotalizer.id == 0) {
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
        reject("OrderTotalizerController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id, tb_institution_id, terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_order_totalizer ' +
          'where ( id =?) ' +
          ' and ( terminal= ?) ' +
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
        reject('OrderItemController.getById: ' + err);
      }
    });
    return promise;
  };

  static async insert(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var totalizer = body.totalizer;
        totalizer.tb_institution_id = body.order.tb_institution_id;
        totalizer.id = body.order.id;
        totalizer.terminal = body.order.terminal;

        Tb.create(totalizer)
          .then(() => {
            resolve(totalizer);
          });
      } catch (error) {
        reject("OrderTotalizerController.insert:" + error);
      }
    });
    return promise;
  }

  static async update(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var totalizer = body.totalizer;
        totalizer.tb_institution_id = body.order.tb_institution_id;
        totalizer.id = body.order.id;
        totalizer.terminal = body.order.terminal;

        Tb.update(totalizer, {
          where: {
            id: totalizer.id,
            tb_institution_id: totalizer.tb_institution_id,
            terminal: totalizer.terminal
          }
        })
          .then(data => {
            resolve(data);
          })
      } catch (error) {
        reject("OrderTotalizerController.insert:" + error);
      }
    });
    return promise;
  }

  static get(tb_institution_id, tb_salesman_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select ' +
        'ort.items_qtde, ' +
        'ort.product_qtde, ' +
        'ort.product_value, ' +
        'ort.ipi_value, ' +
        'ort.discount_aliquot, ' +
        'ort.discount_value, ' +
        'ort.expenses_value, ' +
        'ort.total_value ' +
        'From tb_order_totalizer ort ' +
        '  inner join tb_order ord ' +
        '  on (ord.id = ort.id) ' +
        '    and (ord.tb_institution_id = ort.tb_institution_id) ' +
        '    and (ord.terminal = ort.terminal) ' +
        'where (ord.tb_institution_id =? )' +
        ' and (ord.tb_user_id = ?) ' +
        ' and (ord.id = ?)',
        {
          replacements: [tb_institution_id, tb_salesman_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            resolve({
              items_qtde: Number(data[0].items_qtde),
              product_qtde: Number(data[0].product_qtde),
              product_value: Number(data[0].product_value),
              ipi_value: Number(data[0].ipi_value),
              discount_aliquot: Number(data[0].discount_aliquot),
              discount_value: Number(data[0].discount_value),
              expenses_value: Number(data[0].expenses_value),
              total_value: Number(data[0].total_value),
            });
          } else {
            resolve({
              items_qtde: 0.0,
              product_qtde: 0.0,
              product_value: 0.0,
              ipi_value: 0.0,
              discount_aliquot: 0.0,
              discount_value: 0.0,
              expenses_value: 0.0,
              total_value: 0.0,
            });

          }

        })
        .catch(err => {
          reject('orderTotalizer.get: ' + err);
        });
    });
    return promise;
  }
}
module.exports = OrderTotalizerController;