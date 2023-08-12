const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.invoice;
const fiscalController = require('./fiscal.controller.js');

class InvoiceController extends Base {
  
  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var regIssuer = {id:0};
        if (body.doc_issuer != "" ){
          regIssuer = await fiscalController.getByDocNumber(body.doc_issuer);
        }        
        if (regIssuer.id > 0)
          body.issuer = regIssuer.id
        else  
          body.issuer = body.tb_institution_id;        
        var regEntity = await fiscalController.getByDocNumber(body.doc_entity);
        body.tb_entity_id = regEntity.id;
        
        delete body.doc_issuer;
        delete body.doc_entity;        
        var regInvoice = await this.getById(body.id, body.tb_institution_id, body.terminal) ;
        if (regInvoice.id == 0){                           
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
        reject("InvoiceController.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(id, tb_institution_id,terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize.query(
          'Select * ' +
          'from tb_invoice ' +
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
        reject('InvoiceController.getById: ' + err);
      }
    });
    return promise;
  };

}
module.exports = InvoiceController;