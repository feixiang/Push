/* 
 * 
 * */
function getRoomCoreData(){
    var url = "?s=RoomCore/getRoomCoreById" ; 
    $("#room_info > li").each(function(index){
        var _this = $(this);
        if( _this.attr("CoreID") )
        {
            var CoreID = _this.attr("CoreID");
            $.ajax({
                url:url ,
                type:"POST",
                data:{
                    'CoreID':CoreID
                },
                dataType:"json",
                success:function(data){
                    var html = "<a href=\"__URL__/roomDetail/CloudID/{data.CloudID}/\">"+
                    "<div class=\"thumbnail\">"+
                    "<img src=\"{:C('koc_home').data.jpg_file} alt='data.CloudID' title='data.CloudID'>"+
                    "</div></a>";
                    _this.append(html);
                }
            });
        }
        else return ; 
        
    });
}

