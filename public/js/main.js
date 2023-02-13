GV={ swipers:{},
initialize_page: {},
categories: {},
sub_categories: [],
sous_categories: {},
products: [],
reductions: {},
deliveries: {},
wilayas: {},
communes: {},
code_promo:'',
total_cart: 0,
Total:[],
reduction_pourcentage:[],
initial_quantity:1,
delivery_prices:0,
cart:{},
items:{},
array_price:[],
wilaya_name:"",
commune_name:"",
cart_quantity: 0,
free_delivery: 0,
navigation:[],
back_index:-1
} ;

var slideIndex = 1;



$(document).ready(async function () {
await loadProducts()
await loadCategories()
await loadSub_Categories()
await loadReductions()
await loadDeliveries()
await loadWilaya()
await loadItem()
await getTotalCart()

displayBanner()
navigate_to(get_first_page());
check_cookie('myCart')
  // displayProductsGrid({category:"1"},'#grid_groupe_1',4)
  // displayProductsGrid({category:"2"},'#grid_groupe_2',4)
  // displayProductsGrid({category:"4"},'#monCarousel_home2',4)
  displayPromtedCategories()
 $('#loading_page').fadeOut() 


});


function check_cookie(cname){
   var cart= getCookie(cname)
   if (!cart)return
    GV.cart=JSON.parse(cart) 
   console.log(GV.cart)
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


async function loadItem() {

  let data = await ajax("/load_items", {});
  console.log('ok')
  var items = data.items
  items.forEach(function (item) {
    GV.items[item.id]=item;

  });
};





async function loadProducts() {

    let data = await ajax("/load_products", {});
    var products = data.products
  
    products.forEach(function (product) {
      try{product.images=JSON.parse(product.images);}catch(e){product.images=[];}
      GV.products[product.id] = product;
    });
  };

async function loadCategories() {

    let data = await ajax("/load_categories", {});
    var categories = data.categories

    categories.forEach(function (category) {
        GV.categories[category.id] = category;
    });
};

async function loadSub_Categories() {

    let data = await ajax("/load_sub_categories", {});
    var sous_categories = data.sous_categories

    sous_categories.forEach(function (sous_category) {
        GV.sous_categories[sous_category.id] = sous_category;
    });

};


async function loadReductions() {

  let data = await ajax("/load_reductions", {});
  var reductions = data.reductions
  reductions.forEach(function (reduction) {
    GV.reductions[reduction.id] = reduction;
  });
};

async function loadDeliveries() {

  let data = await ajax("/load_deliveries", {});
  var deliveries = data.deliveries
  deliveries.forEach(function (delivery) {
    GV.deliveries[delivery.id] = delivery;
  });
};

async function loadWilaya() {

  let data = await ajax("/load_wilaya", {});
  var wilayas = data.wilayas
  wilayas.forEach(function (wilaya) {
    GV.wilayas[wilaya.id] = wilaya;
  });
};

async function getTotalCart(){

  for ( var id of Object.keys(GV.reductions)) {
    var reduction = GV.reductions[id]
    GV.Total.push(reduction.total)
    GV.reduction_pourcentage.push(reduction.pourcentage)

  }
  
}






async function displayCommune(nom, selector ){
  var name = {nom}
  let datas = await ajax('/NumberWilaya', name)
  var test = datas.number
  console.log(test)
  let wilaya_id= test[0].code
  let data = {wilaya_id}      
  GV.communes= {}
  var resultCommune = await ajax('/getCommunes', data)
  GV.communes = resultCommune.commune

  let html=""
  for (let Commune_id of Object.keys(GV.communes)) {
    var commune= GV.communes[Commune_id].nom
    html +=`<option value="${commune}" id="id_commune" class="wilaya">${commune}</option>`
  }  
   $(selector).append(html) 
}
  

function get_first_page(){
  var path=window.location.pathname;
  console.log(path)
  if(path.includes("/boutique_page")) return "boutique_page";  
  if(path.includes("/product_page"))  return "product_page";  
  if(path == "/promotion_page")  return "promotion_page";  
  if(path == "/home_page")  return "home_page";  
  return "home_page";  
}

onClick(".link", function () {
  if (!$(this).data('id')) return;
  navigate_to($(this).data('id'));
 topFunction();
});

function navigate_to(page_name,previous) {
  $(".page,#overlay").css('display', 'none')
  $(`.page[data-id="${page_name}"]`).css('display', 'grid');
 if (!GV.initialize_page[page_name]) return;
  GV.initialize_page[page_name]();
  window.history.pushState({}, "le cocon", get_next_page_url(page_name));
  $('#title_head_html').html(page_name)
 if(!previous){
  GV.navigation.push(page_name)

  GV.back_index++

  $(window).scrollTop(0);
 }
 let path = window.location.href
 gtag('config', 'G-LWB1FNJCVL', {
  page_title : page_name,
  page_location: path // The full URL is required.
  });
};

window.onpopstate = function(e) {
  
  e.preventDefault()
  var  target_index= GV.back_index-1
  var  target= GV.navigation[target_index]
  if(!target) return
  GV.back_index=target_index
  navigate_to(target,1)
  $(".link").removeClass("selected")
  $(`.link[data-id="${target}"]`).addClass("selected")

  
}; 

function track_product(product_id,event){
  var  product= GV.products[product_id]
  var product_name=product.product_name
  var product_price=product.price
  var product_cat=GV.categories[product.id_category]

    gtag('event', `${event=="select"?"select_content":"add_to_cart"}`, {
      "content_type": "product",
      "items": [
        {
          "id": product_id,
          "name": product_name,
          "list_name": "",
          "brand": "lecocon",
          "category": product_cat,
          "variant": "",
          "list_position": 0,
          "quantity": 0,
          "price": product_price
        }
      ]
    });
  

  
}


function get_next_page_url(page_name){

  if(page_name == "product_page") return `/${page_name}/${GV.selected_product_id}`;
  if(page_name == "boutique_page" && !GV.selected_category_id) return `/${page_name}`;
  if(page_name == "boutique_page" && GV.selected_category_id && !GV.selected_sub_category_id) return `/${page_name}/${GV.selected_category_id}`;
  if(page_name == "boutique_page" && GV.selected_category_id  && GV.selected_sub_category_id) return `/${page_name}/${GV.selected_category_id}/${GV.selected_sub_category_id}`;
  return `/${page_name}`;
}





//! ///////////////////////////////////////////////////////////
//! //////////////////!    HOME   //////////////////////////
//! ///////////////////////////////////////////////////////////
GV.initialize_page.home_page=function(){

  displayCategories()
 

    $(function() {
    
      new Slider({
          images: '.slider-1 img',
          btnPrev: '.slider-1 .buttons .prev',
          btnNext: '.slider-1 .buttons .next',
          auto: false
      });
    
    new Slider({
          images: '.slider-2 img',
          btnPrev: '.slider-2 .buttons .prev',
          btnNext: '.slider-2 .buttons .next',
          auto: true,
          rate: 2000
      });
    });
    
    displayBanner()
 

   
  
   
}

function displayPromtedCategories(){
  let i=0
  for(element of Object.values(GV.categories)){
    if(element.is_promoted!=1)continue
    i++
    let html=`
    <div class="boutique_section ">
      <div class="grid w100 colmn2 boutique_section_header" style="border-bottom: 1px solid #a7a4a0;"><h5 class="title_block text_color_1 light w100 text_left">selection ${element.category_name}</h5><div class="text_right bold see_more_products" style="padding: 20px;" data-category="${element.id}" data-subcat="">voir plus >> </div></div>
      <div id="grid_groupe_${i}"class="card_group_grid">
      
      </div>
    </div>    
    `
    $('#promoted_categories_container').append(html)
    
    displayProductsGrid({category: element.id},`#grid_groupe_${i}`,4)
    
  }
}

function displayProductsGrid(filters,$selector,limit){
  // let html="";
  var count=0
  for ( var id of Object.keys(GV.products)) {
      
      
     
      var product = GV.products[id]
      var percentage = (100 * product.promo_price) / product.price;
      var promo_percentage =  Math.trunc((100 - percentage)) 
      var category = GV.categories[product.id_category]
      if (!check_product_filters(product,filters)) continue;
      if(product.quantity==0)continue
      count++
      if(count>limit) return 
      // console.log(count,category.category_name,product.product_name,'new')
      if(product.quantity > 0){
      let html = `
      <div class="card_product test" data-id="${product.id}" data-price="${product.price}" data-cat="${product.id_category}" >
      <div class="badge_promo " style=${product.promo!=1 ? "display:none":""}></div>
      <div class="text_badge text_white" style=${product.promo!=1 ? "display:none":""}>-${promo_percentage}%</div> 
          <div class="image_container" data-id="${product.id}"><img src="/img/uploads/${product.images[0]}"</img></div>
          <div class="w100">
            <div class="product_name bold">${product.product_name}</div>
            <div class="product_name">${category.category_name}</div>
          </div>
          <div class="product_price_section w100 bold" style=${product.promo!=1 ? "display:block":""}><div class=${product.promo!=1 ? "":"line-through pricetest"}>${product.price} DA</div><div style=${product.promo!=1 ? "display:none":"color:red"} >${product.promo_price} DA</div></div>
          <div class="button_container add_to_cart"><div class="button_large ${product.promo!=1 ? "color2":"red"} "><div class=" bold text_white ">Ajouter au panier</div></div></div>
    </div>
     `
     $($selector).append(html); 
   
    }}
    console.log(count,limit)
    
}


function displayBanner() {
  $("#carousel_images").html("")
  
  if(!GV.items || jQuery.isEmptyObject(GV.items)){
         let  html = `<img src="img/des-outils-de-bricolage-002.jpg" class="shown" alt=""> `
    
    $("#carousel_images").prepend(html)
  }

    
    
  for (id of Object.keys(GV.items)) {
    let item = GV.items[id]
     let  html1 = `<img src="../img/uploads/${item.picture}" class="" alt=""> `
    $("#carousel_images").append(html1)
    
    
    
  }


}









function Slider(obj) {
	this.images = $(obj.images);
	this.auto = obj.auto;
	this.btnPrev = obj.btnPrev;
	this.btnNext = obj.btnNext;
     this.rate = obj.rate || 2000;

	var i = 0;
     var slider = this;

    // The "Previous" button: to remove the class .shown, to show the previous image and to add the .shown class
	this.prev = function () {
		slider.images.eq(i).removeClass('shown');
		i--;

		if (i < 0) {
			i = slider.images.length - 1;
		}

		slider.images.eq(i).addClass('shown');
	}

    // The "Next" button: to remove the class .shown, to show the next image and to add the .shown class
	this.next = function () {
		slider.images.eq(i).removeClass('shown');
		i++;

		if (i >= slider.images.length) {
			i = 0;
		}

		slider.images.eq(i).addClass('shown');

	}

    // To add next and prev functions when clicking on the corresponding buttons
    $(slider.btnPrev).on('click', function(){ slider.prev();});
    $(slider.btnNext).on('click', function(){ slider.next();});

    // For the automatic slider: this method calls the next function at the set rate
	if (slider.auto)	{
        setInterval(slider.next, slider.rate);
    }
};

function displayCarouselProductsR(filters,$selector) {
  let html="";

  for ( var id of Object.keys(GV.products)) {
      var product = GV.products[id]
      var percentage = (100 * product.promo_price) / product.price;
      var promo_percentage =  Math.trunc((100 - percentage)) 
      var category = GV.categories[product.id_category]
      if (!check_product_filters(product,filters)) continue;
      if(product.quantity > 0){
      html += `
      <div class="card_product test" data-id="${product.id}" data-price="${product.price}" data-cat="${product.id_category}" >
      <div class="badge_promo " style=${product.promo!=1 ? "display:none":""}></div>
      <div class="text_badge text_white" style=${product.promo!=1 ? "display:none":""}>-${promo_percentage}%</div> 
          <div class="image_container" data-id="${product.id}"><img src="/img/uploads/${product.images[0]}"</img></div>
          <div class="w100">
            <div class="product_name bold">${product.product_name}</div>
            <div class="product_name">${category.category_name}</div>
          </div>
          <div class="product_price_section w100 bold" style=${product.promo!=1 ? "display:block":""}><div class=${product.promo!=1 ? "":"line-through pricetest"}>${product.price} DA</div><div style=${product.promo!=1 ? "display:none":"color:red"} >${product.promo_price} DA</div></div>
          <div class="button_container add_to_cart"><div class="button_large ${product.promo!=1 ? "color2":"red"} "><div class=" bold text_white ">Ajouter au panier</div></div></div>
    </div>
     `
           
   
    }}
    
     $($selector).html(html); 

    

}

function displayCategories() {
  $("#category_link").html("")
  $(".category_card_list").html("")
  $("#filter_cat").html("")
  
  for ( var id of Object.keys(GV.categories)) { 
    let category = GV.categories[id]
    var category_id = category.id

    let  html = `
      <div class="dropdown_item text_white link"  data-id="boutique_page" >
        <div class=" dropdown_cat text_color_1 " data-id="${category.id}" >  ${category.category_name} </div>
        <span id="${category_id }" > </span>
                                        
      </div>`
    let  html2 = `
        <div id="filter_${category.id}" class="category_name_card bold" data-id="${category.id}"> > ${category.category_name} </div>
        <span class="sub_cat_${category_id}"> </span>
        `
    let  html3 = `
        <option class="category_name_card bold" value="${category.category_name}" data-id="${category.id}"> ${category.category_name} </option>
        `


    $("#category_link").append(html)
    $(".category_card_list").append(html2)
    $(".category_dropdown").append(html3)

    for(id of Object.keys(GV.sous_categories)){
      let sub_category=GV.sous_categories[id]
      let sub_category_id= sub_category.id_category

      if( sub_category_id==category_id ){
       
       let html=`<div class="dropdown_sub">${sub_category.sub_category_name}<div>`
       let html2=`<div data-id="${sub_category.id}" data-category="${category.id}" class="sub_category_name_card">${sub_category.sub_category_name}<div>`

       $(`#${category_id }`).append(html)
       $(`.sub_cat_${category_id}`).append(html2)
    

      }
    }

  }
  

}

function displayDropCat(id){
 
    $(id).html("")  
  let html=""
  for (let category_id of Object.keys(GV.categories)) {
    var category= GV.categories[category_id].category_name
    console.log(category)
    html +=`<option value="${category_id}" id="${category_id}" class="cat"}>${category}</option>`
     $(id).html(html) 
  }  
  
}


onClick('.banner_type2', function () {
  
  var category=$(this).data('category')
  var sub_cat=$(this).data('subcat')

  if(category)GV.selected_category_id=category
  if(sub_cat)GV.selected_sub_category_id=sub_cat
  navigate_to('boutique_page')

});

onClick('.see_more_products', function () {
  
  var category=$(this).data('category')
  var sub_cat=$(this).data('subcat')

  if(category)GV.selected_category_id=category
  if(sub_cat)GV.selected_sub_category_id=sub_cat

  GV.page=1
  funded_products=0

  $(".cards_container2").html("")

  displayProducts({category:$(this).data("category")})

  navigate_to('boutique_page')

});


onClick('.sidebar_icon', function () {
    if($('.sidebar').hasClass('open_sideBar')){
        $(".sidebar").removeClass('open_sideBar')

    }else{
    $(".sidebar").addClass('open_sideBar')
  
    }

    /*$(".sidebar").css("display","block")
    /*$(".sidebar").css("animation","fadec 0.3s ease-in")*/
});

onClick('.skip', function () {

    $(".sidebar").removeClass('open_sideBar')
   
});

onClick('.menu_side_item ', function () {
    $('.sidebar').removeClass('open_sideBar')
   /* $(".sidebar").css("display","none")
    $(".sidebar").css("animation","fade_left 0.9s ease-out")*/
});

onClick('.cart', function () {
    $('#overlay').css('display','block')
    $('#cart_container').css('display','grid')
    if( GV.delivery_prices == 0){
  
      get_priceDelivery("16")
    }   
    if(GV.cart.length!=0){
         display_cart()

      
         
         
    }
});



onClick ("#overlay", function(){
    $('#overlay').css('display','none')
    $(".recap_container").css('display','none');
    $('#cart_container,#bars_menu_container').css('display','none')    
});

onClick('#skip_btn', function () {
  $('#overlay').css('display', 'none')
  $('#cart_container').css('display','none')

});

//! ///////////////////////////////////////////////////////////
//! //////////////////!    PROMOTION   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.promotion_page=function(){
  displayProductsPromotion({category:""})
  displayCategories()
  displayDropCat("#id_category")
}



