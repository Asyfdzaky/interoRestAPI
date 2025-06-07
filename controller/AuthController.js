const supabase = require("../supabaseClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: "admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

exports.register = async (req, res) => {
  const { email, password, nama } = req.body;

  try {
    // Cek jika sudah ada admin dengan email tersebut
    const { data: existingAdmin } = await supabase
      .from("admin")
      .select("*")
      .eq("email", email)
      .single();

    if (existingAdmin) {
      return res.status(400).json({ error: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase.from("admin").insert([
      {
        email,
        password: hashedPassword,
        nama,
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "Admin berhasil didaftarkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registrasi gagal" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: admin, error } = await supabase
      .from("admin")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const token = generateToken(admin);

    res.json({
      message: "Login berhasil",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        nama: admin.nama,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login gagal" });
  }
};
