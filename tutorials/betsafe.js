//import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
const URL = 'https://racing.betsafe.com/calendar/today';
const URL2 = 'file:///home/user/Downloads/Horse%20Racing%20Betting%20&%20Odds%20-%20Bet%20on%20Horse%20Racing%20_%20Betsafe.html';
const URL3 = 'https://racing.betsafe.com/';

const Frame = 'rbIframe';
const timeSelectoo = 'div > ul > li.race';
const timeSelector = '#race-2425795 > div > div.time > span.post-time';
const roug2 = '#content-main > div > div > h1';
const rough = 'div.box:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1) > span:nth-child(1)';
const cityGroupSelector = 'div.box:nth-child(1) > ul:nth-child(2) > li';
const cityNameSelector = 'a:nth-child(1)';

async function run(){
	const browser = await puppeteer.launch();
	console.log('puppeteer initialized');
	const page = await browser.newPage();
	await page.goto(URL, {timeout: 0});
	console.log('Url navigation');
	await page.waitForNavigation({timeout: 300000});
	console.log('navigation completed hopefully\n');
	
	const frame = await page.frames().find(f => f.name() === Frame);
	
	await frame.waitForSelector(cityGroupSelector);
	
	let results = await frame.evaluate((sel, sel2) => {
		let children = Array.from(document.querySelectorAll(sel));
		const cityList = children.map((child) => {
			const cityUrl = child.querySelector(sel2).getAttribute('href');
			return cityUrl;
			
		});
		return cityList;
		
	}, cityGroupSelector, cityNameSelector);
	
	//  let comp = async (res, i) => {
		 let comp = [];
		 for(let i=0; i<results.length; i++){
			// setTimeout(function(){
				await page.goto(URL3+results[i], {timeout: 0}); 
				await page.waitForNavigation({timeout: 300000});
				
				global['frame' + i] = await page.frames().find(f => f.name() === Frame);
				await global['frame' + i].waitForSelector(roug2);
				
				let nextPage = await global['frame' + i].evaluate((sel, sel2, sel3, sel4) => {
					let elements = Array.from(document.querySelectorAll(sel2));
					 let element = elements.filter((elem) => {
							return elem.querySelectorAll('post-time').length > 0;
						});
			
			if(element.length > 0){
					let city = document.querySelector(sel).innerText;
					let time = Array.from(element.querySelectorAll(sel2));
					let timeNode = time.map((child)=> {
						let time = child.querySelector('div.racedetails > div.time > span.post-time').innerText;
						let urlDigits = child.querySelector('a').getAttribute('href');
							let url = `${sel3}${urlDigits}`;
							time = time ? time : "";
							url = url ? url : "";
							return {time: time, url: url};
						})
						let data = new Object();
						data[city] = data[city]|| [];
						data[city] = timeNode;
							//  return data
						   return sel4.push(data);
					}else{
						let city = document.querySelector(sel).innerText;
						let data = new Object();
						data[city] = data[city]|| [];
							//  return data
							return sel4.push(data)
					}
				}, roug2, timeSelectoo, URL3, comp);
			
			// }, 30000);
				
			//  comp.push([newPage]);
		 }

			console.log(results);
		// console.log(JSON.stringify(results, null, 2));
		console.log(comp);
		// await browser.close();
		console.log('\nI just ran');
}

run();