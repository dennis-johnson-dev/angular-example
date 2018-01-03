import "source-map-support/register";
import * as chalk from "chalk";

import { createApp } from "./app";

const port = process.env.PORT || 3010;
const app = createApp();

app.listen(port, () => {
  console.log(chalk.cyan(`app is listening on port ${port}`));
});
