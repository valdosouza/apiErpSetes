const { Router } = require("express");
  
const price =  require("../endpoint/price.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     price:
 *       type: object
 *       required:
 *         - tb_institution_id
 *         - tb_price_list_id
 *         - tb_product_id
 *         - price_tag
 *         - aliq_profit
 *         - aliq_kickback
 *         - quantity
 *  
 *       properties:
 *         tb_institution_id:
 *           type: integer
 *         tb_price_list_id:
 *           type: integer
 *         tb_product_id:
 *           type: integer
 *         price_tag:
 *           type: number 
 *         aliq_profit:
 *           type: number
 *         aliq_kickback:
 *           type: number 
 *         quantity:
 *           type: number
 * 
 * 
 */

 /**
  * @swagger
  * tags:
  *   name: Price
  *   description: The Price managing API
  */

 /**
 * @swagger
 * /price/sync:
 *   post:
 *     summary: Create a new price
 *     tags: [Price]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/price'
 *     responses:
 *       200:
 *         description: The Price was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/price'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", price.sync);

/**
 * @swagger
 * /price:
 *   post:
 *     summary: Create a new price
 *     tags: [Price]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/price'
 *     responses:
 *       200:
 *         description: The Price was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/price'
 *       500:
 *         description: Some server error
 */
 router.post("/", price.create);

 /**
 * @swagger
 * /price/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the Prices
 *     tags: [Price]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The price tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/price'
 */

router.get("/getlist/:tb_institution_id", price.getList);
  
/**
 * @swagger
 * /price/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the Price
 *     tags: [Price]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The price by tb_institution_id and....
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The price by id
 *     responses:
 *       200:
 *         description: The Price
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/price'
 */

 router.get("/get/:tb_institution_id/:id", price.get);
 /**
 * @swagger
 * /price:
 *  put:
 *    summary: Update the price by the id
 *    tags: [Price]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/price'
 *    responses:
 *      200:
 *        description: The Price was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/price'
 *      404:
 *        description: The price was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", price.update);

/**
 * @swagger
 * /price/{id}:
 *  delete:
 *    summary: Delete the price by the id
 *    tags: [Price]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The price id
 *    responses:
 *      200:
 *        description: The Price was deleted
 *      404:
 *        description: The price was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", price.delete);

module.exports = router;