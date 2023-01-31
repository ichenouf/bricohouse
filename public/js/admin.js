
GV = {
  initialize_page: {},
  users: {},
  categories: {},
  sub_categories: [],
  sous_categories: {},
  sub_categories_index:{'0':0},
  products: {},
  artisans: {},
  reductions: {},
  deliveries: {},
  wilayas: {},
  orders: {},
  productsUsed:{},
  image_name:{},
  id : {},
  ads: {},
  filter_statut:'',
  Total:[],
  filelist: [],
  filelistPhone: [],
  fileListDesktop: [],
  appros:{},
  ordersUsed:{},
  image_desktop:'',
  image_phone:'',
  total_price:0,
  CurrentUser:{},
  history: {},
  items:{},
  chart_data:[],
}

//! ///////////////////////////////////////////////////////////
//! //////////////////!    READY     //////////////////////////
//! ///////////////////////////////////////////////////////////


$(document).ready(async function () {
  navigate_to(get_first_page());
  await loadUser()
  await loadCategories()
  await loadSub_Categories()
  await loadProducts()
  await loadArtisans()
  await loadReductions()
  await loadDeliveries()
  await loadWilaya()
  await loadOrders()
  await loadAppros()
  await loadAds()
  await loadHistory()
  await getCurrentUser()
  await loadItem()
  displaySideMenu()
  displayDashboard()
  displayGeneral()
  displayChart()
  window.addEventListener('offline', () => console.log('Became offline'));
  // setInterval(function(){
  //   checkconnection()
  // }, 10000);
  
  
});

window.addEventListener('offline', () => $('#connection_status').css('display','block'));
window.addEventListener('online', () => $('#connection_status').css('display','none'));

function checkconnection() {
  var status = navigator.onLine;
  if (status){
    
    $('#connection_status').css('display','none')

  } else{
    $('#connection_status').css('display','block')

  }
   
  
}
function navigate_to(page_name) {
  $(".page,#overlay").css('display', 'none')
  $(`.page[data-id="${page_name}"]`).css('display', 'grid');
  if (!GV.initialize_page[page_name]) return;
  GV.initialize_page[page_name]();
  window.history.pushState({}, "brico house", get_next_page_url(page_name));
};

function get_next_page_url(page_name){

  return `/admin/${page_name}`;
}


function get_first_page(){
  var path=window.location.pathname;
  console.log(path)
  if(path.includes("/order_page")) return "order_page";  
  if(path.includes("/product_page"))  return "product_page";  
  if(path.includes("/admin/client_page"))  return "client_page";  
  if(path == "/admin/user_page")  return "user_page";  
  if(path == "/admin/category_page")  return "category_page";  
  if(path == "/admin/reduction_page")  return "reduction_page";  
  if(path == "/admin/banner_page")  return "banner_page";  
  return "dashboard";  
};

