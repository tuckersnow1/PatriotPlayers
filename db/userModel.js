const mongoose = require("mongoose");
/**
 * Defined Schema for Users. Each user has unique login credentials.
 * User is a required, unique String.
 * Password is a required String.
 */
const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Please provide an username!"],
		unique: [true, "Username already exists!"]
	},
	password: {
		type: String,
		required: false,
		unique: false,
},}
)

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
