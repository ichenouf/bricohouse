const express = require('express');
const db = require("./db.js");
const fs = require('fs');
const {join} = require('path');
const session = require('express-session');
const body_parser = require('body-parser');
const path = require('path');
const multer=require('multer');
const bcrypt = require('bcryptjs');
const base_url = path.join(__dirname,'public/');
const nodemailer = require("nodemailer");
const cookieParser = require('cookie-parser')



let app = express();
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true}));
app.use(session({
    secret:'mysecret',  
    resave: false, 
    saveUninitialized: true, 
    cookie:{
        secure:false, 
        maxAge: 1000*60*60*24*30 
    }
}));
app.use(cookieParser()); 
app.use(express.static(join(__dirname, 'public')));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
const upload_dir = join(__dirname,'public/img/uploads/');
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, './public/img/uploads/'),
	filename:    (req, file, cb) => cb(null, Date.now()+file.originalname)
});
  
const upload = multer({storage: storage});
  


require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);





app.get([`/`, "/home_page",  "/promotion_page","/boutique_page"], async (req, res,) => { 
	res.sendFile(base_url+'/main.html');
});


app.get([`/test`,], async (req, res,) => { 
	res.sendFile(base_url+'/zoubir.html');
});


app.get("/product_page/:id", async (req, res,) => { 
	var product_id=req.params.id;
	let file=fs.readFileSync(path.join(__dirname , "/public/main.html")).toString();
	file+=`<script> GV.selected_product_id=${product_id};</script>`;
	res.send(file);
});

app.get("/boutique_page/:id", async (req, res,) => { 
	var category_id=req.params.id;
	let file=fs.readFileSync(path.join(__dirname , "/public/main.html")).toString();
	file+=`<script> GV.selected_category_id=${category_id};</script>`;
	res.send(file);
});

app.get("/boutique_page/:id/:id2", async (req, res,) => { 
	var category_id=req.params.id;
	var sub_category_id=req.params.id2;
	console.log(sub_category_id,category_id,"dokaaa","lll")
	let file=fs.readFileSync(path.join(__dirname , "/public/main.html")).toString();
	file+=`<script> GV.selected_category_id=${category_id}; GV.selected_sub_category_id=${sub_category_id};</script>`;
	res.send(file);
});

 
app.get([`/admin`,`/admin/client_page`, `admin/user_page`,`/admin/category_page`,`/admin/reduction_page`,`/admin/banner_page`,`/admin/product_page`,'/admin/order_page',`/admin/dashboard`], async (req, res,) => { 
	const {user_id} = req.cookies;
	console.log(user_id,'wwww')
	if( user_id == undefined ){
		
		res.redirect("/login")
	}
	else{
		res.sendFile(base_url+'admin/admin.html');
	}

});

app.get([`/login`], async (req, res,) => { 
	const {user_id} = req.cookies;
	console.log(user_id,'wwww')
	if( user_id == undefined ){
		res.sendFile(base_url+'/login.html');
	}
	else{
		res.sendFile(base_url+'admin/admin.html');
	}

});



// app.post(`/send_sms`, async (req, res,) => { 
// 	var data= req.body
// 	var user = data.user
// 	client.messages
// 	.create({
// 	   body: 'Votre commande chez malak spieces a bien été validée',
// 	   from: '+13123865225',
// 	   to: user.phone_number,
// 	 })
// 	.then(message => console.log(message.sid));
// 	 console.log(user.phone_number);
// 	res.send("ok");
//  });


app.post(`/create_orders`, async (req, res,) => { 
	var data=req.body;
	
	var user= await save_user(data.user);
	data.item.user_id = user.id
	var order= await db.insert("orders", data.item);
	var products=await db.select("*","products", {},"indexed");
	var cart= JSON.parse(data.item.content);
	
	for(product_id of Object.keys(cart)){
		var product=products[product_id];
		if(!product){continue;}
		var cart_element=cart[product_id];
		var current_stock=product.quantity;
		var new_stock= parseInt(current_stock) - parseInt(cart_element.quantity);
		var currentSellesIndex = product.selles_index
		var newSellesIndex = currentSellesIndex + 1
		await db.update("products",{quantity:new_stock,selles_index:newSellesIndex},{id:product_id});
	}

	res.send("ok");
 });

