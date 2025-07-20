# 📦 Lisa Notification

> REST API server menggunakan Node.js + Express, dengan fitur [CRUD lisensi, reminder otomatis via cron].

---

## 🚀 Features

- ✅ RESTful API menggunakan Express.js
- ✅ Sequelize ORM + Database (SQL Server)
- ✅ Cron job untuk jadwal otomatis (node-cron)
- ✅ Email reminder (nodemailer)
- ✅ .env configuration

---

## 📁 Project Structure

app/
├── controllers/
├── middleware/
├── models/
├── response/
├── routes/
├── services/
└── utils/
config/
.env
server.js
README.md
cron.json

## 🔧 Installation

```bash
git clone https://github.com/username/project-name.git
cd project-name
npm install
```

## 🧪 Running the app

### Start development mode

```bash
npm start / nodemon server.js
```

### Start production mode

```bash
pm2 start server.js
```

## 🛠️ Built With

Node.js
Express.js
Sequelize
node-cron
nodemailer

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
