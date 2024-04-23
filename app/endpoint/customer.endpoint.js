const customerController = require("../controller/customer.controller.js");
const fiscalController = require("../controller/fiscal.controller.js");

class CustomerEndPoint {

  static sync = (req, res) => {
    try {
      customerController.sync(req.body)
        .then(data => {
          res.send({
            code: data.code,
            id: 200,
            Message: "SAVED"
          })
        })
    } catch (error) {
      res.send({
        code: 0,
        id: 500,
        Message: error
      })
    }
  }

  static save = (req, res) => {
    try {
      var docNumber = "";
      var docKind = "";
      if (req.body.fiscal.person) {
        docNumber = req.body.fiscal.person.cpf;
        docKind = "F";
      }
      if (docNumber == "") {
        docNumber = req.body.fiscal.company.cnpj;
        docKind = "J";
      }
      fiscalController.getByDocNumber(docNumber)
        .then(async dataDocnumber => {          
          var dataCustomer = {tb_salesman_id:0};
          if (dataDocnumber.id > 0) {
            dataCustomer = await customerController.getById(req.body.customer.tb_institution_id, dataDocnumber.id);
          }          
          if ((dataDocnumber.id == 0) || (dataCustomer.tb_salesman_id == 0) || (dataCustomer.tb_salesman_id == req.body.customer.tb_salesman_id)) {
            if (dataDocnumber.id > 0){
              req.body.customer.id = dataDocnumber.id;
              req.body.fiscal.obj_entity.entity.id = dataDocnumber.id;
              for(var i = 0; i < req.body.fiscal.obj_entity.address_list.length;i++){
                req.body.fiscal.obj_entity.address_list[i].id = dataDocnumber.id;
              }
              for(var i = 0; i < req.body.fiscal.obj_entity.phone_list.length;i++){
                req.body.fiscal.obj_entity.phone_list[i].id = dataDocnumber.id;
              }
              if (dataDocnumber.doc.length == 11){
                req.body.fiscal.person.id = dataDocnumber.id;
              }else{
                req.body.fiscal.company.id = dataDocnumber.id;
              }
            }
            customerController.save(req.body)
              .then(data => {
                var dataRes = {
                  id: data.fiscal.obj_entity.entity.id,
                  name_company: data.fiscal.obj_entity.entity.name_company,
                  nick_trade: data.fiscal.obj_entity.entity.nick_trade,
                  doc_kind: "",
                  doc_number: "",
                  error: "",
                };
                if (data.person) {
                  if (data.fiscal.person.id > 0) {
                    dataRes.doc_kind = "F";
                    dataRes.doc_number = data.fiscal.person.cpf;
                  }
                }
                if (data.fiscal.company) {
                  if (data.fiscal.company.id > 0) {
                    dataRes.doc_kind = "J";
                    dataRes.doc_number = data.fiscal.company.cnpj;
                  }
                }
                res.send(dataRes);
              })
          } else {
            var dataRes = {
              id: 0,
              name_company: req.body.fiscal.obj_entity.entity.name_company,
              nick_trade: req.body.fiscal.obj_entity.entity.nick_trade,
              doc_kind: docKind,
              doc_number: docNumber,
              error: "Este Cliente pertence a outro vendedor",
            };
            res.status(201).json(dataRes);

          }
        });

    } catch (err) {
      res.send(err);
    }
  }

  static get = (req, res) => {
    customerController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  };

  static getList(req, res) {
    if (req.body.page == 0) {
      res.status(400).send({
        message: "Page não pode ser 0(Zero)"
      });
      return;
    }
    customerController.getList(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static getListSalesRoute = (req, res) => {

    customerController.getListSalesRoute(req.params.tb_institution_id, req.params.tb_sales_route_id, req.params.tb_salesman_id)
      .then(data => {
        res.send(data);
      })
  };

  static getListBySalesman = (req, res) => {

    customerController.getListBySalesman(req.params.tb_institution_id, req.params.tb_salesman_id)
      .then(data => {
        res.send(data);
      })
  };

  static delete(req, res) {
    customerController.delete(req.body).then(data => {
      res.send(data);
    })
  }
}

module.exports = CustomerEndPoint;