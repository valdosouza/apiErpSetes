const { Router } = require("express");
  
const merchandise =  require("../endpoint/merchandise.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     merchandise:
 *       type: object
 *       required: 
 *         - id
 *         - tb_institution_id
 *         - id_internal
 *         - id_provider
 *         - ncm
 *         - cest
 *         - kind_tributary
 *         - source
 *         - kind
 *         - tb_brand_id
 *         - print
 *         - controlseries
 *         - exclusive_dealer
 *         - application
 *         - composition
 * 
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         id_internal:
 *           type: string
 *         id_provider:
 *           type: string
 *         ncm:
 *           type: string
 *         cest:
 *           type: string
 *         kind_tributary:
 *           type: string
 *         source:
 *           type: string
 *         kind:
 *           type: string
 *         tb_brand_id:
 *           type: integer
 *         print:
 *           type: string
 *         controlseries:
 *           type: string
 *         exclusive_dealer:
 *           type: string
 *         application:
 *           type: string
 *         composition:
 *           type: string
 * 
 * 
 *     merchandiseMain:
 *       type: object
 *       properties:
 *         Product:
 *           $ref: '#/components/schemas/product'
 *         Merchandise:
 *           $ref: '#/components/schemas/merchandise' 
 *         Stock:
 *           $ref: '#/components/schemas/stock'  
 * 
 *
 */

 /**
  * @swagger
  * tags:
  *   name: Merchandise
  *   description: The Merchandise managing API
  */

/**
 * @swagger
 * /merchandise/sync:
 *   post:
 *     summary: Sincronize a merchandise
 *     tags: [Merchandise]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MerchandiseMain'
 *     responses:
 *       200:
 *         description: The Product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Merchandise'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", merchandise.sync);

module.exports = router;