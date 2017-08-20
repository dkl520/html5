/**功能点1：检查用户的登录情况，则没有登录信息，必须跳转到登录页**/
if(!sessionStorage['LoginName']){
  location.href = 'productlist.html';
}

/**功能点2：异步加载页头和页尾**/
$('#header').load('data/header.php', function(){
  $('#welcome').html('欢迎回来：'+sessionStorage['LoginName']);
});
$('#footer').load('data/footer.php');

/**功能点3：点击左侧的附加导航项，右侧内容随之实现切换**/
$('.affix').on('click','li > a', function(e){
  e.preventDefault();
  //切换li的激活
  $(this).parent().addClass('active').siblings('.active').removeClass('active');

  //切换右侧div的激活
  var id = $(this).attr('href');
  $(id).addClass('active').siblings('.active').removeClass('active');
})

/**功能点4：当页面加载完成，异步请求当前用户的所有订单**/
$.ajax({
  url: 'data/9_my_order.php',
  data: {uid: sessionStorage['LoginUid']},
  success: function(list){
    var html = '';
    $.each(list, function(i, order){
      html += `
      <tr>
        <td colspan="6">订单编号：${order.oid}</td>
      </tr>
      <tr>
        <td>`;
      //注意此处的字符串拼接
      $.each(order.productList, function(j,p){
        html += `<a href="#"><img src="${p.pic}"></a>`;
      })
      html +=`
        </td>
        <td>${order.rcvName}</td>
        <td>￥${order.price}<br><span class="payment">${order.payment}</span></td>
        <td><span class="orderTime">${order.orderTime}</span></td>
        <td><span class="status">${order.status}</span></td>
        <td>
          <a href="#">查看</a><br>
          <a href="#">晒单</a>
          <a href="#">评价</a><br>
          <a href="#">还要买</a><br>
        </td>
      </tr>
      `;
    });
    $('#table-order tbody').html(html);
    formatTableData();
  },
  error: function(){
    alert('异步请求用户订单数据失败！请检查Network！');
  }
});

function formatTableData(){
  //把订单支付方式由1/2/3...改为有效的说明文字
  $('#table-order .payment').each(function(){
    var t = $(this).html();
    switch (t){
      case '1':
        t = '货到付款';
        break;
      case '2':
        t = '京东支付';
        break;
      case '3':
        t = '在线支付';
        break;
      case '4':
        t = '支付宝支付';
        break;
      default:
        t = '不可识别的支付方式'
    }
    $(this).html(t);
  });

  //把下单时间由BIGINT转换为y-m-d<br>h:m:s格式
  $('#table-order .orderTime').each(function(){
    var t = $(this).html();
    t = parseInt(t);
    t = new Date(t);
    t = t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate()+'<br>'+t.getHours()+':'+t.getMinutes();
    $(this).html(t);
  });
}


/**功能点5：根据消费统计数据，绘制统计图表**/
$.ajax({
  url: 'data/10_buy_stat.php',
  data: {uid: sessionStorage['LoginUid']},
  success: function(list){
    //使用FusionCharts绘制统计图表
    //var c = new FusionCharts({});
    //c.render(); //对图表进行渲染
    var c = new FusionCharts({
      type: 'doughnut3d',//'doughnut2d',//'pie3d',//'pie2d',//'line',//'column3d',//'column2d',
      renderAt: 'container-buy-stat-svg',
      width: '90%',
      height: '500',
      dataSource: {
        data: list
      }
    });
    c.render(); //对图表进行渲染
  }
})


/**功能点6：页面加载完成时，异步请求当前登录用户的抽奖统计信息**/
$.ajax({
  url: 'data/11_lottery_stat.php',
  data: {uid: sessionStorage['LoginUid']},
  success: function(result){
    if(result.total <= result.used){
      $('#bt-lottery').html('无法抽奖(剩余抽奖次数为零)');
      return;
    }
    ///还有剩余抽奖次数////
    $('#bt-lottery').html(`开始抽奖(总次数:${result.total}，剩余次数：${result.total-result.used})`).prop('disabled', false);

    ///加载两张抽奖必须的图片，全部加载完成开始绘图
    var progress = 0;  //总的加载进度
    var imgPan = new Image();
    imgPan.src = "img/pan.png";
    imgPan.onload = function(){
      progress += 80;
      if(progress===100){
        initDraw(); //开始初始绘图
      }
    }
    var imgPin = new Image();
    imgPin.src = "img/pin.png";
    imgPin.onload = function(){
      progress += 20;
      if(progress===100){
        initDraw(); //开始初始绘图
      }
    }
    //初始绘图
    function initDraw(){
      var w = imgPan.width;
      var h = imgPan.height;
      var c = $('#canvas-lottery')[0];
      c.width = w;
      c.height = h;
      var ctx = c.getContext('2d');
      ctx.drawImage(imgPan, 0, 0);
      ctx.drawImage(imgPin, w/2-imgPin.width/2, h/2-imgPin.height/2);
    }
  }
});


