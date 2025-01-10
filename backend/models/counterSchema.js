const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Change the type to String
  seq: { type: Number, default: 0 }
});

const CounterModel = mongoose.model('CounterModel', counterSchema);

module.exports = CounterModel;
