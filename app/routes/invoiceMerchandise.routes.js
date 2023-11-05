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
 *         invoice_merchandise:
 *           $ref: '#/components/schemas/invoice_merchandise'
 *         invoice_shipping:
 *           $ref: '#/components/schemas/invoice_shipping'
 *         items_icms:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/items_icms'
 *         items_ipi:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/items_ipi'
 *         items_pis:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/items_pis'
 *         items_cofins:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/items_cofins'
 *         items_ii:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/items_ii'
 *         items_issqn:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/items_issqn'
 *         invoice_obs:
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
 *     summary: Create a new Invoice Merchandise
 *     tags: [InvoiceMerchandise]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/obj_invoice_merchandise'
 *     responses:
 *       200:
 *         description: The objInvoiceMerchandise was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/result_message'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", invoiceMerchandise.sync);


module.exports = router;