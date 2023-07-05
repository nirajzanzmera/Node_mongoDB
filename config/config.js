require('dotenv').config();

const config = {
    port:process.env.PORT,
    token_key:process.env.TOKEN_KEY
};

module.exports = config;