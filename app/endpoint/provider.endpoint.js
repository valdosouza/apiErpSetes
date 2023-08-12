const ProviderController = require("../controller/provider.controller.js");

class ProviderEndPoint {

  static sync = (req, res) => {
    try {
      ProviderController.sync(req.body)
        .then(data => {
          res.send({
            code: data.code,
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

module.exports = ProviderEndPoint;