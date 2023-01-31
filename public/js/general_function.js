
function onClick(selector, callback_function){
    $(document).on('click',selector, callback_function);
};


function carousel(selector,passed_options){
	try{
		$(selector).wrapInner('<div class="swiper-wrapper"></div>');
		$(selector).find('.card_product').addClass('swiper-slide');
	
		var options={  slidesPerView: "auto",   freeModeSticky:true, freeModeMomentumRatio:0.4	};
		if(passed_options){
			$.each(passed_options, function(option_title, option_value){
				options[option_title]=option_value;
			})
		}
		
		if(GV.swipers[selector]){	GV.swipers[selector].destroy(true, true); }
		GV.swipers[selector]= new Swiper (selector, options);
	}catch(e){

	}
}

function display_card_placeholders($selector, number) {
	if ($selector.length == 0)  return; 
	$selector.find('.empty-card').remove();
	$selector.each(function () {
        
		while ($(this).find('.card').length < number) {
            // console.log('card number',$(this).find('.card').length);
			var html = `<div class="card empty-card"></div>`;
			$(this).append(html);
		}
	})

}

function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

function check_formulaire(){
    var error="";
    
      
    $(' .required').each(function(){   
        if(!$(this).val()){
            $(this).css('border','2px solid red');
            error="Veuillez renseigner tous les champs.";
        }else{
            $(this).css('border','2px solid  #eeeeee');
        }
    });
   
    $(' .required_login').each(function(){   
        if(!$(this).val()){
            $(this).css('border-bottom','2px solid red');
            error="Veuillez renseigner tous les champs.";
        }else{
            $(this).css('border','2px solid  #eeeeee');
        }
    });

    if($('#phone-number').val() != $('#phone-number-confirmation').val()){
        $('#phone-number, #phone-number-confirmation').css('border','2px solid red');
        error="Veuillez vérifier votre N° de téléphone";
    }else{
        $('#phone-number, #phone-number-confirmation').css('border','2px solid  #eeeeee');
    }
    return error;

  }




function check_cantactus(){
    var error="";
  
    $(' .required_contact').each(function(){   
        if(!$(this).val()){
            $(this).css('border-bottom','2px solid red');
            error="Veuillez renseigner tous les champs.";
        }else{
            $(this).css('border','2px solid  #eeeeee');
        }
    });
    return error;
  }
function check_wilaya(){
    var error="";
  
    $(' .required_wilaya').each(function(){   
        if(!$(this).val()){
            $(this).css('border','2px solid red');
            error="Veuillez entrez la wilaya de livraison";
        }else{
            $(this).css('border','2px solid  #eeeeee');
        }
    });
    return error;
  }
  
  function initialize_observer($selector, callback){
    var options={ threshold: 0.1};
    $selector.each(function(){
        var intersectionObserver = new IntersectionObserver(entries => {
            var is_intersecting=true;
            if(entries[0].intersectionRatio <= 0){
                var is_intersecting=false;
            }
            callback($(entries[0].target),is_intersecting, intersectionObserver);
    },options);
    intersectionObserver.observe(this);

    });
}


function launch_animation($target, is_intersecting, intersectionObserver){
    if(!is_intersecting){return;}
    var animation_name=$target.data('animation');
    $target.addClass(animation_name).removeClass('animatable');
    intersectionObserver.unobserve($target[0]);
}


  
async function ajax(url, data) {
    return await $.ajax({ type: "POST", url, data });
  } 


function disable_button($button){
    var my_button=$(`${$button}`) 
    console.log(my_button)
    if($(`${$button}`).hasClass('button_disabled')){

        $(`${$button}`).removeClass('button_disabled')
        $('.button_text').css('display','block')    
        $('.button_loading_icon').css('display','none')


    }else{
        $(`${$button}`).addClass('button_disabled')
        $('.button_text').css('display','none')    
        $('.button_loading_icon').css('display','block')    

    }
    

}