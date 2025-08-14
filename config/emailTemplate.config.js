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
        <a class='something-class' href='https://lisa.com?uuid=${uuid}'>
            Klik di sini untuk melihat detil lisensi pada aplikasi Digio.
        </a> 
        <p>
            Hormat kami,
            DIGIO System Administrator
        </p> 
    `
}