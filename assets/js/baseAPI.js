// 每次发起 $.ajax 或 $.post 或 $.get请求 都会去先调用ajaxPrefilter函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 发起真正的Ajax请求之前 先拼接接口的 根路径 + url地址即可 
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
})