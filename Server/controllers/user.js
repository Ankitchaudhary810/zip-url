const User = require('../models/user');
const Token = require("../models/token");
const Url = require("../models/url");
const FormModel = require("../models/form");
const bcrypt = require("bcrypt");
const sendEmail = require('../utils/sendEmail');
exports.getUserById = async (req, res, next, _id) => {
  try {
    const user = await User.findById(_id).exec();
    if (!user) {
      return res.status(400).json({
        msg: "No User Was Found By Id",
      })
    }
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      msg: "Error Retrieving user",
      err: err
    })
  }
}



exports.getUser = async (req, res) => {
  req.profile.password = undefined;
  return res.json(req.profile);
}

exports.verifyUser = async (req, res) => {
  try {
    const { id, token } = req.params;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(400).json({ msg: "Invalid link" });
    }

    const verificationToken = await Token.findOne({ userId: user._id, token });

    if (!verificationToken) {
      return res.status(400).json({ msg: "Invalid link" });
    }

    await User.updateOne({ _id: user._id }, { verified: true });
    await Token.deleteOne({ _id: verificationToken._id });
    res.status(200).json({ msg: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


exports.getUrlsById = async (req, res) => {

  try {
    const userId = req.params.userId;
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const shortUrls = await Url.find({ createdBy: userId })

    res.json(shortUrls);

  } catch (error) {
    console.error('Error fetching short URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


exports.updateUserName = async (req, res) => {
  console.log("req.body: ", req.body);
  const userId = req.profile.id;
  console.log({ userId });
  try {
    const { fullName } = req.body;
    if (!fullName) {
      return res.status(400).json({
        msg: "Name is Required"
      })
    }

    let userToFind = await User.findById(userId);
    if (!userToFind) {
      return res.status(400).json({
        msg: "User Not Found"
      })
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { fullName },
      { new: true }
    );

    if (updatedUser) {
      return res.status(200).json({
        msg: "Name is Updated"
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      msg: "Internal Server Error",
      error
    })
  }
}


exports.updateUserPassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const userId = req.profile.id;
    console.log({ password, newPassword });

    if (!password) {
      return res.status(400).json({
        msg: "Current Password is Required"
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        msg: "New Password is Required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        msg: "Incorrect current password"
      });
    }
    const hasedPassword = await bcrypt.hash(newPassword, 4);
    user.password = hasedPassword;
    await user.save();

    const data = `
    <h1>Password Change</h1>
    <br>
    <p>Your password is Changed Recently, if not done by you Change your password right now</p>
    `
    await sendEmail(user.email, "Password Updation", data)
    return res.status(200).json({
      msg: "Password updated successfully"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "Internal server error"
    });
  }
};


exports.handleFeedbackFormSubmit = async (req, res) => {
  try {
    const { FullName, Email, Message } = req.body;

    if (!FullName || !Email || !Message) {
      return res.status(400).json("All Fields Required");
    };

    const form = await new FormModel({
      FullName,
      Email,
      Message,
    });

    await form.save();

    const data = `
    <p>Thank You Form submiting the form.. We reach you in sometimes</p>
    <br>
    Your Form Data as Follows:
    <br>

    FullName: ${form.FullName},
    <br>
    Email: ${form.Email},
    <br>
    Message: ${form.Message}
    <br>

    Thank You.
    `
    await sendEmail(form.Email, "Contact Form", data)
    res.sendStatus(200);
  } catch (error) {
    console.log(error)
    return res.json({ msg: "Internal Server Error" })
  }
}