const StockController = require("../controller/stock.controller.js");

class StockEndPoint {

  static sync = (req, res) => {
    try {
      StockController.sync(req.body)
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
    StockController.insert(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static getList(req, res) {
    const tb_institution_id = req.params.tb_institution_id;

    StockController.getList(tb_institution_id)
    .then(data => {
      res.send(data);
    })
  }

  static get(req, res) {
    StockController.get(req.params.tb_institution_id, req.params.id)
    .then(data => {
      res.send(data);
    })
  }

  static update = (req, res) => {
    const stockList = req.body;
    StockController.update(stockList)
      .then(data => {
        if (data)
          res.send(req.body)
        else
          res.send(data);
      })
  }

  static delete(req, res) {
    StockController.delete(req.body).then(data => {
      res.send(data);
    })
  }
}

module.exports = StockEndPoint;