const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const morgan = require("morgan");
const authRoute = require("./routes/authRoute")
const cors = require("cors")
const categoryRoutes = require("./routes/categoryRoutes")
const productRoutes = require("./routes/productRoutes")
const path = require("path");

//configure env
dotenv.config()

const app = express();

// connect database
connectDb();


//middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use(express.static(path.join(__dirname, './client/build')))

// Routes
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", productRoutes)




// api
app.use("*", function(req, res){
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server is Running on Port: ${PORT}`);
})
