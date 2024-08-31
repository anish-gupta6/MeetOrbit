const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const registerRoute = require('./routes/register');
const otpRoute = require('./routes/generateOTP');
const checkUserRoute = require('./routes/checkUser');
const loginRoute = require('./routes/login');
const cors = require('cors');
// Use CORS middleware

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

//  routes
app.use('/api/auth', registerRoute);
app.use('/api/auth', otpRoute);
app.use('/api/auth', checkUserRoute);
app.use('/api/auth', loginRoute);


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
