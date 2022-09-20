//=====================================================================
//
//=====================================================================
function pythonTest () {
    
    $.ajax({
        type: "POST",
        url:"/TY_test1",
        dataType: 'json',
        data: {registration: "success", name: "xyz", email: "abc@gmail.com"},
        success:function(result){
            // console.log(result.abc);
            alert(result.abc);
        }
    });
} 

//=====================================================================
//
//=====================================================================
function pythonTest2 () {
    
    $.ajax({

        type: "POST",
        url:"/TY_test2",

        success:function(result){

            if(result){

                alert(result);
            }
            else{

                alert("TY: FAIL");
            }
        }
    });
} 

//=====================================================================
//
//=====================================================================
function TY_Python_Movie () {
    
    $.ajax({

        type: "GET",
        url:"/Interface_Movie",

        success:function(response){

            if(response){

                alert(response);
            }
            else{

                alert("TY: FAIL");
            }
        },
        failure:function(response){
            alert("TY: FAILURE");
        },
        error:function(error){
            
            alert("TY: ERROR!");
        }
    });

    alert("TY: Crawling Succeed");
} 
