const StockListController = require("../controller/stockList.controller.js");

class StockListEndPoint {

  static sync = (req, res) => {
    try {
      StockListController.sync(req.body)
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
    StockListController.insert(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static getList(req, res) {
    
    StockListController.getList(req.body)
    .then(data => {
      res.send(data);
    })
  }

  static get(req, res) {
    StockListController.get(req.params.tb_institution_id, req.params.id).then(data => {
      res.send(data);
    })
  }

  static update = (req, res) => {
    const stockList = req.body;
    StockListController.update(stockList)
      .then(data => {
        if (data)
          res.send(req.body)
        else
          res.send(data);
      })
  }

  static delete(req, res) {
    StockListController.delete(req.body).then(data => {
      res.send(data);
    })
  }
}

module.exports = StockListEndPoint;