exports.licenses = (req) => {
    let state = false;
    const { name, start_date, end_date, volume, satuan, harga_satuan, jumlah, username, password } = req.body;
    switch (true) {
        case name === null:
        case start_date === null:
        case end_date === null:
        case volume === null:
        case satuan === null:
        case harga_satuan === null:
        case jumlah === null:
        case username === null:
        case password === null:
        case name === "":
        case start_date === "":
        case end_date === "":
        case volume === "":
        case satuan === "":
        case harga_satuan === "":
        case jumlah === "":
        case username === "":
        case password === "":
            state = false; break;
        default: state = true; break;
    }
    return state;
}

exports.iframeClient = (req) => {
    const { site_name, is_revoked } = req.body;
    let state = false;
    switch (true) {
        case site_name === null:
        case is_revoked === null:
        case site_name === "":
        case is_revoked === "":
            state = false; break;
        default: state = true; break;
    }
    return state;
}

exports.emailRecepient = (req) => {
    const { name, email, email_type } = req.body;
    let state = false;
    console.log(email.email);
    switch (true) {
        case name === null:
        case email === null:
        case email_type === null:
        case name === "":
        case email === "":
        case email_type === "":
            state = false; break;
        case email.includes(" "):
            state = false; break;
        default: state = true; break;
    }
    return state;
}