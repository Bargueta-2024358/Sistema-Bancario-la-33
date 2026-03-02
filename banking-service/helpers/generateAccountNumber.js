const generateAccountNumber = () => {
    return "33" + Math.floor(10000000 + Math.random() * 90000000);
};

module.exports = generateAccountNumber;