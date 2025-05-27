const supabase = require("../supabaseClient");

// Helper untuk handle error
const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({ error: error.message });
};

// GET ALL SCHOOLS
exports.getAll = async (req, res) => {
  try {
    const {
      data: schools,
      error,
      count,
    } = await supabase.from("sekolah").select(
      `
        *,
        alamat(*),
        kontak(*),
        lokasi(*)
      `,
      { count: "exact" } // 👉 ini penting untuk mengaktifkan count
    );

    if (error) throw error;

    res.json({
      total: count,
      data: schools,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// GET SINGLE SCHOOL BY NPSN
exports.getOne = async (req, res) => {
  const { npsn } = req.params;

  try {
    const { data: school, error: schoolError } = await supabase
      .from("sekolah")
      .select(
        `
        *,
        alamat(*),
        kontak(*),
        lokasi(*)
      `
      )
      .eq("npsn", npsn)
      .single();

    if (schoolError) throw schoolError;
    if (!school) return res.status(404).json({ error: "Data tidak ditemukan" });

    res.json(school);
  } catch (error) {
    handleError(res, error);
  }
};

// CREATE NEW SCHOOL (WITH RELATIONAL DATA)
exports.create = async (req, res) => {
  const {
    npsn,
    nama,
    bentukPendidikan,
    jalurPendidikan,
    jenjangPendidikan,
    kementerianPembina,
    statusSatuanPendidikan,
    akreditasi,
    jenisPendidikan,
    alamat,
    kontak,
    lokasi,
  } = req.body;

  try {
    // Begin transaction (important for relational data)
    const { data, error } = await supabase.rpc("create_school_with_relations", {
      p_npsn: npsn,
      p_nama: nama,
      p_bentuk_pendidikan: bentukPendidikan,
      p_jalur_pendidikan: jalurPendidikan,
      p_jenjang_pendidikan: jenjangPendidikan,
      p_kementerian_pembina: kementerianPembina,
      p_status_satuan_pendidikan: statusSatuanPendidikan,
      p_akreditasi: akreditasi,
      p_jenis_pendidikan: jenisPendidikan,
      p_alamat: alamat,
      p_kontak: kontak,
      p_lokasi: lokasi,
    });

    if (error) throw error;

    // Respond with success message and the created data
    res.status(201).json({
      message: "School data successfully created",
    });
  } catch (error) {
    handleError(res, error);
  }
};

// UPDATE SCHOOL
exports.update = async (req, res) => {
  const { npsn } = req.params;
  const {
    nama,
    bentukPendidikan,
    jalurPendidikan,
    jenjangPendidikan,
    kementerianPembina,
    statusSatuanPendidikan,
    akreditasi,
    jenisPendidikan,
    alamat,
    kontak,
    lokasi,
  } = req.body;

  try {
    // Update main school data
    const { data: schoolData, error: schoolError } = await supabase
      .from("sekolah")
      .update({
        nama,
        bentuk_pendidikan: bentukPendidikan,
        jalur_pendidikan: jalurPendidikan,
        jenjang_pendidikan: jenjangPendidikan,
        kementerian_pembina: kementerianPembina,
        status_satuan_pendidikan: statusSatuanPendidikan,
        akreditasi,
        jenis_pendidikan: jenisPendidikan,
      })
      .eq("npsn", npsn);

    if (schoolError) throw schoolError;

    // Update related tables
    const updatePromises = [];

    if (alamat) {
      updatePromises.push(
        supabase.from("alamat").update(alamat).eq("npsn", npsn)
      );
    }

    if (kontak) {
      updatePromises.push(
        supabase.from("kontak").update(kontak).eq("npsn", npsn)
      );
    }

    if (lokasi) {
      updatePromises.push(
        supabase.from("lokasi").update(lokasi).eq("npsn", npsn)
      );
    }

    const results = await Promise.all(updatePromises);
    const errors = results.filter((r) => r.error);

    if (errors.length > 0) throw errors[0].error;

    res.json({
      message: "Data berhasil diupdate",
      npsn,
      ...schoolData,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// DELETE SCHOOL
exports.delete = async (req, res) => {
  const { npsn } = req.params;

  try {
    // Delete related records first
    const { error: alamatError } = await supabase
      .from("alamat")
      .delete()
      .eq("npsn", npsn);

    const { error: kontakError } = await supabase
      .from("kontak")
      .delete()
      .eq("npsn", npsn);

    const { error: lokasiError } = await supabase
      .from("lokasi")
      .delete()
      .eq("npsn", npsn);

    // Then delete main record
    const { error: schoolError } = await supabase
      .from("sekolah")
      .delete()
      .eq("npsn", npsn);

    if (alamatError || kontakError || lokasiError || schoolError) {
      throw new Error("Gagal menghapus data");
    }

    res.json({ message: "Data berhasil dihapus", npsn });
  } catch (error) {
    handleError(res, error);
  }
  //buat fitur untuk filter data sekolah berdasarkan tingkat pendidikan
};
exports.filterByJenjang = async (req, res) => {
  const { jenjang } = req.query;

  if (!jenjang) {
    return res.status(400).json({ error: "Parameter 'jenjang' wajib diisi" });
  }

  try {
    const {
      data: filteredSchools,
      error,
      count,
    } = await supabase
      .from("sekolah")
      .select(
        `
      *,
      alamat(*),
      kontak(*),
      lokasi(*)
    `,
        { count: "exact" }
      )
      .eq("jenjang_pendidikan", jenjang); // filter jenjang

    if (error) throw error;

    res.json({
      total: count,
      data: filteredSchools,
    });
  } catch (error) {
    handleError(res, error);
  }
};
