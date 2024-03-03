// utils/generateShortId.js


const shortid = require('shortid');

const generateShortId = () => {
    return shortid.generate();
};

module.exports = generateShortId;
