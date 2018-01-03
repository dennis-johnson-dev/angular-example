import * as koa from "koa";
import * as hbs from "koa-hbs";
import * as path from "path";
import * as Router from "koa-router";
import * as serve from "koa-static";

import { initPageRoutes } from "./routes/page-routes";

export const createApp = (): koa => {
  const app: koa = new koa();
  const router: Router = new Router();

  app.use(
    serve(path.resolve(__dirname, "./resources"), {
      maxage: 31536000000
    })
  );

  app.use(hbs.middleware({ viewPath: path.resolve(__dirname, "./views") }));

  initPageRoutes(router);

  app.use(router.routes());

  return app;
};
