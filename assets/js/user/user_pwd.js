$(function () {
    // 导出 layui 中的form()方法
    var form = layui.form;
    // 1. 添加表单 得验证规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 验证 新密码 与 原始密码不能一致
        samePwd: function (value) {
            // value 形参得到的就是 新密码
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一致';
            }
        },
        // 验证 新密码 与 新密码不能一致
        rePwd: function (value) {
            // 这个value 形参得到的就是 确认信新密码
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致';
            }
        }
    });
    // 2.
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message + '2秒后重新登录');
                // 修改过后 重置表单
                $('.layui-form')[0].reset();
                // 2秒后跳转的login 页面，需重新登录
                // 定义一个定时器
                setTimeout(function () {
                    window.parent.location.href = '/login.html';
                }, 2000);
            }
        })
    })
})