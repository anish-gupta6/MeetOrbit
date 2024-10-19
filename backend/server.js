const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const registerRoute = require('./routes/register');
const otpRoute = require('./routes/generateOTP');
const checkUserRoute = require('./routes/checkUser');
const loginRoute = require('./routes/login');
const resetPassword = require('./routes/resetPassword')
const getUserDetail = require('./routes/getUserDetail')
const saveNote = require('./routes/saveNote')
const getNotes = require('./routes/getNotes')
const updateNoteStatus = require('./routes/updateNoteStatus')
const deleteNote = require('./routes/deleteNote')
const cors = require('cors');
const multer = require('multer');
const path = require('path');
// Use CORS middleware

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

//  routes
// app.use('/', (req,res)=>{
//   console.log('hello')
//   res.send('5000')
// });
app.use('/api/auth', registerRoute);
app.use('/api/auth', otpRoute);
app.use('/api/auth', checkUserRoute);
app.use('/api/auth', loginRoute);
app.use('/api/auth', resetPassword);
app.use('/api/auth', getUserDetail);
app.use('/api/note', saveNote);
app.use('/api/note', getNotes);
app.use('/api/note', updateNoteStatus);
app.use('/api/note', deleteNote);





// app.post('/save', async (req, res) => {
//   const { content } = req.body;
//   const newContent = new Content({ content });
//   await newContent.save();
//   res.json({ message: 'Content saved successfully' });
// });






app.listen(5000, '0.0.0.0', () => {
    console.log('Server is running on port 5000');
});
