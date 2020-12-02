		const pw = require('playwright');
		const fs = require('fs');
		const { dosDateTimeToDate } = require('yauzl');
		const { cpuUsage } = require('process');
		const mongoose = require('mongoose');
		const Time = require('./models/Time.js');


		function log(log){
		if (typeof log != String){
			log = JSON.stringify(log);
		}
		console.log(log);
		return fs.appendFileSync("log.txt", log+'\n', "UTF-8",{'flags': 'a+'});
	}

		function timeout() {
			return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 10000) + 15000));
		}

		async function scrollOnElement(page, selector) {
			await page.$eval(selector, (element) => {
			element.scrollIntoView();
			});
		}

		

		function convertTime(time){
		let masque=/Aujourd\'hui, (.*)/;
		let masqueHier=/Hier, (.*)/;
		log(time);
		if (typeof time.match(masque) !== undefined && time.match(masque) !== null) {
			var heure= time.match(masque)[1];
			hour=heure.match(/(.*):.*/)[1];
			minutes=heure.match(/.*:(.*)/)[1];
		var currentDate = new Date();
		year= currentDate.getFullYear();
		month=Number(currentDate.getMonth());
		day=Number(currentDate.getDate());
		date=new Date(year,month,day,Number(hour)+1,minutes,0);

			
		}

		else if (typeof time.match(masqueHier) !== undefined && time.match(masqueHier) !== null) {
			var heure= time.match(masqueHier)[1];
			hour=heure.match(/(.*):.*/)[1];
			minutes=heure.match(/.*:(.*)/)[1];
		var currentDate = new Date();
		year= currentDate.getFullYear();
		month=Number(currentDate.getMonth());
		day=Number(currentDate.getDate());
		date=new Date(year,month,Number(day)-1,Number(hour)+1,minutes,0);

			
		}
		
			return Date.parse(date);

		}




		module.exports = {
		play: async function() {
			
			var lastTime = await Time.find().then(time => {return time[0].time}).catch(error => log(error));
			log('Last Time: '+lastTime);


			let iterations=0;
			var result = new Object();
			result.data=[];


			var pages=1;
			let urldroite='';
		/*const browser = await pw.webkit.launch({headless: false }); // or 'chromium', 'firefox'
		
	
		const context = await browser.newContext({
			userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8'

		  });*/
		  const userDataDir='testProfile-2';
	  //const browser = await pw.firefox.launch({headless: false }); // or 'chromium', 'firefox'
	  
	  //const context = await browser.launchPersistentContext(userDataDir);
	  const context = await pw.webkit.launchPersistentContext(userDataDir,{
		headless: true
	  });

		const page = await context.newPage();

		while (true){
		await page.goto('https://www.leboncoin.fr/recherche/?category=2&page='+pages+'&owner_type=pro&fuel=4');

		const lien = await page.$$eval('a[class="_2-MzW _23lZh HlrAk _2k-6T"]', (nodes) => 
		{	
			return nodes.map((n) => n.getAttribute("href"))}
		);
		

		const prix=	await page.$$eval('span[class="_1C-CB"]', (nodes) => 
		{	
			return nodes.map((n) => n.innerText)}
		);
		

			
		const dateSc = await page.$$eval('div[class="_1UzWr"]', (nodes) => 
		{	
			return nodes.map((n) => n.innerText)}
		);
		

		iterations=3;

		for (const element of lien){
			car=new Object();
			car.prix=prix[iterations];
			var timeAnnonce = dateSc[(iterations*3+2)];
			car.time=convertTime(timeAnnonce);
			urldroite=element;
			iterations++;
			
		
		let url='https://www.leboncoin.fr'+urldroite;

		await page.goto(url); 
		await scrollOnElement(page, 'span[class="_1fFkI"]');

		

			const vendeur= await Promise.all([timeout(),page.evaluate(() => {
				let vendeur=[];
				let elements = document.getElementsByClassName('styles_owner__2cysW');
				let elements2 = document.getElementsByClassName('styles_identity__2IDdO');
				let elements3= document.getElementsByClassName('styles_owner__3_OjB');
				let elements4 = document.getElementsByClassName('styles_identity__2o_MH');

				
				for (let element of elements)
					vendeur.push(element.innerText);
					for (let element of elements2)
					vendeur.push(element.innerText);
					for (let element of elements3)
					vendeur.push(element.innerText);
					for (let element of elements4)
					vendeur.push(element.innerText);	
				return vendeur;
			})]);
			





		let siret= await page.evaluate(() => {
				let vendeur=[];
			let elements = document.getElementsByClassName('HGqCc _21rqc _3QJkO _137P- P4PEa _3j0OU');
			let elements2 = document.getElementsByClassName('_21rqc _3QJkO _137P- P4PEa _3j0OU');
			for (let element of elements)
				vendeur.push(element.innerText);
				for (let element of elements2)
				vendeur.push(element.innerText);	
			return vendeur;
		});

		//let masqueSiret=/N° SIRET : (.*)/;

		masqueSiren=/SIREN : (.*)/;
		masqueSiret=/SIRET : (.*)/;
		try {
		if (typeof siret[0].match(masqueSiren) !== undefined && siret[0].match(masqueSiren) !== null) {
			siret=siret[0].match(masqueSiren)[1];

		}
		else if (typeof siret[1].match(masqueSiret) !== undefined && siret[1].match(masqueSiret) !== null) {
			siret=siret[1].match(masqueSiret)[1];

		}

		else {
			siret='Undefined';
		}
			}
			catch (error) {

			log('BUSTED');
			return result;

			}



		const criteres = await page.$$eval('div[class="styles_Criteria__2sVPt"]', (nodes) => 
		{	
			return nodes.map((n) => n.innerText)});

		masqueCriteres=/.*\n(.*)\n.*\n(.*)\n.*\n(.*)\n.*\n(.*)\n.*\n(.*)\n.*\n(.*)/;
		criteresTab=criteres[0].match(masqueCriteres);
		let marque= criteresTab[1];
		let modele=criteresTab[2];
		let annee=criteresTab[3];
		let date=criteresTab[4];
		let kilometrage=criteresTab[5];

		car.vendeur=vendeur[1][0];
		car.url=url;
		car.siret=siret; 
		car.marque=marque;
		car.modele=modele;
		car.annee=annee;
		car.date=date;
		car.kilometrage=kilometrage;

		if (car.time<=lastTime) {
			log('La voiture suivante a deja été enregistré');
			log(car);  

			return result;}	 

		else result.data.push(car);

		log(car);

		}
		pages++;

		}

		}}