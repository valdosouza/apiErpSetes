const CollaboratorController = require("../controller/collaborator.controller.js");
const { entity } = require("../model/index.js");
const lineBusinessController = require("../controller/lineBusiness.controller.js");
const entityHasStockList = require("../controller/entityHasStockList.controller.js");
class CollaboratorEndPoint {

  static save = (req, res) => {
    try {
      CollaboratorController.save(req.body)
        .then(async data => {
          //verifica o cargo do Vendedor
          var lineBusinessModel = await lineBusinessController.get(data.collaborator.tb_institution_id, data.fiscal.obj_entity.entity.tb_linebusiness_id)
          if (lineBusinessModel.description.toLowerCase() === "Vendedor".toLowerCase()) {
            var dataEntityHasStockList = {
              tb_institution_id: data.collaborator.tb_institution_id,
              tb_entity_id: data.fiscal.obj_entity.entity.id,
              name_entity: data.fiscal.obj_entity.entity.nick_trade,
            }
            await entityHasStockList.createAuto(dataEntityHasStockList);
          }
          var dataRes = {
            id: data.fiscal.obj_entity.entity.id,
            name_company: data.fiscal.obj_entity.entity.name_company,
            nick_trade: data.fiscal.obj_entity.entity.nick_trade,
            doc_kind: "",
            doc_number: "",
            tb_linebusiness_id: lineBusinessModel.id,
            name_linebusiness: lineBusinessModel.description,
          };
          if (data.fiscal.person) {
            if (data.fiscal.person.id > 0) {
              dataRes.doc_kind = "F";
              dataRes.doc_number = data.fiscal.person.cpf;
            }
          }
          if (data.fiscal.company) {
            if (data.fiscal.company.id > 0) {
              dataRes.doc_kind = "J";
              dataRes.doc_number = data.fiscal.company.cnpj;
            }
          }
          res.send(dataRes);
        })
    } catch (err) {
      res.send(err);
    }
  }

  static get = (req, res) => {
    CollaboratorController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  };

  static getList = (req, res) => {

    CollaboratorController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  };

  static delete(req, res) {

    CollaboratorController.delete(req.body).then(data => {
      res.send(data);
    })
  }
}

module.exports = CollaboratorEndPoint;