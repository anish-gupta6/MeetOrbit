const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true },
    userId: {type:String,required:true,unique:true},
    userName: { type: String, required: true},
    userEmail: { type: String, required: true, unique: true },
    userPassword: { type: String },
    profileImg:{type:String,required:true},
});
const meetingSchema = new mongoose.Schema({
    userId: {type:String,required:true,unique:true},
    meetingId:{type:String,required:true,unique:true},
    meetingPassword: {type:String,required:true},
    meetingLink:{type:String,required:false}
});
const roomSchema = new mongoose.Schema({
    roomId: {type:String,required:true,unique:true},
    roomPassword:{type:String,required:true,unique:true},
    participants: {type:Array}
});

// Hash the password before saving the users
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('userPassword')) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.userPassword = await bcrypt.hash(this.userPassword, salt);
//     next();
// });

const User = mongoose.model('User', userSchema, 'users');
const MeetingDetails = mongoose.model('MeetingDetails',meetingSchema,'meetingInfo')
const RoomDetails = mongoose.model('RoomDetails',roomSchema,'rooms')
module.exports = {
    User,
    MeetingDetails,
    RoomDetails
};