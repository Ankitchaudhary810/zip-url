const Admin = require("../models/admin");
const bcrypt = require('bcrypt');
const User = require("../models/user")
const jwtToken = require('jsonwebtoken');
const { expressjwt: jwt } = require("express-jwt");
const sendMail = require("../utils/sendEmail");
const crypto = require("crypto");
const Url = require("../models/url")
// admin authentication methods
exports.getAdminById = async (req, res, next, _id) => {
    try {
        const admin = await Admin.findById(_id).exec();
        if (!admin) {
            return res.status(400).json({
                msg: "No User Was Found By Id",
            })
        }
        req.admin = admin;
        next();
    } catch (err) {
        return res.status(400).json({
            msg: "Error Retrieving Admin",
            err: err
        })
    }
}

exports.adminSignup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const saltRounds = 4;
        const hasedPassword = await bcrypt.hash(password, saltRounds);

        const admin = new Admin({
            fullName,
            email,
            password: hasedPassword,
        })
        const savedAdmin = await admin.save();
        if(!savedAdmin){
            return res.status(400).json({
                msg:"Some Error"
            })
        }
        return res.status(200).json({
            admin: savedAdmin,
            msg: "Account is Created",
        })

    } catch (err) {
        JSON.stringify(err);
        if (err.code === 11000) {
            return res.json({
                msg: "User is already Exists"
            });
        }
    }
}

exports.adminSignin = async (req, res) => {
    const { email, password } = req.body;
    console.log({ email, password });
    try {
        const admin = await Admin.findOne({ email });
        console.log({admin})
        if (admin === null) {
            return res.json({ msg: "Admin Not Found" });
        } else {
            if (await bcrypt.compare(password, admin.password)) {
                // Create token
                const admintoken = jwtToken.sign({ _id: admin._id }, process.env.JWT_SECRET);
                // Put token in the cookie
                res.cookie("admintoken", admintoken, { expire: new Date() + 9999 });

                const { _id, fullName, email, updatedAt } = admin;
                return res.status(200).json({
                    msg: `Welcome Back... ${fullName}`,
                    admintoken,
                    admin: {
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


exports.adminSignout = (req, res) => {
    res.clearCookie('admintoken');
    res.status(200).json({ msg: 'Admin signout success' });
};

exports.isAdminSignedIn = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
}
);

exports.isAdminAuthenticated = (req, res, next) => {
    let checker = req.admin && req.auth && req.admin._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            msg: "Access Denied",
        });
    }
    next();
};

// admin method for get the url and user data.
exports.getUsers = async (req, res) => {
    try {
        const allUsers = await User.find({}).exec();
        if (!allUsers || allUsers.length === 0) {
            return res.status(200).json({
                msg: "No User"
            })
        }

        const user = allUsers.map(user => ({
            ...user.toObject(),
            password: null
        }));

        return res.status(200).json({
            msg: "Users Found",
            user
        })

    } catch (error) {
        return res.status(501).json({
            msg: "Internal Server Error"
        })
    }
}

exports.getUserUrl = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    try {
        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }
        const userUrls = await Url.find({ createdBy: userId }).exec();
        console.log({ userUrls })
        if (!userUrls || userUrls.length === 0) {
            return res.status(200).json({
                msg: "No URLs found for this user"
            });
        }

        return res.status(200).json({
            msg: "Urls Found",
            userUrls
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Internal Server Error from Urls by admin"
        });
    }
};

// admin methods to manage the url and user account

exports.deleteUrlAccount = async (req, res) => {
    const userId = req.params.userId;
    try {

        const urlToDelete = await Url.deleteMany({ createdBy: userId });
        if (!urlToDelete) {
            return res.status(404).json({
                msg: "No Url Found To Delete"
            })
        }
        // Delete the user account
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({
                msg: "User not found"
            });
        }
        return res.status(200).json({
            msg: "User account and associated URLs deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
};
