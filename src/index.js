import {getLicense,replaceYear,replaceName} from './license-driver.js';
import {getFullParams} from 'scriptparams';
import fs from 'fs';

//y: year
//a: author
//dp: destination path
//f: force (not control if file exist)
let url = 'https://opensource.org/licenses/MIT',
y = '',
a = '',
dp = process.cwd() + '/LICENSE',
nf = true;
// console.log(__dirname);
// console.log(process.cwd());
const params = getFullParams();
if(params.y) y = params.y.replace(/\'|\"/g,"");
if(params.a) a = params.a.replace(/\'|\"/g,"");
if(params.dp) dp = process.cwd() +'/'+ params.dp.replace(/\'|\"/g,"");
if(params.f != undefined) nf = false;
getLicense(url).then( result =>{
  if(y && y.length>0)result = replaceYear(y,result);
  if(a && a.length>0)result = replaceName(a,result);
  // console.log(result)
  if(nf && fs.existsSync(dp) && fs.statSync(dp).isFile()){
    console.log('File exist!!');
  }else{
    fs.writeFileSync(dp,result,'utf8');
    console.log('File created!!');
  }
});
