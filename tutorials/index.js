const puppeteer = require('puppeteer');


/* 
	This code snippet runs puppeteer via headless chrome.
	The function launches puppeteer on line 15. You can launch it and view it at work by adding the object ``headless: false`` as variable 
	line 16 initiates a browser into a variable called page
	line 17 visits url using the method ``goto``
	line 18 aligns the iamge else it will be off 
	line 19 capture the screen via ``screenshot`` method
	line 20 then closes the browser via ``close`` method.. Always remember to close the broswer after 
	Async/Await is highly used as everything is synchronous. >= Node 8.0 is required
*/

async function getPic() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://google.com');
	await page.setViewPort({width:1000, height:500}) 
	await page.screenshot({path: 'google.png'});
	
	await browser.close();
}
getPic();
