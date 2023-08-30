const OrderSaleController = require("../controller/orderSale.controller.js");

class OrderSaleEndPoint {

  static sync = (req, res) => {
    try {
      OrderSaleController.sync(req.body)
        .then(data => {
          res.send({
            code: data.id,
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

  static create = (req, res) => {
    OrderSaleController.insert(req.body)
      .then(data => {        
       var dataResult = {
          id : data.order.id,
          number: data.sale.number,
          dt_record : data.order.dt_record,
          tb_customer_id : data.sale.tb_customer_id,
          name_customer: data.sale.name_customer,
          doc_customer:  data.sale.doc_customer,
          tb_salesman_id: data.sale.tb_salesman_id,
          name_salesman: data.sale.name_salesman,
          doc_salesman : data.doc_salesman,
          status: data.order.status,
        }
        res.send(dataResult);
      })
  }

  static update = (req, res) => {
    OrderSaleController.update(req.body)
      .then(data => {        
       var dataResult = {
          id : data.order.id,
          number: data.sale.number,
          dt_record : data.order.dt_record,
          tb_customer_id : data.sale.tb_customer_id,
          name_customer: data.sale.name_customer,
          doc_customer:  data.sale.doc_customer,
          tb_salesman_id: data.sale.tb_salesman_id,
          name_salesman: data.sale.name_salesman,
          doc_salesman : data.doc_salesman,
          status: data.order.status,
        }
        res.send(dataResult);
      })
  }  
  static getList = (req, res) => {
    
    OrderSaleController.getList(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static get = (req, res) => {    
    OrderSaleController.get(req.params.tb_institution_id,req.params.tb_salesman_id,req.params.tb_order_id)
      .then(data => {
        res.send(data);
      })
  }

  static delete = (req, res) => {        
    OrderSaleController.delete(req.body.tb_institution_id,req.body.id)
      .then(data => {             
          res.send({result: data});
      })
  }  

  static closure(req, res) {

    OrderSaleController.closure(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200)
            .send({
              result: true,
              message: "A ordem foi fechada com sucesso!!"
            });
        } else if (data == 201) {
          res.status(201)
            .send({
              result: true,
              message: "A ordem já está fechada"
            });
        } else {
          res.send({
              result: false,
              message: "Não foi possivel fechar a ordem!!"
            });
        }
      })
  }

  static reopen(req, res) {

    OrderSaleController.reopen(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200)
            .send({
              result: true,
              message: "A ordem foi reaberta com sucesso!!"
            });
        } else if (data == 201) {
          res.status(201)
            .send({
              result: true,
              message: "A ordem já está aberta"
            });
        } else {
          res.status()
            .send({
              result: false,
              message: "Não foi possivel reabrir a ordem!!"
            });
        }
      })
  }  
}
module.exports = OrderSaleEndPoint; 