function displayProductsPromotion(filters) {
$(".cards_container").html("")

for ( var id of Object.keys(GV.products)) {
  let product = GV.products[id]
  if(product.promo!=0 ){
  var percentage = (100 * product.promo_price) / product.price;
  var promo_percentage = Math.trunc((100 - percentage)) 
  if(!check_product_filters(product, filters)) continue;
  if(product.quantity > 0){
  let  html = `
  <div class="card_product" data-id="${product.id}" data-price="${product.price}" data-cat="${product.id_category}">
    <div class="badge_promo_page " style=${product.promo!=1 ? "display:none":""}></div>
    <div class="text_badge_page text_white" style=${product.promo!=1 ? "display:none":""}>-${promo_percentage}%</div> 
        <div class="image_container" data-id="${product.id}"><img src="/img/uploads/${product.images[0]}"</img></div>
        <div class="product_name title_product">${product.product_name} </div>
        <div class="product_price_section " style=${product.promo!=1 ? "display:block":""}><div  class="line-through">${product.price} DA</div><div style="color:red">${product.promo_price} DA</div></div>
        <div class="button_container add_to_cart"><div class="button_large red"><div class=" bold text_white ">Ajouter au panier</div></div></div>
  </div>
  `


  $(".cards_container").append(html)
}
  }
}

};

