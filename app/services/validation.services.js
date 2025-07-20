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