async function loadUser() {

  let data = await ajax("/loadUsers", {});
  var users = data.users
  users.forEach(function (user) {
    GV.users[user.id] = user;
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


async function loadProducts() {

  let data = await ajax("/load_products", {});
  var products = data.products

  products.forEach(function (product) {
    try{product.images=JSON.parse(product.images);}catch(e){product.images=[];}
    GV.products[product.id] = product;
  });
};


async function loadArtisans() {

  let data = await ajax("/load_artisans", {});
  var artisans = data.artisans

  artisans.forEach(function (artisan) {
    try{artisans.work_img=JSON.parse(artisan.work_img);}catch(e){artisan.work_img=[];}
    GV.artisans[artisan.id] = artisan;
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

async function loadAds(){
  let data = await ajax("/load_ads", {});
 let ads = data.ads
  ads.forEach(function(ad){

    GV.ads[ad.id] = ad;
    
  });
};

async function loadItem() {

  let data = await ajax("/load_items", {});
  console.log('ok')
  var items = data.items
  items.forEach(function (item) {
    GV.items[item.id]=item;

  });
};



async function loadOrders() {

  let data = await ajax("/load_orders", {});
  var orders = data.orders

  orders.forEach(function (order) {
    GV.orders[order.id] = order;
  });
};
async function loadHistory() {

  let data = await ajax("/load_history", {});
  var history = data.history

  history.forEach(function (h) {
    GV.history[h.id] = h;
  });
};
async function loadAppros() {

  let data = await ajax("/load_appros", {});
  var appros = data.appros

  appros.forEach(function (appro) {
    GV.appros[appro.id] = appro;
  });
};

async function displayGeneral(){
  User_num = Object.keys(GV.users).length
  Prod_num = Object.keys(GV.products).length
  Order_num = Object.keys(GV.orders).length
  var tab = Object.values(GV.orders)
  GV.chart_data = Object.values(GV.orders)
let counts = tab.reduce((c, { statut: key }) => (c[key] = (c[key] || 0) + 1, c), {});
  let  html_user = `${User_num}`
  let  html_prod = `${Prod_num}`
  let  html_order = `${Order_num}`
  let  html_new = `${counts.new}`
  let  html_en_attente = `${counts.en_attente}`
  let  html_livraison = `${counts.en_cours}`
  let  html_accepted = `${counts.delivered}`
  $("#order_num").append(html_order)
  $("#user_num").append(html_user)
  $("#prod_num").append(html_prod)
  $("#order_new").append(html_new)
  $("#order_attente").append(html_en_attente)
  $("#order_livraison").append(html_livraison)
  $("#order_accepted").append(html_accepted)

}

onClick(".menu_item", function () {
  $(".menu_item").removeClass("selected")
  $(this).addClass("selected")
})

onClick(".my_profile", function () {

  if ($(".dropdown_container").hasClass("active")) {

    $(".dropdown_container").removeClass("active")

  } else {
    $(".dropdown_container").addClass("active")

  }

})

onClick('#logout', async function(){

  var logOut = {stat:'true'}

  var options = {
    type: "POST",
    url: `/logOut`,
    cache: false,
    data: logOut,
  };
  var received_data = await $.ajax(options);
  if(received_data.success){
    window.location.href='/login'
  }
  
  
});

async function getCurrentUser() {  
        
  let data = await ajax("/load_currentUser", {});
  GV.CurrentUser = data.user
  $('#current_user').html(GV.CurrentUser.username)
  console.log(data.user)
}


async function displaySideMenu(){

if( GV.CurrentUser.role == "super_admin"){
    let  html = `
    
    <div class="menu_item link" data-id="dashboard">
        <i class="fas fa-home icon"></i>
        <span class="item">Dashboard</span>
    </div>
    <div class="menu_item link" data-id="order_page">
        <i class="fas fa-tasks icon"></i>
        <span class="item">Commandes</span>

    </div>
    <div class="menu_item link" data-id="product_page">
        <i class="fas fa-barcode icon"></i>
        <span class="item">Produits</span>
    </div>
    <div class="menu_item link" data-id="client_page">
    <i class="fas fa-users icon"></i>
    <span class="item">Clients</span>

  </div>
  <div class="menu_item link" data-id="user_page">
  <i class="fas fa-users-cog icon"></i>
  <span class="item">utilisateurs</span>

  </div>
    <div class="menu_item link" data-id="category_page">
        <i class="fas fa-list icon"></i>
        <span class="item">Catégories</span>
    </div>
    
    <div class="menu_item link" data-id="reduction_page">
        <i class="fas fa-sort-amount-down icon"></i>
        <span class="item">Réductions</span>
    </div>
    <div class="menu_item link" data-id="delivery_page">
            <i class="fas fa-truck icon"></i>
        <span class="item">Tarifs Livraison</span>

    </div>
      <div class="menu_item link" data-id="banner_page">
            <i class="fa-solid fa-image-polaroid icon"></i>
        <span class="item">Publicités</span>

    </div>
   
    <div class="menu_item link" data-id="appro_page">
      <i class="fas fa-truck icon"></i>
      <span class="item">Approvisionnement</span>
    </div> 
    
    <div class="menu_item link" data-id="artisans_page">
    <span class="material-symbols-outlined">
    engineering
    </span>
      <span class="item">Artisans</span>
    </div>

    
    
     `
    $(".menu").append(html)}
    else if ( GV.CurrentUser.role == "service_client"){
    let html =
    ` <div class="menu_item link" data-id="order_page">
      <i class="fas fa-tasks icon"></i>
      <span class="item">Gestion des commandes</span>
      </div>
      <div class="menu_item link" data-id="product_page">
          <i class="fas fa-barcode icon"></i>
          <span class="item">Gestion des produits</span>
      </div>`
  $(".menu").append(html)}
    
  

}

//! ///////////////////////////////////////////////////////////
//! //////////////////!    DASHBOARD   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.dashboard=function(){

  displayDashboard()
}



function displayDashboard(){
  displayCheckOrders()



};



async function displayCheckOrders() {
  $("#table_body_checkorder").html("")
  
  for ( var id of Object.keys(GV.orders)) {
    let order = GV.orders[id]
    var formatted_date=moment(order.register_date).format('DD-MM-YYYY')
    var dateTime = moment(order.modifie_date).format('DD-MM-YYYY/HH:mm:ss')
    if(order.statut=="new"){
    let  html = `
    <div class="table_content order">
          <div class="table_row"> ${order.id} </div>
           <div class="table_row" class="date_of_order"> ${formatted_date}  </div>
          <div class="table_row" id="check${order.id}" >   </div>
          <div class="table_row" id="address_check${order.id}"> </div>
          <div class="table_row" > ${order.total_cart} DA </div>
          <div class="table_row" > ${order.statut=='new' ? 'Nouvelle Commande': order.statut } </div>
          <div class="table_row" > ${order.modifie_date==null ? 'aucune modification': dateTime}  </div>
          <div class="table_row" >
                <div class="edit_row_prod">
                  <div ><i id="details_order" class="fas fa-info-circle light_grey" data-id="${order.id}"></i></div>
                  <div ><i id="edit_order" class="far fa-edit orange_pastel" data-id="${order.id}"></i></div>
                </div>
          </div>
      </div>
    
     `
    $("#table_body_checkorder").append(html)
    for(id of Object.keys(GV.users)){
      
      let user=GV.users[id]
      let user_id= user.id
      
      if( user_id==order.user_id ){
       
       let html=`<div>${user.first_name} ${user.last_name}<div>`
       let html2=`<div>${user.adress}<div>`
   
       $(`#check${order.id}`).append(html)
       $(`#address_check${order.id}`).append(html2)

      }
      else{
       
      }
      
    }
  }
  }
 
}





//! ///////////////////////////////////////////////////////////
//! //////////////////!    CLIENTS   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.client_page=function(){
  displayClients()
}



function displayClients() {
  $("#table_body_client").html("")
  for (id of Object.keys(GV.users)) {
    let user = GV.users[id]

    if(user.role== null){
    let  html = `
        <div class="table_content user">
          <div id="table_row"> ${user.id} </div>
          <div id="table_row" > ${user.last_name} </div>
          <div id="table_row" >  ${user.first_name}</div>
          <div id="table_row"> ${user.adress} </div>
          <div id="table_row"><a id="table_row" href="tel:${user.phone_number}" > ${user.phone_number} </a> </div>
      </div>
    
     `
    $("#table_body_client").append(html)}
  }


}
$(document).ready(function(){
  $("#client_search_bar").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#table_body_client .user").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});
//! ///////////////////////////////////////////////////////////
//! //////////////////!    USERS   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.user_page=function(){
  displayUsers()
}



function displayUsers() {
  $("#table_body_user").html("")
  for (id of Object.keys(GV.users)) {
    let user = GV.users[id]

    if(user.role!= null){
    let  html = `
        <div class="table_content user">
          <div id="table_row"> ${user.last_name} </div>
          <div id="table_row" >  ${user.first_name} </div>
          <div id="table_row"> ${user.role} </div>
          <div id="table_row" > ${user.username} </div>
          <div id="table_row" >
                <div class="edit_row">
                  <div ><i id="edit_user" class="far fa-edit orange_pastel" data-id="${user.id}"></i></div>
                  <div ><i id="delete_user" class="fas fa-trash-alt red_pastel" data-id="${user.id}"></i></div>
                </div>
          </div>
      </div>
    <div class="modal_add"></div>
     `


    $("#table_body_user").append(html)
    }
  }


}

$(document).ready(function(){
  $("#admin_search_bar").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#table_body_user .user").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

async function addUser() {
  var information = {
    first_name: $("#first_name").val(),
    last_name: $("#last_name").val(),
    username: $("#username").val(),
    role: $("#role").val(),
    password: $("#password").val(),
    password_backup: $("#password").val(),

  }
  console.log(information)
  var options = {
    type: "POST",
    url: `/add_user`,
    cache: false,
    data: {
      information
    },
  };
  var received_data = await $.ajax(options);
  if (received_data.ok) {
    
    $('.popup, #overlay').css('display','block');
    $('.message').html('utilisateur ajouté avec succès')
    $('#side_menu_add_container').css('display','none');

    await loadUser();
    displayUsers();
  }

}

async function  updateUser(id){
  var id = id 

  var user = {
    first_name: $("#first_name").val(),
    last_name: $("#last_name").val(),
    username: $("#username").val(),
    role: $("#role").val(),
    password: $("#password").val(),
    password_backup: $("#password").val(),

  }
  
  var data ={id , user}
    
  var option = {
    type: "POST",
    url: `/update_users`,
    cache: false,
    data: data,
  };
 
  var receved_data = await $.ajax(option);
 
  if (receved_data.ok) {
    
    $('.popup, #overlay').css('display','block');
    $('.message').html('utilisateur modifier avec succès')
    $('#side_menu_add_container').css('display','none');

    await loadUser();
    displayUsers();
    displayUsers(id);


  }
  else{
    alert('ça marche pas!')
  }
}


async function deleteUser(id){
  var id = id 
  var data ={id}
  var option = {
    type: "POST",
    url: `/delete_users`,
    cache: false,
    data: data,
  };
  
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {

    $('.popup, #overlay').css('display','block');
    $('.modal_add').css('display', 'none')
    $('.message').html('utilisateur supprimé avec succès')

  await loadUser();
    displayUsers();
    
  }
  
}




/*var sidebar_icon = document.querySelector(".sidebar_icon");
sidebar_icon.addEventListener("click", function(){
  document.querySelector("body").classList.toggle("hide");
})*/


onClick(".sidebar_icon", function () {
  if ($("#sidebar").hasClass("hide_sidebar")) {
    $("#sidebar").removeClass("hide_sidebar")
    $("#admin_page").css("grid-template-columns", " 230px 1fr")
    $(".border_main_top").css("border-top-left-radius", " 25px")
    $(".border_main_bottom").css("border-bottom-left-radius", " 25px")
  } else {
    $("#sidebar").addClass("hide_sidebar")
    $("#admin_page").css("grid-template-columns", " 1fr")
    $(".main_container").css("transition", " 3s")
    $(".border_main_top").css("border-top-left-radius", " 0px")
    $(".border_main_bottom").css("border-bottom-left-radius", " 0px")

  }

})

onClick(".link", function () {
  if (!$(this).data('id')) return;
  navigate_to($(this).data('id'));
});


/*chart*/

function displayChart() {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create chart instance
  var chart = am4core.create("chartdiv", am4charts.XYChart);

  // Add data
  var tab2 = GV.chart_data

chart.data = tab2
 
  // Create axes
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.grid.template.location = 0;
  dateAxis.renderer.minGridDistance = 50;

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = "id";
  series.dataFields.dateX = "register_date";
  series.strokeWidth = 3;
  series.fillOpacity = 0.5;

  // Add vertical scrollbar
  chart.scrollbarY = new am4core.Scrollbar();
  chart.scrollbarY.marginLeft = 0;

  // Add cursor
  chart.cursor = new am4charts.XYCursor();
  chart.cursor.behavior = "zoomY";
  chart.cursor.lineX.disabled = true;

};


//Edit


function displayModificationUser(id){
  
  let user = GV.users[id]
  $('#side_menu_add_container').html("")
  if(user==undefined){

    let html=`
    <div class="header_side_menu">
                            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
                            <div class="title">Ajouter Administrateur </div>
                        </div>
                        <div class="body_side_menu">
    <div class="form_container">
  
                                  <div class="input-container">
                                      <div class="label">Nom *</div>
                                      <input class="content_editable required" type="text" id="last_name" contenteditable="true" value=""></input>
                                  </div>
  
                                  <div class="input-container">
                                      <div class="label">Prénom *</div>
                                      <input class="content_editable required" type="text" id="first_name" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Username *</div>
                                      <input class="content_editable required" type="text" id="username" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label" for="role">Role *</div>
                                        <select id="role"  class="required" name="role">
                                          <option value="super_admin">Super Administrateur</option>
                                          <option value="service_client">Service Client</option>
                                        </select>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Mot de passe *</div>
                                      <input class="content_editable required" type="password" id="password" contenteditable="true" value=""></input>
                                  </div>
                                  <div id="error"></div>
                              </div>
  
    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="add_user_valid" class="btn btn-outline-success" >Valider</div>

                            </div>
                        </div>
                        `
    $('#side_menu_add_container').html(html)
  
  }
  else{
    let html=`
    <div class="header_side_menu">
    <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
    <div class="title">Modifier </div>
</div>
<div class="body_side_menu">
    <div class="form_container">
  
                                  <div class="input-container">
                                      <div class="label">Nom *</div>
                                      <input class="content_editable" type="text" id="last_name" contenteditable="true" value="${user.last_name}"></input>
                                  </div>
  
                                  <div class="input-container">
                                      <div class="label">Prénom *</div>
                                      <input class="content_editable" type="text" id="first_name" contenteditable="true"  value="${user.first_name}"></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Username *</div>
                                      <input class="content_editable" type="text" id="username" contenteditable="true"  value="${user.username}"></input>
                                  </div>
                                  <div class="input-container">
                                      
                                      <div class="label" for="role">Role *</div>
                                        <select id="role" name="role" value="${user.role}">
                                        <option selected value="${user.role}">${user.role}</option>
                                          
                                          <option value="super_admin">Super Administrateur</option>
                                          <option value="service_client">Service Client</option>
                                        </select>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Mot de passe *</div>
                                      <input class="content_editable" type="password" id="password" contenteditable="true"  value="${user.password_backup}"></input>
                                  </div>
  
                              </div>
  
    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="update_user_valid" class="btn btn-outline-success" data-id="${user.id}" >Valider</div>

                            </div>
                        </div>
                        `
  
    $('#side_menu_add_container').html(html)
  }

}


onClick('#skip_btn', function () {
  $('#overlay').css('display', 'none')
  $('#side_menu_add_container').css('display', 'none')
  $('#products_used_menu').css('display', 'none')
  $('#orders_used_menu').css('display', 'none')

});

onClick('#overlay', function () {
  $('#overlay').css('display', 'none')
  $('.popup_hist').css('display', 'none')
  $('#side_menu_add_container').css('display', 'none')
  $('#products_used_menu').css('display', 'none')
  $('#orders_used_menu').css('display', 'none')
});

onClick('.modal', function () {
  $('.modal').css('display', 'none')
});

onClick('.popup', function () {
  $('.popup').css('display', 'none')
  $('.popup_hist').css('display', 'none')
});
onClick('.ok', async function () {
  $('.popup').css('display', 'none')
  $('.popup_hist').css('display', 'none')
  $('#overlay').css('display', 'none')
  await loadUser();
  displayUsers();
  
  await loadCategories();
  displayCategories()
  
});

onClick('#valid_not', async function () {
  $('.modal_add').css('display', 'none')
  $('.modal_add').html("")
  $('.modal').css('display', 'none')

});

onClick('.modal_add', function () {
  $('.modal_add').css('display', 'none')
});


onClick('#add_user', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  displayModificationUser()


});

onClick('#add_user_valid_confirm', async function () {
    console.log('oui')
  await addUser()
});

onClick('#add_user_valid', async function () {
  var error=check_formulaire();
    $('#error').html(error);
    if(error) return;
  $('.modal_add').css('display', 'block')
  html=`
                            <div class="modal-content">
                                <h5>Êtes-vous sur de vouloir ajouter cet utilisateur ?</h3>
                                    <div class="modal_footer">
                                        <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                                                class="far fa-times-circle"></i> Non </div>

                                        <div class="btn btn-outline-success" id='add_user_valid_confirm'><i
                                                class="far fa-check-circle"></i> Oui </div>

                                    </div>
                            </div>`
  $(".modal_add").append(html)
});


onClick('#edit_user', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  let id= $(this).data("id")

  displayModificationUser(id)
});

onClick('#update_user_valid', async function () {
  $('.modal_add').css('display', 'block')
   var id= $(this).data("id")
   console.log(id)
  let  html = `
 
                            <div class="modal-content">
                                <h5>Êtes-vous sur de vouloir modifier cet utilisateur ?</h3>
                                    <div class="modal_footer">
                                        <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                                                class="far fa-times-circle"></i> Non </div>

                                        <div class="btn btn-outline-success" id='validate_update' data-id="${id}"><i
                                                class="far fa-check-circle"></i> Oui </div>

                                    </div>
                            </div>
`
    $(".modal_add").append(html)
});

onClick('#validate_update',function(){
  var id = $(this).data('id')
console.log('oui', id)
    updateUser(id)
    
});

onClick('#delete_user', function () {
  $('.modal_add').css('display', 'block')
  var id= $(this).data("id")
  let  html = `

  <div class="modal-content">
      <h5>Êtes-vous sur de vouloire supprimer cet utilisateur ?</h3>
          <div class="modal_footer">
              <div class="btn btn-outline-success" id='delete_confirm' data-id=${id}><i
                      class="far fa-check-circle" ></i> Oui </div>
              <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                      class="far fa-times-circle"></i> Non </div>

          </div>
  </div `
    $(".modal_add").append(html)

});

onClick('#delete_confirm', function(){
  $('.modal_add').css('display', 'none')
  var id= $(this).data("id")
    deleteUser(id)
   
});


//! ///////////////////////////////////////////////////////////
//! //////////////////!    CATEGORY   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.category_page=function(){
  displayCategories()
}

function displayCategories() {
  $("#table_body_cat").html("")

  for ( var id of Object.keys(GV.categories)) { 
    let category = GV.categories[id]
    var category_id = category.id

    let  html = `
        <div class="table_content categorie">
          <div class="table_row"> ${category.category_name} </div>
          <div id="${category.id}" class="sub_category_container table_row" > </div>
          <div class="table_row">
                <div class="edit_row">
                  <div ><i id="edit_cat" class="far fa-edit orange_pastel" data-id="${category.id}" ></i></div>
                  <div><span class="material-symbols-outlined is_promoted_btn ${category.is_promoted==1 ?"activated":""}" data-id="${category.id}">visibility</span></div>
                  <div ><i id="delete_cat" class="fas fa-trash-alt red_pastel" data-id="${category.id}"></i></div>
                </div>
          </div>
      </div>
      <div class="modal_add"></div>`


    $("#table_body_cat").append(html)

    for(id of Object.keys(GV.sous_categories)){
      let sub_category=GV.sous_categories[id]
      let sub_category_id= sub_category.id_category

      if( sub_category_id==category_id ){
       
       let html=`<div>${sub_category.sub_category_name}<div>`
        
       $(`#${category_id }`).append(html)

      }
      else{
       
      }
      
    }

  }
  

}

onClick('.is_promoted_btn', async function(){
  
  var category_id=$(this).data('id')
  
  if($(this).hasClass('activated')){
    $(this).removeClass('activated')
    var status=0
  }else{
    $(this).addClass('activated')
    var status=1
  }    

  await changeCategoryStatus(category_id,status)

})


async function changeCategoryStatus(id,status){
  var information={
    is_promoted:status
  }
  var options = {
    type: "POST",
    url: `/update_category_status`,
    cache: false,
    data: {information,id},
  };



var received_data = await $.ajax(options);

// if(received_data.ok=="create"){

// }

}




$(document).ready(function(){
  $("#category_search_bar").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#table_body_cat .categorie").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});


function displayModificationCategory(id){
  
  var category = GV.categories[id]

  $('#side_menu_add_container').html("")


  if(category==undefined){

    let html=`
    <div class="header_side_menu">
                            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
                            <div class="title">Ajouter Catégorie </div>
                        </div>
                        <div class="body_side_menu">
    <div class="form_container">
  
                                  <div class="input-container">
                                      <div class="label">Nom de la Catégorie *</div>
                                      <input class="content_editable required" type="text" id="category_name" contenteditable="true" value=""></input>
                                  </div>
  
                                 
                                  <div id="add_sub_cat" class="label"><i  class="fas fa-plus-circle""></i>Ajouter une autre Sous-Catégorie</div>

                                  <div id="sub_cat_input" >
                                  
                                  </div>
                              </div>
                              <div id="error"></div>
    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="add_cat_valid" class="btn btn-outline-success" >Valider</div>

                            </div>
                        </div>
                        
                        `
    $('#side_menu_add_container').html(html)
  
  }
  else{
    let html=`
    <div class="header_side_menu">
    <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
    <div class="title">Modifier Catégorie </div>
</div>
<div class="body_side_menu">
    <div class="form_container">
                                  <div class="input-container">
                                      <div class="label">Nom de la Catégorie *</div>
                                      <input class="content_editable" id="category_name" contenteditable="true" value="${category.category_name}"></input>
                                  </div>
                                  <div id="add_sub_cat" class="label"><i  class="fas fa-plus-circle""></i>Ajouter une autre Sous-Catégorie</div>

                                  <div id="sub_cat_input" >
                                  
                                  </div>
                                  
  
                              </div>
  
    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="update_cat_valid" data-id="${category.id}" class="btn btn-outline-success" >Valider</div>

                            </div>
                        </div>
                        
                        <!-- The success Modal -->
    <div class="popup">
            <div class="popup-content">
                    <h5 class="message"></h3>
                        <div class="popup_footer">
                            
                            <div class="btn btn-outline-success ok" >
                                <i class="far fa-check-circle"></i> Ok </div>

                        </div>
    </div>
    </div>
                        `
  
    $('#side_menu_add_container').html(html)
  }
  for( let sub_cat_id of Object.keys(GV.sous_categories)){
    let sub_category=GV.sous_categories[sub_cat_id]
    var sub_category_id = sub_category.id_category
  
    if( sub_category_id==id){
     
     let html=`<div class="input-container">
     <input class="content_editable"contenteditable="true" value="${sub_category.sub_category_name}" id="${sub_category.id}" data-id="${sub_category.id}"><i class="fas fa-trash icon delete_sub_cat" data-id='${sub_category.id}' ></i>
     </div>
   `
      
     $(`#sub_cat_input`).append(html)

     
    }
    else{
     
    }
    
  }
}

function display_html_categories(){
  for(id of Object.keys(GV.categories)){
    let category=GV.categories[id]
    html=`
    <option id="${category.id}" value="${category.category_name}"class="category-option">${category.category_name}</option>
    `

    $('#category').append(html)
      
  }

  $("#category").on("change",function(){
    var selectedValID = $(this).find("option:selected" ).attr("id");
   $(`#sub_category`).html('')
   for(id of Object.keys(GV.sous_categories)){
    let sub_category=GV.sous_categories[id]
      let sub_category_id= sub_category.id_category
      if(selectedValID == sub_category_id){
       let html=`<option id="${sub_category.id}" value="${sub_category.sub_category_name}"class="category-option">${sub_category.sub_category_name}</option>`
        
       $(`#sub_category`).append(html)
    }
  }


 });  
}




function sub(){
  let input_sub = $("#sub_cat_input").find(".input-container").find(".content_editable")
GV.sub_categories = []
    for(element of input_sub ){
      let id_sub= $(element).attr('id')
     GV.sub_categories.push({
       id:$(`#${id_sub}`).data("id"),
       sub_category_name:$(`#${id_sub}`).val()
     }) 
console.log(GV.sub_categories)
    }

   

}



async function addCategory() {

  var information = {
    category_name: $("#category_name").val(),
    
  }
   
  let sub_category_name = GV.sub_categories

  var options = {
    type: "POST",
    url: `/create_categories`,
    cache: false,
    data: {information, sub_category_name},
  };
  var received_data = await $.ajax(options);
  console.log(received_data)
  if (received_data.ok) {
    
    $('.popup, #overlay').css('display','block');
    $('.message').html('categorie ajouté avec succès')
    $('#side_menu_add_container').css('display','none');

    await loadCategories();    
    await loadSub_Categories();

    displayCategories();
  }

}



async function deleteCategory(id){
  var id = id 
  var id_category = id 
  var data ={id,id_category}
  var option = {
    type: "POST",
    url: `/delete_category`,
    cache: false,
    data: data,
  };
  var receved_data = await $.ajax(option);

  if (receved_data.ok) {

    $('.modal_add').css('display', 'none')
    $('.popup, #overlay').css('display','block');
    $('.message').html('categorie supprimée avec succès')

  await loadCategories();
  displayCategories();
 
    
  }else{
    alert('ça marche pas!')
  }
  
}

async function deleteSubCategory(id){
  var id = id 
  var data ={id}
  var option = {
    type: "POST",
    url: `/delete_sub_category`,
    cache: false,
    data: data,
  };
  
  
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {
    $('.modal_add').css('display', 'none')
    $('.popup, #overlay').css('display','block');
    $('#side_menu_add_container').css('display','none');
    $('.message').html('sous categorie supprimée avec succès')

  await loadSub_Categories();

    displayCategories();
    
  }
  
}



async function  updateCategory(id){
  var id = id 
  var category = {
    category_name: $("#category_name").val(),
  }
  var sub_category = GV.sub_categories

  var mainCategory ={id , category}
  
  var option = {
    type: "POST",
    url: `/update_category`,
    cache: false,
    data: {mainCategory,sub_category}
  };
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {
    
    $('.popup, #overlay').css('display','block');
    $('.message').html('categorie modifier avec succès')
    $('#side_menu_add_container').css('display','none');

    
    await loadCategories();
    await loadSub_Categories();
    displayCategories();

    

  }
  else{
    alert('ça marche pas!')
  }
}

onClick('#add_cat', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  displayModificationCategory()

});

onClick('#add_cat_valid', async function () {
  var error=check_formulaire();
  $('#error').html(error);
  if(error) return; 
  $('.modal_add').css('display', 'block')
    html=`
        <div class="modal-content">
            <h5>Êtes-vous sur de vouloir ajouter cette categorie ?</h3>
                <div class="modal_footer">
                    <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                            class="far fa-times-circle"></i> Non </div>

                    <div class="btn btn-outline-success" id='add_cat_valid_confirm'><i
                            class="far fa-check-circle"></i> Oui </div>

                </div>
        </div>`
  $(".modal_add").append(html)
  sub()
  
});

onClick('#add_cat_valid_confirm', async function () {
  await addCategory()
});

onClick('#add_sub_cat', function () {
  
  let index=GV.sub_categories_index[0]
  let newIndex=index+1
  GV.sub_categories_index[0]=newIndex
  
  let html =`<div class="input-container">                                    
              <input class="content_editable" id="new_sub_category_${newIndex}"  contenteditable="true" value="">
            </div>`
  $('#sub_cat_input').append(html)
      
  
  

});

onClick('#edit_cat', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  let id= $(this).data("id")

  displayModificationCategory(id)
});

onClick('#update_cat_valid', async function () {
  $('.modal_add').css('display', 'block')
  var id= $(this).data("id")
  let  html = `
  <div class="modal-content">
  <h5>Êtes-vous sur de vouloir modifier cette catégorie ?</h3>
      <div class="modal_footer">
          <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                  class="far fa-times-circle"></i> Non </div>

          <div class="btn btn-outline-success" id='validate_update_cat' data-id=${id}><i
                  class="far fa-check-circle"></i> Oui </div>

      </div>
</div>`
    $(".modal_add").append(html)
  sub()
  
});

onClick('#validate_update_cat',function(){
  var id = $(this).data('id')
  updateCategory(id)
    
});

onClick('#delete_cat', function () {
  $('.modal_add').css('display', 'block')
  var id= $(this).data("id")
  let  html = `

  <div class="modal-content">
      <h5>Êtes-vous sur de vouloire supprimer cet categorie ?</h3>
          <div class="modal_footer">
              <div class="btn btn-outline-success" id='delete_confirm_cat' data-id=${id}><i
                      class="far fa-check-circle" ></i> Oui </div>
              <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                      class="far fa-times-circle"></i> Non </div>

          </div>
  </div `
    $(".modal_add").append(html)

});

onClick('#delete_confirm_cat', function(){
  $('.modal_add').css('display', 'none')
  var id= $(this).data("id")
  
    deleteCategory(id)
   console.log(id)
    
  
});

onClick('.delete_sub_cat', function () {
  $('.modal_add').css('display', 'block')
  var id= $(this).data("id")
  let  html = `

  <div class="modal-content">
      <h5>Êtes-vous sur de vouloire supprimer cette sous categorie ?</h3>
          <div class="modal_footer">
              <div class="btn btn-outline-success" id='delete_confirm_sub_cat' data-id=${id}><i
                      class="far fa-check-circle" ></i> Oui </div>
              <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                      class="far fa-times-circle"></i> Non </div>

          </div>
  </div `
    $(".modal_add").append(html)
    console.log('buttondeletesubcat')
});

onClick('#delete_confirm_sub_cat', async function(){
  $('.modal_add').css('display', 'none')
  $('.modal-content').css('display', 'none')
  var id= $(this).data("id")
    await deleteSubCategory(id)
   
   
});



//! ///////////////////////////////////////////////////////////
//! //////////////////!    PRODUCT   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.product_page=function(){
  displayProducts()
}

onClick('.delete_img',async function(){
  let imgName= $(this).data('name')
  let product_id= $(this).data('id')
  let images=removeItemAll(GV.filelist,imgName )
  $(this).closest('.box').fadeOut()
  console.log(images)
  delete_img(product_id,imgName,images)
})

async function delete_img(product_id,imgName,images){
  console.log(images)
  var option = {
    type: "POST",
    url: `/delete_img`,
    cache: false,
    data:{product_id,imgName,images},
  };
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {
    alert()
  }
  
}

function displayProducts(promo) {
  $("#table_body_prod").html("")
  for ( var id of Object.keys(GV.products)) {
    let product = GV.products[id]
  
    if(promo==undefined ){
    let  html = `
        <div class="table_content product">
          <div id="table_row">
            
            <img class='small_img' onclick="ExpendImg(this);" src="/img/uploads/${product.images[0]}">
            
          </div>
          <div id="table_row"> ${product.ref} </div>
          <div id="table_row" >  ${product.product_name} </div>
          <div id="table_row" >  ${product.quantity > 0 ?  `${product.quantity}`:'<div class="badge warnning">repture de stock</div>'}</div>
          <div id="table_row" >  ${product.price} DA </div>
          <div id="table_row" >  ${product.promo!=0 ? '<div class="badge success">en promo</div>':'<div class="badge warnning">pas en promo</div>'}</div>
          <div id="table_row" >  ${product.selles_index} </div>
          <div id="table_row" >
                <div class="edit_row_prod">
                  <div ><i id="details_prod" class="fas fa-info-circle light_grey" data-id="${product.id}"></i></div>
                  <div ><i id="edit_prod" class="far fa-edit orange_pastel" data-id="${product.id}"></i></div>
                  <div ><i id="delete_prod" class="fas fa-trash-alt red_pastel" data-id="${product.id}"></i></div>
                </div>
          </div>
      </div>
     <div class="modal_add"  style="z-index:600 !important;"></div>
     `
    $("#table_body_prod").prepend(html)}
    else if(product.promo==promo){
      let  html = `
        <div class="table_content product">
        <div id="table_row">
          
          <img class='small_img' onclick="ExpendImg(this);" src="/img/uploads/${product.images[0]}">
          
        </div>
          <div id="table_row"> ${product.ref} </div>
          <div id="table_row" >  ${product.product_name} </div>
          <div id="table_row" >  ${product.quantity > 0 ?  `${product.quantity}`:'<div class="badge warnning">repture de stock</div>'}</div>
          <div id="table_row" >  ${product.price} DA</div>
          <div id="table_row" >  ${product.promo!=0 ? '<div class="badge success">en promo</div>':'<div class="badge warnning">pas en promo</div>'}</div>
          <div id="table_row" >  ${product.selles_index} </div>
          <div id="table_row" >
                <div class="edit_row_prod">
                  <div ><i id="details_prod" class="fas fa-info-circle light_grey" data-id="${product.id}"></i></div>
                  <div ><i id="edit_prod" class="far fa-edit orange_pastel" data-id="${product.id}"></i></div>
                  <div ><i id="delete_prod" class="fas fa-trash-alt red_pastel" data-id="${product.id}"></i></div>
                </div>
          </div>
      </div>
      <div class="modal_add"  style="z-index:600 !important;"></div>     `
    $("#table_body_prod").prepend(html)}
    else if(promo=="Tout" ){
      let  html = `
      <div class="table_content product">
        <div id="table_row">
          <img class='small_img' onclick="ExpendImg(this);" src="/img/uploads/${product.images[0]}">
        </div>
        <div id="table_row"> ${product.ref} </div>
        <div id="table_row" >  ${product.product_name} </div>
        <div id="table_row" >  ${product.quantity > 0 ?  `${product.quantity}`:'<div class="badge warnning">repture de stock</div>'}</div>
        <div id="table_row" >  ${product.price} DA</div>
        <div id="table_row" >  ${product.promo!=0 ? '<div class="badge success">en promo</div>':'<div class="badge warnning">pas en promo</div>'}</div>
        <div id="table_row" >  ${product.selles_index} </div>
        <div id="table_row" >
              <div class="edit_row_prod">
                <div ><i id="details_prod" class="fas fa-info-circle light_grey" data-id="${product.id}"></i></div>
                <div ><i id="edit_prod" class="far fa-edit orange_pastel" data-id="${product.id}"></i></div>
                <div ><i id="delete_prod" class="fas fa-trash-alt red_pastel" data-id="${product.id}"></i></div>
              </div>
        </div>
    </div>
    <div class="modal_add"  style="z-index:600 !important;"></div>   `
  $("#table_body_prod").prepend(html)
    }
    }
   
  
}

function displayModificationProduct(id){
  
  let product = GV.products[id]

  
  $('#side_menu_add_container').html("")
  if(product==undefined){

    let html=`
    <div class="header_side_menu">
                            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
                            <div class="title">Ajouter Produit</div>
                        </div>
                        <div class="body_side_menu">
    <div class="form_container">
  
                                  <div class="input-container">
                                      <div class="label">Référence du produit * :</div>
                                      <input class="content_editable required" id="ref" type="text" contenteditable="true" value=""></input>
                                  </div>
  
                                  <div class="input-container">
                                      <div class="label">Nom du produit * :</div>
                                      <input class="content_editable required" type="text"  id="product_name" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Nom du produit Abréger * :</div>
                                      <input class="content_editable required" type="text"  id="product_shortname" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Prix du produit * :</div>
                                      <input class="content_editable required" type="number"  id="price" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container" >
                                      <div class="label">Description* :</div>
                                      <textarea class="content_editable required" type="text" id="description"  rows="4" cols="50">
                                      </textarea>
                                    </div>
                                  <div class="input-container" >
                                      <div class="label"> وصف :</div>
                                      <textarea class="input content_editable" type="text" id="description_ar"  rows="4" cols="50">
                                      </textarea>
                                  </div>

                                  <div class="input-container" >
                                      <label class="label" for="colorpicker">Couleur:*</label>
                                      <input type="color" id="colorpicker" value="#0000ff">
                                  </div>

                                  <div class="input-container">
                                      <div class="label">Quantité *:</div>
                                      <input class="content_editable required" type="number" id="quantity" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Promo * :</div>
                                        <select class="enter required" type=text id="promo" placeholder="" required="">
                              <option selected></option>
                              <option value="1">Oui</option>
                              <option value="0">Non</option>   
                            </select>
                                  </div>
                                  <div class="promo_form">
                                  
                                  </div>
                                  <div class="input-container">
                                      <div class="label" for="categorie">Catégorie * :</div>
                                      <select class="enter required" type=text id="category" placeholder="" >
                                        <option value=""> séléctionnez une catégorie</option>
                                      </select>
                                        
                                  </div>
                                  <div class="input-container">
                                      <div class="label" for="categorie">Sous-Catégorie :</div>
                                      <select class="enter " type=text id="sub_category" placeholder="" >
                                      <option value=""> séléctionnez une sous catégorie</option>
                                      </select>
                                        
                                  </div>
                                  
                              <div class="custom-file" style="margin-top: 10px;">
                              <form id='file-catcher'>
                              <input type="file" multiple="multiple" name="product_photo" class="custom-file-input required" id="validatedCustomFile" >
                              <label class="custom-file-label" for="validatedCustomFile">Choisir une photo pour le produit</label>
                              <div id="divFiles"><div class="image_section_upload"></div></div>
                              
                              </form>
                            </div>
                            <div id="error"></div>
    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="add_prod_valid" class="btn btn-outline-success" >Valider</div>

                            </div>
                        </div>
                       `
    $('#side_menu_add_container').html(html)
    display_html_categories()
  }
  else{
    let category = GV.categories[product.id_category]

    let sub_category = GV.sous_categories[product.id_sub_category]
    if(!sub_category)sub_category="vide"
    let html=`
    <div class="header_side_menu">
    <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
    <div class="title">Modifier Produit</div>
</div>
<div class="body_side_menu">
    <div class="form_container">
      <div class="input-container">
                                      <div class="label">Référence du produit *</div>
                                      <input class="content_editable" id="ref" type="text" contenteditable="true" value="${product.ref}"> </input>
                                  </div>
  
                                  <div class="input-container">
                                      <div class="label">Nom du produit * :</div>
                                      <input class="content_editable required"  type="text" id="product_name" contenteditable="true" value="${product.product_name}"> </input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Nom du produit Abréger * :</div>
                                      <input class="content_editable required"  type="text" id="product_shortname" contenteditable="true" value="${product.product_shortname}"> </input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Prix du produit * :</div>
                                      <input class="content_editable required" type="number" id="price" contenteditable="true" value="${product.price}"> </input>
                                  </div>
                                  <div class="input-container" >
                                      <div class="label">Description *:</div>
                                      <textarea class="input content_editable required" type="text" id="description"  value="${product.description}"  rows="4" cols="50">
                                      ${product.description}</textarea>
                                    </div>
                                    <div class="input-container" >
                                      <div class="label">وصف :</div>
                                      <textarea class="input content_editable" type="text" id="description_ar" value="${product.description_ar}" rows="4" cols="50">
                                      ${product.description_ar}</textarea>
                                    </div>
                                    <div class="input-container" >
                                    <label class="label" for="colorpicker">Couleur:*</label>
                                    <input type="color" id="colorpicker" value="${product.color?product.color:"#ffff"}">
                                   </div>

                                  <div class="input-container">
                                      <div class="label">Quantité *:</div>
                                      <input class="content_editable required" type="number" id="quantity" contenteditable="true" value="${product.quantity}"> </input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Promo * :</div>
                                        <select class="enter required" type=text id="promo" placeholder="" required="">
                                          <option value="${product.promo}" selected>${product.promo!=0 ? 'oui':'non'} </option>
                                          <option value="1" >Oui</option>
                                          <option value="0">Non</option>   
                                        </select>
                                  </div>
                                  
                                  <div class="promo_form">
                                  
                                  </div>
                                  <div class="input-container">
                                      <div class="label" for="categorie">Categorie * :</div>
                                      <select class="enter required" type=text id="category" placeholder="" required="required">
                                        <option value="">${category.category_name}</option>
                                      </select>
                                        
                                  </div>
                                  <div class="input-container">
                                      <div class="label" for="categorie">Sous-Categorie * :</div>
                                      <select class="enter" type=text id="sub_category" placeholder="" required="required">
                                                                            <option value="">${sub_category.sub_category_name==undefined ? 'aucune sous-catégorie': sub_category.sub_category_name }</option>

                                      </select>
                                        
                                  </div>
                              <div class="custom-file" style="margin-top: 10px;">
                              <form id='file-catcher'>
                              <input type="file" multiple="multiple" name="product_photo" class="custom-file-input required" id="validatedCustomFile" >
                              <label class="custom-file-label" for="validatedCustomFile">Choisir une photo pour le produit</label>
                              <div id="divFiles"><div class="image_section_upload"></div></div>
                              </form>
                            </div>                            
                                  
  
    </div>
  
    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="update_prod_valid" data-id=${product.id} class="btn btn-outline-success grid center" ><div class="button_text">Valider</div><div class="button_loading_icon"><i class="fas fa-circle-notch fa-spin" ></i></div></div>

                            </div>
                        </div>
                        `
  
    $('#side_menu_add_container').html(html)

    display_html_categories() 

    var images = product.images
    GV.filelist= images
    
    console.log(images,GV.fileList)
    for (var i = 0; i < images.length; ++i) {
            var  list = `
            <div class="box shadow img_small" >
            <div class="delete_img" data-name="${images[i]}" data-id="${product.id}" style="color:red;">X</div>
            <img class="thumbnail" src="../img/uploads/${images[i]}">
            </div>`
            $(".image_section_upload").append(list)
          }
  console.log(product.promo)
  }

}

$(document).on('change', '#promo',async function(){
  var promo= $(this).val()
  if(promo == '1'){
    $('.promo_form').html('')

    let html=`<div class="input-container">
                  <div class="label">Prix promo :</div>
                  <input class="content_editable" type="number" id="promo_price" contenteditable="true" value=""></input>
              </div>
            `

    $('.promo_form').html(html)
  }
  else if(promo == '0'){
    $('.promo_form').html('')
  }


});

function displayDetailsProduct(id){
  
  let product = GV.products[id]
  let category = GV.categories[product.id_category]

  let sub_category = GV.sous_categories[product.id_sub_category]
  if(!sub_category)sub_category="vide"

  $('.modal-dialog_details').html("")

    let html=`
      <div class="modal-content_details">
        <div class="modal-header_details color_1">
        <h4 class="modal-title" id="myModalLabel"><strong>ref: ${product.ref}</strong> - ${product.product_name} </h4>
        <div id="details_skip" class="exit"><i class="fa fa-times exit"></i></div>
        </div>
        <div class="modal-body_details">
        <div class="modal-body_details_head">
        <div class="client_title">
          Informations du produit : 
          </div>
          <table class="">
               <tbody>
                   <tr>
                       <td class="h6"><strong>Catégorie :</strong></td>
                       <td></td>
                       <td class="h5">${category.category_name} </td>
                   </tr>
                   <tr>
                       <td class="h6"><strong>Sous-Catégorie :</strong></td>
                       <td></td>
                       <td class="h5">${sub_category.sub_category_name==undefined ? 'aucune sous-catégorie': sub_category.sub_category_name }</td>
                   </tr>
                   
                   <tr>
                       <td class="h6"><strong>En promo :</strong></td>
                       <td> </td>
                       <td class="h5">${product.promo!=0 ? '<div class="badge success">en promo</div>':'<div class="badge warnning">pas en promo</div>'}</td>
                   </tr>
                   
                   <tr>
                       <td class="h6"><strong>Quantité :</strong></td>
                       <td> </td>
                       <td class="h5">${product.quantity}</td>
                   </tr>
                  
                  

               </tbody>
          </table>
          <div class="client_title">
          Photos : 
          </div>
           </div>     
           <div id="lightgallery" class="image_section">
            </div>
            <div class="client_title">
            Descriptions : 
            </div>
          <div class="h6"><strong>Description :</strong></div>
        <div class="description_section"> <p class="open_info hide">${product.description}</p></div>
        <div class="h6"><strong>Description Arabe :</strong></div>

        <div class="description_section"> <p class="open_info hide">${product.description_ar}</p></div>
        </div>
        
          
        <div class="modal-footer_details">       
            
          <div class="text-right pull-right col-md-3">
              Prix: <br/> 
              <span class="h3 text-muted"><strong> ${product.price}DA </strong></span></span> 
          </div> 
            
          <div class="text-right pull-right col-md-3" style=${product.promo!=1 ? "display:none":""}>
              Prix Promo: <br/> 
              <span class="h3 text-muted"><strong>${product.promo_price}DA</strong></span>
          </div>
           
      </div>
    </div>`
   
    $('.modal-dialog_details').html(html)
    var images = product.images
        for (var i = 0; i < images.length; ++i) {
                var  list = `
                <div class="box_details shadow">
                
                <img src="/img/uploads/${images[i]}">
                </div>
                    <!-- Expanded image -->
                  <img id="expandedImg" src="/img/uploads/${images[i]}" style="width:400px; display: none;">
                `
                $(".image_section").append(list)
              }
      
}



function upload_image(file, callback){
  if(callback==undefined){callback=function(){};}

  let ajax = new XMLHttpRequest();
  

ajax.addEventListener("load", function (e) {
      let data = JSON.parse(e.target.response);
      console.log(data)
    callback(data, 'load');	
}, false);

ajax.addEventListener("error", function (e) {
  callback(e, 'error');
}, false);

ajax.addEventListener("abort", function (e) {
  callback(e, 'abort');
}, false);

ajax.open("POST",'/uploads');

var formData = new FormData();
formData.append('file', file);
ajax.send(formData);

};



$(document).on('change','#validatedCustomFile', function(){
let file = this.files[0];
var fileList = GV.filelist
upload_image(file, (e, res) => {
    if (res == "load") {
        console.log('%s uploaded successfuly: ', e.file_name);
        if(e.file_name.includes(".mp4")){
          GV.video_name=e.file_name
          let  html=`
          <div class="box shadow">
          <img src="../img/uploads/${e.file_name}">
         </div>`
         $(".image_section_upload").append(html)
          
          alert()
        }else{
          GV.image_name = e.file_name;
          fileList.push(e.file_name);
        }
        
        
        
        for (var i = 0; i < fileList.length; ++i) {
          var  list = `
          <div class="box shadow">
           <img src="/img/uploads/${fileList[i]}">
          </div>`
          
        }
        $(".image_section_upload").append(list)
          console.log(GV.filelist)
    }
    if (res == "error") {
        console.log('An error happened: ', e);
    }
});
});



async function addProduct(){
  var image_name= GV.filelist
  var information = {
   
    ref: $("#ref").val(),
    product_name: $("#product_name").val(),
    product_shortname: $("#product_shortname").val(),
    price: $("#price").val(),
    promo: $("#promo").val(),
    promo_price: $("#promo_price").val(),
    quantity: $("#quantity").val(),
    description: $("#description").val(),
    description_ar: $("#description_ar").val(),
    selles_index: $("#selles_index").val(),
    id_category: $("#category :selected").attr("id"),
    id_sub_category: $("#sub_category :selected").attr("id"),
    images: image_name,
    video:GV.video_name,
    color: $("#colorpicker").val(),

  }
 
  
  var option = {
    type: "POST",
    url: `/add_products`,
    cache: false,
    data: {
      information
    },
  };

  // disable_button('#update_prod_valid')

  var receved_data = await $.ajax(option);
  if (receved_data.ok) {
    
    console.log(receved_data.ok)
    $('.popup, #overlay').css('display','block');
    $('.message').html('Produit ajouter avec succès')
    $('#side_menu_add_container').css('display','none');

   
    await loadProducts();
    displayProducts();
    

  }
  else{
    alert('ça marche pas!')
  }

}

async function  updateProduct(id){
 
  var id = id 
  var image_name= GV.filelist
  var product = {
    ref: $("#ref").val(),
    product_name: $("#product_name").val(),
    product_shortname: $("#product_shortname").val(),
    price: $("#price").val(),
    promo: $("#promo").val(),
    promo_price: $("#promo_price").val(),
    quantity: $("#quantity").val(),
    description: $("#description").val(),
    description_ar: $("#description_ar").val(),
    selles_index: $("#selles_index").val(),
    id_category: $("#category :selected").attr("id"),
    id_sub_category: $("#sub_category :selected").attr("id"),
    images:image_name,
    video:GV.video_name,
    color:$("#colorpicker").val(),

  }
  var data ={id , product}
  
  var option = {
    type: "POST",
    url: `/update_product`,
    cache: false,
    data: data,
  };
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {
    
    disable_button('#update_prod_valid')

    // $('.popup, #overlay').css('display','block');
    // $('.message').html('produit modifier avec succès')
   
    let product=receved_data.product[0]
    console.log(product)
    GV.products[product.id]=product
    // await loadProducts();
    displayProducts();
    $('#side_menu_add_container , #overlay').css('display','none');

  }
  else{
    alert('ça marche pas!')
  }
}

async function deleteProduct(id){
  var id = id 
  var data ={id}
  var option = {
    type: "POST",
    url: `/delete_product`,
    cache: false,
    data: data,
  };
  console.log(id)
  
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {
 
    delete GV.products[id]
    $('.popup, #overlay').css('display','block');
    $('.modal_add').css('display', 'none')
    $('.message').html('Produit supprimer avec succès')

  await loadProducts();
    displayProducts();
    
  }
  
}

onClick('#add_prod', function () {
    GV.image_name={};
    GV.filelist=[];
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  displayModificationProduct()

});
onClick('#add_prod_valid', async function () {

  var error=check_formulaire();
  $('#error').html(error);
  if(error) return; 
  $('.modal_add').css('display', 'block')
  html=`
  <!-- Modal content -->
  
  <div class="modal-content" syle="display:grid;">
      <h5>Êtes-vous sur de vouloir ajouter ce produit ?</h3>
          <div class="modal_footer">
              <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                      class="far fa-times-circle"></i> Non </div>

              <div class="btn btn-outline-success" id='add_prod_valid_confirm'><i
                      class="far fa-check-circle"></i> Oui </div>

          </div>
  </div>

`
$(".modal_add").append(html)
});

onClick('#add_prod_valid_confirm', async function () {
  
  await addProduct()
});

onClick('#edit_prod', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  let id= $(this).data("id")
    GV.filelist=GV.products[id].images
  
     GV.image_name={};
  displayModificationProduct(id)
});

onClick('#update_prod_valid', async function () {
  // if($(this).hasClass('button_disables')) return   
  var id = $(this).data('id')

  disable_button('#update_prod_valid')

  await updateProduct(id)

});



onClick('#delete_prod', function () {
  $('.modal_add').css('display', 'block')
  var id= $(this).data("id")
  let  html = `

  <div class="modal-content">
      <h5>Êtes-vous sur de vouloire supprimer ce produit ?</h3>
          <div class="modal_footer">
              <div class="btn btn-outline-success" id='delete_confirm_prod' data-id=${id}><i
                      class="far fa-check-circle" ></i> Oui </div>
              <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                      class="far fa-times-circle"></i> Non </div>

          </div>
  </div `
    $(".modal_add").html(html)

});

onClick('#delete_confirm_prod', function(){
  $('.modal_add').css('display', 'none')
  $('.modal-content').css('display', 'none')
  var id= $(this).data("id")
    deleteProduct(id)
    displayProducts();
    displayProducts(id);
   
});

onClick('#details_prod', function () {
  $('#overlay').css('display', 'block')
  $('.modal_details').css('display', 'grid')
  $('.modal-dialog_details').css('display', 'grid')
  let id= $(this).data("id")

  displayDetailsProduct(id)
});

onClick('#details_skip', function () {
  $('#overlay').css('display', 'none')
  $('.modal_details').css('display', 'none')
  $('.modal-dialog_details').css('display', 'none')
});

onClick('.box_details', function (){
  $('#overlay').css('display', 'block')

  $(this).css('display', 'none');
  $('#expandedImg').css('display', 'block');
  

})

$('#filter-select-promo').on('change', async function(){
  var promo= $(this).val()
  displayProducts(promo)

});

$(document).ready(function(){
  $("#products_search_bar").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#table_body_prod .product").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

//! ///////////////////////////////////////////////////////////
//! //////////////////!    REDUCTION   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.reduction_page=function(){
  displayReductions()
}

function displayReductions() {
  $("#table_body_red").html("")

  for ( var id of Object.keys(GV.reductions)) { 
    let reduction = GV.reductions[id]
    var reduction_id = reduction.id

    let  html = `
        <div class="table_content reduction">
          <div class="table_row"> ${reduction.type} </div>
          <div class="table_row"> ${reduction.name} </div>
          <div class="table_row"> ${reduction.type!= 'reduction' ? '----': reduction.total+'DA'}</div>
          <div class="table_row"> ${reduction.type!= 'code_promo' ? '----': reduction.pourcentage+'%'}</div>
          <div class="table_row">
                <div class="edit_row">
                  <div ><i id="edit_red" class="far fa-edit orange_pastel" data-id="${reduction.id}" ></i></div>
                  <div ><i id="delete_red" class="fas fa-trash-alt red_pastel" data-id="${reduction.id}"></i></div>
                </div>
          </div>
      </div>
      <div class="modal_add"></div>`


    $("#table_body_red").append(html)

  }
  

}

$(document).ready(function(){
  $("#red_search_bar").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#table_body_red .reduction").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

function displayModificationReduction(id){
  
  var reduction = GV.reductions[id]

  $('#side_menu_add_container').html("")


  if(reduction==undefined){

    let html=`
    <div class="header_side_menu">
                            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
                            <div class="title">Ajouter Réduction </div>
                        </div>
                        <div class="body_side_menu">
                      <div class="form_container">
                        <div class="input-container">
                        <div class="label">Type de réduction *</div>
                                <select class="enter required" type=text id="type" placeholder="" required="">
                                  <option value='' selected>Choisissez le type de la reduction</option>
                                  <option value="reduction">Réduction</option>
                                  <option value="code_promo">Code promo</option>   
                                </select>
                              </div>
                              <div class="red_form">
                                  
                                  </div>
                                  <div id="error"></div>
                              </div>
  
    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="add_red_valid" class="btn btn-outline-success" >Valider</div>

                            </div>
                        </div>
                        <div class="modal_add">
                            <div class="modal-content">
                                <h5>Êtes-vous sur de vouloir ajouter cette réduction ?</h3>
                                    <div class="modal_footer">
                                        <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                                                class="far fa-times-circle"></i> Non </div>

                                        <div class="btn btn-outline-success" id='add_red_valid_confirm'><i
                                                class="far fa-check-circle"></i> Oui </div>

                                    </div>
                            </div>

                        </div>`
    $('#side_menu_add_container').html(html)
  
  }
  else{
  
    let html=`
    <div class="header_side_menu">
    <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
    <div class="title">Modifier Catégorie </div>
</div>
<div class="body_side_menu">
    <div class="form_container">
    <div class="input-container">
    <div class="label">Nom de la Réduction *</div>
    <input class="content_editable" id="name" contenteditable="true" value="${reduction.name}"></input>
</div>
<div class="input-container" style=${reduction.type=='code_promo' ? "display:none":""}>
    <div class="label">Total panier *</div>
    <input class="content_editable" id="total" contenteditable="true" value="${reduction.total}"></input>
</div>
<div class="input-container" style=${reduction.type=='reduction' ? "display:none":""}>
    <div class="label">Pourcentage % *</div>
    <input class="content_editable" id="pourcentage" contenteditable="true" value="${reduction.pourcentage}"></input>
</div>
                                 
                                  </div>
                                  
  
                              </div>
  
    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="update_red_valid" data-id="${reduction.id}" class="btn btn-outline-success" >Valider</div>

                            </div>
                        </div>
                        <div class="modal_add">
                        <!-- Modal content -->
                        <div class="modal-content">
                            <h5>Êtes-vous sur de vouloir modifier cette reduction ?</h3>
                                <div class="modal_footer">
                                    <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                                            class="far fa-times-circle"></i> Non </div>

                                    <div class="btn btn-outline-success" id='validate_update_red' data-id=${reduction.id}><i
                                            class="far fa-check-circle"></i> Oui </div>

                                </div>
                        </div></div>
                        <!-- The success Modal -->
    <div class="popup">
            <div class="popup-content">
                    <h5 class="message"></h3>
                        <div class="popup_footer">
                            
                            <div class="btn btn-outline-success ok" >
                                <i class="far fa-check-circle"></i> Ok </div>

                        </div>
    </div>
    </div> `
  

    $('#side_menu_add_container').html(html)

  }
}


$(document).on('change', '#type',async function(){
  var type= $(this).val()
  console.log(type)
  if(type == 'reduction'){
    $('.red_form').html('')

    let html=`<div class="input-container">
                <div class="label">Nom de la Réduction *</div>
                <input class="content_editable required" type="text" id="name" contenteditable="true" value=""></input>
            </div>
            <div class="input-container">
                <div class="label">Total prix panier *</div>
                <input class="content_editable required" type="number" id="total" contenteditable="true" value=""></input>
            </div>
            `

    $('.red_form').html(html)
  }
  else if (type =='code_promo'){
    $('.red_form').html('')

    let html=`<div class="input-container">
                <div class="label">Nom du code promo *</div>
                <input class="content_editable required" type="text" id="name" contenteditable="true" value=""></input>
            </div>
            <div class="input-container">
                <div class="label">Pourcentage du code promo *</div>
                <input class="content_editable required" type="number" id="pourcentage" contenteditable="true" value=""></input>
            </div>`

    $('.red_form').html(html)
    
  }

});

async function addReduction() {
  var information = {
    name: $("#name").val(),
    total: $("#total").val(),
    pourcentage: $("#pourcentage").val(),
    type: $("#type").val(),

  }
  var options = {
    type: "POST",
    url: `/add_reduction`,
    cache: false,
    data: {
      information
    },
  };
  var received_data = await $.ajax(options);
  if (received_data.ok) {
    
    $('.popup, #overlay').css('display','block');
    $('.message').html('utilisateur ajouté avec succès')
    $('#side_menu_add_container').css('display','none');

    await loadReductions();
    displayReductions();
    displayReductions(id);
  }

}

async function  updateReduction(id){
  var id = id 
  var reduction = {
    name: $("#name").val(),
    total: $("#total").val(),
    pourcentage: $("#pourcentage").val(),
  }
  var data ={id , reduction}
 
  var option = {
    type: "POST",
    url: `/update_reduction`,
    cache: false,
    data: data,
  };
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {
    
    $('.popup, #overlay').css('display','block');
    $('.message').html('reduction modifier avec succès')
    $('#side_menu_add_container').css('display','none');

    await loadReductions();
    displayReductions();
    displayReductions(id);


  }
  else{
    alert('ça marche pas!')
  }
}


async function deleteReduction(id){
  var id = id 
  var data ={id}
  var option = {
    type: "POST",
    url: `/delete_reduction`,
    cache: false,
    data: data,
  };
  
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {

    $('.popup, #overlay').css('display','block');
    $('.modal_add').css('display', 'none')
    $('.message').html('reduction supprimer avec succès')

  await loadReductions();
    displayReductions();
    displayReductions(id);
  }
  
}


onClick('#add_red', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  displayModificationReduction()
  getTotalCart()

});

onClick('#add_red_valid', async function () {
  var error=check_formulaire();
  $('#error').html(error);
  if(error) return; 
  $('.modal_add').css('display', 'block')
});

onClick('#add_red_valid_confirm', async function () {
  await addReduction()
});

onClick('#edit_red', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  let id= $(this).data("id")

  displayModificationReduction(id)
});

onClick('#update_red_valid', async function () {
  $('.modal_add').css('display', 'block')
});

onClick('#validate_update_red',function(){

  var id = $(this).data('id')
    updateReduction(id)
    
});
onClick('#delete_red', function () {
  $('.modal_add').css('display', 'block')
  var id= $(this).data("id")
  let  html = `

  <div class="modal-content">
      <h5>Êtes-vous sur de vouloire supprimer cette reduction ?</h3>
          <div class="modal_footer">
              <div class="btn btn-outline-success" id='delete_confirm_red' data-id=${id}><i
                      class="far fa-check-circle" ></i> Oui </div>
              <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                      class="far fa-times-circle"></i> Non </div>

          </div>
  </div `
    $(".modal_add").append(html)

});

onClick('#delete_confirm_red', function(){
  $('.modal_add').css('display', 'none')
  $('.modal-content').css('display', 'none')
  var id= $(this).data("id")
    deleteReduction(id)
    displayReductions();
    displayReductions(id);
   
});

function getTotalCart(){
  var total_red = []
  for ( var id of Object.keys(GV.reductions)) {
    var reduction = GV.reductions[id]
    GV.Total.push(reduction.total)
  }
  console.log(GV.Total)
}

//! ///////////////////////////////////////////////////////////
//! //////////////////!    BANNER   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.banner_page=async function(){
    
    await loadItem()
    displayBanners()
}







function  displayBanners(){
 
  $('#table_body_banner').html("")
  let html = ""
  for(id of Object.keys(GV.items)){
    var item=GV.items[id]
     html +=`
  <div id="table_items" class="table_items grid colmn3 center padding15 relative">
  <div class="blod text_color3">${item.id}</div>
  <img style="height: 50px;" src="/img/uploads/${item.picture}">
  <div class="dropdown" >
  <i class="fas fa-ellipsis-v dropbtn dropbtn_banner" data-id="${item.id}" style="font-size: 20px;padding: 10px;"></i>
  <div id="myDropdown_banner_${item.id}" class="dropdown-content">
  <div id="edit-banner" data-id="${item.id}"><i  class="far fa-edit light_grey padding5" ></i> Modifier</div>
  <div id="delete-banner"  data-id="${item.id}"><i  class="fas fa-trash-alt light_grey padding5"></i> Supprimer</div>
</div>
</div>
  
   </div>  
                         
     </div>  
     <div class="modal_add9"></div>                 
  `
}

onClick('#delete-banner', async function () {
  $('.modal_add9').css('display', 'block')
  $('.modal_add9').html("")
  var id= $(this).data("id")
  let  html = `
  <div class="modal-content">
  <h5>Êtes-vous sur de vouloir supprimer ce banner ?</h3>
      <div class="modal_footer">
          <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                  class="far fa-times-circle cursor red"></i> Non </div>

          <div class="btn btn-outline-success" id='validate_delete_banner' data-id=${id}><i
                  class="far fa-check-circle cursor green"></i> Oui </div>

      </div>
</div>`
    $(".modal_add9").html(html)
});


onClick('#validate_delete_banner', async function () {
  var id= $(this).data("id")
  await deleteItem(id)
  $('.modal_add9').css('display', 'none')
  $('.modal').css('display', 'none')
  await loadItem() 
  await displayBanners()

})
async function  deleteItem(id){
  var id = id 

   var data ={id}
  
  var option = {
    type: "POST",
    url: `/delete_item`,
    cache: false,
    data: data,
  };
  var receved_data = await $.ajax(option);
  
  if (receved_data.ok) {
    delete GV.items[id]
    $('.message').html('Banner modifié avec succès')
    $('#side_menu6').css('display','none');
  }
  else{
    alert('ça marche pas!')
  }
}





onClick('.dropbtn_banner', function () {
  let id= $(this).data("id")
  $('.dropdown-content').removeClass('show')
  document.getElementById(`myDropdown_banner_${id}`).classList.toggle("show");  
});

$('#table_body_banner').html(html)
}
  onClick('#btn-add-banner', function(){
    $('#overlay').css('display', 'grid')
    $('#side_menu6').css('display', 'grid')
    displayModificationBanner()
  })
  
onClick('.clicks', async function(){
  $('.popup6').css('display', 'none')
  $('#overlay').css('display', 'none')
  
  $('#side_menu6').css('display', 'none')  
  
})
onClick('#add_banner_valid', async function(){
  // var error=check_formulaire();
  // $('#error').html(error);
  // if(error) return; 
  $('.popup6').css('display', 'none')
  $('#overlay').css('display', 'none')
  
  $('#side_menu6').css('display', 'none')  
  await addBanner()
  await loadItem()
  displayBanners()
 
})

async function addBanner() {
  var information = {
    name: $("#title_banner").val(),
    type: "banner",
    picture: GV.image_name,  
  }

  console.log(information)
    var options = {
      type: "POST",
      url: `/create_item`,
      cache: false,
      data: {information},
    };
  var received_data = await $.ajax(options);

  if (received_data.ok) {
    $('#side_menu6').css('display','none');
    $('.popup6').css('display','block');
    $('.message').html('Banner ajoutée avec succès')
   
    await loadItem()
  }
}

  function displayModificationBanner(id){
 
    GV.image_name ={}
    GV.image_product ={}
    var item = GV.items[id]
    $('#side_menu6').html("")
    

    if(item==undefined){
      let html=`
                          <div class="header_side_menu">
                              <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
                              <div class="title">Ajouter un nouveau banner </div>
                          </div>
  
                          <div class="body_side_menu">
                            <div class="form_container">
    
                                <div class="input-container">
                                    <div class="label">Titre du banner *</div>
                                    <input class="content_editable required" type="text" id="title_banner" contenteditable="true" value=""></input>
                                </div>
                                <div class="input-container">
                                    <div class="label">Photo du banner PC*</div>
                                    <div class="label" style="color: #067d00;font-size: 10px;">Veuillez respecter le format requis: 920x520px*</div>
                                    <input class="content_editable required" type="file" id="validatedCategoryFile" value=""></input>
                                </div>
                               
  
                                <div id="error"></div>
                            </div>
                          </div>
                          </div>
                          
                          <div class="footer_side_menu">
                              <div class="buttons_container cursor">
                                  <div id="add_banner_valid" class="btn button text_color3 cursor text_center " >Valider</div>
  
                              </div>
                          </div>
  
                          <div class="modal_add">
                              <div class="modal-content">
                                  <h5>Êtes-vous sur de vouloir ajouter cette company ?</h3>
                                      <div class="modal_footer">
                                          <div class="supprimer btn btn-outline-danger red"  id='valid_not'><i class="far fa-times-circle"></i> Non </div>
                                          <div class="btn btn-outline-success green" id='add_company_valid_confirm'><i class="far fa-check-circle"></i> Oui </div>
                                      </div>
                              </div>
                          </div>`
      $('#side_menu6').html(html)
    
    }
    else{
      let html=`
      <div class="header_side_menu">
      <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
      <div class="title">Modification du la publication </div>
  </div>
  
  <div class="body_side_menu">
    <div class="form_container">
  
            <div class="input-container">
               <div class="label">Titre du banner *</div>
               <input class="content_editable required" type="text" id="title_banner" contenteditable="true" value="${item.name}"></input>
            </div>
           
            <div class="input-container">
              <div class="label">Photo du banner PC*</div>
              <div class="label" style="color: #067d00;font-size: 10px;">Veuillez respecter le format requis: 920x520px*</div>
              <input class="content_editable required" type="file" id="validatedCategoryFile" value="${item.picture}"></input>
            </div>

            
           <div id="error"></div>
          
    </div>
  </div>
  </div>
  
  <div class="footer_side_menu">
      <div class="buttons_container cursor">
          <div id="edit_banner_valid" class="btn button text_color3 cursor text_center" data-id="${item.id}" >Valider</div>
      </div>
  </div>
  
  <div class="modal_add5">
   
  </div>`
  $('#side_menu6').html(html)
    }
  }
  
onClick('#edit_banner_valid', async function () {
  $('.modal_add9').css('display', 'block')
  var id= $(this).data("id")
  let  html = `
  <div class="modal-content">
  <h5>Êtes-vous sur de vouloir modifier ce banner ?</h3>
      <div class="modal_footer">
          <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                  class="far fa-times-circle cursor red"></i> Non </div>

          <div class="btn btn-outline-success" id='validate_update_banner' data-id=${id}><i
                  class="far fa-check-circle cursor green"></i> Oui </div>

      </div>
</div>`
    $(".modal_add9").append(html)

  
});

onClick('#validate_update_banner', async function(){

  $('#overlay').css('display', 'none')
  var id = $(this).data('id')
  console.log(id)
  await updateBanner(id)
  await loadItem()
  displayBanners()  

});

onClick('#edit-banner', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu6').css('display', 'grid')
  let id= $(this).data("id")
  console.log(id)
  displayModificationBanner(id)
});

async function  updateBanner(id){
  var id = id 

  var information = {
    name: $("#title_banner").val(), 
    type: "banner",
    picture: GV.image_name,  
 
  }
   var data ={id , information}
  
  var option = {
    type: "POST",
    url: `/update_item`,
    cache: false,
    data: data,
  };
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {
    
    $('.message').html('Banner modifié avec succès')
    $('#side_menu6').css('display','none');

    await loadItem();
    displayBanners()
  }
  else{
    alert('ça marche pas!')
  }
}





onClick('#overlay, .exit, #valid_not, .btn-outline-danger', function(){
  $('#overlay').css('display', 'none')
  $('.modal-dialog_details').css('display', 'none')

  $('#side_menu6').css('display', 'none')
  $('.modal_add9').css('display', 'none')
})

$(document).on('change','#validatedCategoryFile', function(){
  let file = this.files[0];
  upload_image(file, (e, res) => {
      if (res == "load") {
          console.log('%s uploaded successfuly: ', e.file_name);
          GV.image_name = e.file_name;
      }
      if (res == "error") {
          console.log('An error happened: ', e);
      }
  });
});
$(document).on('change','#validatedproductFile', function(){
  let file = this.files[0];
  upload_image(file, (e, res) => {
      if (res == "load") {
          console.log('%s uploaded successfuly: ', e.file_name);
          GV.image_product = e.file_name;
      }
      if (res == "error") {
          console.log('An error happened: ', e);
      }
  });
});






//! ///////////////////////////////////////////////////////////
//! //////////////////!    DELIVERY   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.delivery_page=function(){
  displayDeliveries()
}

