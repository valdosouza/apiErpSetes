const routes = require("express").Router();

const stateRouter = require("../routes/state.routes");
routes.use("/state", stateRouter);

const cityRouter = require("../routes/city.routes");
routes.use("/city", cityRouter);

const authRouter = require("../routes/auth.routes");
routes.use("/auth", authRouter);

const userRouter = require("../routes/user.routes");
routes.use("/user", userRouter);

const mailingRouter = require("../routes/mailing.routes");
routes.use("/mailing", mailingRouter);

const entity = require("../routes/entity.routes");
routes.use("/entity", entity);

const company = require("../routes/company.routes");
routes.use("/company", company);

const person = require("../routes/person.routes");
routes.use("/person", person);

const address = require("../routes/address.routes");
routes.use("/address", address);

const phone = require("../routes/phone.routes");
routes.use("/phone", phone);

const institution = require("../routes/institution.routes");
routes.use("/institution", institution);

const stockList = require("../routes/stockList.routes");
routes.use("/stocklist", stockList);

const paymentType = require("../routes/paymentTypes.routes");
routes.use("/paymenttype", paymentType);

const category = require("../routes/category.routes");
routes.use("/category", category);

const brand = require("../routes/brand.routes");
routes.use("/brand", brand);

const package = require("../routes/package.routes");
routes.use("/package", package);

const measure = require("../routes/measure.routes");
routes.use("/measure", measure);

const lineBusinesse = require("../routes/lineBusiness.routes");
routes.use("/linebusiness", lineBusinesse);

const collaborator = require("../routes/collaborator.routes");
routes.use("/collaborator", collaborator);

const customer = require("../routes/customer.routes");
routes.use("/customer", customer);

const provider = require("../routes/provider.routes");
routes.use("/provider", provider);

const priceList = require("../routes/priceList.routes");
routes.use("/pricelist", priceList);

const price = require("../routes/price.routes");
routes.use("/price", price);

const salesroute = require("../routes/salesRoute.routes");
routes.use("/salesroute", salesroute);

const salesman = require("../routes/salesman.routes");
routes.use("/salesman", salesman);


const product = require("../routes/product.routes");
routes.use("/product", product);

const merchandise = require("../routes/merchandise.routes");
routes.use("/merchandise", merchandise);

const stock = require("../routes/stock.routes");
routes.use("/stock", stock);

const stockbalance = require("../routes/stockBalance.routes");
routes.use("/stockbalance", stockbalance);

const stockstatement = require("../routes/stockStatement.routes");
routes.use("/stockstatement", stockstatement);

const orderproduction = require("../routes/orderProduction.routes");
routes.use("/orderproduction", orderproduction);

const orderstocktransfer = require("../routes/orderStockTransfer.routes");
routes.use("/orderstocktransfer", orderstocktransfer);

const orderbonus = require("../routes/orderBonus.routes");
routes.use("/orderbonus", orderbonus);

const ordersale = require("../routes/orderSale.routes");
routes.use("/ordersale", ordersale);

const orderpurchase = require("../routes/orderPurchase.routes");
routes.use("/orderpurchase", orderpurchase);

const invoiceMerchandise = require("../routes/invoiceMerchandise.routes");
routes.use("/invoicemerchandise", invoiceMerchandise);

const invoice = require("../routes/invoice.routes");
routes.use("/invoice", invoice);

const orderconsignment = require("../routes/orderConsignment.routes");
routes.use("/orderconsignment", orderconsignment);

const orderstockadjust = require("../routes/orderStockAdjust.routes");
routes.use("/orderstockadjust", orderstockadjust);

const orderattendance = require("../routes/orderAttendance.routes");
routes.use("/orderattendance", orderattendance);

const financial = require("../routes/financial.routes");
routes.use("/financial", financial);

const cashier = require("../routes/cashier.routes");
routes.use("/cashier", cashier);

const orderloadcard = require("../routes/orderLoadCard.routes");
routes.use("/orderloadcard", orderloadcard);

module.exports = routes;