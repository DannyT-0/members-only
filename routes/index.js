const express = require("express");
const Message = require("../models/message");

const router = express.Router();

router.get("/", async (req, res) => {
	const messages = await Message.find().populate("author").exec();
	res.render("index", { messages, user: req.user });
});

module.exports = router;