function displayDeliveries() {
  $("#table_body_delivery").html("")

  for ( var id of Object.keys(GV.deliveries)) { 
    let delivery = GV.deliveries[id]
    var delivery_id = delivery.id

    let  html = `
        <div class="table_content delivery">
          <div class="table_row"> ${delivery.name_delivery} </div>
          <div class="table_row"> ${delivery.price_delivery} DA</div>
          <div class="table_row" id="${delivery.id_wilaya}"> </div>
          <div class="table_row">
                <div class="edit_row">
                  <div ><i id="edit_delivery" class="far fa-edit orange_pastel" data-id="${delivery.id}" ></i></div>
                  <div ><i id="delete_delivery" class="fas fa-trash-alt red_pastel" data-id="${delivery.id}"></i></div>
                </div>
          </div>
      </div>
       <div class="modal_add"></div>`


    $("#table_body_delivery").append(html)

    for(id of Object.keys(GV.wilayas)){
      let wilaya=GV.wilayas[id]

      if( id== delivery.id_wilaya ){
       let html2=`<span>${wilaya.nom}</span>`
       $(`#${delivery.id_wilaya}`).append(html2)

      }
    }
  }
  

}

$(document).ready(function(){
  $("#delivery_search_bar").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#table_body_delivery .delivery").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

async function displayWilaya(id){
  let html=""
  for (let wilaya_id of Object.keys(GV.wilayas)) {
    var wilaya= GV.wilayas[wilaya_id].nom
    html +=`<option value="${wilaya_id}" id="${wilaya_id}" class="wilaya"}>${wilaya}</option>`
  }  
   $(id).append(html) 
}

function displayModificationDeliveries(id){
  
  var delivery = GV.deliveries[id]

  $('#side_menu_add_container').html("")


  if(delivery==undefined){

    let html=`
    <div class="header_side_menu">
                            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
                            <div class="title">Ajouter Livraison </div>
                        </div>
                        <div class="body_side_menu">
                      <div class="form_container">
  
                                  <div class="input-container">
                                      <div class="label">Nom de la Livraison *</div>
                                      <input class="content_editable required" type="text" id="name_delivery" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Prix *</div>
                                      <input class="content_editable required" type="number" id="price_delivery" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Wilaya *</div>
                                      <select  id="id_wilaya" value="" class="required" type=text placeholder="Wilaya"> 
          <option value="" selected disabled >Wilaya</option>
        </select>
                                  </div>
                              </div>
                              <div id="error"></div>
    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="add_delivery_valid" class="btn btn-outline-success" >Valider</div>

                            </div>
                        </div>
                        <div class="modal_add">
                            <div class="modal-content">
                                <h5>Êtes-vous sur de vouloir ajouter cette livraison ?</h3>
                                    <div class="modal_footer">
                                        <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                                                class="far fa-times-circle"></i> Non </div>

                                        <div class="btn btn-outline-success" id='add_delivery_valid_confirm'><i
                                                class="far fa-check-circle"></i> Oui </div>

                                    </div>
                            </div>

                        </div>
                        `
    $('#side_menu_add_container').html(html)
    displayWilaya("#id_wilaya")
  }
  else{
    let html=`
          <div class="header_side_menu">
          <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
          <div class="title">Modifier Livraison </div>
      </div>
      <div class="body_side_menu">
          <div class="form_container">
          <div class="input-container">
          <div class="label">Nom de la Livraison *</div>
          <input class="content_editable" id="name_delivery" contenteditable="true" value="${delivery.name_delivery}"></input>
      </div>
      <div class="input-container">
          <div class="label">Prix *</div>
          <input class="content_editable" id="price_delivery" contenteditable="true" value="${delivery.price_delivery}"></input>
      </div>
      <div class="input-container">
          <div class="label">Wilaya *</div>
          <select  id="id_wilaya" class="enter cite require" type=text placeholder="Wilaya"> 
          <option value="${delivery.id_wilaya}" selected disabled >${delivery.id_wilaya}</option>
        </select>
      </div>
                                 
          </div>
          

      </div>

    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="update_delivery_valid" data-id="${delivery.id}" class="btn btn-outline-success" >Valider</div>

                            </div>
                        </div>
                        <div class="modal_add">
                        <!-- Modal content -->
                        <div class="modal-content">
                            <h5>Êtes-vous sur de vouloir modifier cette livraison ?</h3>
                                <div class="modal_footer">
                                    <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                                            class="far fa-times-circle"></i> Non </div>

                                    <div class="btn btn-outline-success" id='validate_update_delivery' data-id=${delivery.id}><i
                                            class="far fa-check-circle"></i> Oui </div>

                                </div>
                        </div></div>
                        <!-- The success Modal -->
    <div class="popup">
            <div class="popup-content">
                    <h5 class="message"></h3>
                        <div class="popup_footer">
                            
                            <div class="btn btn-outline-success ok" >
                                <i class="far fa-check-circle"></i> Ok </div>

                        </div>
    </div>
    </div>
                        `
  
    $('#side_menu_add_container').html(html)
    displayWilaya("#id_wilaya")
  }
}


async function addDelivery() {
  var information = {
    name_delivery: $("#name_delivery").val(),
    price_delivery: $("#price_delivery").val(),
    id_wilaya: $("#id_wilaya").val(),

  }
  var options = {
    type: "POST",
    url: `/add_delivery`,
    cache: false,
    data: {
      information
    },
  };
  var received_data = await $.ajax(options);
  if (received_data.ok) {
    
    $('.popup, #overlay').css('display','block');
    $('.message').html('Livraison ajoutée avec succès')
    $('#side_menu_add_container').css('display','none');

    await loadDeliveries();
    displayDeliveries();
    displayDeliveries(id);
  }

}

async function  updateDelivery(id){
  var id = id 
  var delivery = {
    name_delivery: $("#name_delivery").val(),
    price_delivery: $("#price_delivery").val(),
    id_wilaya: $('#id_wilaya').find(":selected").val(),
  }
  var data ={id , delivery}
 console.log(data)
  var option = {
    type: "POST",
    url: `/update_delivery`,
    cache: false,
    data: data,
  };
  var receved_data = await $.ajax(option);
   
  if (receved_data.ok) {
    
    $('.popup, #overlay').css('display','block');
    $('.message').html('Livraison modifier avec succès')
    $('#side_menu_add_container').css('display','none');

    await loadDeliveries();
    displayDeliveries();
    displayDeliveries(id);


  }
  else{
    alert('ça marche pas!')
  }
}


async function deleteDelivery(id){
  var id = id 
  var data ={id}
  var option = {
    type: "POST",
    url: `/delete_delivery`,
    cache: false,
    data: data,
  };
  
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {

    $('.popup, #overlay').css('display','block');
    $('.modal_add').css('display', 'none')
    $('.message').html('Livraison supprimée avec succès')

  await loadDeliveries();
    displayDeliveries();
     displayDeliveries(id);
  }
  
}


onClick('#add_delivery', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  displayModificationDeliveries()
  // getTotalCart()

});

onClick('#add_delivery_valid', async function () {
  var error=check_formulaire();
  $('#error').html(error);
  if(error) return; 
  $('.modal_add').css('display', 'block')

});

onClick('#add_delivery_valid_confirm', async function () {
  await addDelivery()
});

onClick('#edit_delivery', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  let id= $(this).data("id")
  displayModificationDeliveries(id)
});

