$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage


    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());


        return y + '-' + m + '-' + d + '-' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable()
    initCate()


    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html()
                renderPage();
            }
        })
    }

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                var htmlStr = template('tpl-cate', res)
                console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                form.render(); //更新全部

            }
        })
    }

    //把获取到的数据放进去q里面
    $('#form-search').on("submit", function(e) {
            e.preventDefault();
            var cate_id = $('[name=cate_id]').val()
            var state = $("[name=state]").val()

            q.cate_id = cate_id
            q.state = state

            initTable()
        })
        //这个total是在服务器拿到的，在文章管理的获取文章的列表数据
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里填的id值，不用加 # 号

            count: total, //数据总数，从服务端得到

            limit: q.pagesize, //每页显示的数据条数

            curr: q.pagenum, //设置默认被选中的分页

            layout: ['count', 'prev', 'pagenext', 'limit', 'refresh', 'skip'],

            limit: [2, 3, 5, 10],
            //obj包含了当前分页的所有参数，比如： //得到当前页，以便向服务端请求对应页的数据。
            //可以用first去判断触发jump函数的方式

            //两种方式触发jump，

            //1.调用laypage.render 这种如果直接调用  initTable() 会导致死循环
            //2.点击页码 只有点击的时候，才会调用

            jump: function(obj, first) {
                // first第一次会输出true 后面就是undefined
                q.pagenum = obj.curr

                q.pagesize = obj.limit


                if (!first) {
                    initTable()
                }
            }
        });
    }

    $('tbody').on('click', 'btn-delete', function() {
        var len = $('.btn-delete').length

        var id = $(this).attr('data-id')

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });

    })
})