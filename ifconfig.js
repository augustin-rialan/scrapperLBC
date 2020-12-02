const pw = require('playwright');
const fs = require('fs');
const { dosDateTimeToDate } = require('yauzl');
const { cpuUsage } = require('process');
const mongoose = require('mongoose');
const Time = require('./models/Time.js');


module.exports = {
play: async function() {
	/*
	const userDataDir='testProfile-3';

	const context = await pw.webkit.launchPersistentContext(userDataDir,{
		headless: true,
		ignoreHTTPSErrors: true, // To allow https url
		args: ['--proxy-server=proxy.crawlera.com:8010']
	
	  });
const page = await context.newPage();
await page.setExtraHTTPHeaders({
    'Proxy-Authorization': 'Basic ' + Buffer.from('f2c2b219c32d44fdb9fa14983fe4707f:').toString('base64'),
});
*/
const browser = await pw.webkit.launch({headless:false
});

const context = await browser.newContext();

const page = await context.newPage();

await page.goto('https://www.leboncoin.com');

const content = await page.content();
console.log(content);





}

}