onClick('#update_delivery_valid', async function () {
    alert('hey')
  $('.modal_add').css('display', 'block')
 
});

onClick('#validate_update_delivery',function(){

  var id = $(this).data('id')
  console.log($(this).data('id'))
    updateDelivery(id)
    
});
onClick('#delete_delivery', function () {
  $('.modal_add').css('display', 'block')
  var id= $(this).data("id")
  let  html = `

  <div class="modal-content">
      <h5>Êtes-vous sur de vouloire supprimer cette livraison ?</h3>
          <div class="modal_footer">
              <div class="btn btn-outline-success" id='delete_confirm_delivery' data-id=${id}><i
                      class="far fa-check-circle" ></i> Oui </div>
              <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                      class="far fa-times-circle"></i> Non </div>

          </div>
  </div `
    $(".modal_add").append(html)

});

onClick('#delete_confirm_delivery', function(){
  $('.modal_add').css('display', 'none')
  $('.modal-content').css('display', 'none')
  var id= $(this).data("id")
    deleteDelivery(id)
   // displayDeliveries();
   // displayDeliveries(id);
   
});


//! ///////////////////////////////////////////////////////////
//! //////////////////!    ORDER   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.order_page=function(){
  displayOrders({statut:""})
}


  // moment(order.register_date).format('YYYY-MM-DD')
