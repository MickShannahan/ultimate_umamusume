import { umasService } from "../services/UmasService.js";
import BaseController from "../utils/BaseController.js";


export class UmasController extends BaseController {
  constructor() {
    super('api/umas')
    this.router
      .get('', this.getAllUmas)
      .get('/:umaId', this.getOneUma)
  }

  async getAllUmas(req, res, next) {
    try {
      const umas = await umasService.getAllUmas()
      return res.send(umas)
    } catch (error) {
      next(error)
    }
  }

  async getOneUma(req, res, next) {
    try {
      const uma = await umasService.getOneUma(req.params.umaId)
      return res.send(uma)
    } catch (error) {
      next(error)
    }
  }
}