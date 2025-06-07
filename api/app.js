require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const app = express();
const sekolahRoutes = require("../routes/Routes");
const path = require("path");

// const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API Sekolah",
    version: "1.0.0",
    description: "Dokumentasi API Sekolah",
  },
  paths: {
    "/api/sekolah": {
      get: {
        summary: "Ambil semua sekolah",
        responses: {
          200: {
            description: "Daftar sekolah berhasil didapatkan",
          },
        },
      },
      post: {
        summary: "Tambah sekolah baru",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  npsn: { type: "string" },
                  nama: { type: "string" },
                  // Tambah properti lainnya sesuai kebutuhan
                },
                required: ["npsn", "nama"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Sekolah berhasil dibuat",
          },
        },
      },
    },
    "/api/sekolah/{npsn}": {
      get: {
        summary: "Ambil sekolah berdasarkan NPSN",
        parameters: [
          {
            name: "npsn",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Sekolah ditemukan",
          },
          404: {
            description: "Sekolah tidak ditemukan",
          },
        },
      },
      put: {
        summary: "Update data sekolah",
        parameters: [
          {
            name: "npsn",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nama: { type: "string" },
                  // properti lain sesuai kebutuhan
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Data berhasil diupdate" },
        },
      },
      delete: {
        summary: "Hapus sekolah berdasarkan NPSN",
        parameters: [
          {
            name: "npsn",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Sekolah berhasil dihapus" },
        },
      },
    },
  },
};

app.use(
  "/api/sekolah/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use(express.json());
app.use("/api/sekolah", sekolahRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
module.exports = app;
