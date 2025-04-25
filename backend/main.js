const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const { getPresignedUrl } = require("./aws");

require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.post("/presigned-url", async (req, res) => {
  let { fileName, fileType } = req.body;

  if(!fileType) fileType = "audio/webm"

  try {
    const presignedUrl = await getPresignedUrl(fileName, fileType);
    res.status(200).json({ url: presignedUrl });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.use("/api/projects", require("./controllers/project"));
app.use("/api/meetings", require("./controllers/meeting"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
