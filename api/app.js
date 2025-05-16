require("dotenv").config();
const express = require("express");
const app = express();
const sekolahRoutes = require("../routes/Routes");

app.use(express.json());
app.use("/api/sekolah", sekolahRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
