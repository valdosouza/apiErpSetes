const { Router } = require("express");
  
const orderstockadjust =  require("../endpoint/orderStockAdjust.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     orderStockAdjust:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         number:
 *           type: integer
 *         tb_entity_id:
 *           type: integer
 *         name_entity:
 *           type: string
 *         doc_entity:
 *           type: string 
 *         tb_stock_list_id:
 *           type: integer 
 *         name_stock_list:
 *           type: string
 *         direction:
 *           type: string
 * 
 * 
 *     objOrderStockAdjust:
 *       type: object
 *       properties:
 *         order:
 *           $ref: '#/components/schemas/order'
 *         stock_adjust:
 *           $ref: '#/components/schemas/orderStockAdjust'
 *         totalizer:
 *           $ref: '#/components/schemas/orderTotalizer'
 *         items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/orderItems'
 *  
 */
 
 
 
/**
* @swagger
* tags:
*   name: OrderStockAdjust
*   description: The OrderStockAdjust managing API
*/

 /**
 * @swagger
 * /orderstockadjust/sync:
 *   post:
 *     summary: Create a new pricelist
 *     tags: [OrderStockAdjust]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/objOrderStockAdjust'
 *     responses:
 *       200:
 *         description: The objOrderStockAdjust was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objOrderStockAdjust'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", orderstockadjust.sync);

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
 *             $ref: '#/components/schemas/objOrderStockAdjust'
 *     responses:
 *       200:
 *         description: The OrderStockAdjust was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objOrderStockAdjust'
 *       500:
 *         description: Some server error
 */
  //router.post("/", orderstockadjust.create);
  protectedRouter.post("/", orderstockadjust.create);

 /**
 * @swagger
 * /orderstockadjust/getlist/:
 *   post:
 *     summary: Returns the list of all the OrderStockTransfer
 *     tags: [OrderStockAdjust]
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
  protectedRouter.post("/getlist/", orderstockadjust.getList); 

/**
 * @swagger
 * /orderstockadjust/get/{tb_institution_id}/{tb_user_id}/{tb_order_id}:
 *   get:
 *     summary: Returns the OrderStockAdjust
 *     tags: [OrderStockAdjust]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_user_id
 *      - in: path
 *        name: tb_order_id
 *     responses:
 *       200:
 *         description: The OrderStockAdjust
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objOrderStockAdjust'
 */
  router.get("/get/:tb_institution_id/:tb_user_id/:tb_order_id", orderstockadjust.get);
  
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
 *            $ref: '#/components/schemas/objOrderStockAdjust'
 *    responses:
 *      200:
 *        description: The OrderStockAdjust was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/objOrderStockAdjust'
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
 *             $ref: '#/components/schemas/orderAction'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/orderResulAction'
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
  *             $ref: '#/components/schemas/orderAction'
  *     responses:
  *       200:
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/orderResulAction'
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