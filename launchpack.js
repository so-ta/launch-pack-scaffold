/*
 任意のスクリプトを実行することができます。
 */

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Tokyo");

// フォーマットの記載方法
// https://momentjs.com/docs/#/displaying/format/
exports.timeFormat = (timeStr, format) => {
  if (timeStr == null) {
    return "";
  }
  let time = moment(timeStr);
  return time.format(format);
};

exports.exampleStatusText = (status) => {
  switch (status) {
    case "failed":
      return "失敗";
    case "success":
      return "成功";
  }
};
