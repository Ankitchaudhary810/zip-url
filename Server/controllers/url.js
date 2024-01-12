const Url = require("../models/url");
const bcrypt = require('bcrypt');
const express = require('express');
const shortId = require('shortid');
const app = express();
const ejs = require('ejs');
const fs = require('fs');
const util = require('util');
const sendEmail = require("../utils/sendEmail");
var useragent = require('express-useragent');
app.use(useragent.express());


exports.getShortUrl = async (req, res, next, shortUrl) => {
  try {
    console.log({ shortUrl })
    const url = await Url.findOne({ shortUrl }).exec();
    console.log("url: ", url);
    if (!url) {
      return res.status(404).json({
        msg: "No URL was found by short URL",
      });
    }
    req.urlData = url;
    next();
  } catch (err) {
    return res.status(400).json({
      msg: "Error retrieving URL",
      err: err,
    });
  }
};

exports.getUrlbyShortUrl = async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const url = await Url.findOne({ shortUrl });
    if (!url) {
      return res.status(400).json({
        msg: "URL is not found"
      })
    }
    return res.json({
      msg: url
    })
  } catch (error) {
    return res.json({
      msg: error
    })
  }
}

function formatDate(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const date = dateTime.toDateString();
  const time = dateTime.toLocaleTimeString();
  return `${date} - ${time}`;
}

exports.createShortUrl = async (req, res) => {
  const { originalUrl, shortUrl, password } = req.body;
  let sendMailToPassword = false;

  if (!originalUrl) {
    return res.status(400).json({
      msg: "Url is required"
    })
  }
  try {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 4);
      sendMailToPassword = true;
    }
    const url = new Url({
      originalUrl,
      shortUrl: shortUrl || shortId.generate(),
      password: hashedPassword,
      createdBy: req.profile._id
    })
    const urlToSave = await url.save();
    console.log("req.profile", req.profile);
    const text = `
      <p>Hii, ${req.profile.fullName} You have Create a Password Protected Url: Details as follow</p>
      <table>
      <tr>
      <th>Original Url:</th>
      <td>${url.originalUrl}</td>
    </tr>
    <tr>
      <th>Short Url:</th>
      <td><a href=http://localhost:1234/${url.shortUrl}>zipurl/${url.shortUrl}</a></td>
    </tr>
    <tr>
      <th>Password:</th>
      <td>${password}</td>
    </tr>
    <tr>
      <th>createdAt:</th>
      <td>${formatDate(url.createdAt)}</td>
    </tr>
    </table>
      `
    if (urlToSave) {
      //console.log(req.profile.email);
      if (sendMailToPassword) await sendEmail(req.profile.email, "Short URL Password", text)
      return res.json(url.shortUrl)
    }
    return res.json({
      msg: "Some Error"
    })

  } catch (err) {
    JSON.stringify(err);
    if (err.code === 11000) {
      return res.status(400).json({
        msg: `${shortUrl} name already Exits please Take different One`
      })
    }
    return res.json({
      msg: "Internal Server Error",
      err: err
    })
  }
}

exports.verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { ip, headers } = req;
    const shortUrl = req.urlData.shortUrl;

    const url = await Url.findOne({ shortUrl });

    if (!url) {
      res.status(404).send("URL is not found");
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, url.password);

    if (isPasswordMatch) {
      var source = req.headers['user-agent']
      var userAgent = useragent.parse(source);

      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      const city = data.city;
      const region = data.region;
      const country_name = data.country_name;
      const org = data.org;
      url.clicks.push({
        userAgent: userAgent.source,
        browser: userAgent.browser,
        os: userAgent.os,
        platform: userAgent.platform,
        city,
        region,
        country_name,
        org,
      });
      await url.save();
      res.json({ msg: "YES", originalUrl: url.originalUrl });
    } else {
      res.json({ msg: "NO" });
    }
  } catch (error) {
    console.error('Error while verifying password:', error);
    res.status(500).send("Internal Server Error");
  }
};


exports.redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;
  const { password } = req.body;
  const { ip, headers } = req;

  try {
    const url = await Url.findOne({ shortUrl }).exec();
    if (!url) {
      return res.status(404).json({
        error: "URL not Found",
      });
    }

    if (url.password) {
      const userPassword = url.password;
      const urlData = getUrlInfo(shortUrl);
      return res.render('verifyPassword.ejs', { userPassword: userPassword, shortUrl: url.shortUrl, userName: (await urlData).userFullName, date: (await urlData).date, time: (await urlData).time });
    }

    // Access user agent properties using req.useragent
    var source = req.headers['user-agent']
    var userAgent = useragent.parse(source);

    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    const city = data.city;
    const region = data.region;
    const country_name = data.country_name;
    const org = data.org;


    url.clicks.push({
      userAgent: userAgent.source,
      browser: userAgent.browser,
      os: userAgent.os,
      platform: userAgent.platform,
      city,
      region,
      country_name,
      org,
    });
    await url.save();
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting to original URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


function parseUserAgent(userAgent) {
  const browserRegex = /(?:MSIE|Trident\/.*; rv:|Edge\/)(\d+)/;
  const osRegex = /(Windows NT|Mac OS X|Linux|Android|iOS) ([\d._]+)/;

  const browserMatch = userAgent.match(browserRegex);
  const osMatch = userAgent.match(osRegex);

  const browser = browserMatch ? `Browser: ${browserMatch[0]}` : 'Unknown Browser';
  const os = osMatch ? `OS: ${osMatch[0]}` : 'Unknown OS';

  return { browser, os };
}

async function getUrlInfo(shortUrl) {
  try {
    // Find the URL by short URL
    const url = await Url.findOne({ shortUrl });

    if (!url) {
      throw new Error('URL not found');
    }

    // Retrieve user's name
    const user = url.user;
    console.log("url.user", url);
    const userFullName = user ? user.fullName : 'Anonymous';

    // Format the creation date and time
    const createdAt = url.createdAt;
    const date = createdAt.toLocaleDateString();
    const time = createdAt.toLocaleTimeString();

    // Return the information
    return {
      userFullName,
      date,
      time
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to retrieve URL information');
  }
}


exports.DeleteShortUrl = async (req, res) => {
  const { shortUrl } = req.body;
  if (!shortUrl) {
    res.status(404).json({
      msg: 'ShortUrl Not Found'
    })
  }
  try {
    const url = await Url.findOne({ shortUrl });
    if (!url) {
      return res.status(404).json({ msg: 'URL not found' });
    }
    await url.deleteOne()
    return res.status(200).json({ msg: 'URL deleted successfully' });
  } catch (error) {
    console.error('Error while deleting URL:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getshortUrlById = async (req, res) => {
  try {
    const id = req.params.id;

    const url = await Url.findById({ _id: id });
    if (!url) return res.json({ msg: "Url Not Found" });
    res.json(url);
  } catch (error) {
    console.error('Error while deleting URL:', error);
    return res.status(500).json({ error: 'Internal Server Error' });

  }
}