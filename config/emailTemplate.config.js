exports.body = (data, uuid) => {
    return `
        <p>
            Selamat pagi/siang/sore Bapak/Ibu
            Reminder perpanjangan lisensi sebagai berikut
        <ol type="1">
            ${data}
        </ol>
        Demikian disampaikan atas perhatian dan kerjasamanya kami ucapkan terima kasih. 
        </p>
        OPSI 1
        <a class='something-class' href='https://lisa.com?uuid=${uuid}'>
        LIHAT DISINI
        </a> 
        <p>
            Team DIGIO
        </p> 
    `
}