import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log("몽고DB 연결 성공!");
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log("포트 3000에서 서버가 작동하고 있습니다.");
});

app.get("/", (req, res) => {
    res.json({ message: "API가 작동되고 있습니다." });
});
