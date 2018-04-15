import request from 'request';
import cheerio from 'cheerio';

module.exports.getLicense = (url) => {
  return new Promise((resolve,reject) => {
    request(url,(err,res,body) => {
      // console.log('antes del body');
      // console.log(body.errno);
      if(err){
        reject('Error');
      }
      else{
        let $ = cheerio.load(body);
        let mainText = $("div[class='field-item even']").text();
        let arrText = mainText.split('\n')
        for(let i in arrText){
          if(arrText[i].indexOf('Copyright')!=-1){
            arrText = arrText.slice(i);
            break;
          }
        }
        mainText = arrText.join('\n');
        resolve(mainText);
      }

    })
  });
};
