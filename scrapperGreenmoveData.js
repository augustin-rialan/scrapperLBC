const fs = require('fs');
const pw = require('playwright');
const { start } = require('repl');

function timeout() {
	return new Promise(resolve => setTimeout(resolve, 3000));
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
	  //const browser = await pw.firefox.launch({headless: false }); // or 'chromium', 'firefox'
	  
	  //const context = await browser.launchPersistentContext(userDataDir);
	  const context = await pw.webkit.launchPersistentContext(userDataDir,{
		headless: false
	  });
	  const page = await context.newPage();
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
	
	 const stats= await page.evaluate(() => {
		let stats=[];
	   let contacts = document.getElementsByClassName('sc-fzonjX csEuKY');
	   let others = document.getElementsByClassName('sc-fzobTh UpYMB');
	   let aux = document.getElementsByClassName('sc-fznYue kBZZHt');
	   
	   for (let element of contacts)
	   stats.push(element.innerText);
	   
	
	   for (let element of others)
		   stats.push(element.innerText);
	   
		for (let element of aux)
		stats.push(element.innerText);
	
	  // stats.push(intentions);
	  // stats.push(mail);
	   return stats;
	});
	
	 var annoncesOnline= stats[0].replace(',','.');
	 var contactGenerated=stats[1].replace(',','.');
	 var views=stats[2].replace(',','.');
	 var intention=stats[3].replace(/\n/,'').replace(',','.');
	 var mail=stats[4].replace(/\n/,'').replace(',','.');
	 
	log('stats'+stats);
	log('annonces En Ligne'+annoncesOnline);
	log('contact généres'+contactGenerated);
	log('vues'+views);
	log('intentions'+intention);
	log('mail'+mail);
	
	date=new Date();
	month=parseInt(date.getMonth());
	month=month+1;
	day=date.getDate();
	date=day+'-'+month+'-'+date.getFullYear();
	
	
	var stat= [annoncesOnline,contactGenerated,views,intention,mail,date];

	//Recupération annonce

	await page.goto('https://www.leboncoin.fr/compte/pro/mon-activite/');
	log('Go to annonces');

	const annonces = await page.$$eval('div[class="sc-oVpqz gmldoY"]', (nodes) => 
	{	
		return nodes.map((n) => n.innerText + n.getAttribute("href"))}
	);
	//

	console.log(annonces);


	await page.close();
	return stat;
	
	
	
	
	}}