const PackageController = require("../controller/package.controller.js");

class PackageEndPoint {

  static sync = (req, res) => {
    try {
      PackageController.sync(req.body)
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

    PackageController.insert(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static getList(req, res) {

    PackageController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    PackageController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    PackageController.update(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static delete(req, res) {

    PackageController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

}

module.exports = PackageEndPoint; 