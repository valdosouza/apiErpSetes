const { Router } = require("express");

const salesman =  require("../endpoint/salesman.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     salesman:
 *       type: object
 *       properties:
 *         tb_institution_id:
 *           type: integer
 *         active:
 *           type: string 
 *         aliq_kickback:
 *           type: number
 *         kickback_product:
 *           type: number
 *         flex_value:
 *           type: number
 * 
 * 
 *     objSalesman:
 *       type: object
 *       properties:
 *         salesman:
 *           $ref: '#/components/schemas/salesman'  
 *         objCollaborador:
 *           $ref: '#/components/schemas/objCollaborator'   
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Salesman
 *   description: The Salesman managing API
 */


/**
 * @swagger
 * /salesman/sync:
 *   post:
 *     summary: Sincronize a salesman
 *     tags: [Salesman]
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/objSalesman'
 *     responses:
 *       200:
 *         description: The Salesman was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objSalesman'
 *       500:
 *         description: Some server error
 */
router.post("/sync", salesman.sync);

module.exports = router;  