$(document).ready(function(){
  $("#products_promo_search").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".cards_container .card_product ").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

$(document).on("change", ".price-sorting-promo", function() {

  var sortingMethod = $(this).val();
  sortProductsPrice(sortingMethod,".cards_container");
 
});

//! ///////////////////////////////////////////////////////////
//! //////////////////!    BOUTIQUE   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.boutique_page=async function(){
  displayCategories()
  displayDropCat("#id_category")
  // let randomised_products1 = [...GV.products].sort(randomize);
  // let randomised_products = randomised_products1.filter(element => {
  //   return element !== undefined;
  // });

  // GV.selected_category_id="all"
  if(GV.selected_category_id && !GV.selected_sub_category_id){
    displayProducts({category:GV.selected_category_id},)

  }else if(GV.selected_sub_category_id){
    displayProducts({sub_category:GV.selected_sub_category_id})
  }
  else{
    displayProducts({category:""},)
  }

    
}


onClick('#see_more',function(){

  GV.page=GV.page+1

  if(GV.selected_category_id && !GV.selected_sub_category_id){
    displayProducts({category:GV.selected_category_id},)

  }else if(GV.selected_sub_category_id){
    displayProducts({sub_category:GV.selected_sub_category_id})
  }
  else{
    displayProducts({category:""},)
  }

})

  
$(document).on("change", "#id_category", function() {
  var cat=$(this).val()
  GV.page=1
  funded_products=0
  GV.selected_category_id=$(this).val()
  window.history.pushState({}, "brico house", get_next_page_url("boutique_page"));
  $(".cards_container2").html("")

  displayProducts({category:cat})


});


