const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/qaTuorial").then((data) => {
    console.log("Mongodb veritabanı bağlantısı başarlı")
}).catch((err) => {
    console.log("Mongodb veritabanı bağlantısı başarısız")
});