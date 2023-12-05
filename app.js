const express = require("express");
const mongoose = require('mongoose')
const multer = require("multer");
const path = require("path")
const cors = require('cors')
const fs = require("fs")
const app = express();
const {
  createUser,
  deleteUser,
  updateUser,
  getAllUser,
} = require("./controller/user");

app.use(express.json());
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/my-db').then(() =>{
    console.log("db connected")
}).catch((err) =>{
    console.log(err)
})
// ===========================Multer Use for Image upload================================
app.use('/data', express.static(path.join(__dirname , 'images')))
const storage = multer.diskStorage({
  destination:'./images', 

  filename: function(req,file,cb){
    cb(null,  file.originalname)
  }
})
 
const upload = multer({ storage }).single('image');

// ================================All Routers==================================
app.post("/create",upload,  createUser);
app.get("/", getAllUser);
app.delete("/delete/:id", deleteUser)
app.put("/update/:id", updateUser);

// ================================Port Listen For Server==================================
app.listen(4006, () => {
  console.log(`Server run on port ${4006}`);
});
