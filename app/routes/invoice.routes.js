const { Router } = require("express");
const invoice =  require("../endpoint/invoice.endpoint.js");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     invoice:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         issuer:
 *           type: integer
 *         issuer_external_code:
 *           type: integer  
 *         kind_emis:
 *           type: string
 *         finality:
 *           type: string
 *         number:
 *           type: string
 *         serie:
 *           type: string
 *         tb_cfop_id:
 *           type: string
 *         tb_entity_id:
 *           type: integer
 *         entity_external_code:
 *           type: integer 
 *         dt_emission:
 *           type: string
 *         value:
 *           type: number
 *         model:
 *           type: string
 *         note:
 *           type: string
 *         status:
 *           type: string
 * 
 *  
 */

 
 /**
 * @swagger
 * tags:
 *   name: Invoice
 *   description: The Invoice managing API
 */

 /**
 * @swagger
 * /invoice/sync:
 *   post:
 *     summary: Create a new Invoice
 *     tags: [Invoice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/invoice'
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
 router.post("/sync/", invoice.sync);

module.exports = router;