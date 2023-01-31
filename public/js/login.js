

onClick('#login',function() {
    var error=check_formulaire();
    $('#error').html(error);
    if(error) return; 
    login()

});

async function login(){
   
    var username= $("#username").val()
    var password= $("#password").val()
    var data={username,password}
    var option = {
        type: "POST",
        url: `/auth`,
        cache: false,
        data: data,
      };
    var receved_data = await $.ajax(option);

    if(receved_data=='ok'){
        window.location.href = '/admin'
    }
    
} 