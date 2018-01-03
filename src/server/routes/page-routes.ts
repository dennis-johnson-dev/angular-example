import * as Router from "koa-router";

function getFilenames(page: string) {
  let fileNames = {};

  if (process.env.NODE_ENV === "production") {
    const prodFilenames = require("../resources/stats.json");
    fileNames = prodFilenames;
    fileNames = {
      page: prodFilenames[page],
      vendor: prodFilenames.vendor,
      runtime: prodFilenames.runtime
    };
  } else {
    fileNames = {
      page: {
        js: [`${page}.js`]
      }
    };
  }

  return fileNames;
}

export function initPageRoutes(router: Router) {
  router.get("/", async function root(ctx, next) {
    try {
      const fileNames = getFilenames("app");

      return await ctx.render("page", { fileNames });
    } catch (err) {
      console.log(err);
    }
  });
}
