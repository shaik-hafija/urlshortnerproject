const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const insight = require('./models/url-shortner');
const path = require("path");
const { log } = require('console');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());
app.use(express.json());
// app.use(express.static('public'));
// app.set('view engine', 'ejs');
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/url-shortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a URL Schema
// const urlSchema = new mongoose.Schema({
//   originalUrl: String,
//   shortUrl: String,
// });

// const Url = mongoose.model('Url', urlSchema);

// Handle POST requests to shorten URLs


app.get('/', async (req, res) => {
    //res.send("hello")
    res.sendFile(path.join(__dirname, 'index.html'));
})

// Handle POST requests to shorten URLs
app.post('/shorten', async (req, res) => {
    const { originalurl } = req.body;
    console.log(originalurl)
    const shorturl = shortid.generate();
  
    const newUrl = new insight({ originalurl, shorturl });
    await newUrl.save();
  
    // Construct the full shortened URL including the host domain
    const fullShortUrl = `${req.protocol}://${req.get('host')}/${shorturl}`;
  
    // Render the view and pass data
    res.render('view', { originalurl, shorturl: fullShortUrl });
});

  // Redirect to the original URL when the short URL is visited
// Redirect to the original URL when the short URL is visited
app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params; // Changed from shorturl to shortUrl
    console.log("Requested Short URL:", shortUrl); // Add this line for debugging
  
    try {
        const url = await insight.findOne({ shorturl: shortUrl }); // Changed from shorturl to shortUrl
      
        if (url) {
            console.log("Original URL Found:", url.originalurl); // Add this line for debugging
            res.redirect(url.originalurl);
        } else {
            console.log("Short URL Not Found in Database"); // Add this line for debugging
            res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error("Error retrieving URL from database:", error); // Add this line for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
