const ProdcutController = require("../controller/product.controller.js");

class ProductEndPoint {

  static create = (req, res) => {

    ProdcutController.insert(req.body)
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
    ProdcutController.getList(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static priceListGetAll(req, res) {

    ProdcutController.priceListGetAll(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    ProdcutController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }

  static getPriceByProduct(req, res) {
    ProdcutController.getPriceByProduct(req.params.tb_institution_id, req.params.tb_product_id)
      .then(data => {
        res.send(data);
      })    
  }

  static update = (req, res) => {
    ProdcutController.update(req.body)
      .then(data => {
        if (data)
          res.send(req.body)
        else
          res.send(data);
      })
  }

  static delete(req, res) {

    ProdcutController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

}

module.exports = ProductEndPoint; 