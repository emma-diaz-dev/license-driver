'use strict';

var _licenseDriver = require('./license-driver.js');

var _scriptparams = require('scriptparams');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _settings = require('../config/settings.json');

var _settings2 = _interopRequireDefault(_settings);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var replaceYear = function replaceYear(year, str) {
  return str.replace(regY, year);
};
var replaceName = function replaceName(name, str) {
  return str.replace(regA, name);
};
var convertLicText = function convertLicText(licText) {
  if (y && y.length > 0) licText = replaceYear(y, licText);
  if (a && a.length > 0) licText = replaceName(a, licText);
  // console.log(result)
  if (nf && _fs2.default.existsSync(dp) && _fs2.default.statSync(dp).isFile()) {
    console.log('File exist!!');
  } else {
    _fs2.default.writeFileSync(dp, licText, 'utf8');
    console.log('File created!!');
  }
};

var localTempalte = function localTempalte() {
  console.log('get License with Local Templates');
  var licText = _fs2.default.readFileSync('./lic-templates/' + license).toString();
  // console.log(licText);
  convertLicText(licText);
};

//y: year
//a: author
//dp: destination path
//f: force (not control if file exist)
var license = _settings2.default.default.license,
    useInternet = _settings2.default.default.useInternet,
    url = _settings2.default.licenses[license].url,
    regY = new RegExp(_settings2.default.licenses[license].regexp.y),
    regA = new RegExp(_settings2.default.licenses[license].regexp.a, 'g'),
    y = '',
    a = '',
    dp = process.cwd() + _path.sep + _settings2.default.default.fileName,
    nf = _settings2.default.default.notForce,
    l = '';
// console.log(__dirname);
// console.log(process.cwd());
var params = (0, _scriptparams.getFullParams)();
// console.log(params.l);
// console.log(configJson.licenses['ISC']);
// console.log(configJson.licenses[params.l]);
if (params.l) {
  var lic = params.l.trim();
  if (_settings2.default.licenses[lic]) {
    license = lic, url = _settings2.default.licenses[license].url, regY = new RegExp(_settings2.default.licenses[license].regexp.y), regA = new RegExp(_settings2.default.licenses[license].regexp.a, 'g');
  }
}
if (params.y) y = params.y.replace(/\'|\"/g, "").replace(/\/|\#|\\/g, '-');
if (params.a) a = params.a.replace(/\'|\"/g, "");
if (params.dp) dp = process.cwd() + '/' + params.dp.replace(/\'|\"/g, "");
if (params.f != undefined) nf = false;
if (!useInternet) localTempalte();else (0, _licenseDriver.getLicense)(url).then(function (licText) {
  _fs2.default.writeFileSync(__dirname + '/../lic-templates/' + license, licText, 'utf8');
  console.log('get License with Internet');
  convertLicText(licText);
}).catch(function (err) {
  localTempalte();
});