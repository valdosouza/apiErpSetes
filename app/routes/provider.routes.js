const { Router } = require("express");
  
const provider =  require("../endpoint/provider.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     provider:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer 
 *         active:
 *           type: string 
 * 
 *     objProvider:
 *       type: object
 *       properties:
 *         customer:
 *           $ref: '#/components/schemas/provider'
 *         fiscal:
 *           $ref: '#/components/schemas/fiscal' 
 * 
 *             
 *     ListProvider:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name_company:
 *           type: string
 *         nick_trade:
 *           type: string
 *         doc_kind:
 *           type: string
 *         doc_number:
 *           type: string
 * 
 */

 /**
  * @swagger
  * tags:
  *   name: Provider
  *   description: The Provider managing API
  */

/**
 * @swagger
 * /provider/sync:
 *   post:
 *     summary: Sincronize a provider
 *     tags: [Provider]
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/objProvider'
 *     responses:
 *       200:
 *         description: The Provider was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objProvider'
 *       500:
 *         description: Some server error
 */
router.post("/sync", provider.sync);


module.exports = router;  