app.post(`/update_order`, async (req, res,) => { 
	var data=req.body;

	var order =await db.update("orders", data.onchange,  {id:data.id});
	if(data.history){
		var history=await db.insert("history",data.history)
	}
	var products=await db.select("*","products", {},"indexed");

	var added= JSON.parse(data.onchange.content);

	console.log(data.id)
	console.log(added)

	if(added != {}){

	for(product_id of Object.keys(added)){
		var product=products[product_id];
		var quantity = 1 ;
		if(!product){continue;}
		var added_element=added[product_id];
		var current_stock=product.quantity;
		var new_stock= parseInt(current_stock) - parseInt(quantity);
		var currentSellesIndex = product.selles_index
		var newSellesIndex = currentSellesIndex + 1
		await db.update("products",{quantity:new_stock,selles_index:newSellesIndex},{id:product_id});
	}
	}
	res.send({"ok":true });
});
app.post(`/update_order_statut`, async (req, res,) => { 
	var data=req.body;

	var order =await db.update("orders", data.onchange,  {id:data.id});

	res.send({"ok":true });
});

app.post(`/update_appro`, async (req, res,) => { 
	var {onchange,id} = req.body;
	await db.update("approvisionnement",onchange, {id} );

	res.send({"ok":true });
});

app.post(`/load_history`, async (req, res,) => { 
	
	let data= await db.select("*","history");
	
 	res.send({"history":data, "success":true });
});

app.post(`/add_user`, async(req , res) =>{
	var data = req.body
	let user= data.information
	// generate salt to hash password
	const salt = await bcrypt.genSalt(10);
	// now we set user password to hashed password
	user.password = await bcrypt.hash(user.password, salt);
	console.log(user.password)
	var users= await db.insert("users",user)
	res.send({"ok":true });
} )


app.post(`/loadUsers`, async (req, res,) => { 
	
	let data= await db.select("*","users");
	
 	res.send({"users":data, "success":true });
});

app.post(`/add_products`, async(req , res) =>{
	var data = req.body
	let product= data.information
	var products= await db.insert("products",product)
	res.send({"ok":true });
} )

app.post(`/load_products`, async (req, res,) => { 
	
	let data= await db.select("*","products");
	
 	res.send({"products":data, "success":true });
});

app.post(`/load_reductions`, async (req, res,) => { 
	
	let data= await db.select("*","reductions");
	
 	res.send({"reductions":data, "success":true });
});

app.post(`/load_deliveries`, async (req, res,) => { 
	
	let data= await db.select("*","deliveries");
	
 	res.send({"deliveries":data, "success":true });
});
app.post(`/load_wilaya`, async (req, res,) => { 
	
	let data= await db.select("*","wilayas");
	
 	res.send({"wilayas":data, "success":true });
});

app.post(`/load_appros`, async (req, res,) => { 
	
	let data= await db.select("*","approvisionnement"); 
	
 	res.send({"appros":data, "success":true });
});

app.post(`/load_artisans`, async (req, res,) => { 
	
	let data= await db.select("*","artisans");
	
 	res.send({"artisans":data, "success":true });
});

async function save_user(user){
	var existing_user= await db.select("*", "users",{phone_number:user.phone_number}, "row");
	if(existing_user){return existing_user;}
	return await db.insert("users", user, "last");

};


// app.get(`/product/:product_id`, async (req, res, next) => { 
// 	var id=req.params.product_id;
// 	var product=await db.select("*", "products",{id},'row');

// 	let header = readFileSync("header.html");
// 	let mes_variables=`
// 		<script>
// 			var product=${JSON.stringify(product)};
// 		</script>`;
// 	let content = readFileSync("index.html");
	
// 	res.send(header+mes_variables+content);
// }); 

// app.get(`/`, async (req, res, next) => { 
// 	let file = readFileSync("admin.html");
// 	res.send(file);
// }); 

// app.get('/', function (req, res) {  
// 	res.sendFile( __dirname + "/public/" + "index.html" );  
//  })  
// app.get('/admin', function (req, res) {  
// 	res.sendFile( __dirname + "/public/" + "admin.html" );  
//  })  



