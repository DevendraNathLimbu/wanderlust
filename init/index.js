const mongoose = require('mongoose');
const Listing = require('../models/listing');
let initData = require('./data_with_coords.js');

const mongoURL = 'mongodb://localhost:27017/wanderlust';

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect(mongoURL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData = initData.map((data) => ({ ...data,
        owner: '68e767b12ae4652453bd0cf9',
        image: {
            url: data.image,
            filename: data.image.split('/').pop()
        }
    }));
    await Listing.insertMany(initData);
    console.log('Database initialized with sample data');
};

initDB();

module.exports = initDB;