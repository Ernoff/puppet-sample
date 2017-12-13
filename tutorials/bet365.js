const puppeteer = require('puppeteer');
const URL = 'https://www.bet365.com/';
const SportURLSelector = "#dv1 > a";
const horseRaceURLSelector = 'body > div:nth-child(1) > div > div.wc-PageView > div.wc-PageView_Main.wc-HomePage_PageViewMain > div > div.wc-HomePage_ClassificationWrapper.wc-CommonElementStyle_WebNav > div > div > div:nth-child(17)';

const gameSelector = 'body > div:nth-child(1) > div > div.wc-PageView > div.wc-PageView_Main > div > div.wc-CommonElementStyle_PrematchCenter.wc-SplashPage_CenterColumn > div.sm-SplashModule > div:nth-child(1) > div:nth-child(4) > div.sm-MarketGroup_Open > div.sm-RacingMarketGroupChild.sm-Market > div > div';
const timeSelector = 'div.sm-RaceMeeting_NavContainer > div > div > div.sm-RaceMeetingNavBar_HScroll > div > div';
const unitTimeSelector =  'div.sm-AusRacingCouponLink_Countdown';
const citySelector = 'div.sm-MeetingHeader > div.sm-MeetingHeader_LeftContainer > div.sm-MeetingHeader_RaceName';


async function run(){
			const browser = await puppeteer.launch();

	try{
		
		console.log('puppeter initialized');
		const page = await browser.newPage();
		await page.goto(URL);
		await page.click(SportURLSelector);
		await page.waitForSelector(horseRaceURLSelector);
		await page.click(horseRaceURLSelector);
		console.log('Url navigation');
		await page.waitFor(30000);

		
		console.log('navigation completed hopefully');
		let gameGroup = await page.evaluate((sel, sel2, sel3, sel4, sel5) => {
			
			let cityGroup = Array.from(document.querySelectorAll(sel));
			let	cityGrou = cityGroup.filter((elems) => {
					return elems.getAttribute("class").includes('sm-RaceMeeting');
				});
			const cityName = cityGrou.map((child) => {		
					const city = child.querySelector(sel3).innerText;
					 let time = Array.from(child.querySelectorAll(sel4));
					let tim = time.filter((elems)=> {
						return elems.querySelectorAll(sel5).length > 0;
					});
					 const timeNode = tim.map((chi) => {
						 let perTime = chi.querySelectorAll(sel5).innerText;
					 	 perTime = perTime ? perTime : "";
						let urlResult = chi.wrapper.data.PD.slice(1, -1).replace(/#/g,"/");
					 	let url = `${sel2}#/${urlResult}`;
						//  return {time: perTime};
						 return { time: perTime, url: url };
				
					 });

					const result = new Object();
					result[city] = result[city] || [];
					result[city] = timeNode;
					
					return result;
			});
			
			return cityName;
		
		}, gameSelector, URL, citySelector, timeSelector, unitTimeSelector);
			
		console.log(JSON.stringify(gameGroup, null, 2));
		 await browser.close();
		console.log('I just ran');
	
	} catch(e){
		console.log(`Error encountered: ${e}`)
		 await browser.close();
	}

}

run();