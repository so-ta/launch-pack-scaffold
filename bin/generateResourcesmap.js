#!/usr/bin/env node

const fs = require("fs");
const path = require('path');
const shell = require('shelljs');
const sha256File = require('sha256-file');

const rootPath = path.join(__dirname, '..');
const distDirPath = path.join(rootPath, 'public');
const resourcesmapFileName = 'resourcesmap.json';
const hashedDirName = 'hashed';

const getFilePath = (...args) => {
  return path.join(distDirPath, ...args);
};

// 前処理
const resourcesmapFilePath = getFilePath(resourcesmapFileName);
const hashedDirPath = getFilePath(hashedDirName);
(() => {
  shell.rm('-rf', resourcesmapFilePath);
  shell.rm('-rf', hashedDirPath);
  shell.mkdir('-p', hashedDirPath);
})();

const walk = (dir, callback) => {
  let dirents;
  try {
    dirents = fs.readdirSync(dir, {withFileTypes: true});
  } catch (err) {
    console.error('対象ディレクトリを読み取ることができませんでした: ' + err.message);
    return;
  }

  dirents.forEach((dirent) => {
    const filePath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      walk(filePath, callback);
    } else {
      callback(filePath);
    }
  });
};

let resourcesmap = {};
walk(distDirPath, (filePath) => {
// 隠しファイルは対象としない
  if ((/(^|\/)\.[^\/\.]/g).test(filePath)) {
    return;
  }

  const hashedFileName = sha256File(filePath) + path.extname(filePath);

// ファイル名をハッシュ値にしてハッシュ済みディレクトリにコピー
  shell.cp(filePath, path.join(hashedDirPath, hashedFileName));

// キーは`distDirPath`をルートとした相対パス
  resourcesmap['/' + path.relative(distDirPath, filePath)] = hashedFileName;
});

// resourcesmapを作成
fs.writeFileSync(resourcesmapFilePath, JSON.stringify(resourcesmap));

console.log("[generateResourcesmap] '%s' has been generated successfully.", resourcesmapFileName);
