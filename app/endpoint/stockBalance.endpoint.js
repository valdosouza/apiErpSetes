const StockBalanceController = require("../controller/stockBalance.controller.js");

class StockBalanceEndPoint {

  static getList(req, res) {
    StockBalanceController.getList(req.params.tb_institution_id,
                                   req.params.tb_stock_list_id)
    .then(data => {
      res.send(data);
    })
  }

  static getListBySalesman(req, res) {
    if (req.body.page == 0) {
      res.status(400).send({
        message: "Page não pode ser 0(Zero)"
      });
      return;
    }
    StockBalanceController.getListBySalesman(req.body)
    .then(data => {
      res.send(data);
    })
  }
  
  static getListAllCustomer(req, res) {
    StockBalanceController.getListAllCustomer(req.params.tb_institution_id,
                                              req.params.tb_salesman_id)
    .then(data => {
      res.send(data);
    })
  }  

  static getAllBySalesman(req, res) {
    StockBalanceController.getAllBySalesman(req.params.tb_institution_id,
                                            req.params.tb_salesman_id)
    .then(data => {
      res.send(data);
    })
  }    
}

module.exports = StockBalanceEndPoint;