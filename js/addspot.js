var myPhoto = new Image();//リサイズした画像データ
var map = undefined;

// 
// 現在位置の取得
// 
var getGeoLocation = function(callback){
	
	var result = {};
	
	if(navigator.geolocation){ //端末がGeoLocationに対応しているか確認。

		navigator.geolocation.getCurrentPosition(//現在地の取得

			function(position){// 取得に成功した場合の関数

				var data = position.coords;	//取得したデータの整理

				result.lat = data.latitude;
				result.lng = data.longitude;
				result.alt = data.altitude;
				result.accLatlng = data.accuracy;
				result.accAlt = data.altitudeAccuracy;
				result.heading = data.heading;			//0=北,90=東,180=南,270=西
				result.speed = data.speed;
				result.error = undefined; 

				//url = "./map.php?Latitude=" + lat + "&Longitude=" + lng;
				//location.href = url;
				callback(result);
			},

			function(error){//取得に失敗した場合の関数
				//エラーコード(error.code)
				// 0:UNKNOWN_ERROR	  1:PERMISSION_DENIED		 2:POSITION_UNAVAILABLE		 3:TIMEOUT

				var errorInfo = [
					"原因不明のエラーが発生しました。",
					"位置情報の使用を許可してください。",
					"位置情報が取得できませんでした。",
					"タイムアウトエラー。"
				];

				//エラー番号
				var errorNo = error.code;

				//エラーメッセージ
				var errorMessage = "[エラー番号: "+errorNo+"]\n" + errorInfo[errorNo];

				//アラート表示
				alert(errorMessage);
				
				result.error = errorMessage;
				callback(result);
			},

			//[第3引数] オプション
			{
				"enableHighAccuracy": false,
				"timeout": 8000,
				"maximumAge": 2000,
			}

		);

	//対応していない場合
	} else {
		//エラーメッセージ
		var errorMessage = "端末がGeoLacation APIに対応していません。";

		//アラート表示
		alert(errorMessage);
		
		result.error = errorMessage;
		callback(result);
	}

}

// 
// 位置情報取得完了後に呼ばれるcallback
// 
var gotGeoLocation = function(result) {
	
	//連打防止
	if(map != undefined){
		return;
	}
	
	//マップ生成
	var options = {
	    controls:[
	            new OpenLayers.Control.Navigation(), 
	            new OpenLayers.Control.TouchNavigation(), 
	            new OpenLayers.Control.Attribution()
	        ]
	};
	map = new OpenLayers.Map("canvas", options);
	
	//初期位置をイベント会場ににしておきます
	var lat_obj = INIT_LAT;
	var lng_obj = INIT_LNG;
	
	//位置情報が正しく取得できていれば、反映します
	if(result.error == undefined){
		lat_obj = ""+result.lat;
		lng_obj = ""+result.lng;
		
		//マーカーを表示
		var markers = new OpenLayers.Layer.Markers("Markers");
		map.addLayer(markers);
		marker = new OpenLayers.Marker(
	    new OpenLayers.LonLat(lng_obj, lat_obj)
	        .transform(
	            new OpenLayers.Projection("EPSG:4326"), 
	            new OpenLayers.Projection("EPSG:900913")
	        )
		);
		markers.addMarker(marker);
	}
	
	//地図の位置設定
	var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);
     
    var lonLat = new OpenLayers.LonLat(lng_obj, lat_obj)
        .transform(
            new OpenLayers.Projection("EPSG:4326"), 
            new OpenLayers.Projection("EPSG:900913")
        );
    map.setCenter(lonLat, 15);
    
    //送信データを書き換える。		
	$("#latitude").val(String(lat_obj));
	$("#longitude").val(String(lng_obj));
	
	//ダイアログ消します
	$(".dialog-group").fadeOut("slow");
	
	//緯度経度を表示します
	$("#position").text(lat_obj.substring(0, 9) + ", " + lng_obj.substring(0, 9));   
	
	//地図をドラッグして移動したとき。
	map.events.register("move", map, function(){
		var pos = this.getCenter().transform(
            new OpenLayers.Projection("EPSG:900913"), 
            new OpenLayers.Projection("EPSG:4326")
        );
		var lat = ""+pos.lat;
		var lng = ""+pos.lon;
		
		//マップ下に表示している緯度と経度を書き換える。
		$("#position").text(lat.substring(0, 9) + ", " + lng.substring(0, 9));   
		
		//送信データを書き換える。		
		$("#latitude").val(String(lat));
		$("#longitude").val(String(lng));
				
		//マーカーの表示
// 		marker.setPosition(pos);
// 		marker.setTitle('map center: ' + pos);
		//画面上の赤い十字マークはcssの#map_curssor{で表示している。画面幅の中央、高さ方向はマップ高さの1/2に表示。
	});
	
	//ユーザー名用のlocalStorageの処理
	var userName = localStorage.getItem("C4nMapUserName");
	if(userName != null){
		$("#name").val(userName);
	}
		
	//画像を選択した時の処理
	$('input[name=photo]').change(function(e) {
		var file = e.target.files[0];//ファイルの取り出し
		
		//画像処理中の描画をする。
		$("#img_process").fadeIn();
		
		//プレビュー画像を消去する。（以前に選択した画像がある場合への対応）
		$("#image").empty();
		
		//画像のリサイズ
	 	$.canvasResize(file, {
			width: 1000,
			height: 0,
			crop: false,
			quality: 100,
			callback: function(imgData, width, height) {
				//リサイズした画像を画面に表示。
				$('<img>').load(function() {
					$(this).css({
						 'width': width/4,
					 	'height': height/4
					}).appendTo('#image');
					
					$("#image").fadeIn();
					
				}).attr('src', imgData);
				
				myPhoto = imgData;
				
				//画像処理中の表示を消す。
				$("#img_process").fadeOut();
				
				//送信ボタンを表示する。
				$("#sendButton .button").removeClass("disable").prop("disabled", false);
	 		}
		});
	});
}


