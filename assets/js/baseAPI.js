// 每次发起 $.ajax 或 $.post 或 $.get请求 都会去先调用ajaxPrefilter函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 发起真正的Ajax请求之前 先拼接接口的 根路径 + url地址即可 
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // 统一 为有权限的接口，设置headers请求头
    // 如果 options.url 中可以查找到 /my 字符串的话 就给请求设置 headers 请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }
    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // 无论成功还是失败 最终都会调用complete这个函数
        // console.log(res);
        // 在complete回调函数中可以拿到 responseJSON 服务器返回过来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // (1) 强制清空本地存储中的 token
            localStorage.removeItem('token');
            // (2) 强制跳转到login 登录页面
            location.href = '/login.html';
        }
    }
})