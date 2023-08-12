const PaymentController = require("../controller/paymentType.controller.js");

class PaymentTypeEndPoint {

  static sync = (req, res) => {
    try {
      PaymentController.sync(req.body)
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

    PaymentController.insert(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static getList(req, res) {

    PaymentController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    PaymentController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    PaymentController.update(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static delete(req, res) {

    PaymentController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

}

module.exports = PaymentTypeEndPoint; 