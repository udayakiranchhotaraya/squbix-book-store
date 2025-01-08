const mongoose = require('mongoose');
require('dotenv').config();

async function dbConnect() {
    DB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}`;
    DB_NAME = `${process.env.MONGO_DB}`;

    try {
        const connectionInstance = await mongoose.connect(`${DB_URI}/${DB_NAME}`);
        console.log(`Database \`${DB_NAME}\` connected.\nDB HOST: \`${connectionInstance.connection.host}\``);
    } catch (error) {
        console.error(`Connection error: ${error}`);
        process.exit(1);
    }
}

module.exports = dbConnect;