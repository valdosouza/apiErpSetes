const { Router } = require("express"); 
const financial =  require("../endpoint/financial.endpoint.js");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     financial:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         tb_order_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         parcel:
 *           type: integer
 *         tag_value:
 *           type: number
 *         dt_expiration:
 *           type: string
 *         tb_payment_types_id:
 *           type: integer
 *         number:
 *           type: string
 *         kind:
 *           type: string
 *         situation:
 *           type: string
 *         operation:
 *           type: string
 *         stage:
 *           type: string
 *         tb_financial_plans_id:
 *           type: integer
 *
 *     obj_financial:
 *       type: object
 *       properties:
 *         financial:
 *           $ref: '#/components/schemas/financial'
 *         financial_payment:
 *           $ref: '#/components/schemas/financial_payment'
 * 
 * 
 *     FinancialListCustomerCharged:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name_customer:
 *           type: string
 *         time_attendace:
 *           type: string
 *         value_charged:
 *           type: number   
 * 
 * 
 */
 

 /**
  * @swagger
  * tags:
  *   name: Financial
  *   description: The Financial managing API
  */

 /**
 * @swagger
 * /financial/sync:
 *   post:
 *     summary: Create a new Financial
 *     tags: [Financial]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/obj_financial'
 *     responses:
 *       200:
 *         description: The Invoice was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/result_message'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", financial.sync);

 module.exports = router;