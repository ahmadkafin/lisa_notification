const { faker } = require('@faker-js/faker');
const moment = require('moment')
const now = moment().format("YYYY-MM-DD");
const Licenses = () => {
    const volume = faker.number.int({ min: 1, max: 100 });
    const harga_satuan = parseInt(faker.commerce.price({ min: 1000, max: 100000 }));
    return {
        uuid: faker.string.uuid(),
        name: faker.commerce.product(),
        start_date: now,
        end_date: moment().add(1, 'years').format("YYYY-MM-DD"),
        volume: volume,
        satuan: "unit",
        harga_satuan: harga_satuan,
        jumlah: volume * harga_satuan,
        username: faker.internet.username(),
        password: faker.internet.password(),
        lokasi_lisensi: faker.location.city(),
        description: faker.lorem.paragraph(),
        last_user_input: "ahmad.kafin"
    };
}


module.exports = { Licenses }