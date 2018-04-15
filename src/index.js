import {getLicense} from './license-driver.js';
import {getFullParams} from 'scriptparams';
import fs from 'fs';
import configJson from '../config/settings.json';
import {sep} from 'path';

const replaceYear = (year,str) => str.replace(regY,year);
const replaceName = (name,str) => str.replace(regA,name);
const convertLicText = licText => {
  if(y && y.length>0)licText = replaceYear(y,licText);
  if(a && a.length>0)licText = replaceName(a,licText);
  if(nf && fs.existsSync(dp) && fs.statSync(dp).isFile()){
    console.log('File exist!!');
  }else{
    fs.writeFileSync(dp,licText,'utf8');
    console.log('File created!!');
  }
};
const localTempalte = () => {
  console.log('get License with Local Templates');
  let licText = fs.readFileSync(`./lic-templates/${license}`).toString();
  convertLicText(licText);
};

//y: year
//a: author
//dp: destination path
//f: force (not control if file exist)
let license = configJson.default.license,
useInternet = configJson.default.useInternet,
url = configJson.licenses[license].url,
regY = new RegExp(configJson.licenses[license].regexp.y),
regA = new RegExp(configJson.licenses[license].regexp.a,'g'),
y = '',
a = '',
dp = process.cwd() +sep+ configJson.default.fileName,
nf = configJson.default.notForce,
l = '';
const params = getFullParams();
if(params.l){
  let lic = params.l.trim();
  if(configJson.licenses[lic]){
    url = configJson.licenses[lic].url,
    regY = new RegExp(configJson.licenses[lic].regexp.y),
    regA = new RegExp(configJson.licenses[lic].regexp.a,'g');
}
}
if(params.y) y = params.y.replace(/\'|\"/g,"").replace(/\/|\#|\\/g,'-');
if(params.a) a = params.a.replace(/\'|\"/g,"");
if(params.dp) dp = process.cwd() +'/'+ params.dp.replace(/\'|\"/g,"");
if(params.f != undefined) nf = false;
if(!useInternet)localTempalte();
else getLicense(url)
      .then( licText =>{
        fs.writeFileSync(`${__dirname}/../lic-templates/${license}`,licText,'utf8');
        console.log('get License with Internet');
        convertLicText(licText)
      })
      .catch( err => {
        localTempalte();
      });