//  app.post(`/user`, async (req, res,) => { 
// 	var {user, email} = req.body; // user = data.user
// 	console.log({email, user});
//     await db.update("inscriptions", {email}, user);

// 	//  await db.update("inscriptions", {data.email:"marmage@hotmail.fr"}, {data, updated:true});
	
//  	res.send({"ok":true });
//  });


app.post(`/load_recipes`, async (req, res,) => { 
	var data=req.body;
	let recipes= await db.select("*","recipes");
	
 	res.send({"recipes":recipes, "success":true });
});

app.post(`/load_categories`, async (req, res,) => { 
	var data=req.body;
	let categories= await db.select("*","category");
	res.send({"categories":categories, "success":true });
	console.log(categories)
	
	
});

app.post(`/load_sub_categories`, async (req, res,) => { 
	var data=req.body;
	let sous_categories= await db.select("*","sub_category");
	res.send({"sous_categories":sous_categories, "success":true });
	console.log(sous_categories)
});



//! ///////////////////////////////////////////////////////////
//! //////////////////!    admin    //////////////////////////
//! ///////////////////////////////////////////////////////////


app.post('/auth', async (req, res) => {
	
	 try{
		const{username, password}=req.body;
		var user = await db.select("*","users",  {username: username});
		console.log(user);
		console.log(user[0].password);
		
			const validPass = await bcrypt.compare(password, user[0].password);
			
		
				
	 			// req.session.username = username;
				console.log(validPass)
				console.log(username)
				

				if (validPass == true) {
					
					req.session.user = user[0]
					req.session.username = username
					req.session.loggedin = true;
					res.cookie("user_id", user[0].id);
					console.log(user[0].id,'RT')
					// console.log(res.cookie,'cookies')
					res.send('ok')
					
				} 
				

	}
	catch(e) {
		console.log(e)
		res.send('/');
	}

 });

app.post(`/logOut`, async (req, res,) => { 
	
	var logOut= req.body
	
	if(logOut.stat=='true'){
		req.session.username = 'undefined'
	}
 	res.send({"success":true });
});



app.post(`/load_ads`, async (req, res,) => { 
	
	let ads= await db.select("*","ads");
	
 	res.send({"ads":ads, "success":true });
});
app.post(`/load_currentUser`, async (req, res,) => { 
	const {user_id} = req.cookies;
	console.log(req.session.loggedin,'check loggedin')
	if(req.session.loggedin ){
		console.log(req.session.user)
		res.send({"user":req.session.user });
	}else if(user_id){
		let user = await db.select("*","users", {id:user_id});
		res.send({"user":user[0] });
	}
});

app.post(`/update_ads`, async (req, res,) => { 
	var {id , ads} = req.body;
    await db.update("ads",ads, {id} );
   	res.send({"ok":true });
});

app.post(`/add_ads`, async (req, res,) => { 
  
	var data= req.body;
	var ad=data.information
	

	var ads= await db.insert("ads", ad);
	
});

app.post(`/delete_ads`, async (req, res,) => { 
	var {id}= req.body;
	console.log(id)
  
    await db.delete("ads",{id});
   	res.send({"ok":true });
});


app.post(`/delete_img`, async (req, res,) => { 
	var {product_id,imgName,images}= req.body;
	var formatted_images=JSON.stringify(images)
	await db.update("products",{images:formatted_images}, {id:product_id} );
	fs.unlinkSync(upload_dir+imgName);
   	res.send({"ok":true });
});

  app.post(`/update_item`, async (req, res,) => { 
	var {id , information} = req.body;
	await db.update("site",information, {id} );
	res.send({"ok":true });
  });

 app.post(`/create_item`, async (req, res,) => { 
	var data = req.body
	let item= data.information
	var items= await db.insert("site",item)
	res.send({"ok":true });
	
  });

app.post(`/load_items`, async (req, res,) => { 
	let items= await db.select("*","site");
	res.send({"items":items, "success":true });
  });

  app.post(`/delete_item`, async (req, res,) => { 
	var {id}= req.body;  
    await db.delete("site",{id});
   	res.send({"ok":true });
});


