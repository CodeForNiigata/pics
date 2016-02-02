<?php
/*
smartMapping saveData.php
*Copyright (c) 2015 makabe, tomo, mkbtm1968@gmail.com, http://mkbtm.jp/
*Licensed under the MIT license
*/

date_default_timezone_set('Asia/Tokyo');//タイムゾーンの設定

//文字コードの設定
mb_language("Japanese");
mb_internal_encoding("UTF-8");

//レスポンスのjson格納用
$respose = [];

//canvasデータがPOSTで送信されてきた場合
$canvas = $_POST["acceptImage"];

//投稿のタイトル
$title = htmlspecialchars($_POST["title"]);
$name = htmlspecialchars($_POST["name"]);
$category = htmlspecialchars($_POST["category"]);
$abstruct = htmlspecialchars($_POST["abstruct"]);
$latitude = htmlspecialchars($_POST["latitude"]);
$longitude = htmlspecialchars($_POST["longitude"]);

$respose["title"]	 = $title;
$respose["name"] 	 = $name;
$respose["category"] = $category;
$respose["abstruct"] = $abstruct;
$respose["latitude"] = $latitude;
$respose["longitude"]= $longitude;


//abstructの改行をとる
$abstruct = str_replace(array("\r\n", "\r", "\n"), '', $abstruct);


//ヘッダに「data:image/png;base64,」が付いているので、それは外す
$canvas = preg_replace("/data:[^,]+,/i","",$canvas);

//残りのデータはbase64エンコードされているので、デコードする
$canvas = base64_decode($canvas);

//まだ文字列の状態なので、画像リソース化
$image = imagecreatefromstring($canvas);

 //画像保存場所（属性を書き込み可にしておくこと）
$dir = "data/photo/";

//画像ファイルに名前を付ける
 $image_name = date('Y-m-d-His'). '-'. $_SERVER['REMOTE_ADDR'] . '.jpg';

 //投稿日時の取得
 $dateString = date('Y:m:d:H:i:s');


//$handle = fopen($image_name, "w");//追記モードでファイルを開く

//画像として保存（ディレクトリは任意）
//imagesavealpha($image, TRUE); // 透明色の有効
imagejpeg($image , $dir . $image_name);

// $handle


//ファイルへの出力
$handle = fopen("./data/data.txt", "a");//追記モードでファイルを開く
@flock($handle,LOCK_EX); // 排他ロックをかける
fwrite($handle, $latitude . ",");
fwrite($handle, $longitude . ",");
fwrite($handle, $dateString . ",");
fwrite($handle, $title . ",");
fwrite($handle, $name . ",");
fwrite($handle, $abstruct . ",");
fwrite($handle, $category. "," );
fwrite($handle, $image_name );
fwrite($handle, "\n");
fclose($handle);

//バックアップ用に個別ファイルで保存する。ファイル名は$image_nameと同じ。
$bkupFile = "./data/uploadText/" . $image_name . ".txt";
$bkup = fopen($bkupFile, "c");//書き込みモードでファイルを開く
fwrite($bkup, $latitude . ",");
fwrite($bkup, $longitude . ",");
fwrite($bkup, $dateString . ",");
fwrite($bkup, $title . ",");
fwrite($bkup, $name . ",");
fwrite($bkup, $abstruct . ",");
fwrite($bkup, $category. "," );
fwrite($bkup, $image_name );
fwrite($bkup, "\n");
fclose($bkup);


$respose["status"] = "success";
echo json_encode($respose);

exit(0);