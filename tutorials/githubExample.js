const mongoose= require('mongoose');
const User = require('../config/user.js')
const puppeteer = require('puppeteer');
const USERNAME_SELECTOR = '#login_field';
const PASSWORD_SELECTOR = '#password';
const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block'
const CREDS = require('../config/cred.js');
const userToSearch = 'john';
const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users&utf8=%E2%9C%93`;
//const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(1) > div.d-flex > div > a';
const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > a';
// const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(2) >div.d-flex > div > ul > li:nth-child(2) > a';
const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) >div.d-flex > div > ul > li:nth-child(2) > a';
const LENGTH_SELECTOR_CLASS = 'user-list-item';

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
              await page.goto('http://github.com/login');
              await page.click(USERNAME_SELECTOR);
              await page.keyboard.type(CREDS.username);
              await page.click(PASSWORD_SELECTOR);
              await page.keyboard.type(CREDS.password);
              await page.click(BUTTON_SELECTOR);
              await page.waitForNavigation();
              await page.goto(searchUrl);
              await page.waitFor(2*1000);
  let listLength = await page.evaluate((sel) => {
    return document.getElementsByClassName(sel).length;
  }, LENGTH_SELECTOR_CLASS); 
  for(let i = 1; i<=listLength; i ++){
    let usernameSelector = LIST_USERNAME_SELECTOR.replace("INDEX", i);
    let emailSelector = LIST_EMAIL_SELECTOR.replace("INDEX", i);
    let username = await page.evaluate((sel) => {
      return document.querySelector(sel).getAttribute('href').replace("/","");
    }, usernameSelector) ;
    let email = await page.evaluate((sel) => {
      let element = document.querySelector(sel);
      return element ? element.innerHTML : null
    }, emailSelector);
    if(!email)
    continue;
    console.log(username, ' -> ', email);
    
  }
   upsertUser({
    username: username, 
    email: email, 
    dateCrawled: new Date()
  });
  browser.close();
};


function upsertUser(userObj) {
  console.log('ran here')
  if(mongoose.connection.readystate === 0){ mongoose.connect(CREDS.db_url);}
  console.log('ran next');
  //Update if email exists else insert
  
  let conditions = { email: userObj.email};
  let options = { upsert: true, new: true, setDefaultOnInsert: true};
  
  User.findOneAndUpdate(conditions, userObj, options, (err, result) => {
    console.log('ran finally');
    if(err) throw err;
    else console.log('records updated')
  });
};


run();