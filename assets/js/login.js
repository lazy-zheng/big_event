$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击 去登录的链接
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    });
    // 从 layui 中获取 form 对象
    var form = layui.form;
    // 从 layui 中获取 layer 这个对象，就可以使用里面的方法了
    var layer = layui.layer;
    // console.log(layer);
    // 通过form.verify() 函数自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须是6到12位字符,且不能出现空格"],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 注意：这里的value 就是用户输入的值
            // 通过形参拿到的是确认密码框中的内容
            //还需要拿到密码框中的值
            //然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name = password]').val();
            if (pwd !== value) {
                return '两次密码输入不一致'
            }
        }
    });
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault();
        // 2.发起ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
        };
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('注册成功,请登录');
                // 模拟人的点击行为，使注册完后直接，直接跳转到登录的界面
                $('#link_login').click();
            }
        });
    });
    // 监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发送ajax 请求
        $.ajax({
            type: 'POST',
            url: '/api/login',
            // 快速获取form表单中的值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('登录失败！');
                layer.msg('登录成功！');
                // 将登录成功后得到的 token 字符串，保存到本地存储中
                localStorage.setItem('token', res.token);
                // 登录成功后 让页面 跳转到后台主页
                location.href = '/index.html';
            }
        })
    });
})