const OrderStockTransferController = require("../controller/orderStockTransfer.controller.js");

class OrderStockTransferEndPoint {

  static create = (req, res) => {
    OrderStockTransferController.insert(req.body)
      .then(data => {
        var dataResult = {
          id: data.order.id,
          tb_user_id: data.order.tb_user_id,
          tb_entity_id: data.stock_transfer.tb_entity_id,
          name_entity: data.stock_transfer.name_entity,
          number: data.stock_transfer.number,
          dt_record: data.order.dt_record,
          status: data.order.status,
        }
        res.send(dataResult);
      })
  }

  static getList(req, res) {

    OrderStockTransferController.getList(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    OrderStockTransferController.get(req.params.tb_institution_id, req.params.tb_user_id, req.params.tb_order_id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    OrderStockTransferController.update(req.body)
      .then(data => {
        var dataResult = {
          id: data.order.id,
          tb_user_id: data.order.tb_user_id,
          tb_entity_id: data.stock_transfer.tb_entity_id,
          name_entity: data.stock_transfer.name_entity,
          number: data.stock_transfer.number,
          dt_record: data.order.dt_record,
          status: data.order.status,
        }
        res.send(dataResult);
      })
  }

  static delete(req, res) {

    OrderStockTransferController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static closure(req, res) {

    OrderStockTransferController.closure(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200)
            .send({
              result: true,
              message: "A ordem foi fechada com sucesso!!"
            });
        } else if (data == 201) {
          res.status(201)
            .send({
              result: true,
              message: "A ordem já está fechada"
            });
        } else {
          res.send({
              result: false,
              message: "Não foi possivel fechar a ordem!!"
            });
        }
      })
  }

  static reopen(req, res) {

    OrderStockTransferController.reopen(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200)
            .send({
              result: true,
              message: "A ordem foi reaberta com sucesso!!"
            });
        } else if (data == 201) {
          res.status(201)
            .send({
              result: true,
              message: "A ordem já está aberta"
            });
        } else {
          res.status()
            .send({
              result: false,
              message: "Não foi possivel reabrir a ordem!!"
            });
        }
      })
  }
}

module.exports = OrderStockTransferEndPoint; 