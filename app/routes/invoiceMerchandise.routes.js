const { Router } = require("express");
  
const invoiceMerchandise =  require("../endpoint/invoiceMerchandise.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     invoice_merchandise:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         dt_exit:
 *           type: string
 *         tm_exit:
 *           type: string
 *         base_icms_value:
 *           type: number
 *         icms_value:
 *           type: number
 *         base_icms_st_value:
 *           type: number
 *         icms_st_value:
 *           type: number
 *         total_value:
 *           type: number
 *         freight_value:
 *           type: number
 *         insurance_value:
 *           type: number
 *         expenses_value:
 *           type: number
 *         ipi_value:
 *           type: number
 *         discount_value:
 *           type: number
 *         total_qtty:
 *           type: number
 *         indPres:
 *           type: integer
 * 
 * 
 *     obj_invoice_merchandise:
 *       type: object
 *       properties:
 *         invoice:
 *           $ref: '#/components/schemas/invoice'
 *         invoicemerchandise:
 *           $ref: '#/components/schemas/invoice_merchandise'
 *         invoiceshipping:
 *           $ref: '#/components/schemas/invoice_shipping'
 *         itemicms:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/order_item_icms'
 *         itemipi:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/order_item_ipi'
 *         itempis:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/order_item_pis'
 *         itemcofins:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/order_item_cofins'
 *         itemii:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/order_item_ii'
 *         itemissqn:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/order_item_issqn'
 *         invoiceobs:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/invoice_obs'
 * 
 *  
 */
 
 
 /**
  * @swagger
  * tags:
  *   name: InvoiceMerchandise
  *   description: The Invoice Merchandise managing API
  */

 /**
 * @swagger
 * /invoicemerchandise/sync:
 *   post:
 *     summary: Create a new pricelist
 *     tags: [InvoiceMerchandise]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/objInvoiceMerchandise'
 *     responses:
 *       200:
 *         description: The objInvoiceMerchandise was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objInvoiceMerchandise'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", invoiceMerchandise.sync);


module.exports = router;