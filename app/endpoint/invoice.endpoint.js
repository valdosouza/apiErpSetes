const InvoiceController = require("../controller/invoice.controller.js");

class InvoiceEndPoint {

  static sync = (req, res) => {
    try {
      InvoiceController.sync(req.body)
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
module.exports = InvoiceEndPoint; 