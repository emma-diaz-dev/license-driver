'use strict';

var _licenseDriver = require('./license-driver.js');

var _scriptparams = require('scriptparams');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//y: year
//a: author
//dp: destination path
//f: force (not control if file exist)
var url = 'https://opensource.org/licenses/MIT',
    y = '',
    a = '',
    dp = process.cwd() + '/LICENSE',
    nf = true;
// console.log(__dirname);
// console.log(process.cwd());
var params = (0, _scriptparams.getFullParams)();
if (params.y) y = params.y.replace(/\'|\"/g, "");
if (params.a) a = params.a.replace(/\'|\"/g, "");
if (params.dp) dp = process.cwd() + '/' + params.dp.replace(/\'|\"/g, "");
console.log(params.f);
if (params.f != undefined) nf = false;
(0, _licenseDriver.getLicense)(url).then(function (result) {
  if (y && y.length > 0) result = (0, _licenseDriver.replaceYear)(y, result);
  if (a && a.length > 0) result = (0, _licenseDriver.replaceName)(a, result);
  // console.log(result)
  if (nf && _fs2.default.existsSync(dp) && _fs2.default.statSync(dp).isFile()) {
    console.log('File exist!!');
  } else {
    _fs2.default.writeFileSync(dp, result, 'utf8');
    console.log('File created!!');
  }
});