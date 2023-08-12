const OrderStockAdjustController = require("../controller/orderStockAdjust.controller.js");

class OrderStockAdjustEndPoint {

  static sync = (req, res) => {
    try {
      OrderStockAdjustController.sync(req.body)
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
    OrderStockAdjustController.insert(req.body)
      .then(data => {
        res.send(data.order);
      })
  }

  static getList(req, res) {

    OrderStockAdjustController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    OrderStockAdjustController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    OrderStockAdjustController.update(req.body)
      .then((data) => {

        res.send(data.order)
      })
  }

  static delete(req, res) {

    OrderStockAdjustController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static closure(req, res) {

    OrderStockAdjustController.closure(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200).send('The OrderStockTransfer was closed');
        } else {
          if (data == 201) {
            res.status(201).send('The OrderStockTransfer is already closed');
          }
        }
      })
  }

  static reopen(req, res) {

    OrderStockAdjustController.reopen(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200).send('The OrderStockTransfer was open');
        } else {
          if (data == 201) {
            res.status(201).send('The OrderStockTransfer is already open');
          }
        }
      })
  }
}

module.exports = OrderStockAdjustEndPoint; 