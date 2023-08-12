const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.invoiceshipping;

class InvoiceShippingController extends Base {
  
  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var regShipping = await this.getById(body.id, body.tb_institution_id, body.terminal) ;
        if (regShipping.id == 0){                           
          Tb.create(body);
        }else{
          Tb.update(body,{
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
        reject("InvoiceShippingController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id, tb_institution_id,terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_invoice_shipping ' +
          'where ( id =?) ' +
          ' and ( terminal= ?) '+
          ' and (tb_institution_id =?) ',
          {
            replacements: [id, terminal, tb_institution_id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data.length > 0)
              resolve(data[0])
            else
              resolve({id:0});
          })
      } catch (error) {
        reject('InvoiceShippingController.getById: ' + err);
      }
    });
    return promise;
  };

}
module.exports = InvoiceShippingController;