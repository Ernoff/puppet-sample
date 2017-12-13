const puppeteer = require('puppeteer');
const LIST_DATE_SELECTOR= `#horseRacingEventWindow_INDEX_top > div.horseEvent__container > div`
const TRACK_NAME_SELECTOR = '#bra_61 > ul > li.all_leagues.fiveColumns > div';
const URL = 'https://www.realdealbet.co.uk/sports/horse-racing/';
const URL3 = '#gui_filter_mode_3_dateFilter_1';
const URL2 = 'file:///home/user/Downloads/Horse%20Racing%20Betting%20Odds%20_%20Live%20Sports%20betting%20online%20at%20RealDealBet.html'
const gametime = '#bra_61 > ul:nth-child(3) > li';

async function run(){
			const browser = await puppeteer.launch({headless:false});
	try{
		console.log('puppeter initialized');
		const page = await browser.newPage();
		await page.goto(URL, {timeout:0});
		await page.waitForNavigation({timeout: 200000});
		// click on tomorrow because today games has finished
		// await page.click(URL3);
		console.log('Url navigation');
		
		console.log('navigation completed hopefully');
		
		const CC = "#bra_61 > ul > li.all_leagues.fiveColumns > div";

		const titleresult = await page.evaluate((sel) => {
			let elements = Array.from(document.querySelectorAll(sel));
			let element = elements.filter((elem) => {
				return elem.getAttribute('class') === 'trackName';
			});
			 // #bra_61 > ul:nth-child(2) > li.all_leagues.fiveColumns > div:nth-child(8) > a
			 
		const children = element.map((child) => {
			const city = child.querySelector('a').innerText;
			
			 let a = child.querySelector(`[title="${city}"]`).onclick();
			 let b = Array.from(child.getElementsByClassName('events'));
			// const waitForElementToDisplay = (selector, time) => {
				
			// 	// selector = 'events', time = 5000;
			// 	if(document.getElementsByClassName(selector).length === 0) {
			// 					// const races = Array.from(child.getElementsByClassName('events'));
			// 					// 	const target = races.map(chil => {
			// 					// 		let title = chil.querySelector('.horseEvent__title').innerText
			// 					// 		return "title";
			// 					// 	});
			// 					setTimeout(function() {
			// 				waitForElementToDisplay(selector, time);
			// 			 }, time);
			// 	}
			// 	else {
			// 		 alert(document.getElementsByClassName(selector).length)
			// 					return document.getElementsByClassName(selector).length;
			// 	}
				// return;
			// }
			//  return waitForElementToDisplay('events', 5000);	
			 return b;	
						
			});
			
		
				return children;
				
			}, TRACK_NAME_SELECTOR);
			// titleresult.forEach((element)=> {
			// 	 await page.click('a');
			// 	 await page.waitForSelector('.events');

			// })
		console.log(titleresult);
		console.log('I just ran');
		// await browser.close();
	} catch(e){
		console.log(`Error encountered: ${e}`)
		// await browser.close();
	}

}

run();
		