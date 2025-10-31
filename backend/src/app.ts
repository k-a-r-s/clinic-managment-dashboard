import env from "./config/env";
import express from "express"
const app = express();

app.listen(env.PORT, () => {
  console.log(`app is listenning to the port ${env.PORT}`)
})
