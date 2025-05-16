require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const app = express();
const sekolahRoutes = require("../routes/Routes");

const swaggerDocument = YAML.load("swagger.yml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use("/api/sekolah", sekolahRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
module.exports = app;
