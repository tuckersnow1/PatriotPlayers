const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Please provide an username!"],
		unique: [true, "Username already exists!"]
	},
	password: {
		type: String,
		required: [true, "Please provide an password!"],
		unique: false,
},}
)

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);