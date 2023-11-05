const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.invoice;
const fiscalController = require('./fiscal.controller.js');
const EntityExtenralCode = require('./entityExternalCode.controller.js');

class InvoiceController extends Base {

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {        
        if (body.invoice.issuer_external_code > 0) {
          var regIssuer = await EntityExtenralCode.getByExternalCode(body.invoice.tb_institution_id, body.invoice.issuer_external_code, 'EMPRESA');
          body.invoice.issuer = regIssuer.tb_entity_id;
        }else{
          body.invoice.issuer = body.invoice.tb_institution_id;
        }
        var regEntity = await EntityExtenralCode.getByExternalCode(body.invoice.tb_institution_id, body.invoice.entity_external_code, 'EMPRESA');                
        body.invoice.tb_entity_id = regEntity.tb_entity_id;

        delete body.invoice.issuer_external_code;
        delete body.invoice.issuer_external_code;
        var regInvoice = await this.getById(body.invoice.id, body.invoice.tb_institution_id, body.invoice.terminal);        
        if (regInvoice.id == 0) {
          Tb.create(body.invoice);
        } else {
          Tb.update(body.invoice, {
            where: {
              tb_institution_id: body.invoice.tb_institution_id,
              id: body.invoice.id,
              terminal: body.invoice.terminal,
            }
          });
        }
        resolve({
          code: body.id,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("InvoiceController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id, tb_institution_id, terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_invoice ' +
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
        reject('InvoiceController.getById: ' + err);
      }
    });
    return promise;
  };

}
module.exports = InvoiceController;