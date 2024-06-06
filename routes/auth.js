const express = require("express");
const passport = require("passport");
const User = require("../models/user");

const router = express.Router();

router.get("/signup", (req, res) => {
	res.render("signup");
});

router.post("/signup", async (req, res) => {
	const { firstName, lastName, username, password, confirmPassword } = req.body;
	if (password !== confirmPassword) {
		return res.render("signup", { error: "Passwords do not match." });
	}
	try {
		const user = new User({ firstName, lastName, username, password });
		await user.save();
		res.redirect("/auth/login");
	} catch (error) {
		res.render("signup", { error: "Error creating account. Try again." });
	}
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/auth/login",
		failureFlash: true,
	})
);

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

router.get("/join-club", (req, res) => {
	if (!req.isAuthenticated()) {
		return res.redirect("/auth/login");
	}
	res.render("join-club");
});

router.post("/join-club", async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.redirect("/auth/login");
	}
	const { passcode } = req.body;
	const secretPasscode = "SECRET_PASSCODE"; // You should store this in an environment variable
	if (passcode === secretPasscode) {
		req.user.membershipStatus = true;
		await req.user.save();
		res.redirect("/");
	} else {
		res.render("join-club", { error: "Incorrect passcode." });
	}
});

module.exports = router;