app.post(`/update_category`, async (req, res,) => { 
	var  data= req.body;

	var category_name=data.mainCategory.category.category_name
	var id=data.mainCategory.id
	
	var sous_categorie = data.sub_category
	
	// let sub_cat = {sub_category_name:sous_categorie.sub_category_name,id:sous_categorie.id}
	
	await db.update("category",{category_name}, {id} );

	sous_categorie.forEach( async (element)  =>  {
		let sub_category_name = element.sub_category_name 
		let sub_categories={sub_category_name:sub_category_name }
		let sous_cat = {sub_category_name:sub_category_name,id_category: id  }

		var sous_id= element.id 
		if(sous_id != undefined){
			await db.update("sub_category",sub_categories, {id:sous_id} );
		} 
		else{
			await  db.insert("sub_category",sous_cat)}
	 });
   
   	res.send({"ok":true });
});


app.post(`/update_category_status`, async (req, res,) => { 
	var {id , information} = req.body;

	await db.update("category",information, {id} );

	res.send({"ok":"create" });
  });


app.post(`/NumberWilaya`, async (req, res,) => {
	var {nom} = req.body
	var query = await db.select('code',"wilayas", {nom});

	res.send({"number":query, "success":true });
});
  
  
app.post(`/getCommunes`, async (req, res,) => { 
	var {wilaya_id} = req.body
	var query = await db.orderby('nom',"communes", {wilaya_id}, "nom");
	res.send({"commune":query, "success":true });
});

app.post(`/create_categories`, async (req, res,) => { 
  
	var data = req.body
	let category= data.information
	let category_name = {category_name:category.category_name}
	let sub_cat = data.sub_category_name
	var categories= await db.insert("category",category,"last")
	var test= await db.select("id","category",category_name);

	var string=JSON.stringify(test);
	var json =  JSON.parse(string);
	id_category = json[0].id

    sub_cat.forEach( async (element)  =>  {
		let element2= element.sub_category_name 
		let sub_categories={id_category:id_category,sub_category_name:element2}
		var subcat = await  db.insert("sub_category",sub_categories)
	});
	res.send({"ok":true });
	
});



app.post(`/delete_category`, async (req, res,) => { 
	var {id}= req.body;
	var {id_category} = req.body;
	await db.delete("sub_category",{id_category});
	await db.delete("category",{id});

	   res.send({"ok":true });
	
});

app.post(`/delete_sub_category`, async (req, res,) => { 
	var {id}= req.body;
	
    await db.delete("sub_category",{id});
	   res.send({"ok":true });
	
});




app.post(`/load_delivery_prices`, async (req, res,) => { 
	
	let delivery_price= await db.select("*","delivery_prices");
	
 	res.send({"delivery_price":delivery_price, "success":true });
});

app.post(`/update_delivery_prices`, async (req, res,) => { 
	var  {price, id}= req.body;
	
	console.log({price,id})
	
    await db.update("delivery_prices",price, id );
   	res.send({"ok":true });
});



app.post(`/delete_product`, async (req, res,) => { 
	var {id}= req.body;
	console.log(id)
  
    await db.delete("products",{id});
   	res.send({"ok":true });
});

app.post(`/load_popup`, async (req, res,) => { 
	
	let popup= await db.select("*","popup");
	
 	res.send({"popup":popup, "success":true });
});

app.post(`/update_popup`, async (req, res,) => { 
	var  {popup , id}= req.body;
  
	
    await db.update("popup",popup, id );
   	res.send({"ok":true });
});

app.post(`/create_recipe`, async (req, res,) => { 
  
	var recipe = req.body;
	  var order= await db.insert("recipes", recipe);
	
});

app.post(`/update_recipe`, async (req, res,) => { 
	var {id , recipe} = req.body;
  
    await db.update("recipes",recipe, {id} );
   	res.send({"ok":true });
});

app.post(`/delete_recipe`, async (req, res,) => { 
	var {id}= req.body;
	console.log(id)
  
    await db.delete("recipes",{id});
   	res.send({"ok":true });
});



app.post(`/create_product`, async (req, res,) => { 

	var {product} = req.body;
	  var order= await db.insert("products", product);
	res.redirect('/')
  
});

app.post(`/update_product`, async (req, res,) => { 
	var {id , product} = req.body;
    await db.update("products",product, {id} );
    var modifiedProduct=await db.select("*","products",{id});
	console.log(modifiedProduct,"mmmmmmmmmodifiéééééé")
   	res.send({"ok":true,"product":modifiedProduct });
});



