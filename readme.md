# AnyApp Scaffold
ベースとなるフロントエンドを管理するリポジトリです。

## ディレクトリ構成
```
launch-pack-scaffold
 └ bin      # コンパイルに必要なプログラムが格納されています
 └ config   # ルーティングに関する情報を管理します。
 └ data     # サンプルのjsonを管理します。
 └ public   # コンパイル結果が出力されます。
 └ src      # 画像やcss,javascriptを管理します。
 └ views    # htmlを管理します。
```

# 環境構築
`nodejs` `12.10` 以降のバージョンが必要になります。  

## 起動方法
`yarn install` で依存パッケージのインストールを行った後、  
`yarn start` で起動を行ってください。

`localhost:3000` でアクセスすることができるようになります。  
ソースコードの変更を行うと自動的にリビルドがされ、Webページが更新されます。  

## フレームワーク
テンプレートエンジンにECTを使用しています。  
ECTをラップするフレームワークとして、launch-pack を使用しています。

launch-packの説明は下記Qiitaに記載しています。  
https://qiita.com/so-ta/private/21d4519294c5e0ff4495