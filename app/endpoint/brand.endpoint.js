const BrandController = require("../controller/brand.controller.js");

class BrandEndPoint {

  static sync = (req, res) => {
    try {
      BrandController.sync(req.body)
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

    BrandController.insert(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static getList(req, res) {

    BrandController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    BrandController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    BrandController.update(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static delete(req, res) {

    BrandController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

}

module.exports = BrandEndPoint; 