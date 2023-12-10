const mongoose = require("mongoose");
/**
 * Defined Schema for Lobbies.
 * roomTitle, gameTitle, genre, rank, and maxPlayers are all required Attributes.
 * body and currentPlayers are not required.
 * autoDate is set to the current date by default.
 * RoomTitles are unique.
 */
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
		required: [true, "Please enter in the maximum number of players for the lobby"],
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