// console.log(dates)
//   Math.max.apply(null, order.register_date.map(function(e) {
//     return new Date(e.MeasureDate);
//   }));




function displayOrders(filters) {
  $("#table_body_order").html("")
  for ( var id of Object.keys(GV.orders)) {
    let order = GV.orders[id]
    var formatted_date=moment(order.register_date).format('DD-MM-YYYY')
    if(!check_order_filters(order, filters)) continue;
  
    var dateTime = moment(order.modifie_date).format('DD-MM-YY/HH:mm:ss')
    let  html = `
        <div class="table_content order">
          <div class="table_row"> ${order.id} </div>
          <div class="table_row" style="width:100%; text-align:center;" class="date_of_order"> ${formatted_date}  </div>
          <div class="table_row" id="${order.id}" >   </div>
          <div class="table_row" >${order.wilaya} </div>
          <div class="table_row" > ${order.total_cart}DA</div>
          <div class="table_row" >
            <div id="order-statut"> ${order.statut=='new' ? 'Nouvelle Commande': order.statut }</div>
            
          </div>
          <div class="table_row" style="width:100%; text-align:center;" > ${order.modifie_date==null ? 'aucune modification': dateTime}  </div>
          <div class="table_row" >
                <div class="edit_row_prod">
                  <div ><i id="details_order" class="fas fa-info-circle light_grey" data-id="${order.id}"></i></div>
                  <div ><i id="edit_order" class="far fa-edit orange_pastel" data-id="${order.id}"></i></div>
                  <div><i id="history"  data-id="${order.id}" class="fas fa-calendar-plus"></i></div>
                </div>
          </div>
      </div>
    
     `
    $("#table_body_order").prepend(html)
    $('#order-statut').html(order.statut)

  if(order.statut=='appected'){
    $('#order-statut').css('color','#90be6d' )
    $('#order-statut').html('Confirmée')
  }
  else if(order.statut=='delivered'){
    $('#order-statut').css('color','#90be6d' )
    $('#order-statut').html('Livrée')
  }
  else if ( order.statut=='en_cours'){
    $('#order-statut').css('color','#277da1' )
    $('#order-statut').html('En cours de livraison')
  }
  
  else if (order.statut=='canceled'){
    $('#order-statut').css('color','#f94144' )
    $('#order-statut').html('Annulée')
  }

  else if (order.statut=='ready_pickup' ){
    $('#order-statut').css('color','#7f4f24' )
    $('#order-statut').html('Ready for pickup')
  }
  else if (order.statut=='1er_tentative' ){
    $('#order-statut').css('color','#f8961e' )
    $('#order-statut').html('1er tentative')
  }
  else if (order.statut=='2eme_tentative' ){
    $('#order-statut').css('color','#f3722c' )
    $('#order-statut').html('2eme tentative')
  }
  else if (order.statut=='confirm_1er' ){
    $('#order-statut').css('color','#b5e48c' )
    $('#order-statut').html('Confirmée 1er tentative')
  }
  else if (order.statut=='confirm_2eme' ){
    $('#order-statut').css('color','#99d98c' )
    $('#order-statut').html('Confirmée 2eme tentative')
  }
  else if (order.statut=='confirm_echang' ){
    $('#order-statut').css('color','#76c893' )
    $('#order-statut').html('Confirmée échange')
  }
  else if (order.statut=='confirm_ajout' ){
    $('#order-statut').css('color','#52b69a' )
    $('#order-statut').html('Confirmée ajout')
  }
  else if (order.statut=='confirm_ajout_echange' ){
    $('#order-statut').css('color','#1a759f' )
    $('#order-statut').html('Confirmée ajout+échange')
  }
  else if (order.statut=='dans_panier' ){
    $('#order-statut').css('color','#7b2cbf' )
    $('#order-statut').html('Dans panier')
  }
  else{
    $('#order-statut').css('color','grey' )
    $('#order-statut').html('Nouvelle commande')

  }
    for(id of Object.keys(GV.users)){
      
      let user=GV.users[id]
      let user_id= user.id
      
      if( user_id==order.user_id ){
       
       let html=`<div>${user.first_name} ${user.last_name}<div>`

   
       $(`#${order.id}`).append(html)

      }
      
    }

  
  }
}