// 
// sendData
// 
var sendData = function(){
	
	//マスク・ダイアログ表示
	$("#alert-dialog-mask").fadeIn();
	$("#send-dialog").fadeIn();
	
	//マスクが見きれる端末があるので、上にスクロールしてマスク表示
	$('.ons-page-inner').animate({
        scrollTop: 0
    }, 500);
	
	//送信者の名前を保持します
	localStorage.setItem("C4nMapUserName",$("#name").val());

	//送信用データ作成・送信
	var fd = new FormData($('#addSpotForm').get(0));
	fd.append("acceptImage", myPhoto);
	
	$.ajax({
	  url: "saveData.php",
	  type: "POST",
	  data: fd,
	  processData: false,  // jQuery がデータを処理しないよう指定
	  contentType: false   // jQuery が contentType を設定しないよう指定
	}).done(function( res ) {
      //console.log( 'SUCCESS', res );
      
      //結果表示
      $("#send-dialog").hide();
      $("#send-finish-dialog-title").html("送信完了")
      $("#send-finish-dialog-message").html("↓のスポットリストから<br>確認してみましょう！<br><br>続けてスポットを<br>登録することも出来ます。")
      $("#send-finish-dialog").fadeIn();
      
    }).fail(function( jqXHR, textStatus, errorThrown ) {
      //console.log( 'ERROR', jqXHR, textStatus, errorThrown );
      
      //結果表示
      $("#send-dialog").hide();
      $("#send-finish-dialog-title").html("送信失敗")
      $("#send-finish-dialog-message").html("電波の良い所で再度お試しください。")
      $("#send-finish-dialog").fadeIn();
    });
     
}// end of  function sendData()


//
//画面の初期化手順　マップを現在位置を中心に表示
//
function init_addspot() {
	
	//マップデータ初期化
	map = undefined;
	
	//座標取得
	getGeoLocation(gotGeoLocation);
	
	
	//現在地取得スキップ
	$("#dialog-button-cancel").click(function(e){
		var result = {};
		result.error = 1;
		gotGeoLocation(result);
		
		//ダイアログ消します
		$(".dialog-group").fadeOut();
	});
	
	
	//送信の結果ダイアログ
	$("#send-finish-dialog-button").click(function(e){
		//ダイアログ消します
		$(".dialog-group").fadeOut();
	})
}