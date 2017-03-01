var app = angular.module('newsApp',['ng.post','controllers','routers','directives','services']);

var controllers = angular.module('controllers',[]);

//主页控制器
controllers.controller('indexCtrl',['$window','cookie','$scope','$http',function($window,cookie,$scope,$http){
	$http.post('http://10.16.155.28:81/news/php/index.php/login_api/auto_login',{
		params:{
			username:cookie.getCookie('username'),
			token:cookie.getCookie('token')
		}
	}).success(function(data){
		if(data){
			console.log(data);
		}else{
			$window.location.href = '#/login';
		}
	})
	$scope.tabs = 1;
	$scope.changeTab = function(num){
		$scope.tabs = num;
	}  
}])
//推荐控制器
.controller('recommendCtrl',['$window','$scope','$http','$state',function($window,$scope,$http,$state){
	//搜索
	$scope.isSearch = false;
	$scope.searchName = '';
	$scope.search = function() {
		$scope.isSearch = true;
	}
	$scope.cancel = function(){
		$scope.isSearch = false;
	}
	
	//新闻排序方式
	$scope.sort = false;
	
	//排序弹窗
	$scope.isShowActionSheet = false;
	$scope.showActionSheet = function(){
		$scope.isShowActionSheet = true;
	}
	$scope.hideActionSheet = function(){
		$scope.isShowActionSheet = false;
	}
	//点击更多加载数据
	$scope.isLoadMore = true;
	$scope.page = 0;
	$scope.news =[];
	$scope.loadMore = function(){
		$scope.isLoadMore = false;
		$http.get('http://10.16.155.28:81/news/php/index.php/news_api/show_detail_by_channel_id',{
		params:{
				page:$scope.page++,
				channel_id:4
			}
		}).success(function(data){
			console.log(data);
			$scope.news = $scope.news.concat(data.news_list);
			$scope.isLoadMore = true;		
		})
	}
	$scope.loadMore();
}])
//详情页控制器
.controller('detailsCtrl',['$scope','$http','$state',function($scope,$http,$state){
	console.log($state);
	$http.get('http://10.16.155.28:81/news/php/index.php/news_api/show_detail',{
		params:{
			id:$state.params.id
		}
	}).success(function(data){
		console.log(data);
		$scope.news = data.news_list[0];
	})
}])
//注册控制器
.controller('registerCtrl',['$window','$scope','$http',function($window,$scope,$http){
	$scope.goLogin = function(){
		$http.post('http://10.16.155.28:81/news/php/index.php/login_api/register',{
			params:{
				username:$scope.username,
				password:$scope.password
			}
		}).success(function(data){
			if(data){
				$window.location.href = '#/login';
			}else{
				$window.location.href = '#/register';
			}
			// console.log(data);
		})
	}
	
}])
//登录控制器
.controller('loginCtrl',['cookie','$window','$scope','$http',function(cookie,$window,$scope,$http){
	console.log($scope.username);
	console.log($scope.password)
	$scope.goIndex = function(){
		$http.post('http://10.16.155.28:81/news/php/index.php/login_api/login',{
			params:{
				username:$scope.username,
				password:$scope.password
			}
		}).success(function(data){
			console.log(data);
			cookie.setCookie('username', data.user_name);
			cookie.setCookie('token', data.info.token);
			$window.location.href = '#/index/recommend';
		})
	}
}])
.controller('insertCtrl',['$window','$scope','$http',function($window,$scope,$http){
	$scope.insertNews = function(){
		$http.get('http://10.16.155.28:81/news/php/index.php/news_api/insert_news',{
			params:{
				title:$scope.title,
				text:$scope.text
			}
		}).success(function(data){
			console.log(data);
		})
	}
}])
//热点控制器
.controller('hotCtrl',['$scope','$http',function($scope,$http){
	$scope.isLoadMore = false; 
	$http.get('http://10.16.155.28:81/news/php/index.php/news_api/show_detail_by_channel_id',{
		params:{
			page:1,
			channel_id:7
		}
	}).success(function(data){
		$scope.isLoadMore = true; 
		console.log(data);
		$scope.news = data.news_list;
	})
}])

//路由:两层
var routers = angular.module('routers', ['ui.router']); 
routers.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	//第一层
	$stateProvider.state('index',{
		url:'/index',
		templateUrl:'template/index.html',
		controller:'indexCtrl'
	}).state('search',{
		url:'/search',
		templateUrl:'template/search.html'
	}).state('details',{
		url:'/details/:id',
		templateUrl:'template/details.html',
		controller:'detailsCtrl'
	}).state('register',{
		url:'/register',
		templateUrl:'template/register.html',
		controller:'registerCtrl'
	}).state('login',{
		url:'/login',
		templateUrl:'template/login.html',
		controller:'loginCtrl'
	}).state('insert',{
		url:'/insert',
		templateUrl:'template/insert.html',
		controller:'insertCtrl'
	});
	//第二层(index下的html结构)
	$stateProvider.state('index.recommend',{
		url:'/recommend',
		templateUrl:'template-sub/recommend.html',
		controller:'recommendCtrl'
	}).state('index.hot',{
		url:'/hot',
		templateUrl:'template-sub/hot.html',
		controller:'hotCtrl'
	}).state('index.happy',{
		url:'/happy',
		templateUrl:'template-sub/happy.html'
	});
	//默认打开index.html下的第一层路由的index页面中的第二层recommend页面
	$urlRouterProvider.when('', '/index/recommend')
}])
//index中页面的模块
var directives = angular.module('directives',[]);
//头部
directives.directive('nheader',function(){
	return {
		templateUrl:'directive/nheader.html'
	}
})
//搜索
.directive('nsearch',function(){
	return {
		templateUrl:'directive/nsearch.html'
	}
})
//轮播图
.directive('ncarousel',function(){
	return {
		templateUrl:'directive/ncarousel.html',
		link:function(scope,ele,attr){
			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				paginationClickable: true
			});
		}
	}
})
//新闻列表
.directive('nlist',function(){
	return {
		templateUrl:'directive/nlist.html'
	}
})
//弹出窗
.directive('nactionsheet',function(){
	return {
		templateUrl:'directive/nactionsheet.html'
	}
})

//服务的模块
var services = angular.module('services', []);
//cookie服务
services.service('cookie', ['$document', function($document) {
	return {
		setCookie: function(name, value) {
			var days = 10;
			var ex = new Date();
			ex.setTime(ex.getTime() + days * 24 * 60 * 60 * 1000);
			$document[0].cookie = name + "=" + value + ";expires=" + ex;
		},
		getCookie: function(name) {
			var a;
			var reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
			if(a = $document[0].cookie.match(reg)) {
				return a[2];
			}
		}
	}
}])


