const mongoose = require('mongoose');

const carTime = mongoose.Schema({
  time: { type: Intl, required: true },

  
});

module.exports = mongoose.model('Time', carTime);