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

dotenv.config();
const port = process.env.PORT || 5000;
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


   


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
