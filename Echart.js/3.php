<?php 
header("Content-Type:application/json;charset=utf-8");


  $data=[

  	 data:[5,20,36,10,10,20],
  	 categories:["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
  ]
  
   echo  json_encode($data);
 ?>