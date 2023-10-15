const mongoose = require("mongoose");

const LobbySchema = new mongoose.Schema({
	roomTitle: {
		type: String,
		required: [true, "Please provide an room title!"],
		unique: [true, "Room already exists!"]
	},
	gameTitle: {
		type: String,
		required: [true, "Please provide an gameTitle!"],
		unique: false,
},
	body:{
		type:String,
		required:false,
		unique:false,
	},
	maxPlayers:{
		type:Integer,
		required: "Please enter in number of max players for lobby",
		unique:false,
	}}
)

module.exports = mongoose.model.Lobbies || mongoose.model("Lobbies", LobbySchema);