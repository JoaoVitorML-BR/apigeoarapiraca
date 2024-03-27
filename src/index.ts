const bodyParser = require('body-parser');
const express = require("express");
export const app = express();
const cors = require("cors");

const routers = require("./routes/routes");
import Server from './server/server';

import dotenv from 'dotenv';

dotenv.config();

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use("/", routers);

Server();