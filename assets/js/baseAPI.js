//每次调用get post 和ajax的时候都会先调用这个函数
//这个函数我们可以拿到他的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url);
})