const express = require('express');
const  cashier = require('../endpoint/cashier.endpoint.js');
const { withJWTAuthMiddleware } = require('express-kun');
const router = express.Router();
const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

/**
 * @swagger
 * components:
 *   schemas:
 *     cashier:
 *       type: object
 *       properties:
 *         id:
 *           type: integer 
 *         tb_institution_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         tb_user_id:
 *           type: integer
 *         dt_record:
 *           type: string 
 *         hr_begin:
 *           type: string 
 *         hr_end:
 *           type: string 
 *         items:
 *           $ref: '#/components/schemas/cashierItems'  
 * 
 *     cashierItems:
 *       type: object
 *       properties:
 *         tb_cashier_id:
 *           type: integer
 *         kind:
 *           type: string
 *         tb_payment_types_id:
 *           type: integer
 *         name_payment:
 *           type: string
 *         set_value:
 *           type: number
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Cashier
 *   description: The Persons managing API
 */

/**
 * @swagger
 * /cashier/sync:
 *   post:
 *     summary: Sincronize a cashier
 *     tags: [Cashier]
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/cashier'
 *     responses:
 *       200:
 *         description: The cashier was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/cashier'
 *       500:
 *         description: Some server error
 */
router.post("/sync", cashier.sync);


module.exports = router;  