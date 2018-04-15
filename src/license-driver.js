import request from 'request';
import cheerio from 'cheerio';

module.exports.getLicense = (url) => {
  return new Promise((resolve,reject) => {
    request(url,(err,res,body) => {
      if(err)reject(`erro in web site: ${url}`);
      let $ = cheerio.load(body);
      let mainText = $("div[class='field-item even']").text();
      let arrText = mainText.split('\n')
      for(let i in arrText){
        if(arrText[i].indexOf('Copyright')!=-1){
          arrText = arrText.slice(i);
          break;
        }
      }
      // arrText = arrText.filter( el => (el && el != undefined && el.length > 0));
      mainText = arrText.join('\n');
      resolve(mainText);
    })
  });
};

module.exports.replaceYear = (year,str) => str.replace(/\<YEAR\>/,year);

module.exports.replaceName = (name,str) => str.replace(/\<COPYRIGHT\sHOLDER\>/,name);
