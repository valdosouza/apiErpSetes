const { Router } = require("express");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     invoiceObs:
 *       type: object
 *       properties:
 *         tb_order_id:
 *           type: integer
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         tb_invoice_id:
 *           type: integer
 *         kind:
 *           type: string
 *         obs:
 *           type: string
 *  
 * 
 */
 
 
/**
* @swagger
* tags:
*   name: InvoiceObs
*   description: The InvoiceObs managing API
*/


module.exports = router;