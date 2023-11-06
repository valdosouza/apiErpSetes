const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.invoicemerchandise;
const invoice = require('./invoice.controller.js')
const invoiceShippingController = require('./invoiceShipping.controller.js')
const itensIcmsController = require('./orderItemIcms.controller.js')
const itensIpiController = require('./orderItemIpi.controller.js')
const itensPisController = require('./orderItemPis.controller.js')
const itensCofinsController = require('./orderItemCofins.controller.js')
const itensIiController = require('./orderItemII.controller.js')
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
          reject('invoiceMerchandise.getNexNumber: ' + err);
        });
    });
    return promise;
  }

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {        
        //criar essa variavel para montar o body do invoice devido ao envio do invoice detached
        var bodyInvoice ={
          invoice: body.invoice,
          invoice_obs: body.invoice_obs,
          description: body.description,
          date_change: body.date_change,
          tb_institution_id: body.tb_institution_id,
          cnpj_institution: body.cnpj_institution,
          web_id: body.web_id,
          terminal: body.terminal,
          page: body.page
        }        
        await invoice.sync(bodyInvoice);        
        
        var regInvoiceMerchandise = await this.getById(body.invoice_merchandise.id, body.invoice_merchandise.tb_institution_id, body.invoice_merchandise.terminal) ;
        if (regInvoiceMerchandise.id == 0){                           
          await Tb.create(body.invoice_merchandise);
        }else{
          await Tb.update(body.invoice_merchandise,{
            where: {
            tb_institution_id: body.invoice_merchandise.tb_institution_id,
            id: body.invoice_merchandise.id,
            terminal: body.invoice_merchandise.terminal,
            }
          });
        }       
        
        await invoiceShippingController.sync(body.invoice_shipping);        
        await iinvoiceObsController.sync(body.invoice_obs);   
        
        await itensIcmsController.sync(body.items_icms);                
        await itensIpiController.sync(body.items_ipi);
        await itensPisController.sync(body.items_pis);
        await itensCofinsController.sync(body.items_cofins);
        await itensIiController.sync(body.items_ii);
        await itensIssqnController.sync(body.items_issqn);
        
               
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