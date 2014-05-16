    
function getRoomCoreData(){
    var url = "?s=Public/getRoomById" ; 
    $("#room_info > li").each(function(index, element){
        var _this = $(this);
        if( _this.attr("coreid") )
        {
            var CoreID = _this.attr("coreid");
            var angle = _this.attr("angle");
            //alert(CoreID);
            $.ajax({
                url:url ,
                type:"POST",
                //                    async:false,
                data:{
                    CloudID:CoreID
                },
                dataType:"json",
                success:function(data){
                    //alert(data);
                    var html = "" ; 
                    var ret_data = data[0];
                    if( ret_data!=null ){
                        // 这里需要将图片旋转一下,使用css3的图片旋转 transform:rotate(deg)
                        //var rotate = ( angle -ret_data.fAngleStart)/Math.PI * 180 ;
                        var rotate =   Math.round(( ret_data.fAngleStart - angle )/Math.PI * 180)  ;
                        var rotateStyle = "-webkit-transform:rotate("+rotate+"deg)";
                        var width = 0 , height = 0 ; 
                        //if(   ( rotate>= -135 && rotate <= -45)  || (rotate<=-225 && rotate>=-315) ||  ( rotate<= 135 && rotate >= 45)  || (rotate >=225 && rotate<=315)   ){
                        if(   rotate == 90 || rotate == -90  || rotate == 270 || rotate==-270  ){
                            width =ret_data.height;
                            height =ret_data.width;
                        } else
                        { 
                            width =ret_data.width;
                            height =ret_data.height;
                        } ;
                        var jpg_file = "",title="" ; 
                        if( ret_data.jpg_file!= null ){
                            jpg_file = koc_home+ret_data.jpg_file ;
                            title = "ID:"+ret_data.CloudID;
                        } 
                        else {
                            jpg_file = "./Public/images/blank.jpg";
                            title = "ID:"+ret_data.CloudID+"-没有预览图";
                        }
                        html = "<a href='?s=Roominfo/roomDetail/CloudID/"+ret_data.CloudID+"/'>"+
                            "<img class='rotate' style='"+rotateStyle+"' src='"+jpg_file+"' alt='"+ret_data.CloudID+"' title='"+title+"'>"+
                            "</a><p>"+width+"X"+height+"</p>";
                        
                    }else{
                        //如果这里有可能返回空，这样就找一个占位图，防止出现混排
                        html = "<img src='./Public/images/blank.jpg' alt='无预览图' title='没有找到资料'>";
                    }
                    _this.find(".room_core").html(html);
                },
                error:function(xhr){
                    $("#rs").html(xhr.responseText);
                }
            });
        }
        else return ; 
    });
}