#!/usr/bin/env node
'use strict';

var _licenseDriver = require('./license-driver.js');

var _scriptparams = require('scriptparams');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _settings = require('../config/settings.json');

var _settings2 = _interopRequireDefault(_settings);

var _path = require('path');

var _showtables = require('showtables');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

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
  if (params.o != undefined) console.log(_chalk2.default.bgWhite.black(licText));
  if (nf && _fs2.default.existsSync(dp) && _fs2.default.statSync(dp).isFile()) {
    console.log('File exist!!');
  } else {
    _fs2.default.writeFileSync(dp, licText, 'utf8');
    console.log('File created!!');
  }
};
var localTempalte = function localTempalte() {
  console.log(_chalk2.default.green('get License from Local Templates'));
  if (params.o != undefined) console.log(_chalk2.default.bgWhite.black(licText));
  var licText = _fs2.default.readFileSync(__dirname + '/../lic-templates/' + license).toString();
  convertLicText(licText);
};

//y: year
//a: author
//dp: destination path
//f: force (not control if file exist)
//ni: not internet
//l: license code, example => MIT, ISC, etc
var params = (0, _scriptparams.getFullParams)();
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
if (params.h != undefined) {
  (0, _showtables.jsonToPrettyTable)(_settings2.default.help, 'blue', 'white');
} else {
  if (params.l) {
    var lic = params.l.trim();
    if (_settings2.default.licenses[lic]) {
      url = _settings2.default.licenses[lic].url, regY = new RegExp(_settings2.default.licenses[lic].regexp.y), regA = new RegExp(_settings2.default.licenses[lic].regexp.a, 'g');
    }
  }
  if (params.y) y = params.y.replace(/\'|\"/g, "").replace(/\/|\#|\\/g, '-');else if (_settings2.default.default.y) y = _settings2.default.default.y;else y = new Date().getFullYear().toString();
  if (params.a) a = params.a.replace(/\'|\"/g, "");else if (_settings2.default.default.a) a = _settings2.default.default.a;
  if (params.dp) dp = process.cwd() + '/' + params.dp.replace(/\'|\"/g, "");
  if (params.f != undefined) nf = false;
  if (params.ni != undefined) useInternet = false;
  if (!useInternet) localTempalte();else (0, _licenseDriver.getLicense)(url).then(function (licText) {
    _fs2.default.writeFileSync(__dirname + '/../lic-templates/' + license, licText, 'utf8');
    console.log(_chalk2.default.green('get License from Internet'));
    convertLicText(licText);
  }).catch(function (err) {
    localTempalte();
  });
}