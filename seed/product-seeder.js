var product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping', {useMongoClient: true});

var prodects = [
    new product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        titile: 'Gothic Video Game1',
        description: 'Awesome Game!!!!!!!',
        prices: 10
    }),
    new product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        titile: 'Gothic Video Game2',
        description: 'Awesome Game!!!!!!!',
        prices: 10
    }),
    new product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        titile: 'Gothic Video Game3',
        description: 'Awesome Game!!!!!!!',
        prices: 10
    }),
    new product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        titile: 'Gothic Video Game4',
        description: 'Awesome Game!!!!!!!',
        prices: 10
    }),
    new product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        titile: 'Gothic Video Game5',
        description: 'Awesome Game!!!!!!!',
        prices: 10
    }),
    new product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        titile: 'Gothic Video Game6',
        description: 'Awesome Game!!!!!!!',
        prices: 10
    }),
    new product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        titile: 'Gothic Video Game7',
        description: 'Awesome Game!!!!!!!',
        prices: 10
    }), new product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        titile: 'Gothic Video Game8',
        description: 'Awesome Game!!!!!!!',
        prices: 10
    }),
    new product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        titile: 'Gothic Video Game9',
        description: 'Awesome Game!!!!!!!',
        prices: 10
    }),

];

var done = 0;

for (var i = 0; i < prodects.length; i++) {
    prodects[i].save(function (err, reult) {
        done++;
        if (done === product.length) {
            exit();
        }
    });
}

function exit() {

    mongoose.disconnect();
}