/**
 * Load Module Dependencies.
 */
import * as Router from "koa-router";

import * as petController from "../controllers/exchange";

const router  = new Router();

/**
 * @api {post} /api/exchange Calcuate Exchange Rate
 * @apiVersion 1.0.0
 * @apiName Calculate
 * @apiGroup Exchange
 *
 * @apiDescription Calcuate the equivalent exchange rate between currencies
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
router.post('/', petController.create);

router.post('/:RFID', petController.getByRFID);

router.post('/:id', petController.getById);

router.post('/', petController.getAll);

// Expose Exchanger Router
module.exports = router;
