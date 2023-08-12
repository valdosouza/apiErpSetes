const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.orderitemicms;

class OrderItemIcmsController extends Base {

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (body !== null) {
          for (var item of body) {

            if (item != null) {
              var regItem = await this.getById(item.tb_order_item_id, item.tb_order_id, item.tb_institution_id, item.terminal);
              if (regItem.id == 0) {
                await Tb.create(item);
              } else {
                await Tb.update(item, {
                  where: {
                    tb_institution_id: item.tb_institution_id,
                    tb_order_id: item.tb_order_id,
                    tb_order_item_id: item.tb_order_item_id,
                    terminal: item.terminal,
                  }
                });
              }
            }
          }
        }
        resolve({
          code: body.tb_order_item_id,
          id: 200,
          Message: "SYNCHED"
        });

      } catch (error) {
        reject("OrderItemIcmsController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(tb_order_item_id, tb_order_id, tb_institution_id, terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_order_item_icms ' +
          'where ( tb_order_item_id =?) ' +
          ' and ( tb_order_id = ?) ' +
          ' and ( terminal= ?) ' +
          ' and (tb_institution_id =?) ',
          {
            replacements: [tb_order_item_id, tb_order_id, terminal, tb_institution_id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data.length > 0)
              resolve(data[0])
            else
              resolve({ id: 0 });
          })
      } catch (error) {
        reject('OrderItemIcmsController.getById: ' + err);
      }
    });
    return promise;
  };

}
module.exports = OrderItemIcmsController;