/**功能点1：检查用户是否登录，若未登录，则跳转到登录页面**/
if (!sessionStorage['LoginName']) {
  location.href = "productlist.html";
}

/**功能点2：异步加载页头和页尾**/
$('#header').load('data/header.php', function () {
  $('#welcome').html('欢迎回来：' + sessionStorage['LoginName']);
});
$('#footer').load('data/footer.php');

/**功能点3：根据当前登录用户编号，异步请求该用户购物车中的所有商品**/
$.ajax({
  url: 'data/6_cart_detail_select.php',
  data: {uid: sessionStorage['LoginUid']},
  success: function (list) {
    var html = '';
    var sumPrice = 0;
    $.each(list, function (i, p) {
      sumPrice += p.price*p.count; //商品总金额
      html += `
      <div class="goods-item">
          <div class="p-img">
              <a target="_blank" href="">
              <img src="${p.pic}">
              </a>
          </div>
          <div class="p-name">
              <a href="" target="_blank">
                  ${p.pname}
              </a>
          </div>
          <div class="p-price">
              <strong class="jd-price">￥${p.price}</strong>
              <span class="p-num">x${p.count}</span>
              <span class="p-state">有货</span>
          </div>
      </div>
      `;
    });
    $('div.goods-items').html(html);
    //修改总金额的显示
    $('#sum-price').html(`￥${sumPrice.toFixed(2)}`);
    $(':hidden[name="price"]').val(sumPrice);
  },
  error: function () {
    alert('异步获取购物车信息失败！请检查Network！')
  }
});

/**功能点4：点击不同的支付方式，修改同级的隐藏域 payment**/
$('.payment-list').on('click','li', function(){
  //修改激活项对应的class的位置
  $(this).addClass('payment-item-selected').siblings('.payment-item-selected').removeClass('payment-item-selected');

  //获取li对应的value，赋值给隐藏域
  //var v = $(this).attr('data-value');
  var v = $(this).data('value');
  $(this).siblings(':hidden').val(v);
})


/**功能点5：点击“提交订单”，序列化表单form-order,异步提交给服务器端页面**/
$('button.checkout-submit').click(function(){
  var data = $('#form-order').serialize();
  data += `&userId=${sessionStorage['LoginUid']}`
  //异步提交用户输入/选中的数据,实现订单添加
  $.ajax({
    type: 'POST',
    url: 'data/8_order_add.php',
    data: data,
    success: function(result){
      if(result.code===1){  //订单生成成功
        sessionStorage['OrderId']=result.orderId;
        location.href = 'addorder_succ.html';
      }else {
        alert('订单生成失败！失败原因：'+result.msg);
      }
    },
    error: function(){
      alert('异步提交订单数据失败！请检查Network！')
    }
  })
});




