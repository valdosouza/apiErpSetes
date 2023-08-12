const { Router } = require("express");
  
const orderpurchase =  require("../endpoint/orderPurchase.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     orderPurchase:
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
 *         tb_provider_id:
 *           type: integer
 *         name_provider:
 *           type: string
 *         doc_provider:
 *           type: string 
 *         approved:
 *           type: string
 * 
 * 
 *     objOrderPurchase:
 *       type: object
 *       properties:
 *         order:
 *           $ref: '#/components/schemas/order'
 *         purchase:
 *           $ref: '#/components/schemas/orderPurchase'
 *         billing:
 *           $ref: '#/components/schemas/orderBilling'
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
  *   name: OrderPurchase
  *   description: The OrderPurchase managing API
  */

 /**
 * @swagger
 * /orderpurchase/sync:
 *   post:
 *     summary: Create a new pricelist
 *     tags: [OrderPurchase]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/objOrderPurchase'
 *     responses:
 *       200:
 *         description: The objOrderPurchase was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objOrderPurchase'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", orderpurchase.sync);

/**
 * @swagger
 * /orderpurchase:
 *   post:
 *     summary: Create a new order purchase
 *     tags: [OrderPurchase]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/objOrderPurchase'
 *     responses:
 *       200:
 *         description: The objOrderPurchase was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objOrderPurchase'
 *       500:
 *         description: Some server error
 */
 router.post("/", orderpurchase.create);

 

module.exports = router;