const MeasureController = require("../controller/measure.controller.js");

class MeasureEndPoint {

  static sync = (req, res) => {
    try {
      MeasureController.sync(req.body)
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

    MeasureController.insert(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static getList(req, res) {

    MeasureController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    MeasureController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    MeasureController.update(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static delete(req, res) {

    MeasureController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

}

module.exports = MeasureEndPoint; 