app.post(`/load_users`, async (req, res,) => {

	let data= await db.select("*","users");
	res.send({"users":data, "success":true });
  
});    

app.post(`/update_users`, async (req, res,) => { 
	var {id , user} = req.body;
  	// generate salt to hash password
  	
	const salt = await bcrypt.genSalt(10);
	// now we set user password to hashed password
	user.password = await bcrypt.hash(user.password, salt);
	console.log(user.password)
    await db.update("users",user, {id} );
   	res.send({"ok":true });
});

app.post(`/delete_users`, async (req, res,) => { 
	var {id}= req.body;
	console.log(id)
  
    await db.delete("users",{id});
   	res.send({"ok":true });
});

app.post(`/add_appro`, async(req , res) =>{
	var data = req.body
	let appro= data.information
	var appros= await db.insert("approvisionnement",appro)
	res.send({"ok":true });
} )

app.post(`/delete_appros`, async (req, res,) => { 
	var {id}= req.body;
	console.log(id)
  
    await db.delete("approvisionnement",{id});
   	res.send({"ok":true });
});

app.post(`/add_reduction`, async(req , res) =>{
	var data = req.body
	let reduction= data.information
	var reductions= await db.insert("reductions",reduction)
	res.send({"ok":true });
} )

app.post(`/update_reduction`, async (req, res,) => { 
	var {id , reduction} = req.body;
  
    await db.update("reductions",reduction, {id} );
   	res.send({"ok":true });
});

app.post(`/delete_reduction`, async (req, res,) => { 
	var {id}= req.body;
	console.log(id)
  
    await db.delete("reductions",{id});
   	res.send({"ok":true });
});

app.post(`/add_delivery`, async(req , res) =>{
	var data = req.body
	let delivery= data.information
	var deliveries= await db.insert("deliveries",delivery)
	res.send({"ok":true });
} )

app.post(`/update_delivery`, async (req, res,) => { 
	var {id , delivery} = req.body;
  
    await db.update("deliveries",delivery, {id} );
   	res.send({"ok":true });
});

app.post(`/delete_delivery`, async (req, res,) => { 
	var {id}= req.body;
	console.log(id)
  
    await db.delete("deliveries",{id});
   	res.send({"ok":true });
});




app.post(`/load_orders`, async (req, res,) => {

	let data= await db.select("*","orders");
	res.send({"orders":data, "success":true });
  
});    
  
app.post(`/uploads`, upload.single('file'), (req, res, next) => {
	let file = req.file;
	
	let result = {};
	result['file_name'] = file.filename;  
	res.send(result);
	
});

// app.post(`/uploads`, upload.single('file'), async (req, res) => {
// 	let file = req.file;
// 	const { filename: image } = req.file;
      
//        await sharp(req.file.path)
//         .resize(200, 200)
//         .jpeg({ quality: 50 })
//         .toBuffer(function(err, buffer) {
// 			fs.writeFile('file.jpg', buffer, function(e) {
		
// 			});
// 		});
//         // fs.unlinkSync(req.file.path)
// 	let result = {};
// 	result['file_name'] = file.filename;  
// 	res.send(result);
	
// });


app.post(`/send_mail`, async(req , res) =>{
	var data = req.body
	var mail= data.information
	console.log(mail)
	main(mail.email, mail.objet, mail.message)
} )

// async..await is not allowed in global scope, must use a wrapper
async function main(email,objet,message) {
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	let testAccount = await nodemailer.createTestAccount();
  
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
    host: "mail.pharmalifedz.com",
    port: 465,
    secure: true,
	
	  auth: {
		user: "contact@pharmalifedz.com", // generated ethereal user
		pass: "pharmalife", // generated ethereal password
	  },
	});
  
	// send mail with defined transport object
	let info = await transporter.sendMail({
	  from: email, // sender address
	  to: "contact@pharmalifedz.com", // list of receivers
	  subject: objet, // Subject line
	  text:message, 
	  
			  
				  
	});
  
	console.log("Message sent: %s", info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
	// Preview only available when sending through an Ethereal account
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

let port = process.env.PORT;
if (port == null || port == "") {
  port = 80;
}
app.listen(port, () => console.log("running on ", port));

