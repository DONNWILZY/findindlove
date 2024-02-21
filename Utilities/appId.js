const generateSystemNumber = () => {
    // Generate a random 10-digit number
    const min = 1000000000; // Minimum 10-digit number
    const max = 9999999999; // Maximum 10-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = { generateSystemNumber };
