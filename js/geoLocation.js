//

function getGeoLocation(callback){
	
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
				//alert(errorMessage);
				
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
		//alert(errorMessage);
		
		result.error = errorMessage;
		callback(result);
	}

}
