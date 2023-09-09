const router = require("express").Router();
const { JsonWebTokenError } = require("jsonwebtoken");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// SIGNUP
router.post("/signup", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json({Message: `User has been created`});
  } catch (err) {
    res.status(500).json({ error: `User already exists. Cannot Signup` });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "Incorrect Username or Password" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.json({
        success: false,
        message: "Incorrect Username or Password",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      }, 
      process.env.JWT_SEC,
      {expiresIn:"1h"}
    );

    res.status(200).json({ message: "Login Successful" , accessToken});
  } catch (err) {
    res.status(500).json({ error: `Cannot Login. Please try again later` });
  }
});

module.exports = router;
