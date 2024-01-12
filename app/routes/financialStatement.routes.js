const { Router } = require("express");
const financialStatement =  require("../endpoint/financialStatement.endpoint.js");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     financial_statement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         tb_bank_account_id:
 *           type: integer
 *         dt_record:
 *           type: integer
 *         tb_bank_historic_id:
 *           type: integer
 *         credit_value:
 *           type: number
 *         debit_value:
 *           type: number
 *         manual_history:
 *           type: string
 *         kind:
 *           type: string
 *         settled_code:
 *           type: integer
 *         tb_user_id:
 *           type: integer
 *         future:
 *           type: string
 *         dt_original:
 *           type: string
 *         doc_reference:
 *           type: string
 *         conferred:
 *           type: string
 *         tb_payment_types_id:
 *           type: integer
 *         tb_financial_plans_id_cre:
 *           type: integer
 *         tb_financial_plans_id_deb:
 *           type: integer
 * 
 * 
 */ 

/**
 * @swagger
 * tags:
 *   name: Financial Statement
 *   description: The Financial Statement managing API
 */

 /**
 * @swagger
 * /financialstatement/sync:
 *   post:
 *     summary: Create a new Financial Statement
 *     tags: [FinancialStatement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/financial_statement'
 *     responses:
 *       200:
 *         description: The Financial Statement was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/result_message'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", financialStatement.sync);

 module.exports = router;