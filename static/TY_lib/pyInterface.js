//=====================================================================
//
//=====================================================================
function TY_Python_Movie () {
    
    $.ajax({

        type: "GET",
        url:"/Interface_Movie",

        success:function(response){

            if(response){

                // alert(response);
                $('#TY_result_movie').html(response);
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

    alert("TY: Movie Crawling Succeed");
} 

//=====================================================================
//
//=====================================================================
function TY_Python_Article () {
    
    $.ajax({

        type: "GET",
        url:"/Interface_Article",

        success:function(response){

            if(response){

                // alert(response);
                $('#TY_result_article').html(response);
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

    alert("TY: Article Crawling Succeed");
} 

//=====================================================================
//
//=====================================================================
function TY_Python_Song () {
    
    $.ajax({

        type: "GET",
        url:"/Interface_Song",

        success:function(response){

            if(response){

                // alert(response);
                $('#TY_result_song').html(response);
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

    alert("TY: Song Crawling Succeed");
} 

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

