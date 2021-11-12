
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/AuthenticationDB');
}
const Auth = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }

});

// Auth.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
const userModel = mongoose.model('User', Auth);
module.exports = userModel;