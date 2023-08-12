const { Router } = require("express");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     fiscal:
 *       type: object
 *       properties:
 *         objEntity:
 *           $ref: '#/components/schemas/objEntity' 
 *         person:
 *           $ref: '#/components/schemas/person'  
 *         company:
 *           $ref: '#/components/schemas/company'  
 *         noDocNumber:
 *           $ref: '#/components/schemas/noIdentify'  
 * 
 *     noIdentify:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         updated_at:   
 *           type: integer         
 *         reference:
 *           type: integer
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Fiscal
 *   description: The Fiscal managing API
 */

/**
 * @swagger
 * /fiscal:
 *   post:
 *     summary: Create a new fiscal entity
 *     tags: [Fiscal]
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/fiscal'
 *     responses:
 *       200:
 *         description: The Objeto Fiscal  was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/fiscal'
 *       500:
 *         description: Some server error
 */


module.exports = router;  