function check_order_filters(order, filters){
 
  if(!filters) filters={};
  if( filters.statut && order.statut != filters.statut ) return false;
  // if(product.id_category != filters.category) return false;
  return true;  
}

  
function PdfGenerator2(filter){


  $('.pdf').html("")
  for ( var id of Object.keys(GV.orders)) {
    let order = GV.orders[id]
    var dateTime = moment(order.register_date).format('DD-MM-YYYY/HH:mm:ss')
    var sous_total = order.total_cart - order.delivery_price;
    if ( order.statut==filter){
   
  let html = `
      
<div class="invoice_container">
<div class="clearfix header_pdf">
      <div id="logo">
        <img src="/img/logolk2vc2.png">
      </div>
      <div id="company">
        <h2 class="name">PharmaLife</h2>
        
        <div>(+213) 794-694-537</div>
        <div><a href="mailto:contact@pharmalifedz.com">contact@pharmalifedz.com</a></div>
      </div>
      </div>

      <div id="details" class="clearfix">
        <div id="client">
          <div class="to">Facture de:</div>
          <h2 class="name" id="name${order.id}"></h2>
          <div class="address" id="address${order.id}"></div>
          <div class="email" id="phone${order.id}"></div>
        </div>
        <div id="invoice">
          <h3>Facture : ${order.id}</h3>
          <div class="date">Date de commande: ${dateTime}</div>
          
        </div>
      </div>
      <table class="table-pdf" border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th scope="col">ref</th>
            <th scope="col" style="width: 45%;">Nom du produit</th>
            <th scope="col">Prix du produit </th>
            <th scope="col">Quantitée</th>
            <th class="total">TOTAL</th>
          </tr>
        </thead>
        <tbody class="products${order.id}">
         
          
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2"></td>
            <td colspan="2">SOUS-TOTAL</td>
            <td>${sous_total}DA</td>
          </tr>
          <tr>
            <td colspan="2"></td>
            <td colspan="2">PRIX LIVRAISON</td>
            <td>${order.delivery_price}DA</td>
          </tr>
          <tr>
            <td colspan="2"></td>
            <td colspan="2">GRAND TOTAL</td>
            <td>${order.total_cart}DA</td>
          </tr>
        </tfoot>
      </table>
      <div id="thanks">Merci de votre commande!</div>
     
</div>
</div>
<div class="html2pdf__page-break"></div>
    `
   
    $('.pdf').append(html)
    for(id of Object.keys(GV.users)){
      
      let user=GV.users[id]
      let user_id= user.id
  
      if( user_id==order.user_id ){
       
       let html=`<div>${user.first_name} ${user.last_name}</div>`
       let html2=`<div>${user.adress},${user.commune}</div>`
       let html3=`<div> ${user.phone_number} </div> `
   
       $(`#name${order.id}`).append(html)
       $(`#address${order.id}`).append(html2)
       $(`#phone${order.id}`).append(html3)

      }
      else{
       
      }
      
    }
    
    var val = JSON.parse(order.content);
    for(id of Object.keys(val)){

      var contenu = val[id]
      let contenu_id = contenu.id



      for(id of Object.keys(GV.products)){
      
        let product=GV.products[id]
        let product_id= product.id
        
        if( product_id==contenu_id ){
          if(product.promo!=0){
            var total_unity = contenu.quantity * product.promo_price;
          }else{
            var total_unity = contenu.quantity * product.price;
          }

          let html_product=
            `
            <tr>
            <td class="desc">${product.ref}</td>
            <td class="desc" style="width: 45%;">${product.product_name} </td>
            <td class="unit">${product.promo!=0 ? product.promo_price: product.price}DA</td>
            <td class="qty">${contenu.quantity}</td>
            <td class="total">${total_unity}</td>
          </tr>
            `
      
          $(`.products${order.id}`).append(html_product)
  
        }
        
      }

    }
}}    
}
function PdfLabel(filter){


  $('.label').html("")
  for ( var id of Object.keys(GV.orders)) {
    let order = GV.orders[id]
    if ( order.statut==filter){
  let html = `
  <div class="label_container">
  <div>
  <h4 >À:</h4>
  <h5 id="username${order.id}">Client :</h5>
  <h5 id="useraddress${order.id}">Adresse :</h5>
  <h5 >Commande :${order.id}</h5>

</div>
<div >
      <h4 >Produits:</h4>
      <h5 class="Lproducts${order.id}"></h5>
</div>  
</div>
</div>
<div class="html2pdf__page-break"></div>
    `
   
    $('.label').append(html)
    for(id of Object.keys(GV.users)){
      
      let user=GV.users[id]
      let user_id= user.id
      
      if( user_id==order.user_id ){
       
       let html=`${user.first_name} ${user.last_name}`
       let html2=`${user.adress}`
       let html3=`${user.phone_number}`
   
       $(`#username${order.id}`).append(html)
       $(`#useraddress${order.id}`).append(html2)
       $(`#userphone${order.id}`).append(html3)

      }
      else{
       
      }
      
    }
    
    var val = JSON.parse(order.content);
    for(id of Object.keys(val)){

      var contenu = val[id]
      let contenu_id = contenu.id



      for(id of Object.keys(GV.products)){
      
        let product=GV.products[id]
        let product_id= product.id
        
        if( product_id==contenu_id ){
         
          let html_product=
            `
            <div>${product.product_shortname} x${contenu.quantity} <br> </div>
            `
      
          $(`.Lproducts${order.id}`).append(html_product)
  
        }
        
      }

    }
    }
}    
}

function ExportPdf(){
  console.log('hello')
  var element = document.getElementById('id_pdf');
  var element2 = document.getElementById('label');
html2pdf(element, {
  margin:       10,
  filename:     'invoice.pdf',
  jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
});
html2pdf(element2, {
  margin:       10,
  filename:     'Label.pdf',
  jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
});

}

onClick('#download_invoice', function () {
 

  PdfGenerator2(GV.filter_statut)
  PdfLabel(GV.filter_statut)
  ExportPdf()

});

function displayhistory(order_id){

  $('.history_body').html("")
  
  for(id of Object.keys(GV.history)){
   
    let hist = GV.history[id]
if (order_id == hist.order_id) {
  let html = `
  <tr>
<th scope="row">${hist.order_id}</th>
<td>${hist.statut}</td>
<td>${hist.modifie_date} </td>
<td>${hist.user}</td>
</tr>
  `

$('.history_body').prepend(html)}

    }
      
}

onClick('#history', function () {
 
  let id= $(this).data("id")
  $('.popup_hist, #overlay').css('display','block');

  displayhistory(id)

});

function displayDetailsOrder(id){
  
  let order = GV.orders[id]

  $('.modal-dialog_details').html("")

  let html = `
      <div class="modal-content_details">
        <div class="modal-header_details color_1">
        <h4 class="modal-title" id="myModalLabel"><strong>Numéro de commande : ${order.id}</strong></h4>
        <div id="details_skip" class="exit"><i class="fa fa-times exit"></i></div>
        </div>
        <div class="modal-body_details">
        <div class="modal-body_details_head">
          <div class="client_title">
          Informations du client : 
          </div>
          <table class="">
               <tbody>
                   <tr>
                       <td class="h6 "><strong>Nom du client: </strong></td>
                       
                       <td class="h5" id="name${order.id}">  </td>
                   </tr>
                   <tr>
                       <td class="h6"><strong>Prix Commande: </strong></td>
                     
                       <td class="h5"> ${order.total_cart}DA  </td>
                   </tr>
                   
                   <tr>
                       <td class="h6"><strong>Addresse :</strong></td>
                      
                       <td class="h5" id="address${order.id}"></td>
                   </tr>
                   <tr>
                       <td class="h6"><strong>Numéro de télèphone :</strong></td>
                       
                       <td class="h5" id="phone${order.id}"></td>
                   </tr>
               </tbody>
          </table>
           </div>     
              <div class="modal-body_details_content">
                  <div class="client_title"> Produits : </div>
                  
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">ID</th>
                        <th scope="col">Nom du produit</th>
                        <th scope="col">Promo</th>
                        <th scope="col">Prix du produit </th>
                        <th scope="col">Quantitée</th>
                      </tr>
                    </thead>
                    <tbody class="products${order.id}">
                      
                    </tbody>
                  </table>
              </div>
           <div class="modal-body_details_remark">
              <div class="client_title"> Remarques : </div>
              <td class="h5">${order.comment}</td>
          </div>
        </div>
    </div>`
   
    $('.modal-dialog_details').html(html)
    for(id of Object.keys(GV.users)){
      
      let user=GV.users[id]
      let user_id= user.id
      
      if( user_id==order.user_id ){
       
       let html=`<div>${user.first_name} ${user.last_name}</div>`
       let html2=`<div>${user.adress}</div>`
       let html3=`<a href="tel:${user.phone_number}" > ${user.phone_number} </a> `
   
       $(`#name${order.id}`).append(html)
       $(`#address${order.id}`).append(html2)
       $(`#phone${order.id}`).append(html3)

      }
      else{
       
      }
      
    }
    
    var val = JSON.parse(order.content);
    
    for(id of Object.keys(val)){

      var contenu = val[id]
      let contenu_id = contenu.id
      
            



      for(id of Object.keys(GV.products)){
      
        let product=GV.products[id]
        let product_id= product.id
        
        if( product_id==contenu_id ){
    
          
          let html_product=
            `
            <tr>
                    <th scope="row"><img class='small_img' onclick="ExpendImg(this);" id="bigger_img" src="/img/uploads/${product.images[0]}"></th>
                    <td>${product.id}</td>
                    <td>${product.product_name} </td>
                    <td>${product.promo!=0 ? '<div class="badge success">en promo</div>':'<div class="badge warnning">pas en promo</div>'}</td>
                    <td>${product.promo!=0 ? product.promo_price: product.price} DA</td>
                    <td>${contenu.quantity}</td>
                  </tr>`
      
          $(`.products${order.id}`).append(html_product)
         console.log(product.product_name + ',' + contenu.quantity)
  
        }
        
      }

    }
   
}

onClick('.closebtn, .container_expended', function () {
  $('.container_expended').css('display','none' )

});


function ExpendImg(imgs) {
  var expandImg = document.getElementById("expandedImg");
  expandImg.src = imgs.src;
  expandImg.parentElement.style.display = "block";
}

function displayModificationOrder(id){
  
  var order = GV.orders[id]

  $('#side_menu_add_container').html("")

    let html=`
    <div class="header_side_menu">
    <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
    <div class="title">Modifier Le Statut </div>
      </div>
                <div class="body_side_menu">
                    <div class="form_container">       
                    <div class="input-container">
                    <div class="label" for="statut">Changer le statut</div>
                      <select id="statut"  name="statut" value="${order.statut}">
                        <option selected value="${order.statut}">${order.statut=='new' ? 'Nouvelle Commande': order.statut } </option>
                        <option value= "new" >Nouvelle Commande</option>
                                    <option value="appected">Confirmée</option>
                                    <option value="canceled">Annulée</option>
                                    <option value="ready_pickup">Ready for pickup</option>
                                    <option value="1er_tentative">1er tentative</option>
                                    <option value="2eme_tentative">2eme tentative</option>
                                    <option value="confirm_1er">Confirmée 1er tentative</option>
                                    <option value="confirm_2eme">Confirmée 2eme tentative</option>
                                    <option value="en_cours">En cours de livraison</option>
                                    <option value="delivered">Livrée</option>
                                    <option value="confirm_echang">Confirmée échange</option>
                                    <option value="confirm_ajout">Confirmée ajout</option>
                                    <option value="confirm_ajout_echange">Confirmée ajout+échange</option>
                                    <option value="dans_panier">Dans panier</option>
                      </select>
                      
                      </div>
                      </div>
                      <div class="input-container" >
                        <div class="label">Commentaire :</div>
                        <input class="content_editable" id="comment" contenteditable="true" value="${order.comment}"></input>
                      </div>
                      <div class="input-container" >
                      <div class="label">Ajouter d'autres produits : <i id="open_products_used_menu" class="fas fa-plus"></i></div>
                      <div class="content_editable" id="products_used">
                      <div class="productsold${order.id}">
                        
                      </div>
                      </div>
                    </div>
                      </div>
                      
        
          </div>
          </div>
          <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="update_order_valid" data-id="${order.id}" class="btn btn-outline-success" >Valider</div>

                            </div>
                        </div>
                        <div class="modal_add"></div>
                        <!-- The success Modal -->
    <div class="popup">
            <div class="popup-content">
                    <h5 class="message"></h3>
                        <div class="popup_footer">
                            
                            <div class="btn btn-outline-success ok" >
                                <i class="far fa-check-circle"></i> Ok </div>

                        </div>
    </div>
    </div>`
  
    $('#side_menu_add_container').html(html)

    var val = JSON.parse(order.content);
    GV.productsUsed = val;
    for(id of Object.keys(val)){

      var contenu = val[id]
      let contenu_id = contenu.id


      for(id of Object.keys(GV.products)){
      
        let product=GV.products[id]
        let product_id= product.id
        
        if( product_id==contenu_id ){
         
          let html_oldproduct=
            `
            <div class="product_use" data-id="${product.id}"><i class="fas fa-times delete_icon"></i><div>${product.product_name}</div></div>`
      
          $(`.productsold${order.id}`).append(html_oldproduct)
     
  
        }
        
      }

    }
   
}

function get_product_price(product, quantity){
        
  if (!quantity ) quantity= GV.initial_quantity;
  let productPrice= parseFloat(product.price)*quantity
  let productPromoPrice= parseFloat(product.promo_price)*quantity

  if(product.promo=="1" && product.promo_price) return productPromoPrice;
  return productPrice;


}

onClick('.delete_icon', function (){
  
  var id_product=$(this).closest('.product_use').data('id')
  delete GV.productsUsed[id_product] 
  GV.total_price -= GV.products[id_product].price;

  if (GV.products[id_product].promo = 0){
    GV.total_price -= GV.products[id_product].price;
  }else{
    GV.total_price -= GV.products[id_product].promo_price;
  }
  $(this).closest('.product_use').css('display','none')
});


async function  updateOrder(id){

  var id = id 
  last_invoice = GV.orders[id].total_cart
  let order = GV.orders[id]
  var productUsed= JSON.stringify(GV.productsUsed)
  var order_content= JSON.parse(order.content)
  var all_pro = Object.assign(order_content, GV.productsUsed)
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  var invoice = parseInt(last_invoice) +  parseInt(GV.total_price);
GV.total_price = 0
  var onchange = {
    statut : $("#statut").val(),
    comment : $("#comment").val(),
    modifie_date : dateTime,
    content: productUsed,
    total_cart:invoice
  }
  
var history ={
  order_id : id,
  statut : $("#statut").val(),
  modifie_date : dateTime,
  user: GV.CurrentUser.username
}

 if(order.statut != $("#statut").val()){
  var option = {
    type: "POST",
    url: `/update_order`,
    cache: false,
    data: {id , onchange, history}
  };
 }else{
  var option = {
    type: "POST",
    url: `/update_order`,
    cache: false,
    data: {id , onchange}
  
 }
}
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {
    
    $('.popup, #overlay').css('display','block');
    $('.message').html('Commande modifier avec succès')
    $('#side_menu_add_container, #products_used_menu').css('display','none');

    
    await loadOrders();
    displayOrders(statut);
    

  }
  else{
    alert('ça marche pas!')
  }
}

function tableGeneratorOrder(filter){
  $(".table_orders").html("")

  for ( var id of Object.keys(GV.orders)) {
    let order = GV.orders[id]
    if ( order.statut==filter){
    let  html = `
      <tr> 
        <div class="table_content order">
          <td><div class="table_row" id="check_d${order.id}"></div></td>
          <td><div class="table_row " id="phone_check_d${order.id}"></div></td>
          <td><div class="table_row " id="phone_check_dd${order.id}"></div></td>
          <td><div class="table_row">Compléments Alimentaires</div></td>
          <td><div class="table_row quantityd${order.id}"></div></td>
          <td><div class="table_row" id="address_check_d${order.id}"></div></td>
          <td><div class="table_row" > ${order.wilaya}  </div></td>
          <td><div class="table_row" id="commune_check_d${order.id}" > </div></td>
          <td><div class="table_row" > ${order.total_cart} DA  </div></td>
          <td><div class="table_row" ></div></td>
        </div>
    </tr>`
    $(".table_orders").append(html)
    for(id of Object.keys(GV.users)){
      
      let user=GV.users[id]
      let user_id= user.id
      
      if( user_id==order.user_id ){
       var  phone= JSON.stringify(user.phone_number)
       
       let html=`<div>${user.first_name} ${user.last_name}</div>`
       let html2=`<div>${user.adress}</div>`
       let html3=`<div>${phone}</div>`
       let html4=`<div>${user.commune}</div>`
   
       $(`#check_d${order.id}`).append(html)
       $(`#address_check_d${order.id}`).append(html2)
       $(`#phone_check_d${order.id}`).append(html3)
       $(`#phone_check_dd${order.id}`).append(html3)
       $(`#commune_check_d${order.id}`).append(html4)

      }
    }
    var val = JSON.parse(order.content);
    var total_qt = 0
    
    for(id of Object.keys(val)){

      var contenu = val[id]
      let contenu_id = contenu.id
      var qt =parseInt(contenu.quantity)
      total_qt = total_qt +qt


    }
    let html_quantity=
    `
    <div>${total_qt}
    </div>
    `

  $(`.quantityd${order.id}`).append(html_quantity)
  
 
  }}
}

function ExportToExcelOrder(type, fn, dl) {
  
  var elt = document.getElementById('download_orders');
  var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
  
  return dl ?
      XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
      XLSX.writeFile(wb, fn || ('Commandes.' + (type || 'xlsx')));
}

