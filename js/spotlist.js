function init_spotlist(){
	
	//サーバー
	var SERVER_DIR_IMG = "./data/photo/";
	var SERVER_FILE_CSV = "./data/data.txt"
	
	//Open Street Map
	var map;
	//csvの配列
	var makerDataAry;
	//Marker
	var layerMarkers = new OpenLayers.Layer.Markers("Markers");
	var markers = [] ;
	//選択中のマーカー
	var highlightMaker;
	//選択中のマーカーの情報ウィンドウ
	var infoWindow;
	//投稿者名リスト
	var authorAry = [];
	//カテゴリーリスト
	var categoryAry = [];
	//マーカーの吹き出し
	var popup = undefined;
	
	
	var limit = -1;//全件取得
	var offset = 0;
	
	
	//マップ生成スタート
	makeMap(INIT_LAT, INIT_LNG);
	
	
	/*****************************************
		
		Open Street Mapを生成します				
		
	*****************************************/
	function makeMap(lat, lng){
    	
	    //キャンパスの要素を取得します
		var canvas = document.getElementById( "canvas" );
		
		//マップ生成
		var options = {
		    controls:[
		            new OpenLayers.Control.Navigation(), 
		            new OpenLayers.Control.TouchNavigation(), 
		            new OpenLayers.Control.Attribution()
		        ]
		};
		map = new OpenLayers.Map("canvas", options);
		
		//マップの位置設定
		var mapnik = new OpenLayers.Layer.OSM();
	    map.addLayer(mapnik);
	     
	    var lonLat = new OpenLayers.LonLat(lng, lat)
	        .transform(
	            new OpenLayers.Projection("EPSG:4326"), 
	            new OpenLayers.Projection("EPSG:900913")
	        );
	    map.setCenter(lonLat, 15);
	    
	    //marker用レイヤー
	    map.addLayer(layerMarkers);
	    
		//csvのダウンロード
		CsvBucket.loadCsvData(SERVER_FILE_CSV, function (){
			//絞り込み条件
			CsvBucket.searchOption = {title:'all', author:'all', category:'all'};
			
			//マーカー生成
			makeMaker(CsvBucket.getNode({limit:limit, offset:offset}));
		});
    }
    
        
    /*****************************************
		
		マーカーを生成
		
	*****************************************/
    var makeMaker = function (makerDataAry){
	    
	    var bounds = new OpenLayers.Bounds();
	    
	    //マーカーを作成、設置する
	    makerDataAry.forEach(function(element, index, ary){
		    
		    var nodeIndex = $('#list-view-wrapper .media').length;
		    
			//マーカー生成
			var lonlat = new OpenLayers.LonLat(element[CSV_KEY_LNG], element[CSV_KEY_LAT])
				.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
			var marker = new OpenLayers.Marker(lonlat);
			marker.tag = element[CSV_KEY_TITLE];
			marker.x   = element[CSV_KEY_LNG];
			marker.y   = element[CSV_KEY_LAT];
			
			layerMarkers.addMarker(marker);
			markers[nodeIndex] = marker;
			
			marker.events.register('touchstart', marker, function(evt){
				
				//情報ウィンドウ表示します
				showInfoWindow(marker);
								
				//リストビューで該当のノードを表示します	
				var mp = $("#media-node-"+nodeIndex).position() ;
				var lt = $("#map-menu-wrapper").scrollTop();
				var lp = $("#map-menu-wrapper").position();
				var pos = mp.top + lt - lp.top;
				$("#map-menu-wrapper").animate({scrollTop: pos},"slow", "swing");
				
				//ノードをアクティブ表示
				$('.media').removeClass("active");
				$("#media-node-"+nodeIndex).addClass("active");	
				
				OpenLayers.Event.stop(evt);
			});
		
			//リストビューに追加
			addNode2ListView(element);
			
			//bounsにも保持
			bounds.extend(lonlat);
		});
		
		
		//マーカーを全部おいたら地図の拡大率設定
		map.zoomToExtent(bounds, true);
		
		//loading消して、画面表示
		$('#main-wrapper').delay(1000).removeClass('hidden');
		$('#preloader').delay(1000).fadeOut('slow');
		
		//Lazy Loadを起動する
		$(function(){
			$("img.lazy").lazyload({
				effect : "fadeIn",
				container: $('#list-view-wrapper')
			});
		});
	}
	
	
	/*****************************************
		
		リストビューにノードを追加します
	
	*****************************************/
	function addNode2ListView(element){
		
		var imgURL  = SERVER_DIR_IMG + element[CSV_KEY_IMG];
		
		var index = $('#list-view-wrapper .media').length;
		
		//日付の整形
		var m = moment(element[CSV_KEY_DATE],'YYYY:MM:DD:hh:mm:ss');
		var preformattedDate = m.format('YYYY/MM/DD HH:mm:ss');
		
		
		var media = '<div id="media-node-'+index+'"class="media" data-list-index="'+index+'">'
						+'<div class="media-left media-middle">'
							+'<a href="'+imgURL+'" target="_blank">'
								+'<img src="'+imgURL+'" data-original="'+imgURL+'" class="media-object lazy"  style="width: 80px; height: auto; alt="写真">'
							+'</a>'
						+'</div>'
						+'<div class="media-body">'
							+'<h4 class="media-heading">'+element[CSV_KEY_TITLE]+'</h4>'
							+'<p class="media-comment">'+element[CSV_KEY_COMMENT]+'</p>'
							+'<p class="small">投稿者: '+element[CSV_KEY_AUTHOR]+'<br>'
							+'カテゴリー: '+element[CSV_KEY_CATEGORY]+'<br>'
							+'投稿日: '+preformattedDate+'</p>'
							//+'<p class="media-position">緯度:'+element[CSV_KEY_LAT]+', 経度:'+element[CSV_KEY_LNG]+'</p>'
						+'</div>'
					+'</div>';
		
		$(media).appendTo($('#list-view-wrapper')).click(function(event){
						
			//タグからマーカーのindexを取得します
			var index = $(event.currentTarget).data('list-index');
			
			//表示するマーカーを取得
			marker = markers[index];
						
			//マップをピンの位置まで移動します
			map.setCenter(new OpenLayers.LonLat(marker.x, marker.y)
				              .transform( 
				              	new OpenLayers.Projection("EPSG:4326"), 
							  	new OpenLayers.Projection("EPSG:900913")
						),//lonlat
						map.zoom,//zoom
						false,//dragging
						true);//forceZoomChange
			
			//マップの拡大率変更
			//map.setZoom(16);
			
			//ピンのアニメーション
			//highlightMaker.setAnimation( google.maps.Animation.DROP ) ;						
			
			//情報ウィンドウ表示
			showInfoWindow(marker);	
			
			//ノードをアクティブ表示
			$('.media').removeClass("active");
			$(event.currentTarget).addClass("active");
		});
	}
	
	
	//情報ウィンドウ
	function showInfoWindow(marker){
		//既に表示していたらクローズ
		if (popup) map.removePopup(popup); 
		
		//情報ウィンドウ生成
	    popup = new OpenLayers.Popup.FramedCloud(
	            "Popup",        // id               {String}
	            new OpenLayers.LonLat(marker.x, marker.y)
				              .transform( 
				              		new OpenLayers.Projection("EPSG:4326"), 
							  		new OpenLayers.Projection("EPSG:900913")
				), // lonlat {OpenLayers.LonLat}
	            null,           // contentSize      {OpenLayers.Size}
	            marker.tag, // contentHTML      {String}
	            null,           // anchor           {Object}
	            true,          // closeBox         {Boolean}
	            null);          // closeBoxCallback {Function}
	            
	    map.addPopup(popup);
	    
	    //マップの中心座標変更
/*
	    map.setCenter(new OpenLayers.LonLat(marker.x, marker.y)
				              .transform( 
				              	new OpenLayers.Projection("EPSG:4326"), 
							  	new OpenLayers.Projection("EPSG:900913")
						),//lonlat
						map.zoom,//zoom
						false,//dragging
						true);//forceZoomChange
*/
							  		
	}
	
	
	/****************************************
		
		検索の投稿者名・カテゴリーのリスト生成
		
	*****************************************/
	var makeSearchMenu = function(){
		
		//新しい投稿があるかもしれないので、再度csvのダウンロード
		CsvBucket.loadCsvData(SERVER_FILE_CSV, function (){
			//子要素を消しておきます
			$('#select-search-author').empty();
			$('#select-search-category').empty();
			
			//未選択のoptionを追加
			var node = "<option value='未選択'>未選択</option>";
			$(node).appendTo('#select-search-author');
			$(node).appendTo('#select-search-category');
			
			//投稿者リスト
			CsvBucket.getAuthors().forEach(function(element, index, ary){
				var node = "<option value='"+element+"'>"+element+"</option>";
				$(node).appendTo('#select-search-author');
			});
			
			//カテゴリーリスト
			CsvBucket.getCategories().forEach(function(element, index, ary){
				var node = "<option value='"+element+"'>"+element+"</option>";
				$(node).appendTo('#select-search-category');
			});		
		
		});
	}
	
	
	/*****************************************
		
		ボタンイベント
		
	*****************************************/
	$('#nav-btn-release').click(function(){ activeTabView('btn-release'); });
	$('#nav-btn-search').click(function(){ activeTabView('btn-search'); });
	
	function activeTabView(type){
		if(type == "btn-release"){
			//検索解除
			$('#nav-btn-search').removeClass("hidden");
			$('#nav-btn-release').addClass("hidden");
			$('#search-view-wrapper').addClass("hidden");
			$('#list-view-wrapper').removeClass("hidden");
			
			//全件表示
			//マーカー全消去
			markers.forEach(function(marker, index){
				layerMarkers.removeMarker(marker);
// 				marker.destroy();
			});
			markers = [];
			
			//リスト全消去
			$('#list-view-wrapper').empty();
			
			//絞り込み条件
			offset = 0;
			CsvBucket.searchOption = {title:'all', author:'all', category:'all'};
			makeMaker(CsvBucket.getNode({limit:limit, offset:offset}));
			
			$('#label-search-config').html("全件表示中");
			
		}else if(type == "do-search"){
			//検索表示中
			$('#search-view-wrapper').addClass("hidden");
			$('#list-view-wrapper').removeClass("hidden");
			
		}else{
			//検索ボタン
			$('#nav-btn-release').removeClass("hidden");
			$('#nav-btn-search').addClass("hidden");
			$('#list-view-wrapper').addClass("hidden");
			$('#search-view-wrapper').removeClass("hidden");
			
			//検索メニュー生成
			makeSearchMenu();
		}
	}
	
	/******************************************
		
		検索実行
		
	******************************************/
	$('#btn-submit').click(function(){

		//タイトル検索用のキーワード
		var keyTitle = $('#text-keyword').val();
		//投稿者検索用のキーワード
		var keyAuthor = $('#select-search-author option:selected').val();
		//カテゴリー検索用のキーワード
		var keyCategory = $('#select-search-category option:selected').val();
		
		//絞り込み条件
		CsvBucket.searchOption = {title:keyTitle, author:keyAuthor, category:keyCategory};
		var res = CsvBucket.getNode({limit:'10', offset:'0'});
		
		//一件以上ヒットしたら
		if(res.length != 0){
			//リストビュータブをアクティブ
			activeTabView('do-search'); 
			
			//検索情報ラベル更新
			var txt = (keyTitle != "") 			? 'タイトル: ' + keyTitle : "";
			var tmpTxt = (keyAuthor != "未選択") ? '投稿者: ' + keyAuthor : "";
			txt += (txt == "") 					? tmpTxt : "<br>" + tmpTxt;
			tmpTxt = (keyCategory != "未選択") 	? 'カテゴリー: ' + keyCategory : "";
			txt += (txt == "") 					? tmpTxt : "<br>" + tmpTxt;	
			$('#label-search-config').html(txt);
			
			
			//マーカー全消去
			markers.forEach(function(marker, index){
				layerMarkers.removeMarker(marker);
				//marker.destroy();
			});
			markers = [];
			
			//リスト全消去
			$('#list-view-wrapper').empty();
			
			//マーカーとリスト作り直し
			offset = 0;
			makeMaker(res);
			
		}else{
			//Warning表示
			$('#non-item-alert #text').text("検索結果: 0件");
			$('#non-item-alert').slideDown().delay(2000).slideUp();
		}
	});
	
	
	/******************************************
		
		無限スクロール
		
	******************************************/
/*
	var showAllNodeFlg = false;
	$('#map-menu-wrapper').scroll(function(evt){
		
		var height = $(this).outerHeight();
		if((this.scrollTop + height) == this.scrollHeight) {
			
			//追加のマーカー取得
			offset += limit;
			var res = CsvBucket.getNode({limit:limit, offset:offset});
			if(res.length  > 0){
				$('#non-item-alert #text').text("続きを読み込み中")
				$('#non-item-alert').slideDown().delay(1000).slideUp("fast",function(){
					showAllNodeFlg = false;
					makeMaker(res);					
				});
			}else{
				if(!showAllNodeFlg){
					showAllNodeFlg = true;
					$('#non-item-alert #text').text("全件表示しました");
					$('#non-item-alert').slideDown().delay(1000).slideUp();
				}
			}
		}
	});
*/
	
}
