const { Router } = require("express");
  
const stock =  require("../endpoint/stock.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     stock:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - tb_merchandise_id
 *         - tb_package_id
 *         - tb_measure_id
 *         - tb_color_id
 *         - st
 *         - quantity
 *         - minimum
 *         - divisor
 *         - location
 *         - weight
 *         - width
 *         - length
 *         - height
 *         - cost_manufactures
 *         - actual_cost
 *         - cost_price
 *         - negative
 *         - outline
 * 
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         tb_merchandise_id:
 *           type: integer
 *         tb_package_id:
 *           type: integer
 *         tb_measure_id:
 *           type: integer
 *         tb_color_id:
 *           type: integer 
 *         st:
 *           type: string 
 *         quantity:
 *           type: number
 *         minimum:
 *           type: number 
 *         divisor:
 *           type: integer 
 *         location:
 *           type: string 
 *         weight:
 *           type: number
 *         width:
 *           type: number
 *         length:
 *           type: number
 *         height:
 *           type: number
 *         cost_manufactures:
 *           type: number
 *         actual_cost:
 *           type: number
 *         cost_price:
 *           type: number
 *         negative:
 *           type: string
 *         outline:
 *           type: string
 */

 /**
  * @swagger
  * tags:
  *   name: Stock
  *   description: The Stock List managing API
  */

/**
 * @swagger
 * /stockList/sync:
 *   post:
 *     summary: Sincronize Stock List
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/stock'
 *     responses:
 *       200:
 *         description: The Stock List was successfully sincronized 
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/stock'
 *       500:
 *         description: Some server error
 */
router.post("/sync/", stock.sync);

/**
 * @swagger
 * /stockList:
 *   post:
 *     summary: Create a new Stock List
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/stock'
 *     responses:
 *       200:
 *         description: The Stock List was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/stock'
 *       500:
 *         description: Some server error
 */
 router.post("/", stock.create);

 /**
 * @swagger
 * /stock/getlist/{tb_institution_id}:
 *  get:
 *    summary: Return stock by the id
 *    tags: [Stock]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id Institutionr
 *    responses:
 *      200:
 *        description: The Stock was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/stock'
 *      404:
 *        description: The stock was not found
 *      500:
 *        description: Some error happened
 */
router.get("/getlist/:tb_institution_id", stock.getList);
  
/**
 * @swagger
 * /stock/get/{tb_institution_id}/{id}:
 *  get:
 *    summary: Return stock by the id
 *    tags: [Stock]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The stock by tb_institution_id 
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The stock by id
 *    responses:
 *      200:
 *        description: The Stock was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/stock'
 *      404:
 *        description: The stock was not found
 *      500:
 *        description: Some error happened
 */
router.get("/get/:tb_institution_id/:id", stock.get);

 /**
 * @swagger
 * /stockList:
 *  put:
 *    summary: Update the Stock List by the id
 *    tags: [Stock]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/stock'
 *    responses:
 *      200:
 *        description: The Stock List was updated       
 *      404:
 *        description: The Stock List was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", stock.update);

/**
 * @swagger
 * /Stock/{id}:
 *  delete:
 *    summary: Delete the Stock List by the id
 *    tags: [Stock]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Stock List id
 *    responses:
 *      200:
 *        description: The Stock List was deleted
 *      404:
 *        description: The institution was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", stock.delete);

module.exports = router;  