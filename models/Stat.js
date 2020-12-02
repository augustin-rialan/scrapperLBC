const mongoose = require('mongoose');

const statSchema = mongoose.Schema({
  annoncesOnline: { type: Intl, required: true },
  contactGenerated: { type: Intl, required: true },
  views: { type: Intl, required: true },
  intention: { type: Intl, required: true },
  mail: { type: Intl, required: true },
  date: { type: Intl, required: true }
  });

module.exports = mongoose.model('Stat', statSchema);