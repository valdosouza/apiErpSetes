const { Router } = require("express");
  
const product =  require("../endpoint/product.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     product:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - identifier
 *         - description
 *         - tb_category_id
 *         - tb_financial_plans_id
 *         - promotion
 *         - highlights
 *         - active
 *         - published
 *         - note
 * 
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         identifier:
 *           type: string
 *         description:
 *           type: string
 *         tb_category_id:
 *           type: integer
 *         tb_financial_plans_id:
 *           type: integer 
 *         promotion:
 *           type: string
 *         highlights:
 *           type: string 
 *         active:
 *           type: string
 *         published:
 *           type: string
 *         note:
 *           type: string 
 * 
 *     priceListPrice:
 *       type: object
 *       required:
 *         - tb_price_list_id
 *         - price_tag
 *       properties:  
 *         tb_price_list_id:
 *           type: integer
 *         name_price_list:
 *           type: string
 *         price_tag:
 *           type: number
 * 
 *     productMain:
 *       type: object
 *       properties:
 *         product:
 *           $ref: '#/components/schemas/product'
 *         priceilist:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/priceListPrice'
 * 
 *     productPrice:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name_product:
 *           type: string
 *         price_tag:
 *           type: number 
 * 
 *     priceListproductPrice:
 *       type: object
 *       properties:
 *         tb_price_list_id:
 *           type: integer
 *         name_price_list:
 *           type: string
 *         product_price:
 *           type: array
 *           items: 
 *             $ref: '#/components/schemas/productPrice' 
 * 
 *     productParams:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         tb_institution_id:
 *           type: integer 
 *         id:
 *           type: integer
 *         name_product:
 *           type: string
 *
 *     productPriceList:
 *       type: object
 *       properties:
 *         tb_institution_id:
 *           type: integer 
 *         id:
 *           type: integer
 *         name_product:
 *           type: string
 *         product_price:
 *           type: array
 *           items: 
 *             $ref: '#/components/schemas/priceProduct' 
 * 
 *     priceProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name_price_list:
 *           type: string
 *         price_tag:
 *           type: number
 * 
 * 
 */

 /**
  * @swagger
  * tags:
  *   name: Product
  *   description: The Product managing API
  */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductMain'
 *     responses:
 *       200:
 *         description: The Product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductMain'
 *       500:
 *         description: Some server error
 */
 router.post("/", product.create);

 /**
 * @swagger
 * /product/getlist/:
 *   post:
 *     summary: Returns the list of all the Products
 *     tags: [Product]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/productParams'
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

router.post("/getlist/", product.getList);
  
/**
 * @swagger
 * /product/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the Product
 *     tags: [Product]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product by tb_institution_id and....
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product by id
 *     responses:
 *       200:
 *         description: The Product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductMain'
 */
 router.get("/get/:tb_institution_id/:id", product.get);


/**
 * @swagger
 * /product/getPrices/{tb_institution_id}/{tb_product_id}:
 *   get:
 *     summary: Returns the Product List Prices
 *     tags: [Product]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_product_id
 *     responses:
 *       200:
 *         description: The Product List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/productPriceList'
 *
 *
 */
router.get("/getPrices/:tb_institution_id/:tb_product_id", product.getPriceByProduct);
 
/**
 * @swagger
 * /product/pricelist/getall/{tb_institution_id}:
 *   get:
 *     summary: Returns the List os PriceList and Products
 *     tags: [Product]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product and price by tb_institution_id 
 *     responses:
 *       200:
 *         description: The Product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/priceListproductPrice'
 */

router.get("/pricelist/getall/:tb_institution_id/", product.priceListGetAll);

 /**
 * @swagger
 * /product:
 *  put:
 *    summary: Update the product by the id
 *    tags: [Product]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ProductMain'
 *    responses:
 *      200:
 *        description: The Product was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductMain'
 *      404:
 *        description: The product was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", product.update);

/**
 * @swagger
 * /product/{id}:
 *  delete:
 *    summary: Delete the product by the id
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product id
 *    responses:
 *      200:
 *        description: The Product was deleted
 *      404:
 *        description: The product was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", product.delete);

module.exports = router;