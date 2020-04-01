const gulp = require('gulp');
const fs = require("fs");
const path = require('path');
const del = require('del');
const sha256File = require('sha256-file');
const child_process = require('child_process');
const gulpWatch = require('gulp-watch');

const npmRun = (command) => {
  return new Promise(function (resolve, reject) {
    let proc = child_process.spawn('npm', ['run', command], {
      cwd: './'
    });

    console.log("child:" + proc.pid);
    proc.stdout.on('data', (data) => {
      console.log(data.toString().replace(/\n+$/g, ''));
    });

    proc.stderr.on('data', (data) => {
      console.log('exec error: ' + data.toString().replace(/\n+$/g, ''));
    });

    proc.on('close', (code) => {
      console.log("close");
      resolve()
    })
  });
};

const generateResourcesmap = () => {
  return new Promise(function (resolve, reject) {
    /* 既存のresourcemapを削除する */
    let resourcesmapPath = path.join('public', 'resourcesmap.json');
    if (fs.existsSync(resourcesmapPath)) {
      fs.unlinkSync(resourcesmapPath);
    }

    /* 既存のhashを削除する */
    let resourcesHashedDir = path.join('public', 'hashed');
    if (fs.existsSync(resourcesHashedDir)) {
      del.sync(['public/hashed/**']);
    }else{
      fs.mkdirSync(resourcesHashedDir);
    }

    /* ファイル一覧のket/value Objectを作成 */
    let fileItemsObj = {};
    const readTopDirSync = ((folderPath, resourcesMapPath) => {
      let items = fs.readdirSync(folderPath);
      items.forEach((itemPath) => {
        let itemFullPath = path.join(folderPath, itemPath);
        let itemResourcesMapPath = resourcesMapPath + itemPath;
        if (!fs.statSync(itemFullPath).isDirectory()) {
          let filename = sha256File(itemFullPath) + path.extname(itemFullPath);
          fileItemsObj[itemResourcesMapPath] = filename;
          console.log(itemResourcesMapPath);
          fs.createReadStream("public" + itemResourcesMapPath).pipe(fs.createWriteStream('public/hashed/' + filename));
        } else {
          readTopDirSync(itemFullPath, resourcesMapPath + itemPath + "/");
        }
      });
    });
    let folderPath = path.join('public');
    readTopDirSync(folderPath, "/");

    /* jsonにして書き込み */
    let resourcesmapPathJson = JSON.stringify(fileItemsObj, null, "  ");
    fs.writeFileSync(resourcesmapPath, resourcesmapPathJson);
    resolve();
  });
};

gulp.task('generateResourcesmap',async function () {
  Promise.resolve()
    .then(function () {
      return generateResourcesmap()
    })
});

gulp.task('watch', function () {
  gulpWatch('src/**/*', function (event) {
    Promise.resolve()
      .then(function () {
        return npmRun("webpack")
      })
      .then(function () {
        return generateResourcesmap()
      })
  });
});

gulp.task('default', function () {
});
