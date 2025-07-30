exports.licenses = (req, uuid) => {
    const { name,
        start_date,
        end_date,
        volume,
        satuan,
        harga_satuan,
        username,
        password,
        lokasi_lisensi,
        description,
        last_user_input } = req.body;
    return {
        uuid: uuid,
        name: name,
        start_date: start_date,
        end_date: end_date,
        volume: volume,
        satuan: satuan,
        harga_satuan: harga_satuan,
        jumlah: parseInt(volume * harga_satuan),
        username: username,
        password: password,
        lokasi_lisensi: lokasi_lisensi,
        description: description,
        last_user_input: last_user_input,
    }
}

exports.historyLicenses = (data, uuid) => {
    return {
        uuid: uuid,
        licenses_uuid: data.uuid,
        harga_satuan: data.harga_satuan,
        tanggal: data.start_date,
        description: data.description,
        last_user_input: data.last_user_input,
    }
}

exports.iframeClient = (data, uuid) => {
    return {
        uuid: uuid,
        site_name: data.site_name,
        redirect: data.redirect,
        is_revoked: data.is_revoked,
    }
}