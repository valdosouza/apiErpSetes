const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.customer;
const fiscalController = require('./fiscal.controller.js');
const entityExtenralCode = require('./entityExternalCode.controller.js');
const entityControler = require('./entity.controller.js');
const companyControler = require('./company.controller.js');
const personControler = require('./person.controller.js');
const addressControler = require('./address.controller.js');
const phoneControler = require('./phone.controller.js');
const { stack } = require('sequelize/lib/utils');

class CustomerController extends Base {

  static async sync(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {

        await fiscalController.sync(body.fiscal)
          .then(async (data) => {
            if (body.fiscal.person) body.fiscal.person = data.body.person;
            if (body.fiscal.company) body.fiscal.company = data.body.company;
            body.customer.tb_salesman_id = await entityExtenralCode.getByExternalCode(
              body.customer.tb_institution_id,
              body.customer.salesmanExternalCode,
              'COLABORADOR'
            )
            var regCustomer = await this.getById(body.fiscal.objEntity.tb_institution_id, body.fiscal.objEntity.entity.id);
            if (regCustomer.id == 0) {
              body.customer.id = body.fiscal.objEntity.entity.id;
              await Tb.create(body.customer);
            } else {
              body.customer.id = body.fiscal.objEntity.entity.id;
              await Tb.update(body.customer, {
                where: {
                  tb_institution_id: body.customer.tb_institution_id,
                  id: body.customer.id
                }
              });
            }
            resolve({
              code: body.customer.id,
              id: 200,
              Message: "SYNCHED"
            });
          })
      } catch (error) {
        reject("Customer.sync:" + error);
      }
    });
    return promise;
  }

  static async getById(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select ' +
        'ct.id, ' +
        'ct.tb_institution_id, ' +
        'ct.tb_salesman_id, ' +
        'slm.nick_trade salesman_name, ' +
        'ct.tb_carrier_id, ' +
        'ct.credit_status, ' +
        'ct.credit_value, ' +
        'ct.wallet, ' +
        'ct.consumer, ' +
        'ct.multiplier, ' +
        'ct.active ' +
        'from tb_customer  ct ' +
        '  left outer join tb_entity slm ' +
        '  on (slm.id = ct.tb_salesman_id) ' +
        'where (ct.tb_institution_id =?) ' +
        ' and  ( ct.id =?)',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0)
            resolve(data[0])
          else
            resolve({
              id: 0,
              tb_salesman_id: 0,
            });
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };

  static async save(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var resultCustomer = [];
        if (body.customer.id > 0)
          resultCustomer = await this.getById(body.customer.tb_institution_id, body.customer.id);

        if (resultCustomer.length == 0) {
          this.insert(body)
            .then(data => {
              resolve(data);
            })
        } else {
          this.update(body)
            .then(() => {
              resolve(body);
            })
        }
      } catch (err) {
        reject('Customer.save: ' + err);
      }
    });
    return promise;
  }

  static async insert(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var resultDoc = [];

        if (body.fiscal.person) {
          if (body.fiscal.person.cpf != "") {
            resultDoc = await personControler.getByCPF(body.fiscal.person.cpf);
          }
        } else {
          resultDoc = await companyControler.getByCNPJ(body.fiscal.company.cnpj);
        }
        if (resultDoc.length == 0) {
          this.insertComplete(body)
            .then(data => {
              resolve(data);
            })
        } else {
          body.customer.id = resultDoc[0].id;
          this.insertParcial(body)
            .then(data => {
              resolve(data);
            })
        }
      } catch (err) {
        reject('Customer Insert: ' + err);
      }
    });
    return promise;
  }

  static async insertComplete(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        entityControler.insert(body.fiscal.obj_entity.entity)
          .then(data => {
            body.fiscal.obj_entity.entity.id = data.id;
            //Salva a pessoa Juridica                        
            if (body.fiscal.company.cnpj != "") {
              body.fiscal.company.id = body.fiscal.obj_entity.entity.id;
              companyControler.insert(body.fiscal.company)
                .catch(err => {
                  reject("Erro:" + err);
                });
            } else {
              body.fiscal.person.id = body.fiscal.obj_entity.entity.id;
              personControler.insert(body.fiscal.person)
                .catch(err => {
                  reject("Erro:" + err);
                });
            }

            //Salva o endereço  
            body.fiscal.obj_entity.address_list[0].id = body.fiscal.obj_entity.entity.id
            addressControler.insert(body.fiscal.obj_entity.address_list[0])
              .catch(err => {
                reject("Erro:" + err);
              });

            //Salva o Phone
            body.fiscal.obj_entity.phone_list[0].id = body.fiscal.obj_entity.entity.id;
            phoneControler.insert(body.fiscal.obj_entity.phone_list[0])
              .catch(err => {
                reject("Erro:" + err);
              });

            //Grava o customer
            body.customer.id = body.fiscal.obj_entity.entity.id;
            Tb.create(body.customer)
              .catch(err => {
                reject("Erro:" + err);
              });

            //REtornogeral              
            resolve(body);
          })
          .catch(err => {
            reject('Customer InsertComplete: ' + err);
          });
      } catch (err) {
        reject('Customer InsertComplete: ' + err);
      }
    });
    return promise;
  }

  static async insertParcial(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        //Insere o customer
        const existCustomer = await this.getById(body.customer.tb_institution_id, body.customer.id);
        if (existCustomer.length == 0) {
          await Tb.create(body.customer);
        } else {
          await Tb.update(body.customer, {
            where: { id: body.customer.id }
          });
        }

        //Atualiza Entidade    
        body.entity.id = body.customer.id;
        await entityControler.update(body.entity)
        //Atualiza  Person ou Company
        if (body.person) {
          body.person.id = body.customer.id;
          await companyControler.update(body.person);
        } else {
          body.company.id = body.customer.id;
          await personControler.update(body.company);
        }
        //Atualiza o endereço  

        for (var item of body.fiscal.obj_entity.address_list) {
          item.id = body.customer.id;
          await addressControler.save(item);
        }
        //Salva o Phone
        for (var item of body.fiscal.obj_entity.phone_list) {
          item.id = body.customer.id;
          await phoneControler.save(item);
        }
        //REtornogeral              
        resolve(body);
      } catch (err) {
        reject('Customer InsertParc: ' + err);
      }
    });
    return promise;
  }


  static async update(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        body.fiscal.obj_entity.entity.id = body.customer.id
        entityControler.update(body.fiscal.obj_entity.entity);        
        if (body.person) {
          if (body.person.cpf.length == 11) {
            body.person.id = body.fiscal.customer.id
            personControler.update(body.fiscal.person);
          }
        }
        if (body.company) {
          if (body.company.cnpj.length == 14) {
            body.fiscal.company.id = body.customer.id
            companyControler.update(body.fiscal.company);
          }
        }        
        for (var item of body.fiscal.obj_entity.address_list) {
          item.id = body.customer.id
          await addressControler.save(item);
        }
        for (var item of body.fiscal.obj_entity.address_list) {
          item.id = body.customer.id
          phoneControler.save(item);
        }
        //Insere o customer
        const existCustomer = await this.getById(body.customer.tb_institution_id, body.customer.id);
        if (existCustomer.id == 0) {
          Tb.create(body.customer);
        } else {
          Tb.update(body.customer, {
            where: { id: body.customer.id }
          });
        }
        
        resolve(body);
      } catch (err) {
        reject('Customer.update: ' + err);
      }
    });
    return promise;
  }

  static get = (tb_institution_id, id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};
        const dataCustomer = await this.getById(tb_institution_id, id);
        result.customer = dataCustomer;

        const dataFiscal = await fiscalController.get(tb_institution_id, id);
        result.fiscal = dataFiscal;

        resolve(result);
      }
      catch (err) {
        reject('get: ' + err);
      }
    });
    return promise;
  }

  static getList = (body) => {

    const promise = new Promise((resolve, reject) => {
      var nick_trade = "";
      var sqltxt =
        'Select ' +
        'et.id,  ' +
        'et.name_company,  ' +
        'et.nick_trade, ' +
        ' "F" doc_kind, ' +
        'pe.cpf doc_number, ' +
        'adr.street, ' +
        'adr.nmbr, ' +
        'adr.complement,' +
        'adr.neighborhood         ' +
        'from tb_customer ct  ' +
        '  inner join tb_entity et  ' +
        '  on (ct.id = et.id)  ' +
        '  inner join tb_person pe ' +
        '  on (pe.id = et.id) ' +
        '  inner join tb_address adr ' +
        '  on (adr.id = ct.id) and (kind = "COMERCIAL") ' +
        'where ct.tb_institution_id =? ' +
        ' and (tb_salesman_id = ? ) ';

      if (body.name_customer != "") {
        nick_trade = '%' + body.name_customer + '%';
        sqltxt += ' and (et.nick_trade like ? ) ';
      } else {
        nick_trade = "";
        sqltxt += ' and (et.nick_trade <> ?) ';
      }
      sqltxt +=
        'union ' +
        'Select  ' +
        'et.id,  ' +
        'et.name_company,  ' +
        'et.nick_trade, ' +
        ' "J" doc_kind, ' +
        'co.cnpj doc_number, ' +
        'adr.street, ' +
        'adr.nmbr, ' +
        'adr.complement,' +
        'adr.neighborhood ' +
        'from tb_customer ct  ' +
        '  inner join tb_entity et  ' +
        '  on (ct.id = et.id)  ' +
        '  inner join tb_company co ' +
        '  on (co.id = et.id) ' +
        '  inner join tb_address adr ' +
        '  on (adr.id = ct.id) and (kind = "COMERCIAL") ' +

        'where ct.tb_institution_id =? ' +
        ' and (tb_salesman_id = ? ) ';
      if (body.name_customer != "") {
        sqltxt += ' and (et.nick_trade like ? ) ';
      } else {
        sqltxt += ' and (et.nick_trade <> ?) ';
      }
      sqltxt +=
        ' order by nick_trade ' +
        ' limit ' + ((body.page - 1) * 20) + ',20 ';

      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [body.tb_institution_id, body.tb_salesman_id, nick_trade, body.tb_institution_id, body.tb_salesman_id, nick_trade],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('CustomerController.getlist: ' + err);
        });
    });
    return promise;
  }

  static getListSalesRoute = (tb_institution_id, tb_sales_route_id, tb_salesman_id) => {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select ' +
        'src.tb_sales_route_id, ' +
        'sr.description name_sales_route, ' +
        'src.sequence, ' +
        'et.id,  ' +
        'et.name_company,  ' +
        'et.nick_trade, ' +
        ' "F" doc_kind, ' +
        'pe.cpf doc_number ' +
        'from tb_customer ct  ' +
        '  inner join tb_entity et  ' +
        '  on (ct.id = et.id)  ' +
        '  inner join tb_person pe ' +
        '  on (pe.id = et.id) ' +
        ' inner join tb_sales_route_customer src  ' +
        ' on (ct.id = src.tb_customer_id )  ' +
        ' and  (ct.tb_institution_id = src.tb_institution_id) ' +
        ' inner  join  tb_sales_route sr  ' +
        ' on (src.tb_sales_route_id = sr.id)  ' +
        '  and  (src.tb_institution_id = sr.tb_institution_id) ' +
        'where ct.tb_institution_id =? ' +
        '  and ( (tb_sales_route_id =?) or (tb_sales_route_id =0))' +
        ' and (ct.tb_salesman_id = ?)' +
        'union ' +
        'Select  ' +
        'src.tb_sales_route_id, ' +
        'sr.description name_sales_route, ' +
        'src.sequence, ' +
        'et.id,  ' +
        'et.name_company,  ' +
        'et.nick_trade, ' +
        ' "J" doc_kind, ' +
        'co.cnpj doc_number ' +
        'from tb_customer ct  ' +
        '  inner join tb_entity et  ' +
        '  on (ct.id = et.id)  ' +
        '  inner join tb_company co ' +
        '  on (co.id = et.id) ' +
        ' inner  join tb_sales_route_customer src  ' +
        ' on (ct.id = src.tb_customer_id )  ' +
        ' and  (ct.tb_institution_id = src.tb_institution_id) ' +
        ' inner  join  tb_sales_route sr  ' +
        ' on (src.tb_sales_route_id = sr.id)  ' +
        '  and  (src.tb_institution_id = sr.tb_institution_id) ' +
        'where ct.tb_institution_id =? ' +
        '  and ( (tb_sales_route_id =?) or (tb_sales_route_id =0))' +
        ' and (ct.tb_salesman_id = ?)' +
        'order by 3 ',
        {
          replacements: [tb_institution_id, tb_sales_route_id, tb_salesman_id, tb_institution_id, tb_sales_route_id, tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('Customer.getListBySalesRoute: ' + err);
        });
    });
    return promise;
  }

  static getListBySalesman = (tb_institution_id, tb_salesman_id) => {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select ' +
        'ct.tb_salesman_id, ' +
        'clb.name_company name_salesman, ' +
        'et.id, ' +
        'et.name_company, ' +
        'et.nick_trade, ' +
        ' "F" doc_kind, ' +
        'pe.cpf doc_number ' +
        'from tb_customer ct ' +
        '  inner join tb_entity et ' +
        '  on (ct.id = et.id) ' +
        '  inner join tb_person pe ' +
        '  on (pe.id = et.id) ' +
        '  inner join tb_entity clb ' +
        '  on (clb.id = ct.tb_salesman_id) ' +
        'where ( ct.tb_institution_id =?) ' +
        '  and ( ct.tb_salesman_id =?) ' +
        'union ' +
        'Select ' +
        'ct.tb_salesman_id, ' +
        'clb.name_company name_salesman, ' +
        'et.id, ' +
        'et.name_company, ' +
        'et.nick_trade, ' +
        ' "J" doc_kind, ' +
        'co.cnpj doc_number ' +
        'from tb_customer ct ' +
        '  inner join tb_entity et ' +
        '  on (ct.id = et.id) ' +
        '  inner join tb_company co ' +
        '  on (co.id = et.id) ' +
        '  inner join tb_entity clb ' +
        '  on (clb.id = ct.tb_salesman_id) ' +
        'where (ct.tb_institution_id =?) ' +
        '  and ( ct.tb_salesman_id =?)' +
        'order by 5 asc ',
        {
          replacements: [tb_institution_id, tb_salesman_id, tb_institution_id, tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('Customer.getListBySalesman: ' + err);
        });
    });
    return promise;
  }

}
module.exports = CustomerController; 