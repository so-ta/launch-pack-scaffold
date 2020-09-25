/*
 任意のスクリプトを実行することができます。
 */

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Tokyo");

// フォーマットの記載方法
// https://momentjs.com/docs/#/displaying/format/
exports.timeFormat = (format, timeStr = "") => {
  let time = moment();
  if (timeStr) {
    time = moment(timeStr)
  }
  return time.format(format);
};

const escape_html = (string) => {
  if (typeof string !== 'string') {
    return string;
  }
  return string.replace(/[&'`"<>]/g, function (match) {
    return {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;',
    }[match]
  });
};
exports.escape_html = escape_html;

exports.br = (str) => {
  return escape_html(str).replace(/\r?\n/g, '<br>');
};


exports.exampleStatusText = (status) => {
  switch (status) {
    case "failed":
      return "失敗";
    case "success":
      return "成功";
  }
};