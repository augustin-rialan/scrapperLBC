const { time } = require('console');
const { json } = require('express');
const fs = require('fs');
const pw = require('playwright');

function timeout() {
	return new Promise(resolve => setTimeout(resolve, 10000));
}

function log(log){
	if (typeof log != String){
		log = JSON.stringify(log);
	}
	console.log(log);
	return fs.appendFileSync("log.txt", log+'\n', "UTF-8",{'flags': 'a+'});
}

module.exports = {
	play:async function() {
	  const userDataDir='testProfile-1';
	//  const browser = await pw.firefox.launch({headless: false }); // or 'chromium', 'firefox'
	  
	//const context = await browser.launchPersistentContext(userDataDir);
	  const context = await pw.webkit.launchPersistentContext(userDataDir,{
		headless: false	  });
	  var page = await context.newPage();
	 // await page.goto('https://www.leboncoin.fr/');
	
	 await page.goto('https://auth.leboncoin.fr/login/?client_id=lbc-front-web&error=login_required&error_debug=session+token+is+not+found+or+expired&error_description=you+should+login+first%2C+the+__Secure-login+cookie+is+not+found.&error_hint=you+should+login+first%2C+you+can+follow+this+url+https%3A%2F%2Fauth.leboncoin.fr%2Flogin%2F%3Fclient_id%3Dlbc-front-web%26from_to%3Dhttps%253A%252F%252Fwww.leboncoin.fr%252F%26redirect_uri%3Dhttps%253A%252F%252Fauth.leboncoin.fr%252Fapi%252Fauthorizer%252Fv2%252Fauthorize%253Fclient_id%253Dlbc-front-web%2526redirect_uri%253Dhttps%25253A%25252F%25252Fwww.leboncoin.fr%25252Foauth2callbacknext%25252F%2526response_type%253Dcode%2526scope%253D%25252A%252Boffline%2526state%253D21db0a0f-fd11-4456-a595-358f72b0908e+to+retrieve+__Secure-login+cookie&from_to=https%3A%2F%2Fwww.leboncoin.fr%2F&redirect_uri=https%3A%2F%2Fauth.leboncoin.fr%2Fapi%2Fauthorizer%2Fv2%2Fauthorize%3Fclient_id%3Dlbc-front-web%26redirect_uri%3Dhttps%253A%252F%252Fwww.leboncoin.fr%252Foauth2callbacknext%252F%26response_type%3Dcode%26scope%3D%252A%2Boffline%26state%3D21db0a0f-fd11-4456-a595-358f72b0908e');
	  const email = await page.$('input[type=email]');
	  const password = await page.$('input[type=password]');
	  await email.type('contact@greenmove.fr', {delay: 92}); 
	  await password.type('StdGmv2018!', {delay: 63}); 
	  const clickObject= await page.$('button[type=submit]');
	  await Promise.all([
		clickObject.click(),
		page.waitForNavigation()
		
	  ]);

	  log ('Authentification done');
	
		
	 // ]);
	 await page.goto('https://www.leboncoin.fr/compte/pro/statistiques/');
	 log('Go to https://www.leboncoin.fr/compte/pro/statistiques/');
	
	 //IF FIRST TIME
	 /*
	 await page.click('button[id="didomi-notice-agree-button"]');
	 await page.click('button[class="_2qvLx _3WXWV _35pAC _1Vw3w _3x0kP _11dBH _PypL sczyl _3Hrjq uA-D9 _30q3D _1y_ge _3QJkO"]');
	 await page.click('button[class="_2RuPl _2CaPj"]');
	*/
	 await timeout();
	 try {
	 await page.waitForSelector('div[role=tab] > div > div');
	 await page.waitForSelector('div[role=tabpanel] > div > div > div > div > span');
	 }
	 catch(error){
		 console.log('Les sélecteurs désirés ne sont pas apparus pour pouvoir récupérer les statistiques');
	 }
	
	 const stats= await page.evaluate(() => {
	  let stats=[];
		
	  let first = document.querySelectorAll('div[id=strip-widget] > div > div > div > div > div > div > div');
	  let contacts = document.querySelectorAll('div[role=tab] > div > div');
	  let others = document.querySelectorAll('div[role=tabpanel] > div > div > div > div > span');
	   stats.push(first[0].innerText);
	   stats.push(first[1].innerText);
	   stats.push(contacts[0].innerText);
	   stats.push(contacts[1].innerText);
	   stats.push(others[0].innerText);
	   stats.push(others[2].innerText);
	  return stats;
	});
	log('stats'+stats);
	
	 var annoncesOnline= stats[0];
	 var favoris= stats[1]
	 var contactGenerated=stats[2];
	 var views=stats[3];
	 var intention=stats[4];
	 var mail=stats[5];
	 
	log('annonces En Ligne'+annoncesOnline);
	log('favoris'+favoris);
	log('contact généres'+contactGenerated);
	log('vues'+views);
	log('intentions'+intention);
	log('mail'+mail);
	
	date=new Date();
	month=parseInt(date.getMonth());
	month=month+1;
	day=date.getDate();
	date=day+'-'+month+'-'+date.getFullYear();
	
	
	var stat= [annoncesOnline,favoris,contactGenerated,views,intention,mail,date];


	await page.goto('https://www.leboncoin.fr/compte/pro/mon-activite/');
	log('Go to annonces');
	await page.waitForSelector('a[target=_blank][title]:not([size])>span');
	await page.waitForSelector('div[title] > div > span > div > div');
	await page.waitForSelector('div[id=ads-widget]>div>div>div>div>div>div>div>div:nth-child(3)>div:first-child');
	await page.waitForSelector('div[id=ads-widget]>div>div>div>div>div>div>div>div>div>span:only-child');
	await page.waitForSelector('div[id=ads-widget]>div>div>div>div>div>div>div>div>div:nth-child(5)');
	await page.waitForSelector('div[id=ads-widget]>div>div>div>div>div>div>div>div>div:nth-child(6)');
	

	const annonces= await page.evaluate(() => {
		let annonces=[];
	   let annoncesTitle = document.querySelectorAll('a[target=_blank][title]:not([size])>span');
	   let annoncesStat = document.querySelectorAll('div[title] > div > span > div > div');
	   let prix = document.querySelectorAll('div[id=ads-widget]>div>div>div>div>div>div>div>div>div>span:only-child');
	   let publication = document.querySelectorAll('div[id=ads-widget]>div>div>div>div>div>div>div>div>div:nth-child(5)');
	   let ref = document.querySelectorAll('div[id=ads-widget]>div>div>div>div>div>div>div>div:nth-child(3)>div:first-child');
	   let joursRestants = document.querySelectorAll('div[id=ads-widget]>div>div>div>div>div>div>div>div>div:nth-child(6)');
	   



	   
		let i=0;
	   for (let element of annoncesTitle){
		annonce = new Object();
		annonces.push(annonce);
	   annonces[i].title=element.innerText;
	   i++;
	   }
	   i=0;
	   for (let element of annoncesStat){
		   switch(i%4){
				   case 0: annonces[Math.floor(i/4)].totalVues=element.innerText;
				   case 1: annonces[Math.floor(i/4)].totalFavoris=element.innerText;
				   case 2: annonces[Math.floor(i/4)].totalMessages=element.innerText;
				   case 3: annonces[Math.floor(i/4)].totalIntentions=element.innerText;
		   }
		   i++;
	   }
	   i=0;
	   for (let element of prix){
		annonces[i].prix=element.innerText;
		i++;
	   }
	   i=0;

	   for (let element of publication){
		annonces[i].publication=element.innerText;
		i++;
	   }
	   i=0;

	   for (let element of ref){
		annonces[i].ref=element.innerText;
		i++;
	   }

	   i=0;

	   for (let element of joursRestants){
		annonces[i].joursRestants=element.innerText;
		i++;
	   }
	 
	   

	 
	   return annonces;

	});

	var options = await page.$$eval('div[id=ads-widget]>div>div>div>div>div>div>div>div>div>div', (nodes) => 
		{	
			return nodes.map((n) => n.innerHTML)});

	options=options.map((n) => n.match(/<a/)!==null ? 0 : 1);

//	console.log('OPTIONS ->'+options);
	i=0;
	annonces.forEach(annonce => {
		annonce.options= [];
		annonce.options.push(options[i] ? 'Option abonnement en tête de liste' : 'Pas option abonnement en tête de liste');
		annonce.options.push(options[i+1] ? 'Option a la une' : 'Pas option a la une');
		annonce.options.push(options[i+2] ? 'Option logo urgent' : 'Pas option logo urgent');
		annonce.options.push(options[i+3] ? 'Option pack photos supplémentaires' : 'Pas option pack photos supplémentaires');
		i+=4;
		annonce.date=date;
	});

	//click element 
	/*
	const printTable = await page.$$('button[class="sc-fznBtT eUufZQ"]');

	await printTable[0].click();
	
	await page.waitForSelector('.sc-pRTZB > svg > g > rect')
	const circle = await page.$('.sc-pRTZB > svg > g > rect');
	await circle.click();
	*/
	
	// REDO
	await page.waitForSelector('div:nth-child(2) > div:nth-child(2)>button:nth-child(2)');
	const printTable = await page.$$('div:nth-child(2) > div:nth-child(2)>button:nth-child(2)');
	var circle=null;
	var nbApparitions=null;
	for ( i=0;i<annoncesOnline;i++){
	await printTable[i].click();
	
	await page.waitForSelector('div[role=tabpanel] > div > div:nth-child(2) > svg > g > rect')
	await timeout();
	 circle = await page.$$('div[role=tabpanel] > div > div:nth-child(2) > svg > g > rect');

	await circle[i].click({
		position: {x:(await circle[i].boundingBox()).width,y:0}});
	 await page.waitForSelector('div.c-panda-linear-chart-tooltip.panda-is-pinned > div > div:nth-child(2)')
	 nbApparitions = await page.$('div.c-panda-linear-chart-tooltip.panda-is-pinned > div > div:nth-child(2)');
	 nbApparitions= await nbApparitions.innerHTML();
	 nbApparitions = nbApparitions.match(/(.*)&nbsp/)[1];
	 remontee = await page.$('div.c-panda-linear-chart-tooltip.panda-is-pinned > div > div:nth-child(3)');
	 if (remontee!==null) annonces[i].remontee = (await remontee.innerHTML()).match(/<\/span>(.*)&nbsp/)[1];
	 else annonces[i].remontee = 'Non';

	 await timeout();
	annonces[i].nbApparitions= nbApparitions;
	}

  
	
	log('ANNONCES'+JSON.stringify(annonces));
	let result=new Object();
	result.stat=stat;
	result.annonces=annonces;

//	await page.close();
	return result;
	
	
	
	
	}}