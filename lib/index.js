'use strict';

var _licenseDriver = require('./license-driver.js');

var _scriptparams = require('scriptparams');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _settings = require('../config/settings.json');

var _settings2 = _interopRequireDefault(_settings);

var _path = require('path');

var _showtables = require('showtables');

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
  convertLicText(licText);
};

//y: year
//a: author
//dp: destination path
//f: force (not control if file exist)
//ni: not internet
//l: license code, example => MIT, ISC, etc
var params = (0, _scriptparams.getFullParams)();
if (params.h != undefined) {
  (0, _showtables.jsonToPrettyTable)(_settings2.default.help, 'blue', 'white');
} else {
  var _license = _settings2.default.default.license,
      useInternet = _settings2.default.default.useInternet,
      url = _settings2.default.licenses[_license].url,
      _regY = new RegExp(_settings2.default.licenses[_license].regexp.y),
      _regA = new RegExp(_settings2.default.licenses[_license].regexp.a, 'g'),
      _y = '',
      _a = '',
      _dp = process.cwd() + _path.sep + _settings2.default.default.fileName,
      _nf = _settings2.default.default.notForce,
      l = '';
  if (params.l) {
    var lic = params.l.trim();
    if (_settings2.default.licenses[lic]) {
      url = _settings2.default.licenses[lic].url, _regY = new RegExp(_settings2.default.licenses[lic].regexp.y), _regA = new RegExp(_settings2.default.licenses[lic].regexp.a, 'g');
    }
  }
  if (params.y) _y = params.y.replace(/\'|\"/g, "").replace(/\/|\#|\\/g, '-');else if (_settings2.default.default.y) _y = _settings2.default.default.y;else _y = new Date().getFullYear().toString();
  if (params.a) _a = params.a.replace(/\'|\"/g, "");else if (_settings2.default.default.a) _a = _settings2.default.default.a;
  if (params.dp) _dp = process.cwd() + '/' + params.dp.replace(/\'|\"/g, "");
  if (params.f != undefined) _nf = false;
  if (params.ni != undefined) useInternet = false;
  if (!useInternet) localTempalte();else (0, _licenseDriver.getLicense)(url).then(function (licText) {
    _fs2.default.writeFileSync(__dirname + '/../lic-templates/' + _license, licText, 'utf8');
    console.log('get License with Internet');
    convertLicText(licText);
  }).catch(function (err) {
    localTempalte();
  });
}