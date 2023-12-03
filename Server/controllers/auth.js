const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwtToken = require('jsonwebtoken');
const { expressjwt: jwt } = require("express-jwt");
const Token = require("../models/token");
const sendMail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout success"
  });
};

exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const saltRounds = 4;
    const hasedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      fullName,
      email,
      password: hasedPassword,
    })
    const savedUser = await user.save();

    const token = await new Token({
      userId: savedUser._id,
      token: crypto.randomBytes(32).toString("hex")
    }).save();

    const url = `
      Welcome <b>${fullName}</b> to the zipUrl
      <a href="http://localhost:5173/${savedUser._id}/verify/${token.token}">click Here</a>
      to Vefity Yourself.
      `
    console.log("url: ", url);
    await sendMail(savedUser.email, "ZipUrl Verification Mail", url);

    return res.status(200).json({
      user: savedUser,
      msg: "An Email is sent to your account please verify"
    })
  } catch (err) {
    console.error("Error during signup: ", err);
    JSON.stringify(err);
    if (err.code === 11000) {
      return res.status(400).json({
        msg: "Email already exists. Please use a different email address."
      });
    }

    return res.status(500).json({
      msg: "An error occurred during signup. Please try again later."
    });
  }
}


exports.signin = async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password })
  try {
    const user = await User.findOne({ email });

    if (user === null) {
      return res.json({ msg: "User Not Found" });
    } else {
      // Check if the user is verified
      if (!user.verified) {
        return res.json({ msg: "Email not verified" });
      }

      if (await bcrypt.compare(password, user.password)) {
        // Create token
        const token = jwtToken.sign({ _id: user._id }, process.env.JWT_SECRET);

        // Put token in the cookie
        res.cookie("token", token, { expire: new Date() + 666 });

        const { _id, fullName, email, updatedAt } = user;
        return res.status(200).json({
          msg: `Welcome Back... ${fullName}`,
          token,
          user: {
            _id,
            fullName,
            email,
            updatedAt,
          },
        });
      } else {
        return res.json({ msg: "Password is incorrect..." });
      }
    }
  } catch (err) {
    return res.json({ msg: err });
  }
};


exports.signout = (req, res) => {
  res.clearCookie('token'); // Clear the token cookie
  res.status(200).json({ message: 'User signout success' });
};


// Protected routes
exports.isSignedIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
}
);

// Custom middleware
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      msg: "Access Denied",
    });
  }
  next();
};