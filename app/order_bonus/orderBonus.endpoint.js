const OrderBonusController = require("../order_bonus/orderBonus.controller");

class OrderBonusEndPoint {

  static sync = (req, res) => {
    try {
      OrderBonusController.sync(req.body)
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
    OrderBonusController.insert(req.body)
      .then(data => {
        var dataResult = {
          id: data.order.id,
          tb_user_id: data.order.tb_user_id,
          tb_customer_id: data.bonus.tb_customer_id,
          name_customer: data.bonus.name_customer,
          number: data.bonus.number,
          dt_record: data.order.dt_record,
          status: data.order.status,
        }
        res.send(dataResult);
      })
  }

  static getList(req, res) {

    OrderBonusController.getList(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    OrderBonusController.get(req.params.tb_institution_id, req.params.tb_user_id, req.params.tb_order_id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    OrderBonusController.update(req.body)
      .then(data => {
        var dataResult = {
          id: data.order.id,
          tb_user_id: data.order.tb_user_id,
          tb_entity_id: data.bonus.tb_entity_id,
          name_entity: data.bonus.name_entity,
          number: data.bonus.number,
          dt_record: data.order.dt_record,
          status: data.order.status,
        }
        res.send(dataResult);
      })
  }

  static delete(req, res) {

    OrderBonusController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static closure(req, res) {

    OrderBonusController.closure(req.body)
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

    OrderBonusController.reopen(req.body)
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

module.exports = OrderBonusEndPoint; 