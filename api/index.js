const express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const adminRouter = require("./routers/admin");
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const cateRouter = require("./routers/categoryRouter");
const uploadRouter = require("./routers/uploadRouter");
const postRouter = require("./routers/postRouter");
const sliderRouter = require("./routers/sliderRouter");
const productTypeRouter = require("./routers/productTypeRouter");
const productRouter = require("./routers/productRouter");

const payRouter = require("./routers/payment");
const thongbaoRouter = require("./routers/thongbaoRouter");

var fs = require('fs');
dotenv.config();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

//file tĩnh
app.use("/public", express.static(path.join(__dirname, "/images")));

//router api

app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/v1/admin/", adminRouter);
app.use("/v1/category", cateRouter);
app.use("/v1/upload", uploadRouter);
app.use("/v1/posts", postRouter);
app.use("/v1/slider", sliderRouter);
app.use("/v1/product-type", productTypeRouter);
app.use("/v1/product", productRouter);

app.use("/v1/payment", payRouter);
app.use("/v1/notice/", thongbaoRouter);

const dbUrl = process.env.mongodbUrl;
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

app.listen(5001, () => {
    mongoose.connect(dbUrl, connectionParams).then(() => {
        console.log("connect db success");
    }).catch((e) => {
        console.log("connect db error:: ", e);
    })
})

