const express = require("express")
const cors = require("cors")
const mysql = require("mysql")
const caretakerrouter=require("./controllers/CaretakerRouter")
const foodrouter=require("./controllers/foodRoute")
const userRoute=require("./controllers/userRoute")

const app = express()

app.use(express.json())

app.use("/api/caretaker",caretakerrouter)
app.use("/api/food",foodrouter)
app.use("/api/user",userRoute)

app.listen(3002,()=>{
    console.log("Server Running")
})