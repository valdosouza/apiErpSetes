const { Router } = require("express");
  
const orderstocktransfer =  require("../endpoint/orderStockTransfer.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     orderStockTransfer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         number:
 *           type: integer
 *         tb_entity_id:
 *           type: integer
 *         name_entity:
 *           type: string 
 *         tb_stock_list_id_ori:
 *           type: integer
 *         name_stock_list_ori:
 *           type: string  
 *         tb_stock_list_id_des:
 *           type: integer
 *         name_stock_list_des:
 *           type: string
 *
 * 
 *     objOrderStockTransfer:
 *       type: object
 *       properties:
 *         order:
 *           $ref: '#/components/schemas/order'
 *         stock_transfer:
 *           $ref: '#/components/schemas/orderStockTransfer'
 *         items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/orderItems'
 */
 
 
 /**
  * @swagger
  * tags:
  *   name: OrderStockTransfer
  *   description: The OrderStockTransfer managing API
  */

/**
 * @swagger
 * /orderstocktransfer:
 *   post:
 *     summary: Create a new orderstocktransfer
 *     tags: [OrderStockTransfer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/objOrderStockTransfer'
 *     responses:
 *       200:
 *         description: The OrderStockTransfer was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/orderStockTransfer'
 *       500:
 *         description: Some server error
 */
  //router.post("/", orderstocktransfer.create);
  protectedRouter.post("/", orderstocktransfer.create);

 /**
 * @swagger
 * /orderstocktransfer/getlist/:
 *   post:
 *     summary: Returns the list of all the OrderStockTransfer
 *     tags: [OrderStockTransfer]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/orderParams'
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/orderStockTransfer'
 */
 router.post("/getlist/", orderstocktransfer.getList);
 //protectedRouter.get("/getlist/:tb_institution_id", orderstocktransfer.getList);


/**
 * @swagger
 * /orderstocktransfer/get/{tb_institution_id}/{tb_user_id}/{tb_order_id}:
 *   get:
 *     summary: Returns the OrderStockTransfer
 *     tags: [OrderStockTransfer]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_user_id
 *      - in: path
 *        name: tb_order_id 
 *     responses:
 *       200:
 *         description: The OrderStockTransfer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objOrderStockTransfer'
 */
  //router.get("/get/:tb_institution_id/:id", orderstocktransfer.get);
  protectedRouter.get("/get/:tb_institution_id/:tb_user_id/:tb_order_id", orderstocktransfer.get);

 /**
 * @swagger
 * /orderstocktransfer:
 *  put:
 *    summary: Update the orderstocktransfer by the id
 *    tags: [OrderStockTransfer]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/objOrderStockTransfer'
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/orderStockTransfer'
 *      404:
 *        description: The orderstocktransfer was not found
 *      500:
 *        description: Some error happened
 */
  //router.put("/", orderstocktransfer.update);
  protectedRouter.put("/", orderstocktransfer.update);
/**
 * @swagger
 * /orderstocktransfer/{tb_institution_id}/{id}:
 *  delete:
 *    summary: Delete the orderstocktransfer by the id
 *    tags: [OrderStockTransfer]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: id 
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderstocktransfer id
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/orderResulAction'
 *      404:
 *        description: The orderstocktransfer was not found
 *      500:
 *        description: Some error happened
 */
  //router.delete("/:tb_institution_id/:id", orderstocktransfer.delete);
  protectedRouter.delete("/:tb_institution_id/:id", orderstocktransfer.delete);


/**
 * @swagger
 * /orderstocktransfer/closure:
 *   post:
 *     summary: Close status Order StockTransfer
 *     tags: [OrderStockTransfer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/orderAction'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/orderResulAction'
 *       201:
 *         description: The OrderStockTransfer is already closed
 *       404:
 *         description: The Order Transfer was notTransfer
 *       500:
 *         description: Some error happened
 */
  
  protectedRouter.post("/closure/", orderstocktransfer.closure);
 /**
  * @swagger
  * /orderstocktransfer/reopen:
  *   post:
  *     summary: Reopen Status Order StockTransfer
  *     tags: [OrderStockTransfer]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/orderAction'
  *     responses:
  *       200:
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/orderResulAction'
  *       201:
  *         description: The OrderStockTransfer is already open
  *       404:
  *         description: The Order Transfer was notTransfer
  *       500:
  *         description: Some error happened
  */
  //router.post("/reopen/", orderstocktransfer.reopen);     
  protectedRouter.post("/reopen/", orderstocktransfer.reopen);     

module.exports = router;