const Admin = require("../models/admin");
const bcrypt = require('bcrypt');
const User = require("../models/user")
const jwtToken = require('jsonwebtoken');
const { expressjwt: jwt } = require("express-jwt");
const sendMail = require("../utils/sendEmail");
const crypto = require("crypto");
const Url = require("../models/url")
const mongoose = require("mongoose")

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
        if (!savedAdmin) {
            return res.status(400).json({
                msg: "Some Error"
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
    try {
        const admin = await Admin.findOne({ email });
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


exports.handleUserSideReports = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalUrls = await Url.countDocuments({});
        const totalPasswordProtectedUrls = await Url.countDocuments({ password: { $exists: true, $ne: null, $ne: "" } });
        const totalNoPasswordUrls = await Url.countDocuments({ $or: [{ password: { $exists: false } }, { password: { $in: ["", null] } }] });

        const allUrls = await Url.find({});
        const totalRedirections = allUrls.reduce((sum, url) => sum + url.clicks.length, 0);

        const passwordProtectedUrls = await Url.find({ password: { $exists: true, $ne: null, $ne: "" } });
        const totalRedirectionsPasswordProtected = passwordProtectedUrls.reduce((sum, url) => sum + url.clicks.length, 0);

        // Get the total number of redirections for non-password-protected URLs
        const noPasswordUrls = await Url.find({ $or: [{ password: { $exists: false } }, { password: { $in: ["", null] } }] });
        const totalRedirectionsNoPassword = noPasswordUrls.reduce((sum, url) => sum + url.clicks.length, 0);

        const topUsers = await Url.aggregate([
            { $group: { _id: "$createdBy", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            { $project: { _id: "$user._id", fullName: "$user.fullName", email: "$user.email", count: 1 } }
        ]);

        const topPlatforms = await Url.aggregate([
            { $unwind: "$clicks" },
            { $group: { _id: "$clicks.platform", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const topUrls = await Url.aggregate([
            { $unwind: "$clicks" },
            { $group: { _id: "$_id", url: { $first: "$originalUrl" }, userId: { $first: "$createdBy" }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            { $project: { _id: 1, url: 1, fullName: "$user.fullName", count: 1 } }
        ]);

        return res.json({
            totalUrls,
            totalUsers,
            totalPasswordProtectedUrls,
            totalNoPasswordUrls,
            totalRedirections,
            totalRedirectionsNoPassword,
            totalRedirectionsPasswordProtected,
            topUsers,
            topPlatforms,
            topUrls
        });
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({
            msg: "Internal Server Error",
            errorMessage
        });
    }
};


exports.handleAdminSideReports = async (req, res) => {
    try {
        // Example: Get all URLs with their click details and user info
        const reports = await Url.find({})
            .populate('createdBy', 'fullName email') // Populate user details
            .exec();

        // Example: Format the reports
        const formattedReports = [];

        reports.forEach(url => {
            url.clicks.forEach(click => {
                formattedReports.push({
                    userId: url.createdBy._id,
                    fullName: url.createdBy.fullName,
                    email: url.createdBy.email,
                    originalUrl: url.originalUrl,
                    shortUrl: url.shortUrl,
                    timestamp: click.timestamp,
                    userAgent: click.userAgent,
                    userBroswer: click.browser,
                    os: click.os,
                    platform: click.platform,
                    city: click.city,
                    region: click.region,
                    country_name: click.country_name,
                    org: click.org,
                });
            });
        });

        // Send the formatted reports to the admin
        res.status(200).json(formattedReports);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




exports.handleDeleteUrlAdminSide = async (req, res) => {

    try {

        const { userId, urlId } = req.params;

        const user = await User.findById(userId)
        if (!user) return res.status(401);

        const url = await Url.findByIdAndDelete({ _id: urlId });
        console.log({ url })
        const test = `
            hello, ${user.fullName}
            This is a system generated mail. you are reciving This mail because the ADMIN has deleted you shortUrl from the Client side. because it is not following the standered zipURL GUIDE LINES.
        `

        console.log(user.email);
        await sendMail(user.email, "Zipurl Admin Side", test);

        await res.status(200);


    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });

    }
}