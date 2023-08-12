const { Router } = require("express");
  
const ordersale =  require("../endpoint/orderSale.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     orderSale:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         number:
 *           type: integer
 *         dt_record:
 *           type: string
 *         tb_customer_id:
 *           type: integer
 *         name_customer:
 *           type: string
 *         doc_customer:
 *           type: string
 *         tb_salesman_id:
 *           type: integer
 *         name_salesman:
 *           type: string 
 *         doc_salesman:
 *           type: string 
 *         status:
 *           type: string 
 * 
 *     objOrderSale:
 *       type: object
 *       properties:
 *         order:
 *           $ref: '#/components/schemas/order'
 *         sale:
 *           $ref: '#/components/schemas/orderSale'
 *         billing:
 *           $ref: '#/components/schemas/orderBilling'
 *         totalizer:
 *           $ref: '#/components/schemas/orderTotalizer'
 *         items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/orderItems'
 *  
 *     orderDelete:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer 
 * 
 *  
 *     resultDelete:
 *       type: object
 *       properties:
 *         result:
 *           type: boolean
 */
 
 
 /**
  * @swagger
  * tags:
  *   name: OrderSale
  *   description: The OrderSale managing API
  */

 /**
 * @swagger
 * /ordersale/sync:
 *   post:
 *     summary: Create a new pricelist
 *     tags: [OrderSale]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/objOrderSale'
 *     responses:
 *       200:
 *         description: The objOrderSale was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objOrderSale'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", ordersale.sync);

/**
 * @swagger
 * /ordersale:
 *   post:
 *     summary: Create a new ordersale
 *     tags: [OrderSale]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/objOrderSale'
 *     responses:
 *       200:
 *         description: The OrderSale was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objOrderSale'
 *       500:
 *         description: Some server error
 */
 router.post("/", ordersale.create);

/**
 * @swagger
 * /ordersale:
 *   put:
 *     summary: Update a ordersale
 *     tags: [OrderSale]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/objOrderSale'
 *     responses:
 *       200:
 *         description: The OrderSale was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objOrderSale'
 *       500:
 *         description: Some server error
 */
  router.put("/", ordersale.update);

/**
 * @swagger
 * /ordersale:
 *   delete:
 *     summary: Delete a ordersale
 *     tags: [OrderSale]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/orderDelete'
 *     responses:
 *       200:
 *         description: The OrderSale was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/resultDelete'
 *       500:
 *         description: Some server error
 */
router.delete("/", ordersale.delete);

 /**
 * @swagger
 * /ordersale/getlist/{tb_institution_id}/{tb_salesman_id}:
 *   get:
 *     summary: Returns the list of all the OrderSale
 *     tags: [OrderSale]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_salesman_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The ordersale tb_institution_id and tb_order_id
 *     responses:
 *       200:
 *         description: The list of the OrderSale
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/orderSale'
 */
  //router.get("/getlist/:tb_institution_id", orderstocktransfer.getList);
  router.get("/getlist/:tb_institution_id/:tb_salesman_id/", ordersale.getList); 

/**
 * @swagger
 * /ordersale/get/{tb_institution_id}/{tb_order_id}:
 *   get:
 *     summary: Returns the OrderSaleMain
 *     tags: [OrderSale]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_order_id
 *     responses:
 *       200:
 *         description: The list of the OrderSaleMain
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objOrderSale'
 */  
  router.get("/get/:tb_institution_id/:tb_order_id/", ordersale.get); 

module.exports = router;