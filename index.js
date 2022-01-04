const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require('path');
const router = require("./routers/main");
const cors = require('cors');
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
require("./helpers/database/database");
app.use(express.json());
app.use(cors());

dotenv.config({
    path: "./config/env/config.env"
});
const { PORT } = process.env;

app.use("/api", router);
app.use(customErrorHandler);
app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
    console.log(`server ${PORT} portunda çalışıyor -- ${process.env.NODE_ENV}`)
});