function randomize(a, b) {
  return Math.random() - 0.5;
}

GV.page = 1;
GV.increment = 10;
var funded_products=0



// function display_products() {
// let html = "";
// let currentIndex= GV.page * GV.increment;
// for (var i =currentIndex; i < (currentIndex +increment); i++) {
//   let product=Object.values(GV.products)[i];
//   if(!product) continue;
//   html += product_html();
// }
// return html;
// }




const groupBy = (arr, key) => {
  const initialValue = {};
  return arr.reduce((acc, cval) => {
    const myAttribute = cval[key];
    acc[myAttribute] = [...(acc[myAttribute] || []), cval]
    return acc;
  }, initialValue);
};





function displayProducts(filters) {
  
  let currentIndex= GV.page * GV.increment; //10 puis 20 
  if(currentIndex==10){
    currentIndex=0
  }

  if(GV.selected_sub_category_id){
    console.log(GV.selected_sub_category_id,"selected_subcategoy")
    var res = groupBy(GV.products, "id_sub_category");
    var limit_loop_product = res[filters.sub_category].length

    if( currentIndex > limit_loop_product ){
      limit_loop_product=20
    }


  }else if(GV.selected_category_id && !GV.selected_sub_category_id) {
    var res = groupBy(GV.products, "id_category");

    var limit_loop_product = res[filters.category].length

  }else{
    var limit_loop_product = GV.products.length

  }
  // console.log(limit_loop_product,"limit loop")

  // console.log(res[filters.sub_category], "grouped_products")
  

  let  html =""




  for (var i = currentIndex; funded_products<(currentIndex+GV.increment) && i< limit_loop_product ; i++) {

    if (filters.category && !filters.sub_category){
      var product=Object.values(res[filters.category])[i];
     
    

    } else if (filters.sub_category) {
      console.log("here i am")
      var product=Object.values(res[filters.sub_category])[i];
      console.log(product,"product", i, "index")
      console.log(i,"index")
      // console.log(res[filters.sub_category],"res")


    }else {
      var product=Object.values(GV.products)[i];

    }
    
    console.log(currentIndex, "current index")

    // if(filters.category  && res[product.id_category].length==$(".cards_container2").find('.test').length){
    //   console.log(res[product.id_category].length)
    //   alert()
    //   return
    // } 

    if(!product) continue;


  
    var percentage = (100 * product.promo_price) / product.price;
    var promo_percentage = Math.trunc((100 - percentage)) 
    let category = GV.categories[product.id_category]

    if(!check_product_filters(product, filters)) continue;

    funded_products = funded_products+1


    if(product.quantity > 0){
      html = `
    <div class="card_product test" data-id="${product.id}" data-price="${product.price}" data-cat="${product.id_category}" >
      <div class="badge_promo " style=${product.promo!=1 ? "display:none":""}></div>
      <div class="text_badge text_white" style=${product.promo!=1 ? "display:none":""}>-${promo_percentage}%</div> 
          <div class="image_container" data-id="${product.id}"><img src="/img/uploads/${product.images[0]}"</img></div>
          <div class="w100">
            <div class="product_name bold">${product.product_name}</div>
            <div class="product_name">${category.category_name}</div>
            
          </div>
          <div class="product_price_section  w100 bold" style=${product.promo!=1 ? "display:block":""}><div class=${product.promo!=1 ? "":"line-through pricetest"}>${product.price} DA</div><div style=${product.promo!=1 ? "display:none":"color:red"} >${product.promo_price} DA</div></div>
          <div class="button_container add_to_cart"><div class="button_large ${product.promo!=1 ? "color2":"red"} "><div class=" bold text_white ">Ajouter au panier</div></div></div>
          
    </div>
    `
    $(".cards_container2").append(html)
  
    }
   
  }

};





