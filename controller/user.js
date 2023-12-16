  const users = require('../models/user.model')
  const Signup = require ("../models/signupModel")
  const jwt = require('jsonwebtoken');
  const path = require("path");
  const fs =require("fs")
  //===================================== Signup Route ====================================
  exports.signupUser = async(req, res) => {
  const { name, email, password, age } = req.body;
  

  try {
    const existingUser = await Signup.findOne({ email });

    if (existingUser) {
      return res.send('user already exists');
    }

    const newUser = new Signup({
      name,
      email,
      password,
      age,
    });

    await newUser.save();
    console.log(newUser)
    res.json('user created successfully');
  } catch (error) {
    console.error(error);
    console.log("notumar ")
    res.send('user already exist');
  }
}
  //===================================== Signin Route ====================================
  exports.signinUser = async(req, res) =>{
  const { email, password } = req.body;
  try {
    const user = await Signup.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(404).json("user not found");
    }
    const token = jwt.sign({ userId: user._id, userEmail: user.email,ref_id:user._id }, 'token');

    res.json({
      id: user._id,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
}
  // ====================================Create New User=====================================
  exports.createUser = async(req, res) => {
    try {
    const findUser = await users.findOne({email:req.body.email})
    if(findUser){
      return res.json('user already exist')
    }
    const filePath= `http://localhost:4006/data/${req.file.filename}`
    const newUser = new users
    ({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      age: req.body.age,
      image: filePath,
      signup: req.user
    });
    // console.log(req.body.auth)
    await newUser.save();
    return res.json(newUser)
    } catch (error) {
      console.log("server error", error);
      return res.json({ error: "Internal server error" });
    }
  };
  // ====================================Get All User Data=====================================
  exports.getAllUser = async(req, res) => {
    // console.log(req.user);
    let filter={signup:req.user}
  const allUsers = await users.find(filter)
    return res.send(allUsers);
  };

  // ==============================Delete User Data With Params==================================
  exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await users.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.json({ error: "User not found" });
      }

      if (deletedUser.image) {
        const imagePath = path.join(__dirname, '..', 'images', path.basename(deletedUser.image));
        fs.unlinkSync(imagePath);
      }

      return res.send(deletedUser);
    } catch (error) {
      console.log("server error", error);
      return res.json({ error: "Internal server error" });
    }
  };

  // ==============================Updata User Data With Params===================================
  exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password, age } = req.body;
      const findUser = await users.findById(id);

      if (!findUser) {
        return res.json({ error: "User not found" });
      }

      if (name) {
        findUser.name = name;
      }
      if (email) {
        findUser.email = email;
      }
      if (password) {
        findUser.password = password;
      }
      if (age) {
        findUser.age = age;
      }
      if (req.file) {
        if (findUser.image) {
          const imagePath = path.join(__dirname, '..', 'images', path.basename(findUser.image));
          fs.unlinkSync(imagePath);
        }

        const filePath = `http://localhost:4006/data/${req.file.filename}`;
        findUser.image = filePath;
      }

      await findUser.save();
      res.send(findUser);
    } catch (error) {
      console.log("server error", error);
      return res.json({ error: "Internal server error" });
    }
  };

