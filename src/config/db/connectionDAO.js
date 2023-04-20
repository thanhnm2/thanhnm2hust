const mongoose = require("mongoose");
require("dotenv").config();
const connection_string = process.env.CONNECTION_STRING;
async function connect() {
    try {
        await mongoose.connect(
            connection_string,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        ).then(() => {
            console.log("Connect successfully!!!");
        });
    } catch (error) {
        console.log(error);
        console.log("Connect failure!!!");
    }
}

module.exports = { connect };
