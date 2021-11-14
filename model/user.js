
const mongoose = require('mongoose');

const passportLocalMongoose = require('passport-local-mongoose');
// const encrypt = require('mongoose-encryption');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/AuthenticationDB');
}
const Auth = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
 
  }

});
Auth.plugin(passportLocalMongoose);

// Auth.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
const userModel = mongoose.model('User', Auth);
module.exports = userModel;