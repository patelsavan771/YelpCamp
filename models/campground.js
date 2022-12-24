const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

ImageSchema.virtual('cardImage').get(function() {
    return this.url.replace('/upload', '/upload/ar_4:3,c_crop')
})

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    geometry: {
        coordinates: {
            type: [Number],
            required: true
        },
        type: {
            type: String,
            enum: ['Point'],
            required: true
        }
    },
    description: String,
    location: String,
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);