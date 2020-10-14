// (1) 从layui 中导出 layer方法
var layer = layui.layer;
var form = layui.form;
$(function () {

    initCate();
    // 1. 定义 加载文章分类的函数 (下拉框)
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 拿到模板引擎渲染好的字符串
                var htmlStr = template('tpl-artPub', res);
                // 添加到下拉框中
                $('[name=cate_id]').html(htmlStr);
                get();
                form.render();
            }
        });
    }
    // 初始化富文本编辑器
    // initEditor('Context');
    // 初始化富文本编辑器
    initEditor('Context');

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 当点击了选择封面的按钮 触发文件选择框的点击事件
    $('#btn-Choose').on('click', function () {
        $('input[name=cover_img]').click();
    });

    // 将 文件渲染到裁剪区
    $('input[name=cover_img]').on('change', function (e) {
        // 拿到 上传的文件。注意这是一个伪数组 
        var files = e.target.files;
        if (files.length === 0) return;
        // 根据文件 创建对应的URL地址
        var newimgURL = URL.createObjectURL(files[0]);

        // 为裁剪区重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newimgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });


    // 定义 文章的发布状态
    var state_pub = '已发布';

    $('#btn-save2').on('click', function () {
        state_pub = '草稿';
    })

    $('#form-pubArt').on('submit', function (e) {
        e.preventDefault();
        // 快速为form 表单创建一个formData实例对象
        var fd = new FormData(this)
        // 把文章的发布状态追加的fd中
        fd.append('state', state_pub);
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
            })
        // 调用实现文章发布文章的ajax函数 
        publisherArt(fd);
    })


    // 定义一个发布文章的方法
    // 注意：这里发送的是formData 的数据格式
    // 需要添加 contentType:false  
    function publisherArt(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message + '2秒后跳转到文章列表');
                setTimeout(() => {
                    location.href = '/article/art_list.html'
                }, 2000);
            }
        });
    }

    // console.log(localStorage.getItem('id'));
    // 编辑 文章功能 函数, 这部分有问题(功能不完善)
    function get() {
        // 发起ajax
        var idx = localStorage.getItem('id');
        if (idx) {
            $.ajax({
                type: "GET",
                url: "/my/article/" + idx,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    form.val('form-pubArt', {
                        'id': res.data.id,
                        'title': res.data.title,
                        'content': res.data.content,
                    })
                }
            });
        }
        localStorage.removeItem('id');
    }
})