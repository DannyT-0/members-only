const express = require("express");
const Message = require("../models/message");

const router = express.Router();

router.get("/create", (req, res) => {
	if (!req.isAuthenticated()) {
		return res.redirect("/auth/login");
	}
	res.render("create-message", { error: null });
});

router.post("/create", async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.redirect("/auth/login");
	}
	const { title, text } = req.body;
	try {
		const message = new Message({ title, text, author: req.user._id });
		await message.save();
		res.redirect("/");
	} catch (error) {
		res.render("create-message", {
			error: "Error creating message. Try again.",
		});
	}
});

router.post("/:id/delete", async (req, res) => {
	if (!req.isAuthenticated() || !req.user.isAdmin) {
		return res.redirect("/auth/login");
	}
	try {
		await Message.findByIdAndDelete(req.params.id);
		res.redirect("/");
	} catch (error) {
		res.redirect("/");
	}
});

module.exports = router;
