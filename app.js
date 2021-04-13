require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// My Routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const stripeRouter = require("./routes/stripePayment");

const app = express();

// DB Connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
}).then ( () => {
    console.log("DB CONNECTED");
}).catch ( ()=> {
    console.log("DB ERROR. OOPS......");
})

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// My Routes
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);
app.use("/api", orderRouter);
app.use("/api", stripeRouter);


// Port
const port = process.env.PORT || 8000;

// Starting a Server
app.listen(port, () => {
    console.log(`Server is Up and Running at Port : ${port}`);
});