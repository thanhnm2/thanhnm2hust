const express = require("express");
const app = express(),
  bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSetting = require("./config/swagger.json"); 
const errorHandler = require("./middleware/error-handler");
const db = require("./config/db/connectionDAO");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3001;
const options = {
  explorer: true
};

// swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSetting, options)
);

app.get("/", (req, res) =>
  res.status(200).send({ message: "Welcome to base api" })
);

// api routes
app.use("/auth", require("./routes/auth.router"));
//admin
app.use("/user", require("./routes/user.router"));
// global error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  // Connect to DB
  await db.connect();
  console.log(`Node server running @ http://localhost:${PORT}`);
});
