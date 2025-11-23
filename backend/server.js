const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/projects", require("./routes/projects"));

app.listen(8080, () => console.log("Node backend running on 8080"));
