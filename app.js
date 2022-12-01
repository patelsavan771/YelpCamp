const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');

//connect to mongoose:
mongoose.connect('mongodb://localhost:27017/yelpcamp')
    .then(() => {
        console.log("connected to mongoDB.");
    })
    .catch(err => {
        console.log('Error in mongoDB connection');
        console.log(err);
    })

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// morgan is middleware to log info of incomming requests:
// app.use(morgan('tiny'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    res.redirect(`/campgrounds/${req.params.id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})




// app.get('/new', async (req, res) => {
//     const campground = new Campground({
//         title: 'kedarnaath',
//         price: '20000',
//         description: 'the most amazing place, har har mahadev',
//         location: 'utranchal'
//     });
//     await campground.save();
//     res.send(campground);
// });

app.listen(3000, () => {
    console.log("Serving on port 3000...");
});