onClick('#download_excel', async function () {

  tableGeneratorOrder(GV.filter_statut)
  ExportToExcelOrder()

});

onClick('#details_order', function () {
  $('#overlay').css('display', 'block')
  $('.modal_details').css('display', 'grid')
  $('.modal-dialog_details').css('display', 'grid')
  let id= $(this).data("id")

  displayDetailsOrder(id)
});

onClick('#edit_order', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  let id= $(this).data("id")
  
  displayModificationOrder(id)
  
});

onClick('#update_order_valid', async function () {
  $('.modal_add').css('display', 'block')
  var id= $(this).data("id")
  var order = GV.orders[id]
  
  let  html = `
  <div class="modal-content">
  <h5>Êtes-vous sur de vouloir changer le statut de la commande ?</h3>
      <div class="modal_footer">
          <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                  class="far fa-times-circle"></i> Non </div>

          <div class="btn btn-outline-success" id='validate_update_order' data-id=${id}><i
                  class="far fa-check-circle"></i> Oui </div>

      </div>
</div>`
    $(".modal_add").html(html)
  
});

onClick('#validate_update_order',function(){
  var id = $(this).data('id')
  updateOrder(id)
  $('.modal_add').css('display', 'none')
});


$('#filter-select-menu').on('change', async function(){
  var statut= $(this).val()
  GV.filter_statut = statut
  
  displayOrders({statut:$(this).val()})

});

