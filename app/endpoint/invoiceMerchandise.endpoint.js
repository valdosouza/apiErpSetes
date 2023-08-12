const InvoiceMerchandiseController = require("../controller/invoiceMerchandise.controller.js");

class OrderSaleEndPoint {

  static sync = (req, res) => {
    try {
      InvoiceMerchandiseController.sync(req.body)
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


}
module.exports = OrderSaleEndPoint; 