var app = angular.module('newsApp',['controllers','routers','directives']);

var controllers = angular.module('controllers',[]);
controllers.controller('indexCtrl',['$scope','$http',function($scope,$http){
	$scope.tabs = 1;
	$scope.changeTab = function(num){
		$scope.tabs = num;
	}  
}]).controller('recommendCtrl',['$scope','$http',function($scope,$http){
	$scope.isSearch = false;
	$scope.search = function() {
		$scope.isSearch = true;
	}
	$scope.cancel = function(){
		$scope.isSearch = false;
	}
	$scope.searchName = '';
	$scope.sort = true;
	$scope.showActionSheet = function(){
		$scope.isShowActionSheet = true;
	}
	$scope.hideActionSheet = function(){
		$scope.isShowActionSheet = false;
	}
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
}]).controller('detailsCtrl',['$scope','$http','$state',function($scope,$http,$state){
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
	});
	//第二层(index下的html结构)
	$stateProvider.state('index.recommend',{
		url:'/recommend',
		templateUrl:'template-sub/recommend.html',
		controller:'recommendCtrl'
	}).state('index.hot',{
		url:'/hot',
		templateUrl:'template-sub/hot.html'
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

