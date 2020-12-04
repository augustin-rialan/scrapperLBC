const mongoose = require('mongoose');

const annonceSchema = mongoose.Schema(
	{
	annonce :[{
  title: { type: String, required: true },
  totalVues: { type: Intl, required: true },
  totalFavoris: { type: Intl, required: true },
  totalMessages: { type: Intl, required: true },
  prix: { type: String, required: true },
  publication: { type: String, required: true },
  ref: { type: String, required: true },
  options: [String],
  joursRestants: { type: Intl, required: true },
  nbApparitions:{ type: Intl, required: true },
  Remontee:{ type: String, required: true }
 
  
}],
	date: { type: Intl, required: true }
	}

);

module.exports = mongoose.model('Annonce', annonceSchema);