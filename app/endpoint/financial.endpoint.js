const FinancialController = require("../controller/financial.controller");

class FinancialEndPoint {

  static sync = (req, res) => {
    try {
      FinancialController.sync(req.body)
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
 
}

module.exports = FinancialEndPoint; 