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
    $.each(list, function (i, p) {
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
  },
  error: function () {
    alert('异步获取购物车信息失败！请检查Network！')
  }
});

/**功能点4：点击不同的支付方式，修改同级的隐藏域 payment**/


/**功能点5：点击“提交订单”，序列化表单form-order,异步提交给服务器端页面**/





