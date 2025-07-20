exports.body = (data) => {
    return `
        <p>
            Selamat pagi/siang/sore Bapak/Ibu
            Reminder perpanjangan lisensi sebagai berikut
        <ol type="1">
            ${data}
        </ol>
        Demikian disampaikan atas perhatian dan kerjasamanya kami ucapkan terima kasih. 
        </p>
        <p>
            Team DIGIO
        </p> 
    `
}