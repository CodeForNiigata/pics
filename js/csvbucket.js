/*
	csvを格納して擬似DBのように扱えたらいいなというオブジェクト
	jQueryに依存してます
*/ 

//CSVの参照用
var CSV_KEY_LAT 		= 0;
var CSV_KEY_LNG 		= 1;
var CSV_KEY_DATE 		= 2;
var CSV_KEY_TITLE 	= 3;
var CSV_KEY_AUTHOR	= 4;
var CSV_KEY_COMMENT 	= 5;
var CSV_KEY_CATEGORY	= 6;
var CSV_KEY_IMG 		= 7;

var CSV_PARAMETER_LENGTH = 8;

/* csvデータパターン 20150716
緯度, 経度, 日時, タイトル, 登録者名, 説明, カテゴリー, 画像ファイル名
*/

//var API_FILE_GET = "http://pluscreative.sakura.ne.jp/suga/mapresult/fileget.php";
var API_FILE_GET = "./data/data.txt";
var SEARCH_UNSELECTED =  "未選択";


//グローバルなオブジェクト定義
var CsvBucket = CsvBucket || {};

//クロスドドメイン用のcgiのurl
CsvBucket.API_FILE_GET = API_FILE_GET;
//csvのテキストファイル
CsvBucket.csvDataTxt = "";
//csvを配列したもの
CsvBucket.csvDataArr = "";
//検索条件
CsvBucket.searchOption;


/*
	csvをダウンロード	
*/
CsvBucket.loadCsvData = function(targetURL, callBack){
	
	$.ajax({
		  type: "POST",
		  url: CsvBucket.API_FILE_GET,
		  dataType: "text",
		  data: { url: targetURL },
		  global: false,
		})
		.done(function(data) {
			
			//csvを配列にして保持します
			var arr = $.csv.toArrays(data);
			
			//配列を投稿日が新しい順順にソートします
			arr.sort(function(a,b) {
				return (a[CSV_KEY_DATE] < b[CSV_KEY_DATE] ? 1 : -1);
			});
			
			
			CsvBucket.csvDataTxt = data;
			CsvBucket.csvDataArr = arr;

			
			callBack();			
		})
		.fail(function() {
			//通信エラー
			alert("通信に失敗しました。再読み込みをお試し下さい。")
		})
		.always(function() {
			//処理完了
		}); 
}

// limit
// offset
CsvBucket.getNode = function(obj){
	
	var keyTitle 	= CsvBucket.searchOption.title;
	var keyAuthor 	= CsvBucket.searchOption.author;
	var keyCategory = CsvBucket.searchOption.category;
	
	var limit = obj.limit;
	var offset = obj.offset;
	
	var matchItems = [];
	var resItems = [];

	//マーカーの配列から検索
	CsvBucket.csvDataArr.forEach(function(element, index, arr){	

		if(element.length ==  CSV_PARAMETER_LENGTH){
			///検索条件で絞込
			var flg;
			flg = (element[CSV_KEY_TITLE].indexOf(keyTitle) != -1 	|| keyTitle == "" || keyTitle == "all")						?  true : false; 
			flg = (flg && (element[CSV_KEY_AUTHOR] == keyAuthor 	|| keyAuthor == SEARCH_UNSELECTED || keyAuthor == "all")) 		?  true : false; 
			flg = (flg && (element[CSV_KEY_CATEGORY] == keyCategory || keyCategory == SEARCH_UNSELECTED || keyCategory == "all")) 	?  true : false; 
			
			if(flg) matchItems.push(element);
			
		}
	});	
	
	//全件取得
	if(limit < 0){
		return matchItems;
	}
	
	return matchItems.slice(offset, limit+offset);
}


//投稿者一覧取得
CsvBucket.getAuthors = function(){
	var authorAry = [];
	
	CsvBucket.csvDataArr.forEach(function(element, index, arr){	
		//投稿者を重複しないように保持
		if($.inArray(element[CSV_KEY_AUTHOR], authorAry ) == -1){
			authorAry.push(element[CSV_KEY_AUTHOR]);
		}
	});
	
	return authorAry;
}


//投稿者一覧取得
CsvBucket.getCategories = function(){
	var categoryAry = [];
	
	CsvBucket.csvDataArr.forEach(function(element, index, arr){	
		//カテゴリーを重複しないように保持
		if($.inArray(element[CSV_KEY_CATEGORY], categoryAry ) == -1){
			categoryAry.push(element[CSV_KEY_CATEGORY]);
		}
	});
	
	return categoryAry;
}

