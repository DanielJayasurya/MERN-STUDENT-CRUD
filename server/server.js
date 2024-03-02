const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const mysql = require("mysql2/promise");
const appRoutes = require("./routes/allRoutes");
require("dotenv").config();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// DB connection
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
});


app.use((req, res, next) => {
  req.db = pool;
  next();
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Routes
app.use('/', appRoutes); 

