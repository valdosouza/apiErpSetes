const OrderPurchaseController = require("../controller/orderPurchase.controller.js");

class OrderPurchaseEndPoint {

  static sync = (req, res) => {
    try {
      OrderPurchaseController.sync(req.body)
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
    OrderPurchaseController.insert(req.body)
      .then(data => {
        res.send(data);
      })
  }

}
module.exports = OrderPurchaseEndPoint; 