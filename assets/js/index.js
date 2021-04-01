$(function() {
    getUserInfo()
})

function getUserInfo() {
    $.ajax({
        method: 'post',
        url: '/my/userinfo',
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function(res) {
            console.log(res);
        }

    })
}