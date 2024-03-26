const express = require("express");
const cors = require("cors");
const caretakerrouter = require("./controllers/CaretakerRouter");
const foodrouter = require("./controllers/foodRoute");
const eventRouter = require("./controllers/eventRouter");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/caretaker", caretakerrouter);
app.use("/api/food", foodrouter);
app.use("/api/event", eventRouter);

app.listen(3002, () => {
    console.log("Server Running");
});
