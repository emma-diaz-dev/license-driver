'use strict';

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports.getLicense = function (url) {
  return new Promise(function (resolve, reject) {
    (0, _request2.default)(url, function (err, res, body) {
      // console.log('antes del body');
      // console.log(body.errno);
      if (err) {
        reject('Error');
      } else {
        var $ = _cheerio2.default.load(body);
        var mainText = $("div[class='field-item even']").text();
        var arrText = mainText.split('\n');
        for (var i in arrText) {
          if (arrText[i].indexOf('Copyright') != -1) {
            arrText = arrText.slice(i);
            break;
          }
        }
        mainText = arrText.join('\n');
        resolve(mainText);
      }
    });
  });
};