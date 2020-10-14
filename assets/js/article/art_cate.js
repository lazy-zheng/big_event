$(function () {
    // (1) 从layui中导出layer方法
    var layer = layui.layer;
    // (2) 从layui中 导出form方法
    var form = layui.form;

    // 调用获取服务器中的文章列表函数
    getArticleList();

    // 1. 定义获取服务器中的文章列表函数
    function getArticleList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                // 调用模板引擎的函数 template得到 最后拼接的字符串
                var htmlStr = template('tpl-art_cate', res);
                // 把得到字符串放到 tbody中
                $('#tb').html(htmlStr);
            }
        });
    }


    // 2. 点击添加类别按钮 实现添加功能
    var index = null;
    $('#btn_add').on('click', function () {
        // layer.open 方法会返回一个 当前弹出框的索引号
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章列表',
            content: $('#popup_layer').html(),
        });
    });


    // 3.因为 form_add 这个表单在页面中是不存在的，需要动态获取到
    // 所以 这里利用事件委托，为他绑定submit 提交事件
    $('body').on('submit', '#form_add', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // console.log('ok');
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('添加文章失败！');
                }
                // 再次调用 获取服务器中文章列表的渲染页面的函数
                getArticleList();
                // 弹出 提示用户添加文章成功
                layer.msg('添加文章成功！');
                // 添加成功后,关闭当前的弹出框
                layer.close(index);
            }
        });
    })


    // 4. 通过代理的形式为btn-edit 按钮绑定点击事件
    var indexEdit = null;
    $('#tb').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        });
        // 获取当前点击的编辑 按钮的自定义属性 data-Id 的值
        var id = $(this).attr('data-Id');
        // console.log(id);
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return
                }
                // console.log(res);
                // 注意：利用layui中的 form.val() 快速为表单赋值 ，必须和 form 表单,添加lay-filter 自定义属性
                form.val('form-edit', res.data)
            }
        });
    })


    //5. 通过代理的形式为form_edit 表单添加提交事件
    $('body').on('submit', '#form_edit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // (1)提示提示用户 修改成功
                layer.msg(res.message);
                //(2) 关闭修改文章分类信息的层
                layer.close(indexEdit);
                // 再重新调用获取服务器中的文章列表函数
                getArticleList();
            }
        });
    });

    // 6. 通过代理的形式为 删除按钮添加鼠标点击事件
    $('#tb').on('click', '.btn-delete', function () {
        // 定义变量获取 用户点击的 按钮当前数据的id的值
        var idDel = $(this).attr('data-id');
        // console.log(indexDel);
        // 弹出询问框 提示用户是否确定删除
        layer.confirm('确定删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + idDel,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    // 提示用户删除成功的消息
                    layer.msg(res.message);
                    // 关闭当前询问框
                    layer.close(index);
                    // 再调用服务器中文章列表的函数
                    getArticleList();
                }
            });
        });
    });
})