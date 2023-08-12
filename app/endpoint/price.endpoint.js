const PriceController = require("../controller/price.controller.js");

class PriceEndPoint {

  static sync = (req, res) => {
    try {
      PriceController.sync(req.body)
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

    PriceController.insert(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static getList(req, res) {

    PriceController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    PriceController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    PriceController.update(req.body)
      .then(data => {
        if (data)
          res.send(req.body)
        else
          res.send(data);
      })
  }

  static delete(req, res) {

    PriceController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

}

module.exports = PriceEndPoint; 