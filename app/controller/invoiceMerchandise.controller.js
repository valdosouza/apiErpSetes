const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.invoicemerchandise;
const invoice = require('./invoice.controller.js')
const invoiceShippingController = require('./invoiceShipping.controller.js')
const itensIcmsController = require('./orderItemIcms.controller.js')
const itensIpiController = require('./orderItemIpi.controller.js')
const itensPisController = require('./orderItemPis.controller.js')
const itensCofinsController = require('./orderItemCofins.controller.js')
const itensIiController = require('./orderItemIi.controller.js')
const itensIssqnController = require('./orderItemIssqn.controller.js')
const iinvoiceObsController = require('./invoiceObs.controller.js')

class InvoiceMerchandiseController extends Base {
  static async getNextNumber(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_invoice_merchandise ' +
        'WHERE ( tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data) {
            const nextNumber = data[0].lastNumber + 1;
            resolve(nextNumber);
          } else {
            resolve(1);
          }
        })
        .catch(err => {
          reject('orderSale.getNexNumber: ' + err);
        });
    });
    return promise;
  }

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {        
        invoice.sync(body.invoice);        
        
        var regInvoiceMerchandise = await this.getById(body.invoicemerchandise.id, body.invoicemerchandise.tb_institution_id, body.invoicemerchandise.terminal) ;
        if (regInvoiceMerchandise.id == 0){                           
          Tb.create(body.invoicemerchandise);
        }else{
          Tb.update(body.invoicemerchandise,{
            where: {
            tb_institution_id: body.invoicemerchandise.tb_institution_id,
            id: body.invoicemerchandise.id,
            terminal: body.invoicemerchandise.terminal,
            }
          });
        }       
        
        invoiceShippingController.sync(body.invoiceshipping);
        
        itensIcmsController.sync(body.itemsicms);        
        
        itensIpiController.sync(body.itemsipi);
        itensPisController.sync(body.itemspis);
        itensCofinsController.sync(body.itemscofins);
        itensIiController.sync(body.itemsii);
        itensIssqnController.sync(body.itemsissqn);
        iinvoiceObsController.sync(body.invoiceobs);   
                   
        resolve({
          code: body.invoice.id,
          id: 200,
          Message: "SYNCHED"
        });
      } catch (error) {
        reject("InvoiceMerchandiseController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id, tb_institution_id,terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_invoice_merchandise ' +
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
        reject('InvoiceMerchandiseController.getById: ' + err);
      }
    });
    return promise;
  };

}
module.exports = InvoiceMerchandiseController;