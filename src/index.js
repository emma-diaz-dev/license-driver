#!/usr/bin/env node
import {getLicense} from './license-driver.js';
import {getFullParams} from 'scriptparams';
import fs from 'fs';
import configJson from '../config/settings.json';
import {sep} from 'path';
import {jsonToPrettyTable} from 'showtables';
import chalk from 'chalk';
const replaceYear = (year,str) => str.replace(regY,year);
const replaceName = (name,str) => str.replace(regA,name);
const convertLicText = licText => {
  if(y && y.length>0)licText = replaceYear(y,licText);
  if(a && a.length>0)licText = replaceName(a,licText);
  if(params.o != undefined)console.log(chalk.bgWhite.black(licText));
  if(nf && fs.existsSync(dp) && fs.statSync(dp).isFile()){
    console.log('File exist!!');
  }else{
    fs.writeFileSync(dp,licText,'utf8');
    console.log('File created!!');
  }
};
const localTempalte = () => {
  console.log(chalk.green('get License from Local Templates'));
  if(params.o != undefined)console.log(chalk.bgWhite.black(licText));
  let licText = fs.readFileSync(`${__dirname}/../lic-templates/${license}`).toString();
  convertLicText(licText);
};

//y: year
//a: author
//dp: destination path
//f: force (not control if file exist)
//ni: not internet
//l: license code, example => MIT, ISC, etc
const params = getFullParams();
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
if(params.h != undefined){
jsonToPrettyTable(configJson.help,'blue','white');
}else {
  if(params.l){
    let lic = params.l.trim();
    if(configJson.licenses[lic]){
      url = configJson.licenses[lic].url,
      regY = new RegExp(configJson.licenses[lic].regexp.y),
      regA = new RegExp(configJson.licenses[lic].regexp.a,'g');
    }
  }
  if(params.y) y = params.y.replace(/\'|\"/g,"").replace(/\/|\#|\\/g,'-');
  else if(configJson.default.y)y = configJson.default.y;
  else y = new Date().getFullYear().toString();
  if(params.a) a = params.a.replace(/\'|\"/g,"");
  else if(configJson.default.a)a = configJson.default.a;
  if(params.dp) dp = process.cwd() +'/'+ params.dp.replace(/\'|\"/g,"");
  if(params.f != undefined) nf = false;
  if(params.ni!= undefined) useInternet = false;
  if(!useInternet)localTempalte();
  else getLicense(url)
        .then( licText =>{
          fs.writeFileSync(`${__dirname}/../lic-templates/${license}`,licText,'utf8');
          console.log(chalk.green('get License from Internet'));
          convertLicText(licText)
        })
        .catch( err => {
          localTempalte();
        });
}
