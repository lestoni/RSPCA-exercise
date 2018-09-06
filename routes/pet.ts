/**
 * Load Module Dependencies.
 */
import Router from "koa-router";

import petController from "../controllers/pet";

const router  = new Router();

/**
 * @api {post} /api/pet Calcuate Exchange Rate
 * @apiVersion 1.0.0
 * @apiName Calculate
 * @apiGroup Exchange
 *
 * @apiDescription Calcuate the equivalent pet rate between currencies
 *
 * @apiParam {String} from_currency Currency Converting From
 * @apiParam {String} to_currency Currency Converting To
 * @apiParam {Number} amount Currency Amount
 *
 * @apiParamExample Request Example:
 *  {
 *    "from_currrency": "EUR",
 *    "to_currency": "USD",
 *    "amount": 100.0
 *  }
 *
 * @apiSuccess {Number} value Exchange Rate Value
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "equivalent" : 129.00
 *  }
 *
 */
router.post('/', petController.addPet);

router.get('/', petController.getPets);

router.get('/:id', petController.getPet);

// Expose Pet Router
export default router;
