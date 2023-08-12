const MerchandiseController = require("../controller/merchandise.controller.js");

class MerchandiseEndPoint {

  static sync = (req, res) => {
    try {
      MerchandiseController.sync(req.body)
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
    MerchandiseController.insert(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static getList(req, res) {
    if (req.body.page == 0) {
      res.status(400).send({
        message: "Page não pode ser 0(Zero)"
      });
      return;
    }
    MerchandiseController.getList(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static priceListGetAll(req, res) {

    MerchandiseController.priceListGetAll(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    MerchandiseController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    MerchandiseController.update(req.body)
      .then(data => {
        if (data)
          res.send(req.body)
        else
          res.send(data);
      })
  }

  static delete(req, res) {

    MerchandiseController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

}

module.exports = MerchandiseEndPoint; 