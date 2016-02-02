<div id="main" class="spotlist-page">
	<ons-page>
	
		<nav class="navbar navbar-default navbar-fixed-top">
			<div class="container-fluid">
				<a href="#" class="navbar-brand btn-top" ></a>
				<a href="#" id="nav-btn-search" class="navbar-brand navbar-right navbar-link btn-search"><span class="glyphicon glyphicon-search" aria-hidden="true"></span>&nbsp;検索</a> 
				<a href="#" id="nav-btn-release" class="navbar-brand navbar-right navbar-link btn-release hidden"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>&nbsp;解除</a> 
				<p id="label-search-config" class="navbar-text search-config">全件表示中</p>
			</div>
		</nav>
		
		<div id="main-wrapper" class="hidden1">
					
		    <div id="canvas-wrapper">
				<div id="canvas" ></div>
			</div>
			
			<div id="map-menu-wrapper">
		
				<div id="search-view-wrapper" class="hidden">
					<form class="form-horizontal">
						<div class="form-parts">
						    <label for="inputTitle" class="control-label">タイトル検索</label>
						    <input id="text-keyword" type="text" class="form-control" placeholder="キーワードを入力してください...">
						</div>
						
						<div class="form-parts">
						    <label for="inputAuthor" class="control-label">投稿者検索</label>
						    <select id="select-search-author" class="form-control"></select>
						</div>						
						
						<div class="form-parts">
						    <label for="inputCategory" class="control-label">カテゴリー検索</label>							
					    	<select id="select-search-category" class="form-control"></select>
						</div>
						
						<div class="form-parts">
							<button id="btn-submit" type="button" class="btn btn-default btn-lg btn-block">検索</button>
						</div>
					</form>
				</div>
		
				<div id="list-view-wrapper"></div>
				
				<div id="non-item-alert" class="alert alert-warning alert-dismissible" style="display: none" role="alert">
					<strong><span id="text">検索結果: 0件</span></strong>
				</div>
			</div>
			
		</div><!-- id="main-wrapper" -->
		
		<div id="preloader"></div>
	
	</ons-page>
</div>