// function displayProducts(filters) {
//   $(".cards_container2").html("")
//   let  html =""
//   var randomised_products = [...GV.products].sort(randomize);
//   // randomised_products= randomised_products.sort(randomize);


//   console.log(randomised_products,'yesssss')
//   for ( var element of Object.values(randomised_products)) {
//     var product = element
//     if (!product)continue
//     console.log(product,product.id)
  
//     var percentage = (100 * product.promo_price) / product.price;
//     var promo_percentage = Math.trunc((100 - percentage)) 
//     let category = GV.categories[product.id_category]
//     console.log(category)
//     if(!check_product_filters(product, filters)) continue;
//     if(product.quantity > 0){
//      html += `
//     <div class="card_product test" data-id="${product.id}" data-price="${product.price}" data-cat="${product.id_category}" >
//       <div class="badge_promo " style=${product.promo!=1 ? "display:none":""}></div>
//       <div class="text_badge text_white" style=${product.promo!=1 ? "display:none":""}>-${promo_percentage}%</div> 
//           <div class="image_container" data-id="${product.id}"><img src="/img/uploads/${product.images[0]}"</img></div>
//           <div class="w100">
//             <div class="product_name bold">${product.product_name}</div>
//             <div class="product_name">${category.category_name}</div>
            
//           </div>
//           <div class="product_price_section w100 bold" style=${product.promo!=1 ? "display:block":""}><div class=${product.promo!=1 ? "":"line-through pricetest"}>${product.price} DA</div><div style=${product.promo!=1 ? "display:none":"color:red"} >${product.promo_price} DA</div></div>
//           <div class="button_container add_to_cart"><div class="button_large ${product.promo!=1 ? "color2":"red"} "><div class=" bold text_white ">Ajouter au panier</div></div></div>
//     </div>
//     `

//   }
// }
// $(".cards_container2").html(html)
// };

function check_product_filters(product, filters){
 
  if(!filters) filters={};
  if(filters.promo &&  product.promo !=filters.promo && filters.catgeory != product.id_category ) return false;
  if( filters.category && product.id_category != filters.category ) return false;
  if( filters.sub_category && product.id_sub_category != filters.sub_category ) return false;
  // if(product.id_category != filters.category) return false;
  return true;  
}

$(document).ready(function(){
  $("#products_search").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".cards_container2 .card_product ").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

$('#filter-promo').on('change', async function(){
 
  displayProducts({promo:$(this).val(),category:$(".selected").data("id")})

});


$(document).on("change", ".price-sorting", function() {

  var sortingMethod = $(this).val();
  sortProductsPrice(sortingMethod,".cards_container2");
 
});



function sortProductsPrice(sortingMethod,$selector)
{
  if(sortingMethod == 'l2h')
  {

    var products = $($selector).find('.card_product')
    products.sort(function(a, b){ return $(a).data("price")-$(b).data("price")});
    $($selector).html(products);
  }
  else if(sortingMethod == 'h2l')
  {
    var products = $($selector).find('.card_product')
    products.sort(function(a, b){ return $(b).data("price")-$(a).data("price")});
    $($selector).html(products);
  
  }
  
}




onClick(".category_name_card, .dropdown_cat", function () {
  $(".category_name_card, .sub_category_name_card, .dropdown_cat").removeClass("selected")
  GV.selected_category_id=$(this).data('id')
  GV.selected_sub_category_id=undefined
  window.history.pushState({}, "brico house", get_next_page_url("boutique_page"));
  $(this).addClass("selected")

  GV.page=1
  funded_products=0

  $(".cards_container2").html("")

  displayProducts({category:$(this).data("id")})

  // displayProductsPromotion({category:$(this).data("id")})
});




onClick(".dropdown_cat", function () {

  displayProducts({category:$(this).data("id")})
  displayProductsPromotion({category:$(this).data("id")})
})


onClick(".sub_category_name_card", function () {
  $(".category_name_card, .sub_category_name_card").removeClass("selected")
  GV.selected_category_id=$(this).data('category')
  GV.selected_sub_category_id=$(this).data('id')
  window.history.pushState({}, "brico house", get_next_page_url("boutique_page"));
  $(this).addClass("selected")

  GV.page=1
  funded_products=0

  $(".cards_container2").html("")

  displayProducts({sub_category:$(this).data("id")})
  displayProductsPromotion({sub_category:$(this).data("id")})
})

onClick(".card_info", function () {
  $(".category_name_card").removeClass("selected")
var selection =  $(this).data("cat")
console.log(selection)

 
   
  $(`#filter_${selection}`).addClass("selected")



  displayProducts({category:$(this).data("cat")})

})



// 

//! ///////////////////////////////////////////////////////////
//! //////////////////!    PRODUCT DETAILS   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.product_page=async function(){
    displayDetailsProduct(GV.selected_product_id)
    topFunction()
    let product= GV.products[GV.selected_product_id]
    let category=GV.categories[product.id_category]
    displayCarouselProductsR({category:category.id},'#monCarousel2');
    carousel('#monCarousel2');


    showSlides(slideIndex);

    // $("#product_page_video").get(0).play();

    Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
      get: function () {
          return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
      }});

    $('body').on('click touchstart', function () {
      const videoElement = document.getElementById('product_page_video');
      if (videoElement.playing) {
          // video is already playing so do nothing
      }
      else {
          // video is not playing
          // so play video now
          videoElement.play();
      }
  });
  
  }


  // function getSuggestionCarousel(){

  // } 

  function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }


