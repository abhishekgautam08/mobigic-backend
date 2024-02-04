require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes/index");
const connectToMongo = require("./database/mongoDb/index.js");

const app = express();

app.use(cors());

const port = process.env.PORT;


connectToMongo();

app.use(express.json({ limit: "5mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "5mb",
  })
);


app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Health Api");
});

app.listen(port, () => {
  console.log(`Mobigic backend app listening on port ${port}`);
});
