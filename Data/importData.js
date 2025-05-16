const supabase = require("../supabaseClient");
const fs = require("fs");
// Baca file DATA.json
const rawData = fs.readFileSync("./Data/done.json");
const sekolahArray = JSON.parse(rawData);
async function importData() {
  for (const item of sekolahArray) {
    const { npsn, nama, alamat, kontak, lokasi } = item;

    const { error } = await supabase.rpc("create_school_with_relations", {
      p_npsn: npsn,
      p_nama: nama,
      p_bentuk_pendidikan: item.bentukPendidikan,
      p_jalur_pendidikan: item.jalurPendidikan,
      p_jenjang_pendidikan: item.jenjangPendidikan,
      p_kementerian_pembina: item.kementerianPembina,
      p_status_satuan_pendidikan: item.statusSatuanPendidikan,
      p_akreditasi: item.akreditasi,
      p_jenis_pendidikan: item.jenisPendidikan,
      p_alamat: alamat,
      p_kontak: kontak,
      p_lokasi: {
        lintang: lokasi.lintang,
        bujur: lokasi.bujur,
      },
    });

    if (error) {
      console.error(`❌ Gagal import ${npsn}: ${error.message}`);
    } else {
      console.log(`✅ Berhasil import NPSN ${npsn}`);
    }
  }
}

importData();