// $(document).on('click','.see-more', function(){
//   page = page +1;
//   display_products();
// });

onClick('.plus',function(){
  var val=parseInt($('.qty').val())

  var newVal= val+1

  $('.qty').val(newVal)
});

onClick('.minus',function(){
  var val=parseInt($('.qty').val())
  if(val==1)return
  var newVal= val-1
  $('.qty').val(newVal)
});

function displayDetailsProduct(id){
 
    let product = GV.products[id]
    let category = GV.categories[product.id_category]
    let description = product.description
    let description_ar= product.description_ar
    let formated_description= description.replace(/\n/g,'<br/>')
    let formated_description_ar= description_ar.replace(/\n/g,'<br/>')

    
    console.log(formated_description,description)

  let sub_category = GV.sous_categories[product.id_sub_category]
      if(!sub_category)sub_category="vide"
    $('.details_product').html("")

      let html=`          
                <div class="small_item_img">
                </div>
                <input id="product-id" type="hidden" value="${id}"/>
                
                <div class="item_img" >
                <div class="slideshow-container">
            
                    <!-- Next and previous buttons -->
                    <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
                    <a class="next" onclick="plusSlides(1)">&#10095;</a>
                  </div>
                </div>
                
            <div class="item_body" data-id="${product.id}">
            <div class="item_body_title text_color_1 bold">${product.product_name}</div>
            <div class="item_body_subtitle pb_10">${category.category_name}--${sub_category.sub_category_name==undefined ? 'aucune sous-catégorie': sub_category.sub_category_name } </div>
            <div id="product-price" class="item_body_subtitle price ">${get_product_price_html(product)}</div>
            <div class="item_body_subtitle product_description pb_10">${formated_description}</div>
            <div class="item_body_subtitle product_description_arabe pb_10">
            ${formated_description_ar} </div>

            <div class="input-group w100 ">
                
                
            <div class="quantity buttons_added">
            <input type="button" value="-" class="minus"><input type="number" step="1" min="1" max="" name="quantity" value="1" title="Qty" class="input-text qty text" size="4" pattern="" inputmode=""><input type="button" value="+" class="plus">
          </div>
              
                        <div class="button_container add_to_cart"><div class="button_large color2 shadow"><div class=" bold text_white "><i class="fas fa-shopping-cart color"></i>  Ajouter au panier</div></div></div>            
                    </div>
            </div>
          
                `

      $('.details_product').html(html)

      
      var images = product.images
      let list=""
      let list2=""
      for (let id of Object.keys(images) ) {
             list += `
              <div class="small_item_img">
              <img src="/img/uploads/${images[id]}">
                </div>`
             list2 += `
             <div class="mySlides fade">
             <img src="/img/uploads/${images[id]}"style="width:100%">
           </div>`
            
              
              console.log(images[id])
            }
            $(".small_item_img").html(list)
            $(".slideshow-container").append(list2)
       
            
         
  }




$(document).on("click", ".card_product", function () {
  GV.selected_product_id=$(this).data("id");
  navigate_to("product_page")
  track_product(GV.selected_product_id,"select")

});

function displayCarouselGallery() {
let html=""
  for ( var id of Object.keys(GV.products)) {
      let product = GV.products[id]
     
      var images = product.images
   
      for (let id of Object.keys(images) ) {
             html += `
             <div class="card_product" data-id="${product.id}">
             <img src="/img/uploads/${product.images[0]}"</img>
         </div>
              `
              
              console.log(images[id])
            }
            $("#gallery").html(html)
    }


}


// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace("active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += "active";
}

function get_product_price_html(product, quantity){
  
  if (!quantity ) quantity= GV.initial_quantity;
      let productPrice= parseFloat(product.price)*quantity
      let productPromoPrice= parseFloat(product.promo_price)*quantity
    
      if(product.promo == 1) {
        return `
                <div class="item_body_subtitle product_price_section  price pb_10"><div>${productPromoPrice} DA</div><div class="line-through">${productPrice} DA</div></div>
                `
      }
    
      return `<div class="price">${productPrice} DA</div>`;
  
  }


$(document).on('change','#quantity-select', function(){
    let product=GV.products[$('#product-id').val()];
    let quantity=$(this).val();
    $('#product-price').html(get_product_price_html(product, quantity));
    console.log(quantity)
  })
  
function get_product_price(product, quantity){
        
        if (!quantity ) quantity= GV.initial_quantity;
        let productPrice= parseFloat(product.price)*quantity
        let productPromoPrice= parseFloat(product.promo_price)*quantity

        if(product.promo=="1" && product.promo_price) return productPromoPrice;
        return productPrice;

 
}


  

//! ///////////////////////////////////////////////////////////
//! //////////////////!    CART     //////////////////////////
//! ///////////////////////////////////////////////////////////



