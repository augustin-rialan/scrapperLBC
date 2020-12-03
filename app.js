const express = require('express');
const scrapperGreenmoveData = require('./scrapperGreenmoveData');
const scrapperLBC = require('./scrapperLBC');
const mongoose = require('mongoose');
const Car = require('./models/Car.js');
const Time = require('./models/Time.js');
const cron = require('node-cron');
const fs = require('fs');
const Stat = require('./models/Stat.js');
const Annonce = require('./models/Annonce.js');


  

mongoose.connect('mongodb+srv://augustinrialan:1%25HeKbDkQd%28%2B%2B@cluster0.7jzdg.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => log('Connexion à MongoDB réussie !'))
  .catch(() => log('Connexion à MongoDB échouée !'));

  function log(log){
	if (typeof log != String){
		log = JSON.stringify(log);
	}
	console.log(log);
	return fs.appendFileSync("log.txt", log+'\n', "UTF-8",{'flags': 'a+'});
}
async function saving(tab){
	isNotEmpty=false;
	for await (let car of tab){
		let carToSave = new Car({prix:car.prix,time:car.time,vendeur:car.vendeur,url:car.url,siret:car.siret,marque:car.marque,modele:car.modele,annee:car.annee,date:car.date,kilometrage:car.kilometrage});
		//VERIF QUE URL PAS DEJA DANS LA BASE
		carToSave.save().then(() =>{ log('Enregistrement réussi'); isNotEmpty=true;}).catch(error => log(error));
	}
	
	return isNotEmpty;
}
  
const app = express();

cron.schedule('0 */1 * * *', async function() {
	log('Execution' + new Date());
	try {
	result = await scrapperLBC.play();
	}
	catch (error){
		log('FAILLURE: '+ error);
	}
	var isNotEmpty= result.data.length>0;
	saving(result.data);
	
	if (isNotEmpty){
	await Time.deleteOne().then(() => log('Objet supprimé!')).catch(error => log(error));
	
	var lastTime = result.data.shift().time;
	lastTime= new Time({time:lastTime});
	await lastTime.save().then(() => log('Temps sauvegardé')).catch(error => log(error));
	}
	else {
	log('Aucune nouvelle annonce');}
  });
  

 
 // cron.schedule('* * */15 * *', async function() {
/*	log('Execution' + new Date());

	result = await scrapperGreenmoveData.play();
	let statToSave = new Stat({annoncesOnline:result[0],contactGenerated:result[1],views:result[2],intention:result[3],mail:result[4],date:result[5]});
	await statToSave.save().then(log('Statistiques quotidiennes sauvegardés')).catch(error => log(error));

  });
  */


  app.use(async (req, res, next) => {

	result = await scrapperGreenmoveData.play();
	statsAnnonces= result.annonces;
	result=result.stat;
	log('RESULT'+JSON.stringify(result));
	log('STATS ANNONCES'+JSON.stringify(statsAnnonces));

	let statToSave = new Stat({annoncesOnline:result[0],contactGenerated:result[1],views:result[2],intention:result[3],mail:result[4],date:result[5]});
	await statToSave.save().then(log('Statistiques quotidiennes sauvegardés')).catch(error => log(error));
	let annonces = new Annonce({annonce:[],date:''});
	statsAnnonces.forEach(annonce => {
		log(JSON.stringify(annonce));
		annonces.annonce.push({title:annonce.title,totalVues:annonce.totalVues,totalFavoris:annonce.totalFavoris,totalMessages:annonce.totalMessages,prix:annonce.prix,publication:annonce.publication,ref:annonce.ref,options:annonce.options});
		annonces.date=annonce.date;
	});
	
	await annonces.save().then(log('Statistiques des annonces sauvegardés')).catch(error => log(error));


	
	
});





	

module.exports = app;