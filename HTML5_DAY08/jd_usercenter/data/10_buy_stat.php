<?php
/***
*根据客户端提交的用户编号，统计出该用户过去12个月里每个月的消费总金额，
*以JSON形式 —— 使用伪造数据
*/
header('Content-Type: application/json;charset=UTF-8');

@$uid = $_REQUEST['uid'] or die('{"code":2,"msg":"uid required"}');

//此处使用的伪数据
$output = [
    ['label'=>'1月', 'value'=>6200],
    ['label'=>'2月', 'value'=>4300],
    ['label'=>'3月', 'value'=>8500],
    ['label'=>'4月', 'value'=>3200],
    ['label'=>'5月', 'value'=>4000],
    ['label'=>'6月', 'value'=>7000],
    ['label'=>'7月', 'value'=>6000],
    ['label'=>'8月', 'value'=>5500],
    ['label'=>'9月', 'value'=>6500],
    ['label'=>'10月', 'value'=>4500],
    ['label'=>'11月', 'value'=>0],
    ['label'=>'12月', 'value'=>3000]
];

echo json_encode($output);






