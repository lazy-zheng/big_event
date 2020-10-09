// 调用 获取用户 的基本信息的函数
getUserinfo();

// 1. 获取用户的基本信息
function getUserinfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        data: "data",
        // headers 就是请求头对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || '',
        // },
        //  ajax请求是异步的，async 将这个请求 设定为同步请求
        async: false,
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败');
            // 调用渲染用户头像的函数
            renderAvatar(res.data);
        },
        // 无论成功还是失败 最终都会调用complete这个函数
        // complete: function (res) {
        //     console.log(res);
        //     // 在complete回调函数中可以拿到 responseJSON 服务器返回过来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // (1) 强制清空本地存储中的 token
        //         localStorage.removeItem('token');
        //         // (2) 强制跳转到login 登录页面
        //         location.href = '/login.html';
        //     }
        // }
    });
}

// 2. 渲染用户的头像 函数
function renderAvatar(user) {
    // 1.获取用户的名称  短路运算
    var name = user.nickname || user.username;
    // 2.渲染用户名 欢迎某某某的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide();
        // 把获取到的name 的值 第一个字符 取出来 转换 为大写，设置到文本头像中文本内容
        // toUpperCase() 转换成大写
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}
// 3. 点击退出按钮，实现退出的功能
// 导出layui中的 layer方法
var layer = layui.layer;
$('#btnLogout').on('click', function () {
    // 测试
    // console.log('ok');
    // 提示用户是否确认退出
    layer.confirm('确认退出登录?', {
        icon: 3,
        title: '提示'
    }, function (index) {
        //do something
        // (1) 清空本地存储中的token
        localStorage.removeItem('token');
        // (2) 跳转到登录页面
        location.href = '/login.html';
        // (3) 这是关闭 confirm 询问框
        layer.close(index);
    });
})