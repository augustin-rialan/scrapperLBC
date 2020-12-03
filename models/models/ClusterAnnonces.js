const mongoose = require('mongoose');
const Annonce = require('./Annonce.js');

const clusterannonceSchema = mongoose.Schema({
  annonces: [{type: String}]

 
  
});

module.exports = mongoose.model('ClusterAnnonces', clusterannonceSchema);