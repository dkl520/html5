/**功能点1：为“提交注册信息”按钮绑定监听函数**/
$('#bt-submit').click(function(){
  //收集用户在表单中的输入，可以使用“表单序列化”
  var data = $('#form-register').serialize();

  //使用$.ajax()发起异步请求
  $.ajax({
    type: 'POST',
    url: 'data/7_user_add.php',
    data: data,
    success: function(result){
      if(result.code===1){
        alert('注册成功！3秒钟后跳转到登录页面');
        setTimeout(function(){
          location.href ='productlist.html';
        },3000);
      }else {
        alert('注册失败！原因为：'+result.msg);
      }
    },
    error: function(){
      alert('响应消息有问题！请检查Network！');
    }
  });

});