onClick (".card_product .add_to_cart", function(e){
    e.stopPropagation();
    var id = $(this).closest('.card_product').data("id");
    
    
      let quantity = 1
      add_to_cart(id,quantity)
      track_product(id,"add_to_cart")

  });
  
  
  onClick (".item_body .add_to_cart", function(e){
    e.stopPropagation();
    var id = $(this).closest('.item_body').data("id");
    
    var quantity = parseInt($('.qty').val())
    add_to_cart(id, quantity)
    
  });
  
  function add_to_cart(id,quantity){
    GV.cart[id]={id, quantity}; 
    let myCart= JSON.stringify(GV.cart)
    
   document.cookie = `myCart=${myCart}`;
    display_cart();
  }
  
  async function displayWilaya(id){
    let html=""
    for (let wilaya_id of Object.keys(GV.wilayas)) {
      var wilaya= GV.wilayas[wilaya_id].nom
      html +=`<option value="${wilaya_id}" id="${wilaya_id}" class="wilaya"}>${wilaya}</option>`
    }  
     $(id).append(html) 
  }

  function display_cart(){
    $('#overlay').css('display','block')
    $('#cart_container').css('display','grid')
    var html="";
    console.log(GV.cart)
    for(product_id of Object.keys(GV.cart)){
      var cart_element= GV.cart[product_id];
      var product= GV.products[product_id];  
        
        html +=`<div class="cart_product_container" data-id="${product.id}">
                  <div class="cart_product_img"><img src="/img/uploads/${product.images[0]}"></div>
                  <div class="cart_product_informations">
                      <div class="cart_product_title capitalize">${product.product_name}</div>
                      <div class="cart_product_subtitle price"> ${get_product_price_html(product, cart_element.quantity)}</div>
                  </div>
                  
                  <div> x ${cart_element.quantity}</div>
                  <div class="cart_product_icon grid center"><i class="fas fa-times delete_icon" data-id="${product.id}" style="width:100%;height:100%"></i></div>
                </div>
                `
    }
  
    $(".body_cart").html(html); 
    displayWilaya("#id_wilaya")
    totalCart(); 
   
  }
  


  onClick('.delete_icon', function (){
    var id=$(this).data('id')
    delete GV.cart[id] 
    $(this).closest('.cart_product_container').fadeOut()
    totalCart()
  });



  function get_priceDelivery(id){
    GV.delivery_prices = 0;
    for ( var id_delivery of Object.keys(GV.deliveries)) { 
      let delivery = GV.deliveries[id_delivery]
      var delivery_id = delivery.id
  
      for(id_wilaya of Object.keys(GV.wilayas)){
        let wilaya=GV.wilayas[id_wilaya]
  
        if( id==delivery.id_wilaya && id==id_wilaya ){
              
              GV.delivery_prices = parseInt(delivery.price_delivery);
              
         
        }
      }

    }
   
  }
  


  $(document).on('change', '#name',async function(){
 
    var code_promo= $("#name").val()
    GV.code_promo = code_promo
    totalCart()
   
  });


  function get_cart_quantity(){
    // for( product_id of Object.keys(GV.cart)){
    //   if(GV.cart.hasOwnProperty(product_id)){
    //     GV.cart_quantity = GV.cart_quantity+1;
    //      }
    // }
    
    var size = Object.size(GV.cart);
    console.log(size)
    $('.cart_quantity').html(`${size}`); 
  }

  Object.size = function(obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };


  function totalCart(){
    var total=0;

    
    for( product_id of Object.keys(GV.cart)){
      var cart_element= GV.cart[product_id];
      var quantity= cart_element.quantity
      var product = GV.products[product_id]
      var price = get_product_price(product, quantity);
      total += price;
      
    }
   
    get_cart_quantity()

    GV.total_cart=total
    
    for ( var id of Object.keys(GV.reductions)) {
      var reduction = GV.reductions[id]
      // let lowestToHighest = GV.Total.sort((a, b) => a - b);
      // for (var i = 0; i < lowestToHighest.length; i++) {
        
      //   if ( lowestToHighest[i] <= total && total < lowestToHighest[i+1] ){
          
      //     if (lowestToHighest[i] == reduction.total ){
            
      //   var pourcent = reduction.pourcentage/100;
      //   var minus_red = total * pourcent
      //   var grand_total = total - minus_red
      //   $('.sous_total').html(`Avec Réduction: ${grand_total} DA `)}
      //   }
      //   else if(total >= lowestToHighest[i+1] ){
      //   if (lowestToHighest[i+1] == reduction.total ){
            
      //     var pourcent = reduction.pourcentage/100;
      //     var minus_red = total * pourcent
      //     var grand_total = total - minus_red
      //     $('.sous_total').html(`Avec Réduction:  ${grand_total} DA`)}}
      // }
      
      if ( GV.total_cart >= reduction.total  && reduction.total != null ){
        var test= "yes"
        GV.free_delivery = 1
        GV.delivery_prices = 0
      }
      else{
        var test= "no"
        
      }

      if(GV.code_promo == reduction.name){
        
        var pourcent = reduction.pourcentage/100;
        var minus_red = GV.total_cart * pourcent
        GV.total_cart = GV.total_cart - minus_red
        $('.sous_total').html(`code_promo: ${reduction.pourcentage}% `)
      }
      
    }
   
    GV.total_cart += GV.delivery_prices
    let priced=GV.delivery_prices
    let free_delivery = `Prix Livraison : Livraison Gratuite`
    let with_delivery =`Prix Livraison : ${priced}`

    let testing = `${GV.free_delivery==1 ? free_delivery:with_delivery} `
    $('.delivery').html(testing)

   
    // $('.sous_total').html(`Sous-total: ${total} DA`)
    
    $('.total').html(`TOTAL: ${GV.total_cart} DA`);  
   

  }
  
   
  $(document).on('change', '#id_wilaya', '#name',async function(){
 
    var id= $("#id_wilaya").val()
    GV.wilaya_name =GV.wilayas[id].nom
   GV.commune={}
   $('#id_commune').html("")
    displayCommune(GV.wilaya_name,$('#id_commune') )
    get_priceDelivery(id)
    totalCart()
  });
  

  onClick ("#retour", function(){
    $(".cart_container").css("display","block")
    $(".body_cart").css("display","block")
    $("#confirme_cart").css("display","block")
    $("#save_cart").css("display","none")
    $("#cart_form").css("display","none");
});

