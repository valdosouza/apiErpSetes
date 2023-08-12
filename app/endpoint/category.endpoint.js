const CategoryController = require("../controller/category.controller.js");

class CategoryTypeEndPoint {

  static sync = (req, res) => {
    try {
      CategoryController.sync(req.body)
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

    CategoryController.insert(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static getList(req, res) {

    CategoryController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    CategoryController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    CategoryController.update(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static delete(req, res) {

    CategoryController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

}

module.exports = CategoryTypeEndPoint; 