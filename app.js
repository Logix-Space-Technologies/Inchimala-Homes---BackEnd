const express = require("express")
const cors = require("cors")
const mysql = require("mysql")

const caretakerrouter=require("./controllers/CaretakerRouter")
const foodrouter=require("./controllers/foodRoute")
const userRoute=require("./controllers/userRoute")
const packagerouter=require("./controllers/packageRoute")
const adminrouter=require("./controllers/AdminRouter")
const eventrouter=require("./controllers/eventRouter")
const bookingrouter=require("./controllers/bookingRouter")


const app = express()

app.use(express.json())
app.use(cors())


app.use("/api/caretaker",caretakerrouter)
app.use("/api/food",foodrouter)

app.use("/api/user",userRoute)
app.use("/api/package",packagerouter)
app.use("/api/event",eventrouter)
app.use("/api/booking",bookingrouter)



app.use("/api/admin",adminrouter)





app.listen(3002,()=>{
    console.log("Server Running...")
})