async function sendMail() {
  var information = {
    nom: $("#nom").val(),
    email: $("#e-mail").val(),
    objet: $("#objet").val(),
    message: $("#message").val(),

  }
  var options = {
    type: "POST",
    url: `/send_mail`,
    cache: false,
    data: {
      information
    },
  };
  var received_data = await $.ajax(options);
  if (received_data.ok) {
    
    $(".recap_container").css('display','block');
  }

}

onClick("#contact_us", function(){
  var error=check_cantactus();
  $('#error').html(error);
  if(error) return; 
  sendMail() 
  $('.popup').css('display','block');
    $('.message').html('Message envoyer avec succès')
});

  onClick("#confirme_cart", function(){
    var error=check_wilaya();
    $('#error').html(error);
    if(error) return; 
    $("#cart_container").addClass("cart_modified")
       $(".cart_container,#wilaya_container,#promo_container").css("display","none")
    $(".body_cart").css("display","none")
    $("#cart_form").fadeIn();
    $("#confirme_cart").css("display","none")
    $("#save_cart").css("display","block")
    display_input_commune()
  });

  async function displayWilaya(id){
    let html=""
    for (let wilaya_id of Object.keys(GV.wilayas)) {
      var wilaya= GV.wilayas[wilaya_id].nom
      html +=`<option value="${wilaya_id}" id="${wilaya_id}" class="wilaya" >${wilaya}</option>`
    }  
     $(id).append(html) 
    
  }

  function display_input_commune(){

    var html="";

        
        html +=`<div class="input-container" >
        <div class="label">Commune *</div>
        <select data-id="id_commune" data-name="commune" id="id_commune" type=text placeholder="Veuillez entrez la commune" class="required"> 
              <option value=""   >Commune</option>
          </select>
      </div>
                `
  
    $("#cart_form").append(html); 
    displayCommune(GV.wilaya_name,$('#id_commune') )

   
  }
  $(document).on('change', '#id_commune',async function(){
 
    var id= $("#id_commune").val()
    GV.commune_name =id;

  });
  
  onClick("#save_cart", async function(){

    var error=check_formulaire();
    $('#error').html(error);
    if(error) return; 
    var invoice = GV.total_cart
    var delivery_price = GV.delivery_prices
    var wilaya = GV.wilaya_name
    var commune =  GV.commune_name
    var invoice_euro= invoice/214
    var val_pixel= parseFloat(invoice).toFixed(2)
    var val_pixel_euro=  parseFloat(invoice_euro).toFixed(2)
    var item={content: JSON.stringify(GV.cart),total_cart:invoice,delivery_price:delivery_price, wilaya:wilaya, commune:commune };
    let user={};
    $('#cart_form').find('input, select, textarea').each(function(){
      if(!$(this).data('name')) return true;
      user[$(this).data('name')]=$(this).val();
    });
    console.log(val_pixel_euro)
    fbq('track', 'Purchase', {value:val_pixel_euro, currency: "EUR"});
    var received_data= await $.ajax({type: 'POST', url: `/create_orders`, data:{item,user}});
    // var received_data_sms= await $.ajax({ type: 'POST', url:`/send_sms`, data:{user}});
    if(received_data != "ok") return;
   
    $("#cart_container").css('display','none');
    $(".cart_product_container, .form_container").html('')
    $(".recap_container").css('display','block');
       document.cookie = `myCart=[]`;

  });

onClick("#close", function(){
  $("#overlay").css('display','none');
  $(".recap_container").css('display','none');
  location.reload(true);  
});
  

  
  
  onClick('.ok', async function () {
    $('.popup').css('display', 'none')
    $('#overlay').css('display', 'none')
    location.reload(true);  
  });


//! ///////////////////////////////////////////////////////////
//! //////////////////!    ARTISANS PAGE    //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.artisans_page=async function(){
  
}

  var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};

//! ///////////////////////////////////////////////////////////
//! //////////////////!    ARTISANS PAGE DETAILS   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.artisans_page_details=async function(){}
  

onClick('.box_artisan_category',function(){
    navigate_to("artisans_page_details")
})



//! ///////////////////////////////////////////////////////////
//! //////////////////!    ARTISAN PAGE DETAILS   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.artisan_page_details=async function(){}
  

onClick('.artisan_card',function(){
    navigate_to("artisan_page_details")
})


const ratingStars = [...$(".rating__star")];


function executeRating(stars) {
  const starClassActive = "rating__star fas fa-star";
  const starClassInactive = "rating__star far fa-star";
  const starsLength = stars.length;
  let i;
  stars.map((star) => {
    star.onclick = () => {
      i = stars.indexOf(star);

      if (star.className===starClassInactive) {
        for (i; i >= 0; --i) stars[i].className = starClassActive;
      } else {
        for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
      }

    };
  });
}
executeRating(ratingStars);