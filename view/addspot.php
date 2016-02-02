<?php

/*
smartMapping map.php 
*Copyright (c) 2015 makabe, tomo, mkbtm1968@gmail.com, http://mkbtm.jp/
*Licensed under the MIT license
*/

date_default_timezone_set('Asia/Tokyo');//タイムゾーンの設定

mb_language("Japanese");//文字コードの設定
mb_internal_encoding("UTF-8");
?>

<div id="main" class="addspot-page">
	
<!--
	<ons-toolbar>
		<div class="center">スポット登録</div>
		<div class="right"><ons-toolbar-button onclick="openCamera()"><ons-icon icon="ion-camera" size="28px"></ons-icon>&nbsp;カメラ起動</ons-toolbar-button></div>
	</ons-toolbar>
-->
	
	<ons-page>
		
			<!--google mapを表示-->
			<div id="canvas"></div>
			<div id="message"></div>
			<div id="reloadButtonDiv">
			
<!--
				<div id="reloadButton">
					<a href="javascript:void(0)" onclick="init_addspot()"><img src="images/gps.png" width="40" height="40"></a>
				</div>
-->			
				<p id="position">0,0</p>	
			
			</div>
		
			<!--画面中央の赤い十字マーク-->
			<img id ="map_curssor" src="images/red_cross.png">
			
			<!-- 入力フォーム-->
			<div class="input_form">					
				
				
				<div class="input-area">
					<form id="addSpotForm" name="addSpotForm">
						<input id="latitude" type="hidden" name="latitude" value="$myLatitude">
						<input id="longitude" type="hidden" name="longitude" value="$myLongitude">
				
						<ons-list modifier="inset">
				       
							<ons-list-item>
								<label class="list-label">写真</label>
								<div id="image" style="display: none">&nbsp;</div>
								<div id="img_process" style="display: none">写真を圧縮中...</div>
								
								<div id="area">
									<!-- 画像を選択するボタン-->
									<div class="file">写真を撮る・選ぶ<input name="photo" type="file"></div>
								</div>
							</ons-list-item>
							
					        <ons-list-item>
						        <label class="list-label">タイトル</label>
								<input id="title" name="title" type="text" class="text-input text-input--transparent" placeholder="タイトル" style="width: 100%">
					        </ons-list-item>
					
					        <ons-list-item>
						        <label class="list-label">説明文</label>
					        	<textarea id="abstruct" name="abstruct" class="textarea textarea--transparent" placeholder="説明文" style="width: 100%; height: 100px;"></textarea>
					        </ons-list-item>
					        
							<ons-list-item>
								<label class="list-label">投稿者</label>
								<input id="name" name="name" type="text" class="text-input text-input--transparent" placeholder="投稿者名" style="width: 100%">
					        </ons-list-item>
					        
							<ons-list-item>
								<label class="list-label">ジャンル選択</label>
								
								<label class="radio-button">
								  <input type="radio" name="category" value="がっかり" checked="checked">
								  <div class="radio-button__checkmark"></div>
								  がっかり
								</label><br>
								
								<label class="radio-button">
								  <input type="radio" name="category" value="トマソン">
								  <div class="radio-button__checkmark"></div>
								  トマソン
								</label><br>
								
								<label class="radio-button">
								  <input type="radio" name="category" value="なんでやねん！">
								  <div class="radio-button__checkmark"></div>
								  なんでやねん！
								</label>
							</ons-list-item>
						</ons-list>
					</form>
					
					<!-- 送信ボタン-->
					<div id="sendButton">
						<button class="button button--large disable" type="button" onClick="sendData()" disabled="disabled">送信する</button>
					</div>
					
				</div>	
				
				
				<!-- ダイアログ -->
				<div id="alert-dialog-mask" class="alert-dialog-mask dialog-group"></div>
				
				<div id="init-dialog" class="alert-dialog dialog-group">
				  <div class="alert-dialog-content">
				    <p id="init-dialog-message">現在位置を取得しています…</p>
				  </div>
				
				  <div class="alert-dialog-footer">
				    <button id="dialog-button-cancel" class="alert-dialog-button
				      alert-dialog-button--primal">キャンセル</button>
				  </div>
				</div>
				
				<div id="send-dialog" class="alert-dialog dialog-group" style="display: none;">
				  <div class="alert-dialog-content">
				    <p id="send-dialog-message">データ送信中…</p>
				  </div>
				</div>
				
				<div id="send-finish-dialog" class="alert-dialog dialog-group" style="display: none;">
				  <div id="send-finish-dialog-title" class="alert-dialog-title">title</div>
				
				  <div id="send-finish-dialog-message" class="alert-dialog-content">
				    message
				  </div>
				
				  <div class="alert-dialog-footer">
				    <button id="send-finish-dialog-button" class="alert-dialog-button
				      alert-dialog-button--primal">OK</button>
				  </div>
				</div>
				
				<!-- ダイアログ -->
				
			</div>
	</ons-page>
</div>