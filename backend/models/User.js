const mongoose = require('mongoose');


// user schema
const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true },
    userId: {type:String,required:true,unique:true},
    userName: { type: String, required: true},
    userEmail: { type: String, required: true, unique: true },
    userPassword: { type: String },
    profileImg:{type:String,required:true},
    colorId:{type:String,required:true},
});



// meeting schema
const recentMeetingSchema = new mongoose.Schema({
    activityId:{type: String,required: true,unique:true},
    title: {type: String,required: true},
    startTime: {type: Date,required: true},
    endTime: {type: Date,required: true},
    duration: {type: Number,required: true},
})
const scheduledMeetingSchema = new mongoose.Schema({
    title: {type: String,required: true},
    scheduledTime: {type: Date,required: true},
    timeBefore: {type: Number,default: "15"},
    createdAt: {type: Date,default: Date.now},
})
const recordingSchema = new mongoose.Schema({
    recordingId: {type: String,required: true},
    title: {type: String,required: true},
    favourite: {type: Boolean,default: false},
    inTrash: {type: Boolean,default: false},
    meetingDate: {type: Date,required: true},
    videoLink:{type: String,required: true},
    createdAt: {type: Date,default: Date.now},
})
const meetingSchema = new mongoose.Schema({
    userId: {type:String,required:true,unique:true},
    meetingName:{type:String,required:true},
    meetingId:{type:String,required:true,unique:true},
    meetingPassword: {type:String,required:true},
    meetingLink:{type:String,required:false},
    meetingRecordings:[recordingSchema],
    recentMeetings:[recentMeetingSchema],
    scheduledMeetings:[scheduledMeetingSchema],
});


const User = mongoose.model('User', userSchema, 'users');
const MeetingDetails = mongoose.model('MeetingDetails',meetingSchema,'meetingInfo')

module.exports = {
    User,
    MeetingDetails,
};