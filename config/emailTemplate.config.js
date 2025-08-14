exports.body = (data, uuid) => {
    return `
        <p>
            Dengan Hormat,
            Berdasarkan data yang ada pada sistem, lisensi di bawah ini akan kadaluarsa. Keterlambatan dalam melakukan perpanjangan lisensi berpotensi mengakibatkan kegagalan akses pada seluruh sistem dan aplikasi Sistem Informasi Infrastruktur yang berbasis lisensi tersebut.
            Adapun detil lisensi tersebut adalah sebagai berikut:
        <ol type="1" style="margin:0; padding-left:20px;">
            ${data}
        </ol>
        Demikian disampaikan atas perhatian dan kerjasamanya kami ucapkan terima kasih. 
        </p>
        <div style="text-align:center; margin:20px 0;">
            <a href="https://digio.pgn.co.id/lisa?uuid=${uuid}" 
            style="
                display:inline-block;
                background-color:#007BFF;
                color:#ffffff;
                padding:10px 20px;
                border-radius:5px;
                text-decoration:none;
                font-weight:bold;
            ">
            Klik di sini untuk melihat detil lisensi pada aplikasi Digio
            </a>
        </div>
        <p>
            Hormat kami,
            DIGIO System Administrator
        </p> 
    `
}