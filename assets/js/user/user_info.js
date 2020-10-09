$(function () {
    // 1.导出layui 中的form 方法
    var form = layui.form;

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6个字符之间'
            }
        }
    });
    // 调用 初始化用户基本信息函数
    initUserInfo()
    // 2. 初始化 用户的基本信息
    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res);
                // 调用form.val() 快速为表单赋值
                // (1)第一个值 是form 表单的 lay-filter 自定义属性的值
                // (2) 第二个值，是服务器返回来 需要渲染的数据
                // 注意:这里要保证表单的name 值和服务器返回数据的 属性名一致，才可以设定成功
                form.val('formUserInfo', res.data);
            }
        })
    }
    // 3. 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单重置的默认行为
        e.preventDefault();
        // 再调用 获取用户的基本信息函数
        initUserInfo();
    });
    // 4. 点击 提交修改 实现修改用户
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 获取修改过后的数据
        let data = $(this).serialize();
        // 发起ajax 数据请求
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: data,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 调用 父页面中的方法getUserinfo() , 重新获取服务器数据，渲染用户信息和头像
                window.parent.getUserinfo();
            }
        })
    })
})