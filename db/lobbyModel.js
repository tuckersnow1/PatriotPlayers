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
	genre:{
		type:String,
		required:true,
		unique:false,
	},
	rank:{
		type:Number,
		required:true,
		unique:false
	},
	maxPlayers:{
		type: Number,
		required: "Please enter in number of max players for lobby",
		unique:false,
	},
	currentPlayers:{
		type:Number,
		required:false,
		unique:false,
	},
	autoDate: {
		type: Date,
		default: Date.now, // This sets the default value to the current date and time
	      }}
)

module.exports = mongoose.model.Lobbies || mongoose.model("Lobbies", LobbySchema);