const { Router } = require("express");
  
const measure =  require("../endpoint/measure.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Measure:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - description
 *         - abbreviation
 *         - escale
 *         - active
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         description:
 *           type: string
 *         abbreviation:
 *           type: string 
 *         escale:
 *           type: string 
 *         active:
 *           type: string
 */

 /**
  * @swagger
  * tags:
  *   name: Measure
  *   description: The Measure managing API
  */

 /**
 * @swagger
 * /measure/sync:
 *   post:
 *     summary: Sincronize a new brand
 *     tags: [Measure]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Measure'
 *     responses:
 *       200:
 *         description: The Measure was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Measure'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", measure.sync);

/**
 * @swagger
 * /measure:
 *   post:
 *     summary: Create a new brand
 *     tags: [Measure]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Measure'
 *     responses:
 *       200:
 *         description: The Measure was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Measure'
 *       500:
 *         description: Some server error
 */
 router.post("/", measure.create);

 /**
 * @swagger
 * /measure/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the Brands
 *     tags: [Measure]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The brand tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Measure'
 */

router.get("/getlist/:tb_institution_id", measure.getList);
  
/**
 * @swagger
 * /measure/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the Measure
 *     tags: [Measure]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The brand by tb_institution_id and....
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The brand by id
 *     responses:
 *       200:
 *         description: The Measure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Measure'
 */

 router.get("/get/:tb_institution_id/:id", measure.get);
 /**
 * @swagger
 * /measure:
 *  put:
 *    summary: Update the brand by the id
 *    tags: [Measure]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Measure'
 *    responses:
 *      200:
 *        description: The Measure was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Measure'
 *      404:
 *        description: The brand was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", measure.update);

/**
 * @swagger
 * /brand/{id}:
 *  delete:
 *    summary: Delete the brand by the id
 *    tags: [Measure]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The brand id
 *    responses:
 *      200:
 *        description: The Measure was deleted
 *      404:
 *        description: The brand was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", measure.delete);

module.exports = router;