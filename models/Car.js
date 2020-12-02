const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
  prix: { type: String, required: true },
  time: { type: Intl, required: true },
  vendeur: { type: String, required: true },
  url: { type: String, required: true },
  siret: { type: String, required: true },
  marque: { type: String, required: true },
  modele: { type: String, required: true },
  annee: { type: String, required: true },
  date: { type: String, required: true },
  kilometrage: { type: String, required: true }
  
});

module.exports = mongoose.model('Car', carSchema);