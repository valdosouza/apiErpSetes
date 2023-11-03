const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.invoiceobs;

class InvoiceObsController extends Base {

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {        
        if (body) {
          for (var item of body) {
            if (item != null) {
              var regItem = await this.getById(item.id, item.tb_institution_id, item.terminal, item.tb_invoice_id);
              if (regItem.id == 0) {
                await Tb.create(item);
              } else {
                await Tb.update(item, {
                  where: {
                    tb_institution_id: item.tb_institution_id,
                    tb_invoice_id: item.tb_invoice_id,
                    id: item._id,
                    terminal: item.terminal,
                  }
                });
              }
            }
          }
        }
        resolve({
          code: body,
          id: 200,
          Message: "SYNCHED"
        });

      } catch (error) {
        reject("InvoiceObsController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id, tb_institution_id, terminal, tb_invoice_id) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_invoice_obs ' +
          'where ( id =?) ' +
          ' and (tb_institution_id =?) ' +
          ' and ( terminal= ?) ' +
          ' and ( tb_invoice_id = ?) ',
          {
            replacements: [id, tb_institution_id, terminal, tb_invoice_id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data.length > 0)
              resolve(data[0])
            else
              resolve({ id: 0 });
          })
      } catch (error) {
        reject('InvoiceObsController.getById: ' + err);
      }
    });
    return promise;
  };

}
module.exports = InvoiceObsController;