const { Router } = require("express");
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
 *         doc_issuer:
 *           type: string  
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
 *         doc_entity:
 *           type: string 
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

module.exports = router;