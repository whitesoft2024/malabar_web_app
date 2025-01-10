const mongoose = require('mongoose');

const deignationSchema= new mongoose.Schema({
  designation: {type : String}
})
const Designation = mongoose.model('Designation', deignationSchema);

module.exports = Designation;