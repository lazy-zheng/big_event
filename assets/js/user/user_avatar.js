$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options);

    // 2. 点击上传按钮 触发页面中的 文件选择框
    var layer = layui.layer;
    $('#chooseImage').on('click', function () {
        $('#file').click();
    })
    // 3. 为文件选择框绑定change 事件
    $('#file').on('change', function (e) {
        // console.log(e);
        console.dir(this);
        var first = e.target.files;
        // console.log(first);
        if (first.length === 0) {
            return layer.msg('请选择图片');
        }
        // console.log(first);
        // 1.拿到 用户上传的照片
        var img = e.target.files[0];
        console.log(img);

        // 2. 将文件转化为路径
        var newImgURL = URL.createObjectURL(img);
        // 3.
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    $('#btnUpload').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $('#image').attr('src', dataURL)
        // 4.调用接口 把头像上传到服务器
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL,
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！');
                }
                layer.msg(res.message);
                window.parent.getUserinfo();
            }
        });
    })
})