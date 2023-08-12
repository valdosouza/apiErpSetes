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
    
    OrderSaleController.getList(req.params.tb_institution_id,req.params.tb_salesman_id)
      .then(data => {
        res.send(data);
      })
  }

  static get = (req, res) => {    
    OrderSaleController.get(req.params.tb_institution_id,req.params.tb_order_id)
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
}
module.exports = OrderSaleEndPoint; 