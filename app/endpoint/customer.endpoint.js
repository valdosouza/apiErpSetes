const CustomerController = require("../controller/customer.controller.js");
const fiscalController = require("../controller/fiscal.controller.js");

class CustomerEndPoint {

  static sync = (req, res) => {
    try {
      CustomerController.sync(req.body)
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
      if (req.body.person) {
        docNumber = req.body.person.cpf;
        docKind = "F";
      }
      if (docNumber == "") {
        docNumber = req.body.company.cnpj;
        docKind = "J";
      }
      
      fiscalController.getByDocNumber(req.body.customer.tb_institution_id, docNumber)
        .then(dataDocnumber => {
          if ((dataDocnumber.length == 0) || (dataDocnumber.tb_salesman_id == req.body.customer.tb_salesman_id)) {
            
            CustomerController.save(req.body)
              .then(data => {
                var dataRes = {
                  id: data.entity.id,
                  name_company: data.entity.name_company,
                  nick_trade: data.entity.nick_trade,
                  doc_kind: "",
                  doc_number: "",
                  error:"",
                };
                if (data.person) {
                  if (data.person.id > 0) {
                    dataRes.doc_kind = "F";
                    dataRes.doc_number = data.person.cpf;
                  }
                }
                if (data.company) {
                  if (data.company.id > 0) {
                    dataRes.doc_kind = "J";
                    dataRes.doc_number = data.company.cnpj;
                  }
                }
                res.send(dataRes);
              })
          } else {
            var dataRes = {
              id: 0,
              name_company: req.body.entity.name_company,
              nick_trade: req.body.entity.nick_trade,
              doc_kind: docKind,
              doc_number: docNumber,
              error:"Este Cliente pertence a outro vendedor",
            };            
            res.status(201).json(dataRes);
            
          }
        });

    } catch (err) {
      res.send(err);
    }
  }

  static getCustomer = (req, res) => {
    CustomerController.getCustomer(req.params.tb_institution_id, req.params.id)
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
    CustomerController.getList(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static getListSalesRoute = (req, res) => {

    CustomerController.getListSalesRoute(req.params.tb_institution_id, req.params.tb_sales_route_id, req.params.tb_salesman_id)
      .then(data => {
        res.send(data);
      })
  };

  static getListBySalesman = (req, res) => {

    CustomerController.getListBySalesman(req.params.tb_institution_id, req.params.tb_salesman_id)
      .then(data => {
        res.send(data);
      })
  };

  static delete(req, res) {
    CustomerController.delete(req.body).then(data => {
      res.send(data);
    })
  }
}

module.exports = CustomerEndPoint;