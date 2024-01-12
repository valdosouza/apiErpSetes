const { Router } = require("express");
  
const customer =  require("../endpoint/customer.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     customer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer 
 *         tb_salesman_id:
 *           type: integer
 *         salesman_name:
 *           type: string
 *         tb_carrier_id:
 *           type: integer  
 *         tb_sales_route_id:
 *           type: integer
 *         sales_route_name:
 *           type: string
 *         credit_status:
 *           type: string
 *         credit_value:
 *           type: number
 *           format: double
 *         Wallet:
 *           type: string
 *         consumer:
 *           type: string
 *         multiplier:
 *           type: number
 *           format: double
 *         by_pass_st:
 *           type: string
 *         active:
 *           type: string 
 * 
 *     objCustomer:
 *       type: object
 *       properties:
 *         customer:
 *           $ref: '#/components/schemas/customer'
 *         fiscal:
 *           $ref: '#/components/schemas/fiscal' 
 * 
 *             
 *     ListCustomer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name_company:
 *           type: string
 *         nick_trade:
 *           type: string
 *         doc_type:
 *           type: string
 *         doc_number:
 *           type: string
 * 
 * 
 *     customerParams:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         tb_institution_id:
 *           type: integer 
 *         id:
 *           type: integer
 *         name_customer:
 *           type: string 
 */

 /**
  * @swagger
  * tags:
  *   name: Customer
  *   description: The Customer managing API
  */

/**
 * @swagger
 * /customer/sync:
 *   post:
 *     summary: Sincronize a customer
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/objCustomer'
 *     responses:
 *       200:
 *         description: The Salesman was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objCustomer'
 *       500:
 *         description: Some server error
 */
router.post("/sync", customer.sync);

/**
 * @swagger
 * /customer:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/objCustomer'
 *     responses:
 *       200:
 *         description: The Customer was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListCustomer'
 *       500:
 *         description: Some server error
 */
 router.post("/", customer.save);

 /**
 * @swagger
 * /customer/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the list of all the customer
 *     tags: [Customer]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: id  
 *        required: true
 *        description: The id customer
 *     responses:
 *       200:
 *         description: The  customer
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/objCustomer'
 */
 router.get("/get/:tb_institution_id/:id", customer.getCustomer);
  
/**
 * @swagger
 * /customer/getlist/:
 *   post:
 *     summary: Returns the list of all the Customers
 *     tags: [Customer]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/customerParams'
 *     responses:
 *       200:
 *         description: The list of the customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ListCustomer'
 */

router.post("/getlist/", customer.getList);

 /**
 * @swagger
 * /customer/salesroute/getlist/{tb_institution_id}/{tb_sales_route_id}/{tb_salesman_id}:
 *   get:
 *     summary: Returns the list of all the Customer
 *     tags: [Customer]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true
 *      - in: path
 *        name: tb_sales_route_id
 *        required: true
 *      - in: path
 *        name: tb_salesman_id
 *        required: true
 *     responses:
 *       200:
 *         description: The list of Customer by Route e by Salesman
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ListCustomerByRoute'
 *       500:
 *         description: Some server error 
 */
 router.get("/salesroute/getlist/:tb_institution_id/:tb_sales_route_id/:tb_salesman_id", customer.getListSalesRoute);

/**
 * @swagger
 * /customer/salesman/getlist/{tb_institution_id}/{tb_salesman_id}:
 *   get:
 *     summary: Returns the list of all the Customer
 *     tags: [Customer]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: tb_salesman_id
 *        required: true
 *        description: The Customer List by tb_institution_id tb_salesman_id
 *     responses:
 *       200:
 *         description: The list of Customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ListCustomerBySalesRoute'
 *       500:
 *         description: Some server error 
 */
router.get("/salesman/getlist/:tb_institution_id/:tb_salesman_id", customer.getListBySalesman); 
/**
 * @swagger
 * /customer/{id}:
 *  delete:
 *    summary: Delete the customer by the id
 *    tags: [Customer]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The customer id
 *    responses:
 *      200:
 *        description: The customer was deleted
 *      404:
 *        description: The institution was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", customer.delete);

module.exports = router;  
