const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(
	session({ secret: "your secret", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new LocalStrategy(
		{ usernameField: "username" },
		async (username, password, done) => {
			const user = await User.findOne({ username });
			if (!user) {
				return done(null, false, { message: "Incorrect username." });
			}
			const isMatch = await user.comparePassword(password);
			if (!isMatch) {
				return done(null, false, { message: "Incorrect password." });
			}
			return done(null, user);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id).exec();
		if (!user) {
			return done(null, false);
		}
		return done(null, user);
	} catch (error) {
		return done(error);
	}
});

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/messages", require("./routes/messages"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
