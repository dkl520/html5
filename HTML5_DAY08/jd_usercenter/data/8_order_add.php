<?php
/***
*接收客户端的rcvName, addr, price, payment(付款方式1/2/3/4)，userId，
*返回：{"code":1, "orderId": 9234234134}
*/
header('Content-Type: application/json;charset=UTF-8');

@$rcvName = $_REQUEST['rcvName'] or die('{"code":2,"msg":"rcvName required"}');
@$addr = $_REQUEST['addr'] or die('{"code":3,"msg":"addr required"}');
@$price = $_REQUEST['price'] or die('{"code":4,"msg":"price required"}');
@$payment = $_REQUEST['payment'] or die('{"code":5,"msg":"payment required"}');
@$userId = $_REQUEST['userId'] or die('{"code":6,"msg":"userId required"}');
$orderTime = time()*1000;
$status = 1;  //刚下的订单，默认状态为配货中

require('1_init.php');

//SQL1：向jd_order表中插入一行记录，得到oid
$sql = "INSERT INTO jd_order VALUES(NULL,'$rcvName','$addr','$price','$payment','$orderTime','$status','$userId')";
$result = mysqli_query($conn,$sql);
$orderId = mysqli_insert_id($conn);

//SQL2：读取当前用户购物车中的条目，获取所有商品编号
$sql = "SELECT productId,count FROM jd_cart_detail WHERE cartId=(SELECT cid FROM jd_cart WHERE userId=$userId)";
$result = mysqli_query($conn,$sql);
$list = mysqli_fetch_all($result, MYSQLI_ASSOC);

//SQL3：（循环）针对每个购物车项执行INSERT，插入到jd_order_detail
foreach($list as $p){
    $sql = "INSERT INTO jd_order_detail VALUES(NULL,'$orderId','$p[productId]','$p[count]')";
    mysqli_query($conn,$sql);
}
//SQL4：删除当前用户购物车中的条目
$sql = "DELETE FROM jd_cart_detail WHERE cartId=(SELECT cid FROM jd_cart WHERE userId=$userId)";
mysqli_query($conn,$sql);

$output['code']=1;
$output['orderId']=$orderId;

echo json_encode($output);


