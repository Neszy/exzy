const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const rateLimit = require("express-rate-limit");


// ! กรณ๊ที่ต้องการ Allow IP
const allowedOrigins = [
  "localhost"
];

// กำหนด rate limit ที่ 100 requests ต่อ 15 นาที
const limiter = rateLimit({
  windowMs: 1000 * 60 * 1, // 15 นาที
  max: 100,
});

module.exports = async (app) => {
  // Middleware สำหรับรับ IP Address
  app.use((req, res, next) => {
    // ดึง IP Address ของผู้ใช้จากคำขอ
    const userIp = req.ip;

    // นำ IP Address ไปเก็บไว้ในตัวแปรหรือใช้ในโค้ดต่อไป
    req.userIp = userIp;

    next();
  });

  // Middleware สำหรับรับข้อมูลแพลตฟอร์ม (Platform)
  app.use((req, res, next) => {
    // ดึงข้อมูล User-Agent header เพื่อรับข้อมูลแพลตฟอร์ม
    const userAgent = req.get("User-Agent");
    // นำข้อมูลแพลตฟอร์มไปเก็บไว้ในตัวแปรหรือใช้ในโค้ดต่อไป
    req.userPlatform = userAgent;

    next();
  });


  // app.use(logger());
  app.use(helmet());

  // app.use(
  //   cors({
  //     origin: function (origin, callback) {
  //       if (!origin) return callback(null, true);
  //       if (allowedOrigins.indexOf(origin) == -1) {
  //         var msg =
  //           "The CORS policy for this site does not allow access from the specified Origin.";
  //         return callback(new Error(msg), false);
  //       }
  //       return callback(null, true);
  //     },
  //   })
  // );
  app.use(
    cors({
      origin: '*'
    })
  );
  

  // ใช้ middleware rate limit ก่อนทุกคำขอ (requests)
  app.use(limiter);

  app.use(express.json());
  // app.use(express.urlencoded());
  app.use(express.urlencoded({ extended: false }));

  // Logger
  // รหัสที่เป็น 400 ขึ้นไปให้ log ไปที่ console ด้วย
  app.use(
    morgan("dev", {
      skip: function (req, res) {
        return res.statusCode < 400;
      },
    })
  );

  // request ทั้งหมดเขียนลง access.log
  // app.use(
  //   morgan("common", {
  //     stream: fs.createWriteStream(
  //       path.join(__dirname, "../../logs/access.log"),
  //       { flags: "a" }
  //     ),
  //   })
  // );

  // Static file
  app.use("/static", express.static(path.join(__dirname, "/public")));

  // Custom Response Format
  app.use(require("./responseFormat"));

  // เปิดใช้งาน Passport
  // app.use(passport.initialize());
  // app.use(passport.session());
};