$(document).ready(function(){
  $("#orders_search_bar").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#table_body_order .order").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

onClick('#open_products_used_menu', function (){
  
  displayProductsListe()
  $('#products_used_menu').css('display','grid')

});

async function displayProductsListe(){
  $('.product_used_container').html('')
  for(let product_id of Object.keys(GV.products)){
    var product=GV.products[product_id]
    if(product.quantity > 0){
    let html=`<div class="product_used" data-id="${product.id}">${product.product_name}</div>`
    $('.product_used_container').prepend(html)
    }
  }
  
} 

onClick('.product_used', function(){
  $(this).addClass("highlight");
  setTimeout(function () {
        $(this).removeClass('highlight');
  }, 1000);
  var id = $(this).data('id')
  
  addProductsUsed(id)


});


function addProductsUsed(id){
  var quantity = 1;
  GV.productsUsed[id]={id,quantity};
  displayProductsUsed(id)
  
}


function displayProductsUsed(id){
  console.log(id)

 if(!id){
   
   for(let object_id of Object.keys(GV.productsUsed)){
     var product_id=GV.productsUsed[object_id].id
     var productName= GV.products[product_id].product_name
   
     var html =`<div class="product_use" data-id="${product_id}"><i class="fas fa-times delete_icon"></i><div>${productName}</div></div>` 
     $('#products_used').prepend(html)
     console.log('je suis la')
  // GV.total_price += GV.products[product_id].price;
  // console.log(parseInt(GV.total_price),'jajouteap')
   }
 }
 else{
  
  var product_id = GV.productsUsed[id].id
  
  var productName= GV.products[product_id].product_name
  var html =`<div class="product_use"data-id="${product_id}"><i class="fas fa-times delete_icon"></i><div>${productName}</div></div>` 
  $('#products_used').prepend(html)
  if (GV.products[product_id].promo = 0){
    GV.total_price += GV.products[product_id].price;
  }else{
    GV.total_price += GV.products[product_id].promo_price;
  }
  
  console.log(parseInt(GV.total_price),)

 }
  
}



$("#products_used_search_bar").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $(".product_used").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

//! ///////////////////////////////////////////////////////////
//! //////////////////!    APPROVISIONNEMENT   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.appro_page=function(){
  displayAppros()

}
function displayAppros() {
  $("#table_body_appro").html("")
  for (id of Object.keys(GV.appros)) {
    let appro = GV.appros[id]
    var formatted_date=moment(appro.creation_date).format('DD-MM-YYYY/HH:mm:ss')
    var dateTime = moment(appro.updated_date).format('DD-MM-YYYY/HH:mm:ss')
    let  html = `
        <div class="table_content appro">
          <div id="table_row"> ${appro.id_appro} </div>
          <div id="table_row" > ${appro.name} </div>
          <div id="table_row" > ${formatted_date} </div>
          <div id="table_row " for="status" >
                      <select data-id="${appro.id}" id="change-status-menu" name="status" value="${appro.status}" style="-webkit-appearance: button;">
                        <option selected value="${appro.status}">${appro.status}</option>
                        <option value="en_cours" >En cours</option>
                        <option value="delivered" >Délivrée</option>
                      </select>
                      </div>
          <div id="table_row" > ${dateTime} </div>
          <div id="table_row" >
                <div class="edit_row">
                <div ><i id="details_appro" class="fas fa-info-circle light_grey" data-id="${appro.id}"></i></div>
                  <div ><i id="delete_appro" class="fas fa-trash-alt red_pastel" data-id="${appro.id}"></i></div>
                </div>
          </div>
      </div>
      <div class="modal_add"></div>`
     
    $("#table_body_appro").append(html)
   

    
    

}
}
$(document).ready(function(){
  $("#appro_search_bar").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#table_body_appro .appro").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

function displayModificationAppro(id){
  
  let appro = GV.appros[id]
  $('#side_menu_add_container').html("")

    let html=`
    <div class="header_side_menu">
                            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
                            <div class="title">Ajouter Approvisionnement </div>
                        </div>
                        <div class="body_side_menu">
    <div class="form_container">
  
                                  <div class="input-container">
                                      <div class="label">ID Approvisionnement *</div>
                                      <input class="content_editable required" type="text" id="id_appro" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Nom *</div>
                                      <input class="content_editable required" type="text" id="name" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label" for="status">Statut *</div>
                                        <select id="status" name="status">
                                          <option value="en_cours">En cours</option>
                                          <option value="delivered">Délivrée</option>
                                          
                                        </select>
                                  </div>
                                  <div class="input-container" >
                                    <div class="label">Ajouter commandes : <i id="open_orders_used_menu" class="fas fa-plus"></i></div>
                                    <div class="content_editable" id="orders_used">
                                      
                                    </div>
                                    <div id="error"></div>
                                  </div>
                                  
                              </div>
  
    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="add_appro_valid" class="btn btn-outline-success" >Valider</div>

                            </div>
                        </div>
                        `
    $('#side_menu_add_container').html(html)

}


function displayDetailsAppro(id){
  
  let appro = GV.appros[id]
  
 

  $('.modal-dialog_details').html("")

    let html=`
      <div class="modal-content_details">
        <div class="modal-header_details color_1">
        <h4 class="modal-title" id="myModalLabel"><strong>ID d'approvisionnemnt : ${appro.id}</strong></h4>
        <div id="details_skip" class="exit"><i class="fa fa-times exit"></i></div>
        </div>
        <div class="modal-body_details">
        <div class="modal-body_details_head">
          <div class="client_title">
          Informations de la commande : 
          </div>
          <table class="">
               <tbody>
                   <tr>
                       <td class="h6"><strong>ID:</strong> &nbsp&nbsp${appro.id_appro} </td>
                       
                   </tr>
                   <tr>
                       <td class="h6"><strong>Name: </strong> &nbsp&nbsp${appro.name}</td>
                       
                   </tr>
                   
                   <tr>
                       <td class="h6"><strong>Statut:</strong>  &nbsp&nbsp${appro.status}</td>
                       
                   </tr>
               </tbody>
          </table>
           </div>     
              <div class="modal-body_details_content">
                  <div class="client_title"> Détails commande : </div>
                  
                   <table class="">
               <tbody>
                   <tr>
                       <td class="h6 flex" ><strong>Commandes: </strong> &nbsp&nbsp<div class="h6" id="commande${appro.id}" ></div></td>
                       <td></td> 
                       
                   </tr>
                   
               </tbody>
          </table>
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">ID Commande</th>
                        <th scope="col">ID Produit</th>
                        <th scope="col">Nom du produit</th>
                        <th scope="col">Prix du produit </th>
                        <th scope="col">Quantitée</th>
                      </tr>
                    </thead>
                    <tbody class="products${appro.id}">
                      
                    </tbody>
                  </table>
              </div>
        </div>
    </div>`
   
    $('.modal-dialog_details').html(html)
    var obj = JSON.parse(appro.content)
    
    for (id of Object.keys(obj)) {
      let content=obj[id]
      let content_id= content.id
      
      for(let order_id of Object.keys(GV.orders)){
        var order=GV.orders[order_id]
        var id = order.id

        
        if( order_id==content_id ){
          
          for(id2 of Object.keys(GV.users)){
        
            let user=GV.users[id2]
          let user_id= user.id
          
            if( user_id==order.user_id ){
              console.log(content_id, user.first_name)
              let html2=`<div> ID Commande: ${content_id} &nbsp;</div>`
       
              $(`#commande${appro.id}`).prepend(html2)
        
            }
          }
          var val = JSON.parse(order.content);
      for(id of Object.keys(val)){

      var contenu = val[id]
      let contenu_id = contenu.id

      for(id of Object.keys(GV.products)){
      
        let product=GV.products[id]
        let product_id= product.id
        
        if( product_id==contenu_id ){
         
          let html_product=
            `
            <tr>
                    <th scope="row"><img class='small_img' onclick="ExpendImg(this);" src="/img/uploads/${product.images[0]}"></th>
                    <td>${order.id}</td>
                    <td>${product.id}</td>
                    <td>${product.product_name} </td>
                    <td>${product.promo!=0 ? product.promo_price: product.price} DA</td>
                    <td>${contenu.quantity}</td>
                  </tr>`
      
          $(`.products${appro.id}`).append(html_product)
        
    
        }
        
      }
     
      }
      }
      
  }
      
}}


onClick('#open_orders_used_menu', function (){
  
  displayOrdersListe()
  $('#orders_used_menu').css('display','grid')

});

async function displayOrdersListe(){
  $('.order_used_container').html('')
  for(let order_id of Object.keys(GV.orders)){
    var order=GV.orders[order_id]

    if(order.statut!="dans_panier"){

    let html=`<div class="order_used" id="client${order.id}" data-id="${order.id}">ID commande :${order.id} </div>`
    $('.order_used_container').prepend(html)
    for(id of Object.keys(GV.users)){
      
      let user=GV.users[id]
      let user_id= user.id
      
      if( user_id==order.user_id ){
       
       let html=`<div> Client :${user.first_name} ${user.last_name}<div>`
   
       $(`#client${order.id}`).append(html)
  
      }
    }
  }
  }

} 

onClick('.order_used', function(){
  $(this).addClass("highlight");
  setTimeout(function () {
        $(this).removeClass('highlight');
  }, 1000);
  var id = $(this).data('id')
  
  addOrdersUsed(id)


});


function addOrdersUsed(id){
  GV.ordersUsed[id]={id};
  displayOrdersUsed(id)
 
}

async function  updateOrderStatut(id){

  var id = id 
var change_statut = "dans_panier"
  var onchange = {
    statut : change_statut,
    
  }

  var option = {
    type: "POST",
    url: `/update_order_statut`,
    cache: false,
    data: {id , onchange}
  };
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {
   

  }
  else{

  }
}

function displayOrdersUsed(id){
 if(!id){
   
   for(let object_id of Object.keys(GV.ordersUsed)){
     var order_id=GV.ordersUsed[object_id].id
   
     var html =`<div class="order_use" data-id="${order_id}"><i class="fas fa-times delete_icon"></i><div>${order_id}</div></div>` 
     $('#orders_used').prepend(html)

   }
 }
 else{
  var order_id = GV.ordersUsed[id].id

  var html =`<div class="order_use"data-id="${order_id}"><i class="fas fa-times delete_icon"></i><div>${order_id}</div></div>` 
  $('#orders_used').prepend(html)

 }
  
}


onClick('.delete_icon_order', function (){
  var id=$(this).closest('.order_use').data('id')
  delete GV.ordersUsed[id] 
  $(this).closest('.order_use').css('display','none')
});

$("#orders_used_search_bar").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $(".order_used").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

async function addAppro() {
  for(let object_id of Object.keys(GV.ordersUsed)){
    var order_id=GV.ordersUsed[object_id].id
    updateOrderStatut(order_id)
  }
  var information = {
    id_appro: $("#id_appro").val(),
    name: $("#name").val(),
    content:JSON.stringify(GV.ordersUsed),
    status: $("#status").val(),

  }
  var options = {
    type: "POST",
    url: `/add_appro`,
    cache: false,
    data: {
      information
    },
  };
  var received_data = await $.ajax(options);
  if (received_data.ok) {
    
    $('.popup, #overlay').css('display','block');
    $('.message').html('appro ajouté avec succès')
    $('#side_menu_add_container, #orders_used_menu').css('display','none');
    
    await loadAppros();
    displayAppros();
  }

}

async function updateAppro(id){
  var id = id 
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  var onchange = {
    status : $("#change-status-menu").val(),
    updated_date: dateTime
  }
  
  var data ={id , onchange}
 
  var option = {
    type: "POST",
    url: `/update_appro`,
    cache: false,
    data: data
  };
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {
    
    $('.popup, #overlay').css('display','block');
    $('.message').html('approvisionnement modifier avec succès')

    
    await loadAppros();
    displayAppros();
    

  }
  else{
    alert('ça marche pas!')
  }
  
}

async function deleteAppro(id){
  var id = id 
  var data ={id}
  var option = {
    type: "POST",
    url: `/delete_appros`,
    cache: false,
    data: data,
  };
  
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {

    $('.popup, #overlay').css('display','block');
    $('.modal_add').css('display', 'none')
    $('.message').html('Approvisionnement supprimé avec succès')

  await loadAppros();
    displayAppros();
    
  }
  
}

onClick('#add_appro', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  displayModificationAppro()

});

onClick('#add_appro_valid_confirm', async function () {
  await addAppro()
});

onClick('#add_appro_valid', async function () {
  var error=check_formulaire();
    $('#error').html(error);
    if(error) return;
  $('.modal_add').css('display', 'block')

  html=`

  <div class="modal-content">
      <h5>Êtes-vous sur de vouloir ajouter cet utilisateur ?</h3>
          <div class="modal_footer">
              <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                      class="far fa-times-circle"></i> Non </div>

              <div class="btn btn-outline-success" id='add_appro_valid_confirm'><i
                      class="far fa-check-circle"></i> Oui </div>

          </div>
  </div>

`
$(".modal_add").append(html)
});


onClick('#delete_appro', function () {
  $('.modal_add').css('display', 'block')
  var id= $(this).data("id")
  let  html = `

  <div class="modal-content">
      <h5>Êtes-vous sur de vouloire supprimer cette approvisionnement ?</h3>
          <div class="modal_footer">
              <div class="btn btn-outline-success" id='delete_confirm_appro' data-id=${id}><i
                      class="far fa-check-circle" ></i> Oui </div>
              <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                      class="far fa-times-circle"></i> Non </div>

          </div>
  </div `
    $(".modal_add").append(html)

});

onClick('#delete_confirm_appro', function(){
  $('.modal_add').css('display', 'none')
  var id= $(this).data("id")
    deleteAppro(id)
   
});

onClick('#details_appro', function () {
  $('#overlay').css('display', 'block')
  $('.modal_details').css('display', 'grid')
  $('.modal-dialog_details').css('display', 'grid')
  let id= $(this).data("id")

  displayDetailsAppro(id)
});

$(document).on('change', '#change-status-menu',async function(){
  $('.modal_add').css('display', 'block')
  var id= $(this).data("id") 
  var val =$(this).val()
  console.log($(this).val())
  let  html = `
  <div class="modal-content">
  <h5>Êtes-vous sur de vouloir changer le statut de la commande ?</h3>
      <div class="modal_footer">
          <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                  class="far fa-times-circle"></i> Non </div>

          <div class="btn btn-outline-success" id='validate_update_appro' data-id=${id}><i
                  class="far fa-check-circle"></i> Oui </div>

      </div>
</div>`
    $(".modal_add").append(html)
  
});

onClick('#validate_update_appro',function(){
  var id = $(this).data('id')
  updateAppro(id)
    
});

//! ///////////////////////////////////////////////////////////
//! //////////////////!    ADS   //////////////////////////
//! ///////////////////////////////////////////////////////////

GV.initialize_page.ads_page=function(){
  displayAds()
}

function displayAds() {
  $("#table_body_ads").html("")

  for ( var id of Object.keys(GV.ads)) { 
    let ad = GV.ads[id]
    var ad_id = ad.id
    var formatted_date=moment(ad.date).format('DD-MM-YYYY')

    let  html = `
        <div class="table_content ads">
          <div id="table_row">
            <img class='small_img' onclick="ExpendImg(this);" src="/img/uploads/${ad.image_desktop}">
          </div>
          <div class="table_row"> ${ad.name} </div>
          <div class="table_row"> ${ad.lien} DA</div>
          <div class="table_row"> ${formatted_date}</div>
          <div class="table_row" >${ad.statut!=0 ? 'On':'Off'} </div>
          <div class="table_row">
                <div class="edit_row">
                  <div ><i id="edit_ad" class="far fa-edit orange_pastel" data-id="${ad.id}"></i></div>
                  <div ><i id="delete_ad" class="fas fa-trash-alt red_pastel" data-id="${ad.id}"></i></div>
                </div>
          </div>
      </div>`


    $("#table_body_ads").append(html)
    console.log(ad)

  }
  
}


function displayModificationAds(id){
  
  let ad = GV.ads[id]

  
  $('#side_menu_add_container').html("")
  if(ad==undefined){

    let html=`
    <div class="header_side_menu">
                            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
                            <div class="title">Ajouter Publicité </div>
                        </div>
                        <div class="body_side_menu">
    <div class="form_container">
  
                                  <div class="input-container">
                                      <div class="label">Nom de la pub *</div>
                                      <input class="content_editable" id="ad_name" contenteditable="true" value=""></input>
                                  </div>
  
                                  <div class="input-container">
                                      <div class="label">Lien de la pub *</div>
                                      <input class="content_editable" id="ad_lien" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Statut *</div>
                                        <select class="enter" type=text id="ad_statut" placeholder="" required="">
                              <option selected></option>
                              <option value="1">On</option>
                              <option value="0">Off</option>   
                            </select>
                                  </div>
                              <div class="custom-file" style="margin-top: 10px;">
                              <input type="file" class="custom-file-input" id="Image_Desktop_File" >
                              <label class="custom-file-label" for="ad_desktop_photo">Choisir une photo pour la recette</label>
                            </div>
                            <div class="custom-file" style="margin-top: 10px;">
                              <input type="file" class="custom-file-input" id="Image_Phone_File">
                              <label class="custom-file-label" for="ad_phone_photo">Choisir une photo du cuisinier</label>
                            </div>
                              <div id="divFiles"><div class="image_section_upload">
                              </div></div>
                           
    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="add_ads_valid" class="btn btn-outline-success" >Valider</div>

                            </div>
                        </div>
                        <div class="modal_add">
                            <div class="modal-content">
                                <h5>Êtes-vous sur de vouloir ajouter cette pub ?</h3>
                                    <div class="modal_footer">
                                        <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                                                class="far fa-times-circle"></i> Non </div>

                                        <div class="btn btn-outline-success" id='add_ads_valid_confirm'><i
                                                class="far fa-check-circle"></i> Oui </div>

                                    </div>
                            </div>

                        </div>`
    $('#side_menu_add_container').html(html)
  }
  else{
   
    let html=`
    <div class="header_side_menu">
    <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
    <div class="title">Modifier Publicité</div>
</div>
<div class="body_side_menu">
    <div class="form_container">
                        <div class="input-container">
                        <div class="label">Nom de la pub *</div>
                        <input class="content_editable" id="name" contenteditable="true" value="${ad.name}"></input>
                    </div>

                    <div class="input-container">
                        <div class="label">Lien de la pub *</div>
                        <input class="content_editable" id="lien" contenteditable="true" value="${ad.lien}"></input>
                    </div>
                    <div class="input-container">
                        <div class="label">Statut *</div>
                          <select class="enter" type=text id="statut" placeholder="" required="">
                          <option value="${ad.statut}" selected>${ad.statut!=0 ? 'On':'Off'} </option>
                          <option value="1">On</option>
                          <option value="0">Off</option>   
                          </select>
                      </div>
                                  
                              <div class="custom-file" style="margin-top: 10px;">
                                <input type="file" class="custom-file-input" id="Image_Desktop_File" >
                                <label class="custom-file-label" for="ad_desktop_photo">Choisir une photo pour la recette</label>
                              </div>
                              <div class="custom-file" style="margin-top: 10px;">
                                <input type="file" class="custom-file-input" id="Image_Phone_File">
                                <label class="custom-file-label" for="ad_phone_photo">Choisir une photo du cuisinier</label>
                              </div>
                              <div id="divFiles"><div class="image_section_upload">
                              <div class="box shadow">
                                <img src="/img/uploads/${ad.image_desktop}"
                                </div>
                            <div class="box shadow">
                                <img src="/img/uploads/${ad.image_phone}"
                                </div>
                                </div></div>
                                </div></div>
                                </div></div>
    
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="update_ads_valid" class="btn btn-outline-success" >Valider</div>

                            </div>
                        </div>
                        <!-- The add validattion Modal -->
                        <div class="modal_add">

                            <!-- Modal content -->
                            <div class="modal-content">
                                <h5>Êtes-vous sur de vouloir modifier cette publicité ?</h3>
                                    <div class="modal_footer">
                                        <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                                                class="far fa-times-circle"></i> Non </div>

                                        <div class="btn btn-outline-success" id='validate_update_ads' data-id=${ad.id}><i
                                                class="far fa-check-circle"></i> Oui </div>

                                    </div>
                            </div>

                        </div>`
  
    $('#side_menu_add_container').html(html)

   
  }
}


$(document).on('change','#Image_Phone_File', function(){
  let file = this.files[0];
  var fileListPhone = GV.filelistPhone
  upload_image(file, (e, res) => {
      if (res == "load") {
          console.log('%s uploaded successfuly: ', e.file_name);
          GV.image_phone = e.file_name;
          fileListPhone.push(e.file_name);
          
          for (var i = 0; i < fileListPhone.length; ++i) {
            var  list = `
            <div class="box shadow">
             <img src="/img/uploads/${fileListPhone[i]}">
            </div>`
            
          }
          $(".image_section_upload").append(list)
      }
      if (res == "error") {
          console.log('An error happened: ', e);
      }
  });
  });

$(document).on('change','#Image_Desktop_File', function(){
  let file = this.files[0];
  var fileListDesktop = GV.fileListDesktop
  upload_image(file, (e, res) => {
      if (res == "load") {
          console.log('%s uploaded successfuly: ', e.file_name);
          GV.image_desktop = e.file_name;
          fileListDesktop.push(e.file_name);
          
          for (var i = 0; i < fileListDesktop.length; ++i) {
            var  list = `
            <div class="box shadow">
             <img src="/img/uploads/${fileListDesktop[i]}">
            </div>`
            
          }
          $(".image_section_upload").append(list)
      }
      if (res == "error") {
          console.log('An error happened: ', e);
      }
  });
  });

async function addAds(){
  var image_desktop= GV.fileListDesktop
  var image_phone= GV.fileListPhone
  var information = {
   
    name: $("#ad_name").val(),
    lien: $("#ad_lien").val(),
    statut: $("#ad_statut").val(),
    image_desktop: image_desktop,
    image_phone: image_phone


  }
 
  
  var option = {
    type: "POST",
    url: `/add_ads`,
    cache: false,
    data: {
      information
    },
  };

  
  var receved_data = await $.ajax(option);
  console.log(receved_data.ok)
  if (receved_data.ok) {
    
    
    $('.popup, #overlay').css('display','block');
    $('.message').html('Pub ajouter avec succès')
    $('#side_menu_add_container').css('display','none');

   
    await loadAds();
    displayAds();
    

  }
  else{
    alert('ça marche pas!')
  }

}

async function  updateAds(id){
  var id = id 
  var image_desktop= GV.fileListDesktop
  var image_phone= GV.fileListPhone
  var ads = {
    name: $("#name").val(),
    lien: $("#lien").val(),
    statut: $("#statut").val(),
    image_desktop: image_desktop,
    image_phone: image_phone
  }

  console.log(ads)
  var data ={id , ads}
  
  var option = {
    type: "POST",
    url: `/update_ads`,
    cache: false,
    data: data,
  };
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {
    
    $('.popup, #overlay').css('display','block');
    $('.message').html('pub modifier avec succès')
    $('#side_menu_add_container').css('display','none');

   
    await loadAds();
    displayAds();
    displayAds(id);


  }
  else{
    alert('ça marche pas!')
  }
}

async function deleteAds(id){
  var id = id 
  var data ={id}
  var option = {
    type: "POST",
    url: `/delete_ads`,
    cache: false,
    data: data,
  };
  console.log(id)
  
  var receved_data = await $.ajax(option);
  if (receved_data.ok) {

    $('.popup, #overlay').css('display','block');
    $('.modal_add').css('display', 'none')
    $('.message').html('Pub supprimée avec succès')

  await loadAds();
    displayAds();
    
  }
  
}

onClick('#add_ads', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  displayModificationAds()

});
onClick('#add_ads_valid', async function () {
  $('.modal_add').css('display', 'block')

});

onClick('#add_ads_valid_confirm', async function () {
  await addAds()
});

onClick('#edit_ad', function () {
  $('#overlay').css('display', 'block')
  $('#side_menu_add_container').css('display', 'grid')
  let id= $(this).data("id")
console.log(id)
  displayModificationAds(id)
});

onClick('#update_ads_valid', async function () {
  $('.modal_add').css('display', 'block')
});

onClick('#validate_update_ads',function(){
  var id = $(this).data('id')

    updateAds(id)
    
});
onClick('#delete_ad', function () {
  $('.modal_add').css('display', 'block')
  var id= $(this).data("id")
  let  html = `

  <div class="modal-content">
      <h5>Êtes-vous sur de vouloire supprimer cette pub ?</h3>
          <div class="modal_footer">
              <div class="btn btn-outline-success" id='delete_confirm_ads' data-id=${id}><i
                      class="far fa-check-circle" ></i> Oui </div>
              <div class="supprimer btn btn-outline-danger" id='valid_not'><i
                      class="far fa-times-circle"></i> Non </div>

          </div>
  </div `
    $(".modal_add").append(html)

});

onClick('#delete_confirm_ads', function(){
  $('.modal_add').css('display', 'none')
  $('.modal-content').css('display', 'none')
  var id= $(this).data("id")
    deleteAds(id)
    displayAds();
    displayAds(id);
   
});



//! ///////////////////////////////////////////////////////////
//! //////////////////!   Artisans  //////////////////////////
//! ///////////////////////////////////////////////////////////
GV.initialize_page.artisans_page=function(){
  displayArtisans()
};

function displayModificationArtisan(id){
  
  let artisan ="undefined"
  
  
  $('#side_menu_add_container').html("")
  if(artisan=="undefined"){

    let html=`
    <div class="header_side_menu">
                            <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
                            <div class="title">Ajouter un Artisan</div>
                        </div>
                        <div class="body_side_menu">
    <div class="form_container">
  
                                  <div class="input-container">
                                      <div class="label">Nom * :</div>
                                      <input class="content_editable required" type="text"  id="artisan_lastName" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Prénom * :</div>
                                      <input class="content_editable required" type="text"  id="Artisan_firstName" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">N° téléphone* :</div>
                                      <input class="content_editable required" type="number"  id="Artisan_phone" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Adresses de travail* :</div>
                                      <input class="content_editable required" type="text"  id="Artisan_address" contenteditable="true" value=""></input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Experience*:</div>
                                      <input class="content_editable required" type="number" id="artisan_experience" contenteditable="true" value=""></input>
                                  </div>
  
                                  <div class="input-container">
                                      <div class="label" for="categorie">Catégorie * :</div>
                                      <select class="enter required" type=text id="category_artisans" placeholder="" >
                                        <option value="" disable> séléctionnez une catégorie</option>
                                        <option value=""> Plombier</option>
                                        <option value=""> Electricien</option>
                                      </select>
                                        
                                  </div>
                                  
                              <div class="custom-file" style="margin-top: 10px;">
                                <form id='file-catcher'>
                                  <input type="file" multiple="multiple" name="product_photo" class="custom-file-input required" id="validatedCustomFile" >
                                  <label class="custom-file-label" for="validatedCustomFile">Choisir une photo de profil</label>
                                  <div id="divFiles"><div class="image_section_upload"></div></div>
                                  
                               </form>
                            </div>
                            <div id="error"></div>
    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="add_prod_valid" class="btn btn-outline-success" >Valider</div>

                            </div>
                        </div>
                       `
    $('#side_menu_add_container').html(html)

  }
  else{
    let html=`
    <div class="header_side_menu">
    <div id="skip_btn" class="exit"><i class="fas fa-chevron-left exit"></i></div>
    <div class="title">Modifier Produit</div>
</div>
<div class="body_side_menu">
    <div class="form_container">
      <div class="input-container">
                                      <div class="label">Référence du produit *</div>
                                      <input class="content_editable" id="ref" type="text" contenteditable="true" value="${product.ref}"> </input>
                                  </div>
  
                                  <div class="input-container">
                                      <div class="label">Nom du produit * :</div>
                                      <input class="content_editable required"  type="text" id="product_name" contenteditable="true" value="${product.product_name}"> </input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Nom du produit Abréger * :</div>
                                      <input class="content_editable required"  type="text" id="product_shortname" contenteditable="true" value="${product.product_shortname}"> </input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Prix du produit * :</div>
                                      <input class="content_editable required" type="number" id="price" contenteditable="true" value="${product.price}"> </input>
                                  </div>
                                  <div class="input-container" >
                                      <div class="label">Description *:</div>
                                      <textarea class="input content_editable required" type="text" id="description"  value="${product.description}"  rows="4" cols="50">
                                      ${product.description}</textarea>
                                    </div>
                                    <div class="input-container" >
                                      <div class="label">وصف :</div>
                                      <textarea class="input content_editable" type="text" id="description_ar" value="${product.description_ar}" rows="4" cols="50">
                                      ${product.description_ar}</textarea>
                                    </div>
                                    <div class="input-container" >
                                    <label class="label" for="colorpicker">Couleur:*</label>
                                    <input type="color" id="colorpicker" value="${product.color?product.color:"#ffff"}">
                                   </div>

                                  <div class="input-container">
                                      <div class="label">Quantité *:</div>
                                      <input class="content_editable required" type="number" id="quantity" contenteditable="true" value="${product.quantity}"> </input>
                                  </div>
                                  <div class="input-container">
                                      <div class="label">Promo * :</div>
                                        <select class="enter required" type=text id="promo" placeholder="" required="">
                                          <option value="${product.promo}" selected>${product.promo!=0 ? 'oui':'non'} </option>
                                          <option value="1" >Oui</option>
                                          <option value="0">Non</option>   
                                        </select>
                                  </div>
                                  
                                  <div class="promo_form">
                                  
                                  </div>
                                  <div class="input-container">
                                      <div class="label" for="categorie">Categorie * :</div>
                                      <select class="enter required" type=text id="category" placeholder="" required="required">
                                        <option value="">${category.category_name}</option>
                                      </select>
                                        
                                  </div>
                                  <div class="input-container">
                                      <div class="label" for="categorie">Sous-Categorie * :</div>
                                      <select class="enter" type=text id="sub_category" placeholder="" required="required">
                                                                            <option value="">${sub_category.sub_category_name==undefined ? 'aucune sous-catégorie': sub_category.sub_category_name }</option>

                                      </select>
                                        
                                  </div>
                              <div class="custom-file" style="margin-top: 10px;">
                              <form id='file-catcher'>
                              <input type="file" multiple="multiple" name="product_photo" class="custom-file-input required" id="validatedCustomFile" >
                              <label class="custom-file-label" for="validatedCustomFile">Choisir une photo pour le produit</label>
                              <div id="divFiles"><div class="image_section_upload"></div></div>
                              </form>
                            </div>                            
                                  
  
    </div>
  
    </div>
    </div>
    <div class="footer_side_menu">

                            <div class="buttons_container">

                                <div id="update_prod_valid" data-id=${product.id} class="btn btn-outline-success grid center" ><div class="button_text">Valider</div><div class="button_loading_icon"><i class="fas fa-circle-notch fa-spin" ></i></div></div>

                            </div>
                        </div>
                        `
  
    $('#side_menu_add_container').html(html)

    display_html_categories() 

    var images = product.images
    GV.filelist= images
    
    console.log(images,GV.fileList)
    for (var i = 0; i < images.length; ++i) {
            var  list = `
            <div class="box shadow img_small" >
            <div class="delete_img" data-name="${images[i]}" data-id="${product.id}" style="color:red;">X</div>
            <img class="thumbnail" src="../img/uploads/${images[i]}">
            </div>`
            $(".image_section_upload").append(list)
          }
  console.log(product.promo)
  }

}





function displayArtisans() {
  $("#table_body_artisans").html("")
  for ( var id of Object.keys(GV.artisans)) {
    let artisan= GV.artisans[id]
    if(!artisan)continue
  
    let  html = `
        <div class="table_content artisans">
          <div id="table_row">
            
            <img class='small_img' onclick="ExpendImg(this);" src="/img/uploads/${artisan.work_img[0]}">
            
          </div>
          <div id="table_row"> ${artisan.id} </div>
          <div id="table_row" >  ${artisan.first_name} </div>
          <div id="table_row" >  ${artisan.last_name} DA </div>
          <div id="table_row" >  ${artisan.phone} </div>
          <div id="table_row" >  ${artisan.work_locations} </div>
          <div id="table_row" >  ${artisan.experience} </div>
          <div id="table_row" >  ${artisan.rating}/5</div>
          <div id="table_row" >
                <div class="edit_row_prod">
                  <div ><i id="details_prod" class="fas fa-info-circle light_grey" data-id="${artisan.id}"></i></div>
                  <div ><i id="edit_prod" class="far fa-edit orange_pastel" data-id="${artisan.id}"></i></div>
                  <div ><i id="delete_prod" class="fas fa-trash-alt red_pastel" data-id="${artisan.id}"></i></div>
                </div>
          </div>
      </div>
     <div class="modal_add"  style="z-index:600 !important;"></div>
     `
    $("#table_body_artisans").prepend(html)}

   
  
}

onClick('#add_artisan', function () {
  
$('#overlay').css('display', 'block')
$('#side_menu_add_container').css('display', 'grid')
displayModificationArtisan()

});