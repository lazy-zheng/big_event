$(function () {
    // (1) 从layui 中导出layer方法
    var layer = layui.layer;
    // 从layui中 导出form 方法
    var form = layui.form;

    var laypage = layui.laypage;

    // (2) 定义一个查询字符串的对象，将来请求数据的时候,
    // 将请求的数据参数对象提交到服务器中
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    }


    // 调用获取文章列表数据的函数
    initTable();
    // 1. 获取 初始化文章列表数据的方法
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 调用渲染模板引擎的template 函数
                var htmlStr = template('tpl-artList', res);
                $('tbody').html(htmlStr);
                // 调用分页的函数，渲染分页的区域的内容
                renderPage(res.total);
            }
        });
    }

    // 定义 时间 小于10的时候 补0的函数
    function padzero(n) {
        return n < 10 ? '0' + n : n;
    }
    // 2. 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function (timer) {
        var dt = new Date(timer);
        //  年 月 日
        var y = dt.getFullYear();
        var m = padzero(dt.getMonth() + 1);
        var d = padzero(dt.getDate());
        // 时 分 秒
        var hh = padzero(dt.getHours());
        var mm = padzero(dt.getMinutes());
        var ss = padzero(dt.getSeconds());
        // 返回一个结果
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 调用渲染文章分类筛选 的下拉框中
    initCate();
    // 3.初始化 文章分类的方法
    function initCate() {
        // 发送ajax 获取文章分类渲染到 筛选下拉框中
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败');
                }
                // 调用模板引擎的template 方法
                var htmlStr = template('tpl-initCate', res);
                // 渲染好的字符串 添加到select中
                $('[name=cate_id]').html(htmlStr);
                // layui js文件运行机制导致未获取到动态渲染的数据，需重新调用一下 layui的渲染函数
                form.render();
            }
        });
    }

    // 4. 点击筛选按钮，获取下拉框中的数据,发送ajax请求
    $('#form-search').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 获取表单中的值 赋值给变量
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为 q 查询字符中的对应属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的查询条件，重新渲染表格的数据
        initTable();
    })


    // 5.定义渲染分页的方法 接受一个 总的数据条数的 形参
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 注意，这里的 test1 是 ID，不用加 # 号
            count: total, // 数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认选中的页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 设置选择每页显示的条数 下拉框的值 
            limits: [2, 3, 5, 6],
            // 分页发生切换的时候 会触发 jump 回调函数
            jump: function (obj, first) {
                // console.log(obj);
                // console.log(obj.curr);
                // 点击 哪个页面获取到 该页码的值 赋值给q 查询参数对象中
                // 把最新的页码值，赋值给查询对象
                q.pagenum = obj.curr;
                // 把最新的 每页显示几条数据的值， 赋值给 q.pagesize
                q.pagesize = obj.limit;
                // console.log(first);
                if (!first) {
                    initTable();
                }
            }
        });
    }


    // 7. 利用事件委托，为每个 删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取到当前点击的 自定义属性id的值
        var id = $(this).attr('data-id');
        // 获取页面中所有的删除按钮
        var len = $('.btn-delete').length;
        console.log(len);
        // 弹出询问框，询问是否确定删除
        layer.confirm('确定删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 根据 Id 删除文章数据
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    // (1)当删除数据成功后，判断当前这一页中，是否还有剩余的数据
                    // (2)如果没有剩余的数据了，则先让页码值 -1  在调用文章列表数据的方法
                    //(3) 再重新调用 initTable 方法，渲染页面
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                    layer.close(index);
                }
            });
        })
    })
})

// 6.利用事件委托，为每个 编辑按钮绑定点击事件
$('tbody').on('click', '.btn-edit', function () {
    // 获取到 点前点击的自定义属性 id的值
    var iditId = $(this).attr('data-id')
    localStorage.setItem('id', iditId);
    // console.log(id);
    location.href = '/article/art_pub.html';
})