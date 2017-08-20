<?php
/***
*接收客户端提交用户编号，返回该用户的抽奖统计信息，
*形如：{"uid":10, "total":21, "used": 3}
*/
header('Content-Type: application/json');

@$uid = $_REQUEST['uid'] or die('{"code":2,"msg":"uid required"}');

require('1_init.php');

$output = [
    'uid'=>$uid,
    'total'=>0,
    'used'=>0
];

//SQL1：计算指定用户的订单总额
$sql = "SELECT SUM(price) FROM jd_order WHERE userId=$uid";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_row($result);
$sum = $row[0];
$output['total'] = intval( $sum/1000 );

//SQL2：计算指定用户已经抽奖的次数
$sql = "SELECT COUNT(*) FROM jd_lottery WHERE userId=$uid";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_row($result);
$num = $row[0];
$output['used'] = intval( $num );

echo json_encode($output);
