const { Router } = require("express");
  
const orderstockadjust =  require("../endpoint/orderStockAdjust.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderStockAdjust:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - tb_user_id
 *         - tb_entity_id
 *         - dt_record
 *         - status
 *         - tb_stock_list_id
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         tb_user_id:
 *           type: integer
 *         dt_record:
 *           type: string
 *         number:
 *           type: integer
 *         tb_entity_id:
 *           type: integer
 *         name_entity:
 *           type: string 
 *         tb_stock_list_id:
 *           type: integer
 *         name_stock_list:
 *           type: string  
 *         tb_stock_list_id_des:
 *           type: integer
 *         name_stock_list_des:
 *           type: string
 *         note:
 *           type: string 
 *         status:
 *           type: string
 *  
 *     OrderStockAdjustList:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_user_id:
 *           type: integer
 *         dt_record:
 *           type: string
 *         number:
 *           type: integer
 *         tb_entity_id:
 *           type: integer
 *         name_entity:
 *           type: string 
 *         status:
 *           type: string
 * 
 *     OrderStockAdjustItem:
 *       type: object
 *       required:
 *         - tb_product_id
 *         - unit_value
 *         - quantity
 *       properties:
 *         tb_product_id:
 *           type: integer
 *         name_product:
 *           type: string
 *         unit_value:
 *           type: number
 *         quantity:
 *           type: number
 * 
 *     OrderStockAdOperation:
 *       type: object
 *       required:
 *         - tb_institution_id
 *         - tb_order_id 
 *         - dt_record
 *         - direction 
 *       properties:
 *         tb_institution_id:
 *           type: integer
 *         id:
 *           type: integer
 *         dt_record:
 *           type: string 
 *
 *     OrderStockAdjustMain:
 *       type: object
 *       properties:
 *         Order:
 *           $ref: '#/components/schemas/OrderStockAdjust'
 *         Items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderStockAdjustItem'
 */
 
 
 /**
  * @swagger
  * tags:
  *   name: OrderStockAdjust
  *   description: The OrderStockAdjust managing API
  */

/**
 * @swagger
 * /orderstockadjust:
 *   post:
 *     summary: Create a new orderstockadjust
 *     tags: [OrderStockAdjust]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderStockAdjustMain'
 *     responses:
 *       200:
 *         description: The OrderStockAdjust was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStockAdjustMain'
 *       500:
 *         description: Some server error
 */
  //router.post("/", orderstockadjust.create);
  protectedRouter.post("/", orderstockadjust.create);

 /**
 * @swagger
 * /orderstockadjust/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the OrderStockAdjusts
 *     tags: [OrderStockAdjust]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderstockadjust tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the StockAdjust
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderStockAdjustList'
 */
  //router.get("/getlist/:tb_institution_id", orderstockadjust.getList);
  protectedRouter.get("/getlist/:tb_institution_id", orderstockadjust.getList);
/**
 * @swagger
 * /orderstockadjust/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the OrderStockAdjust
 *     tags: [OrderStockAdjust]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Order StockAdjust by tb_institution_id and id
 *     responses:
 *       200:
 *         description: The OrderStockAdjust
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStockAdjustMain'
 */
  router.get("/get/:tb_institution_id/:id", orderstockadjust.get);
  //protectedRouter.get("/get/:tb_institution_id/:id", orderstockadjust.get);
 /**
 * @swagger
 * /orderstockadjust:
 *  put:
 *    summary: Update the orderstockadjust by the id
 *    tags: [OrderStockAdjust]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OrderStockAdjustMain'
 *    responses:
 *      200:
 *        description: The OrderStockAdjust was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderStockAdjustMain'
 *      404:
 *        description: The orderstockadjust was not found
 *      500:
 *        description: Some error happened
 */
  //router.put("/", orderstockadjust.update);
  protectedRouter.put("/", orderstockadjust.update);
/**
 * @swagger
 * /orderstockadjust/{tb_institution_id}/{id}:
 *  delete:
 *    summary: Delete the orderstockadjust by the id
 *    tags: [OrderStockAdjust]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: id 
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderstockadjust id
 *    responses:
 *      200:
 *        description: The OrderStockAdjust was deleted
 *      404:
 *        description: The orderstockadjust was not found
 *      500:
 *        description: Some error happened
 */
  //router.delete("/:tb_institution_id/:id", orderstockadjust.delete);
  protectedRouter.delete("/:tb_institution_id/:id", orderstockadjust.delete);
/**
 * @swagger
 * /orderstockadjust/closure:
 *   post:
 *     summary: Close status Order StockAdjust
 *     tags: [OrderStockAdjust]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderStockAdOperation'
 *     responses:
 *       200:
 *         description: The OrderStockAdjust was closed
 *       201:
 *         description: The OrderStockAdjust is already closed
 *       404:
 *         description: The Order Transfer was notTransfer
 *       500:
 *         description: Some error happened
 */
  
  protectedRouter.post("/closure/", orderstockadjust.closure);
 /**
  * @swagger
  * /orderstockadjust/reopen:
  *   post:
  *     summary: Reopen Status Order StockAdjust
  *     tags: [OrderStockAdjust]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/OrderStockAdOperation'
  *     responses:
  *       200:
  *         description: The OrderStockAdjust was open
  *       201:
  *         description: The OrderStockAdjust is already open
  *       404:
  *         description: The Order Transfer was notTransfer
  *       500:
  *         description: Some error happened
  */
  //router.post("/reopen/", orderstockadjust.reopen);     
  protectedRouter.post("/reopen/", orderstockadjust.reopen);     
module.exports = router;