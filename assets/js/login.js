$(function() {
    //注意这里，我在html页面中的id属性中多了一个空格，这些js代码就失效了
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
            $('.login-box').hide()
            $('.reg-box').show()
        })
        // 点击“去登录”的链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //注册密码验证
    var form = layui.form
    var layer = layui.layer

    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val()
            if (value != pwd) {
                return '两次密码不一致'
            }
        }
    })


    $("#form_reg").on("submit", function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }

        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return console.log(res.message)
            }

            layer.msg('注册成功！请登录')
                //注册完之后可以直接去到登录页面，调用点击函数
            $('#link_login').click()
        })
    })
    $("#form_login").submit(function(e) {
            e.preventDefault();
            $.ajax({
                url: '/api/login',
                method: 'POST',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("登陆失败")
                    }
                    layer.msg("登陆成功！")
                    localStorage.setItem('token', res.token)
                    location.href = '/index.html'
                }
            })
        })
        //注册用户名
})