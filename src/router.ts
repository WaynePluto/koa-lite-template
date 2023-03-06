import Router from "./libs/router";
import { initCompanyRoute } from "./modules/company/controller";
import { initUserRoute } from "./modules/user/controller";

export const router = new Router();

export function initRouter(){
  initCompanyRoute()
  initUserRoute()
  // other routes...
  return router.init()
}

