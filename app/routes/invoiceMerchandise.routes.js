const { Router } = require("express");
  
const invoiceMerchandise =  require("../endpoint/invoiceMerchandise.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     invoicemerchandise:
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
 *     objInvoiceMerchandise:
 *       type: object
 *       properties:
 *         invoice:
 *           $ref: '#/components/schemas/invoice'
 *         invoicemerchandise:
 *           $ref: '#/components/schemas/invoicemerchandise'
 *         invoiceshipping:
 *           $ref: '#/components/schemas/invoiceshipping'
 *         itemicms:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/orderItemIcms'
 *         itemipi:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/orderItemIpi'
 *         itempis:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/orderItemPis'
 *         itemcofins:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/orderItemCofins'
 *         itemii:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/orderItemIi'
 *         itemissqn:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/orderItemIssqn'
 *         invoiceobs:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/invoiceObs'
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