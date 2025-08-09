const Url = require("../models/urlSchema");
const shortid = require("shortid");
require("dotenv").config();

/**
 * Create a short URL
 */
const createShortUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "Original URL is required" });
  }

  try {
    let url = await Url.findOne({ originalUrl });

    if (url) {
      return res.json(url);
    }

    const shortId = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${shortId}`;

    url = new Url({
      originalUrl,
      shortUrl,
      shortId, // storing separately makes lookups easier
    });

    await url.save();
    res.json(url);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

/**
 * Get all URLs
 */
const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find();
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

/**
 * Delete a URL
 */
const deleteUrl = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const url = await Url.findByIdAndDelete(id);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.json({ message: "URL deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

/**
 * Redirect to original URL
 */
const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortId } = req.params;
    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

module.exports = {
  createShortUrl,
  getAllUrls,
  deleteUrl,
  redirectToOriginalUrl,
};
