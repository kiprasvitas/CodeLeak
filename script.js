// Initialize Firebase
var config = {
	apiKey: "AIzaSyBQ9fqNB50nKwUqeIVND5t7nrbFkJzxCso",
    authDomain: "code-leak-777f4.firebaseapp.com",
    databaseURL: "https://code-leak-777f4-default-rtdb.firebaseio.com",
    projectId: "code-leak-777f4",
    storageBucket: "code-leak-777f4.appspot.com",
    messagingSenderId: "103125803204",
    appId: "1:103125803204:web:080ab4056396fb472ce991",
    measurementId: "G-XLBR09X11D"
};
firebase.initializeApp(config);
firebase.analytics();

// Get a reference to the database service
const database = firebase.database();
const chatMsgs = firebase.database().ref().child('chat');
const forumMsgs = firebase.database().ref().child('forums');
const document_title = "Code Leak | App";

// Bind elements
const inputName = document.getElementById('input-name');
const inputPass = document.getElementById('input-pass');
const btnLogin = document.getElementById('btn-login');
const inputMsg = document.getElementById('input-message');
const inputTxt = document.getElementById('input-msg');
const btnSendMsg = document.getElementById('btn-sendMsg');
const chatWrap = document.getElementById('chat-wrap');
const pageLogin = document.getElementById('page-login');
const pageChat = document.getElementById('page-chat');
const accTxt = document.getElementById('account-txt');
const accBtn = document.getElementById('accbtn');
const upbtn = document.getElementById('upbtn');
const search = document.getElementById('search');
const searchdiv = document.getElementById('search-div');
const errorlogin = document.getElementById("error-login");
const errorverify = document.getElementById("error-verify");
const errorupload = document.getElementById("error-upload");
const errorupload2 = document.getElementById("error-upload2");
var userName = "";
var postTime = "";
var userPass = "";
const auth = firebase.auth();

function timeNow() {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	postTime = mm + '/' + dd + '/' + yyyy;
}
timeNow();


function switchPage(pagename) {
	var pages = document.querySelectorAll(".page");
	for (i = 0; i < pages.length; i++) {
		if (pages[i].getAttribute("id") == pagename) {
			pages[i].classList.remove('d-none');
		} else {
			pages[i].classList.add('d-none');
		}
	}
	
}

function openQuery() {
	var queryString = window.location.search;
	var loader = document.getElementById("block2");
	var urlParams = new URLSearchParams(queryString);
	var haveForum = urlParams.has('forum');
	var havePost = urlParams.has('post');
	var haveFunction = urlParams.has('open');
	var haveSearch = urlParams.has('search');
	var haveAuthor = urlParams.has('author');
	
	if (haveForum == true) {
		loader.style.display = "block";
		var val = urlParams.get('forum');
		var forum = val.replace("%20", " ");
		document.getElementById("back-repo").setAttribute("onclick", "reloadParams()");
		forums(10);
		window.setTimeout(function(){
			openForum(forum);
			loader.style.display = "none";
		}, 4300);
	} else if (havePost == true) {
		loader.style.display = "block";
		var val2 = urlParams.get('post');
		var post = val2.replace("%20", " ");
		document.getElementById("back-repo").setAttribute("onclick", "reloadParams()");
		window.setTimeout(function(){
			openPost(post);
			loader.style.display = "none";
		}, 3300);
	} else if (haveFunction == true) {
		var funct = urlParams.get('open');
		if (funct == "login") {
			account();
			document.getElementById("back-lgn").setAttribute("onclick", "reloadParams()");
		}
	} else if (haveSearch == true) {
		var search_item = urlParams.get('search');
		window.onload = function() {
			document.getElementById("search").value = search_item;
			searchPosts();
		}
	} else if (haveAuthor == true) {
		loader.style.display = "block";
		var auther = urlParams.get('author');
		document.getElementById("back-repo").setAttribute("onclick", "reloadParams()");
		window.setTimeout(function(){
			author(auther);
			loader.style.display = "none";
		}, 3300);
	} else {
		console.log("no parameters");
	}
}

function account() {
	switchPage('page-login');
}

function home() {
	switchPage('page-chat');
}

function privacy() {
	firebase.database().ref('policy').once('value', function(snapshot) {
		var content = snapshot.val();
		document.getElementById("policy").innerHTML = content;
	});
	switchPage('page-privacy');
}

function reloadParams() {
	history.replaceState(null, "", location.href.split("?")[0]);
	window.location.reload();
}

function reload() {
	history.replaceState(null, "", location.href.split("?")[0]);
	window.location.reload();
}

function upload() {
	switchPage('page-upload');
}

function post() {
	switchPage('page-forum');
}

function init() {
	getName();
	fireListen(10);
	openQuery();
}

document.getElementById("postFile").addEventListener('change', function(evt) {
	var name = document.getElementById('postFile');
	var label = document.getElementById('label-file');
	var filename = document.getElementById('file-name');
	filename.innerHTML = name.files.item(0).name;
	filename.style.display = "block";
	label.innerHTML = "Change";
	var output = document.getElementById('output');
	output.style.display = "block";
	var source = URL.createObjectURL(evt.target.files[0]);
    output.src = source;
    output.onload = function() {
      URL.revokeObjectURL(output.src) // free memory
    }
})

document.getElementById("postFile2").addEventListener('change', function(evt) {
	var name = document.getElementById('postFile2');
	var label = document.getElementById('label-file2');
	var filename = document.getElementById('file-name2');
	filename.innerHTML = name.files.item(0).name;
	filename.style.display = "block";
	label.innerHTML = "Change";
	var output = document.getElementById('output2');
	output.style.display = "block";
	var source = URL.createObjectURL(evt.target.files[0]);
    output.src = source;
    output.onload = function() {
      URL.revokeObjectURL(output.src) // free memory
    }
})

var codefiles = [];

document.getElementById("postCode").addEventListener('change', function(evt) {
	codefiles = [];
	var name = document.getElementById('postCode');
	var label = document.getElementById('label-code');
	var filename = document.getElementById('file-code');
	if (name.files.length < 2) {
		filename.innerHTML = name.files.item(0).name;
	} else {
		filename.innerHTML = name.files.length + " files";
	}
	filename.style.display = "block";
	label.innerHTML = "Change";
	for (var x = 0; x < name.files.length; x++) {
		placeFileContent(name.files[x]);
	}
	console.log(codefiles);
})

//Read file
function placeFileContent(file) {
	readFileContent(file).then(content => {
  	//codefiles.push(content);
	codefiles.push({
		key:   file.name,
		value: content
	});
  }).catch(error => console.log(error))
}

function readFileContent(file) {
	const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = evt => resolve(evt.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}

function random() {
	let random_name_int = Math.floor(100000000 + Math.random() * 900000000);
	let random_name = random_name_int.toString();
	return random_name;
}


var loggedin = false;
var currentname = "";

// Look for user name in local storage
function getName() {
	firebase.auth().onAuthStateChanged(user => {
	  if (user) {
		  var isVerified = firebase.auth().currentUser.emailVerified;
		  if (isVerified == true) {
				loggedin = true;
				let userEmail = firebase.auth().currentUser.email;
				var username = userEmail.substring(0, userEmail.indexOf("@"));
				setStatus(loggedin);
				setUsername(username);
			  
				switchPage('page-chat');
				accTxt.innerHTML = "Logout";
				accBtn.setAttribute("onclick", "logout()");
				upbtn.style.display = "";
				searchdiv.setAttribute("style", "margin-left: 23%;");
		  } else {
				switchPage('page-verify');
		  }
	  }
	  if (!user) {
		  loggedin = false;
		  setStatus("none", loggedin);
		  upbtn.style.display = "none";
		  accTxt.innerHTML = "Login / Sign up";
		  accBtn.setAttribute("onclick", "account()");
		  searchdiv.setAttribute("style", "margin-left: 32%;");
	  }
	})
}

function setStatus(log) {
	loggedin = log;
}

function setUsername(user) {
	if (user != "none") {
		currentname = user;
	}
}

function addUser() {
	firebase.database().ref('users').once('value', function(snapshot) {
		var val = snapshot.val().num;
		var num = val + 1;
		firebase.database().ref('users').set({num});
	});
}

function verify() {
	var user = firebase.auth().currentUser;
	user.sendEmailVerification().then(function() {
		errorverify.style.display = "block";
		errorverify.innerHTML = "Please check your email for verification";
		addUser();
	}).catch(function(error) {
		errorverify.style.display = "block";
		errorverify.innerHTML = "Something went wrong";
	});
}

// Login for new user
function login() {
	if (inputName.value && inputPass.value) {
	  userName = inputName.value;
	  userPass = inputPass.value;
	  auth.signInWithEmailAndPassword(userName, userPass).catch(function(error){
		var errorCode = error.code;
		var errorMessage = error.message;
		var res = errorMessage.replace(error.message, "This account is not valid.");
		errorlogin.style.display = "block";
		errorlogin.innerHTML = res;
	  });
	  firebase.auth().onAuthStateChanged(user => {
	  if (user) {
		  switchPage('page-chat');
		  upbtn.style.display = "";
		  reload();
	  }
	  })
	} else {
	  if (userName == '' || userPass == ''){
			errorlogin.style.display = "block";
			errorlogin.innerHTML = "Please fill out field.";
		}
	}
}

function forgot() {
	var inputEmail = document.getElementById('input-name');
	if (inputEmail.value) {
	  var emailAddress = inputEmail.value;
	  auth.sendPasswordResetEmail(emailAddress)
	  .then(function() {
		errorlogin.style.display = "block";
		errorlogin.innerHTML = "Please check your email.";
	  })
	  .catch(function(error){
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log(errorMessage);
		var res = errorMessage.replace(error.message, "This email is not registered");
		errorlogin.style.display = "block";
		errorlogin.innerHTML = res;
	  });
	} else {
		errorlogin.style.display = "block";
		errorlogin.innerHTML = "Please include an email.";
	}
}

function signup() {
	if (inputName.value && inputPass.value) {
		userName = inputName.value;
		userPass = inputPass.value;
		auth.createUserWithEmailAndPassword(userName, userPass).catch(function(error){
			var errorCode = error.code;
			var errorMessage = error.message;
			var res = errorMessage
			errorlogin.style.display = "block";
			errorlogin.innerHTML = res;
		});
	} else {
	  if (userName == '' || userPass == ''){
			errorlogin.style.display = "block";
			errorlogin.innerHTML = "Please fill out field.";
		}
	}
}

var init_lim = 0;

// Get chat message from database & listen to update
function fireListen(lim) {
	var loader = document.getElementById("mainload");
	var displayMsgs = document.getElementById("postcollection");
	displayMsgs.innerHTML = "";
	var index = 0;
	var size = 0;
	var showmore = document.getElementById('showmore');
	if (showmore != null) {
		showmore.remove();
	}
	var limit = init_lim + lim;
	init_lim = limit;
	chatMsgs.on('value', function(chatMsgs) {
		size = chatMsgs.numChildren();
	  chatMsgs.forEach(function(chatMsg) {
		if (index < limit) {
			var id = chatMsg.key;
			var description = chatMsg.val().message;
			var sender = chatMsg.val().sender;
			var time = chatMsg.val().time;
			var code = chatMsg.val().code;
			var title = chatMsg.val().name;
			var image = chatMsg.val().image;
			var views = chatMsg.val().views;
			var likes = chatMsg.val().likes;
			
			var displayMsg = 
			`
			<div class="card message" >
				<div class="img-post" style="background-image: url('`+image+`');"></div><h6 onclick="openPost(this.innerText)" class="title-post">`+title+`</h6>
				<div class="description">`+description+`</div>
				<h6 onclick="author('`+sender+`')" class="author">`+sender+` &nbsp &nbsp<span class="date">`+time+`</span>&nbsp &nbsp<span class="date">`+views+` views</span></h6>
				<div onclick="like(this, `+likes+`, 'chat')" id="like`+id+`" class="like fa fa-heart-o"><span class="tooltiptext">`+likes+`</span></div>
			</div>
			`
			
			displayMsgs.innerHTML += displayMsg;
			if (loggedin == true) {
				checkLike(id);
			}
			index += 1;
		}
	  });
	  
	  if (loader != null) {
		  loader.remove();
	  }
	  index = limit;
	  
	  if (index == limit && limit < size) {
		  document.getElementById('page-chat').innerHTML += "<a onclick='fireListen(10);' id='showmore'>Show more</a>";
	  }
	  var numpost = chatMsgs.exists();
	  var isthere = document.getElementById('noposts');
	  if (numpost == false && isthere == null) {
		document.getElementById('postcollection').innerHTML = "";
		document.getElementById('chat-wrap').style.height = "400px";
		document.getElementById('chat-wrap').innerHTML += "<h5 id='noposts2' class='center' >Error 404: There are no leaks yet.</h5>";
	  }
	});
}

function like(x, likes, type) {
	if (loggedin == true) {
		if (x.classList == "like fa fa-heart") {
			x.classList = "like fa fa-heart-o";
		} else {
			x.classList = "like fa fa-heart";
		}
		
		var id_unparsed = x.id;
		var id = id_unparsed.slice(4);
		var user = firebase.auth().currentUser;
		var likes = likes;
		
		firebase.database().ref('likes/' + id + user.uid).once('value', function(snapshot) {
			
			if (snapshot.exists() == true) {
				//remove like if already liked
				firebase.database().ref('likes/' + id + user.uid).remove();
				var likenum = likes - 1;
				firebase.database().ref(type + '/' + id).update({likes: likenum});
				document.getElementById("like" + id).innerHTML = `<span class="tooltiptext">`+likenum+`</span>`;
				document.getElementById("like" + id).setAttribute("onclick", "like(this, "+likenum+", '"+type+"')");
			} else {
				//push a new like if not liked
				firebase.database().ref('likes/' + id + user.uid).set({liked: "true"});
				var likenum = likes + 1;
				firebase.database().ref(type + '/' + id).update({likes: likenum});
				document.getElementById("like" + id).innerHTML = `<span class="tooltiptext">`+likenum+`</span>`;
				document.getElementById("like" + id).setAttribute("onclick", "like(this, "+likenum+", '"+type+"')");
			}
		});
	} else {
		var id_unparsed = x.id;
		var id = id_unparsed.slice(4);
		document.getElementById("like" + id).setAttribute("onclick", "account()");
	}
}

function checkLike(id) {
	var user = firebase.auth().currentUser;
	
	firebase.database().ref('likes/' + id + user.uid).once('value', function(snapshot) {
		
		if (snapshot.exists() == true) {
			try {
				document.getElementById("like" + id).classList = "like fa fa-heart";
			}
			catch {
				console.log("can't find liked post");
			}
		} else {
			try {
				document.getElementById("like" + id).classList = "like fa fa-heart-o";
			}
			catch {
				console.log("can't find liked post");
			}
		}
	});
}

var init_lim2 = 0;

function forums(lim) {
	document.getElementById("upbtn").innerHTML = "Upload a Post";
	document.getElementById("upbtn").setAttribute("onclick", "post()");
	document.getElementsByClassName("navbtnleft")[0].setAttribute("id", "nonselected");
	document.getElementsByClassName("navbtnright")[0].setAttribute("id", "selected");
	var loader = document.getElementById("mainload");
	var displayMsgs = document.getElementById("postcollection");
	displayMsgs.innerHTML = "";
	var index = 0;
	var size = 0;
	var showmore = document.getElementById('showmore');
	if (showmore != null) {
		showmore.remove();
	}
	var limit = init_lim2 + lim;
	init_lim2 = limit;
	forumMsgs.on('value', function(forumMsgs) {
		size = forumMsgs.numChildren();
	  forumMsgs.forEach(function(chatMsg) {
		if (index < limit) {
			var id = chatMsg.key;
			var description = chatMsg.val().message;
			var sender = chatMsg.val().sender;
			var time = chatMsg.val().time;
			var code = chatMsg.val().code;
			var title = chatMsg.val().name;
			var image = chatMsg.val().image;
			var views = chatMsg.val().views;
			var likes = chatMsg.val().likes;
			
			var displayMsg = 
			`
			<div class="card message" >
				<div class="img-post" style="background-image: url('`+image+`');"></div><h6 onclick="openForum(this.innerText)" class="title-post">`+title+`</h6>
				<div class="description">`+description+`</div>
				<h6 onclick="author('`+sender+`')" class="author">`+sender+` &nbsp &nbsp<span class="date">`+time+`</span>&nbsp &nbsp<span class="date">`+views+` views</span></h6>
				<div onclick="like(this, `+likes+`, 'forums')" id="like`+id+`" class="like fa fa-heart-o"><span class="tooltiptext">`+likes+`</span></div>
			</div>
			`
			
			displayMsgs.innerHTML += displayMsg;
			if (loggedin == true) {
				checkLike(id);
			}
			index += 1;
		}
	  });
	  
	  if (loader != null) {
		  loader.remove();
	  }
	  index = limit;
	  
	  if (index == limit && limit < size) {
		  document.getElementById('page-chat').innerHTML += "<a onclick='forums(10);' id='showmore'>Show more</a>";
	  }
	  var numpost = forumMsgs.exists();
	  var isthere = document.getElementById('noposts');
	  var isthere2 = document.getElementById('noposts2');
	  if (isthere2 != null) {
			document.getElementById('noposts2').remove();
	  }
	  if (numpost == false && isthere == null) {
		document.getElementById('postcollection').innerHTML = "";
		document.getElementById('chat-wrap').style.height = "400px";
		document.getElementById('chat-wrap').innerHTML += "<h5 id='noposts' class='center' >Error 404: There are no forums yet.</h5>";
	  }
	});
}

var openposts = false;

function author(title1) {
	openposts = false;
	document.getElementById("repo-page").innerHTML = "";
	switchPage('page-repository');
	
	var description = "";
	var sender = "";
	var time = "";
	var title = "";
	var image = "";
	var size = "";
	var views = "";
	var userid = "";
	
	document.title = "Code Leak | " + title1;
	chatMsgs.orderByChild('sender').equalTo(title1).on("value", function(snapshot) {
		if (snapshot.exists() == true) {
			size = snapshot.numChildren();
			snapshot.forEach(function(data) {
				userid = data.val().senderid;
				description = data.val().message;
				sender = data.val().sender;
				time = data.val().time;
				title = data.val().name;
				image = data.val().image;
				views = data.val().views;
				
				var displayRepo = 
					`
					<div id="author" class="card message" >
						<div class="img-post" style="background-image: url('`+image+`');"></div><h6 id="author-title" onclick="openPost(this.innerText)" class="title-post">`+title+`</h6>
						<div class="description">`+description+`</div>
						<h6 class="author">`+sender+` &nbsp &nbsp<span class="date">`+time+`</span>&nbsp &nbsp<span class="date">`+views+` views</span></h6>
					</div>
					`
				if (openposts != true) {
					document.getElementById('repo-page').innerHTML += displayRepo;
				}
				
				if (loggedin == true) {
					checkFollow(userid);
				}
			});
		} else {
			document.title = "Code Leak | Nothing Found";
			document.getElementById("block").style.display = "block";
		}
	});
	
	document.getElementById('repo-name').innerHTML = title1 + `<a title="recieve notifications on posts" onclick="follow('`+userid+`');" id="followbtn">Follow User</a>` + "<br><p id='author-posts'>"+size+" posts <span id='followercnt'>0 followers</span></p>";
	
	var user = firebase.auth().currentUser;
		
	firebase.database().ref('follows/').orderByChild('follow').equalTo(userid).on("value", function(snapshot) {
		var followers = snapshot.numChildren();
		document.getElementById("followercnt").innerHTML = followers + " followers";
	});
	
	if (size == 0 && openposts != true) {
		document.getElementById('repo-page').innerHTML += "<h5 id='noposts' class='center' >This author has no posts</h5>";
	}
	
	document.getElementById("back-repo").addEventListener('click', function(event) {
		document.getElementById("repo-page").innerHTML = "";
		document.title = document_title;
	});
}

function follow(uid) {
	if (loggedin == true) {
		var x = document.getElementById("followbtn");
		if (x.innerHTML == "Unfollow") {
			x.innerHTML = "Follow User";
		} else {
			x.innerHTML = "Unfollow";
		}
		
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('follows/' + uid + user.uid).once('value', function(snapshot) {
			
			if (snapshot.exists() == true) {
				//remove follow if already followed
				firebase.database().ref('follows/' + uid + user.uid).remove();
			} else {
				//push a new follow if not followed
				firebase.database().ref('follows/' + uid + user.uid).set({follow: uid});
			}
		});
	} else {
		document.getElementById("followbtn").setAttribute("onclick", "account()");
	}
}

function checkFollow(followid) {
	var user = firebase.auth().currentUser;
	
	firebase.database().ref('follows/' + followid + user.uid).once('value', function(snapshot) {
		
		if (snapshot.exists() == true) {
			try {
				document.getElementById("followbtn").innerHTML = "Unfollow";
			}
			catch {
				console.log("can't find follower");
			}
		} else {
			try {
				document.getElementById("followbtn").innerHTML = "Follow User";
			}
			catch {
				console.log("can't find follower");
			}
		}
	});
}

function openPost(title1) {
	document.getElementById("repo-page").innerHTML = "";
	openposts = true;
	var id = "";
	var description = "";
	var sender = "";
	var time = "";
	var code = "";
	var title = "";
	var image = "";
	var looks = 0;
	var isexist = false;
	document.title = "Code Leak | " + title1;
	chatMsgs.orderByChild('name').equalTo(title1).on("value", function(snapshot) {
		if (snapshot.exists() == true) {
			isexist = true;
			snapshot.forEach(function(data) {
				id = data.key;
				description = data.val().message;
				sender = data.val().sender;
				time = data.val().time;
				code = data.val().code;
				title = data.val().name;
				image = data.val().image;
				looks = data.val().views;
			});
		} else {
			document.getElementById("block").style.display = "block";
			document.title = "Code Leak | Nothing Found";
		}
	});
	looks += 1;
	if (loggedin == true && isexist == true) {
		firebase.database().ref('chat/' + id).update({
			views: looks
		});
	}
	
	switchPage('page-repository');
	
	var displayRepo = 
		`
		<div id="repository" class="card message" >
			<div class="img-repo" style="background-image: url('`+image+`');"></div><h6 onclick="author(this.innerText)" class="title-post">`+sender+`</h6>
			<button class="btn1 btn-primary" name="`+id+`" id="downloadbtn" onclick="download(this.name)"><i class="fa fa-download" aria-hidden="true"></i>&nbsp Download Code</button>
			<h6 class="repo-info">`+time+` &nbsp &nbsp<span class="date">Repository</span>&nbsp &nbsp<span class="date">`+looks+` views</span></h6>
			<br class="breakpost"><br class="breakpost">
			<div id="code-list"></div><br class="breakpost" ><br>
			<p id="repo-descrip">`+description+`</p><br>
			<p>Hot tip: Type a '#' before a line to code format it!</p>
			<div id="chats">
				
			</div>
			<div id="chat-div" >
			  <input class="form-control mb-2" id="chat-input" placeholder="Say something..."/><button name="`+id+`" onclick="chat(this.name, '`+currentname+`', 'chat')" class="btn2 btn-primary" id="chatbtn"><i class="fa fa-paper-plane"></i></button>
			</div>
		</div>
		`
	
	var post_title = title1.replace(/ /g, '%20');
	var link = "https://codeleak.dev/app?post=" + post_title;
	document.getElementById('repo-name').innerHTML = title1 + `<a id="copylink">Copy Link</a><input value="`+link+`" type="text" id="postlink"/>`;
	document.getElementById('repo-page').innerHTML = displayRepo;
	
	for (var i = 0; i < code.length; i++) {
		if (i < 6) {
			var name = code[i].key;
			var type = "text/plain;charset=utf-8";
			var data = code[i].value;
			document.getElementById("code-list").innerHTML += `<a index="`+i+`" name="`+id+`" onclick="downloadSpecific(this.name, this.getAttribute('index'))" class="repo-codelist">`+name+`</a>`;
		}
	}
	
	firebase.database().ref('chat/' + id + '/chat').on("value", function(snapshot) {
		document.getElementById("chats").innerHTML = "";
		document.getElementById("chat-input").value = "";
		snapshot.forEach(function(data) {
			var message = data.val().message;
			var sender = data.val().sender;
			if (message.slice(0, 1) == "#") {
				var msg = message.slice(1);
				document.getElementById("chats").innerHTML += `<div id="chatmsg2"><a onclick="author('`+sender+`')" id="chatauthor">`+sender+`:</a> <input id="code" value="`+msg+`" readonly/></div>`;
			} else {
				document.getElementById("chats").innerHTML += `<div id="chatmsg"><a onclick="author('`+sender+`')" id="chatauthor">`+sender+`:</a> <input id="chatmsgformat" value="`+message+`" readonly/></div>`;
			}
		});
	});
	
	var input = document.getElementById("chat-input");
	input.addEventListener("keyup", function(event) {
	  if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("chatbtn").click();
	  }
	});
	
	document.getElementById("back-repo").addEventListener('click', function(event) {
		input.removeEventListener("keyup", event);
		document.getElementById("repo-page").innerHTML = "";
		document.title = document_title;
	});
	
	document.getElementById("copylink").addEventListener('click', function(event) {
		var text = document.getElementById("postlink");
		text.select();
		document.execCommand("copy");
	});
	
	if (loggedin != true) {
		document.getElementById("chat-div").remove();
		document.getElementById("repository").innerHTML += `<p class="mustlogin">You must be logged in to comment</p>`;
	}
}

function openForum(title1) {
	openposts = true;
	document.getElementById("repo-page").innerHTML = "";
	var id = "";
	var description = "";
	var sender = "";
	var time = "";
	var title = "";
	var image = "";
	var looks = 0;
	var isexist = false;
	document.title = "Code Leak | " + title1;
	forumMsgs.orderByChild('name').equalTo(title1).on("value", function(snapshot) {
		if (snapshot.exists() == true) {
			isexist = true;
			snapshot.forEach(function(data) {
				id = data.key;
				description = data.val().message;
				sender = data.val().sender;
				time = data.val().time;
				title = data.val().name;
				image = data.val().image;
				looks = data.val().views;
			});
		} else {
			document.getElementById("block").style.display = "block";
			document.title = "Code Leak | Nothing Found";
		}
	});
	looks += 1;
	if (loggedin == true && isexist == true) {
		firebase.database().ref('forums/' + id).update({
			views: looks
		});
	}
	
	switchPage('page-repository');
	
	var displayRepo = 
		`
		<div id="forumpost" class="card message" >
			<div class="img-repo" style="background-image: url('`+image+`');"></div><h6 onclick="author(this.innerText)" class="title-post">`+sender+`</h6>
			<h6 class="repo-info">`+time+` &nbsp &nbsp<span class="date">Forum</span>&nbsp &nbsp<span class="date">`+looks+` views</span></h6>
			<br><br>
			<p id="repo-descrip">`+description+`</p><br>
			<p>Hot tip: Type a '#' before a line to code format it!</p>
			<div id="chats">
				
			</div>
			<div id="chat-div" >
			  <input class="form-control mb-2" id="chat-input" placeholder="Say something..."/><button name="`+id+`" onclick="chat(this.name, '`+currentname+`', 'forums')" class="btn2 btn-primary" id="chatbtn"><i class="fa fa-paper-plane"></i></button>
			</div>
		</div>
		`
	
	var post_title = title1.replace(/ /g, '%20');
	var link = "https://codeleak.dev/app?forum=" + post_title;
	document.getElementById('repo-name').innerHTML = title1 + `<a id="copylink">Copy Link</a><input value="`+link+`" type="text" id="postlink"/>`;
	document.getElementById('repo-page').innerHTML = displayRepo;
	
	firebase.database().ref('forums/' + id + '/chat').on("value", function(snapshot) {
		try {
			document.getElementById("chats").innerHTML = "";
			document.getElementById("chat-input").value = "";
		}
		catch {
		}
		
		snapshot.forEach(function(data) {
			var message = data.val().message;
			var sender = data.val().sender;
			if (message.slice(0, 1) == "#") {
				var msg = message.slice(1);
				document.getElementById("chats").innerHTML += `<div id="chatmsg2"><a onclick="author('`+sender+`')" id="chatauthor">`+sender+`:</a> <input id="code" value="`+msg+`" readonly/></div>`;
			} else {
				document.getElementById("chats").innerHTML += `<div id="chatmsg"><a onclick="author('`+sender+`')" id="chatauthor">`+sender+`:</a> <input id="chatmsgformat" value="`+message+`" readonly/></div>`;
			}
		});
	});
	
	var input = document.getElementById("chat-input");
	input.addEventListener("keyup", function(event) {
	  if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("chatbtn").click();
	  }
	});
	
	document.getElementById("back-repo").addEventListener('click', function(event) {
		document.getElementById("upbtn").innerHTML = "Upload a Post";
		document.getElementById("upbtn").setAttribute("onclick", "post()");
		input.removeEventListener("keyup", event);
		document.getElementById("repo-page").innerHTML = "";
		document.title = document_title;
	});
	
	document.getElementById("copylink").addEventListener('click', function(event) {
		var text = document.getElementById("postlink");
		text.select();
		document.execCommand("copy");
	});
	
	if (loggedin != true) {
		document.getElementById("chat-div").remove();
		document.getElementById("forumpost").innerHTML += `<p class="mustlogin" >You must be logged in to comment</p>`;
	}
}

function chat(id, sender, where) {
	var message = document.getElementById("chat-input").value;
	var author = sender;
	
	if (message != "") {
		if (where == "forums") {
			firebase.database().ref('forums/' + id).child("chat").push({
				message: message,
				sender: author
			});
		} else {
			firebase.database().ref('chat/' + id).child("chat").push({
				message: message,
				sender: author
			});
		}
	}
}

function download(id) {
	var code = "";
	firebase.database().ref('chat/' + id).on('value', (snapshot) => {
		code = snapshot.val().code;
	});
	
	for (var i = 0; i < code.length; i++) {
		var name = code[i].key;
		var type = "text/plain;charset=utf-8";
		var data = code[i].value;
		downloader(data, name, type);
	}
}

function downloadSpecific(id, index) {
	var code = "";
	firebase.database().ref('chat/' + id).on('value', (snapshot) => {
		code = snapshot.val().code;
	});
	
	for (var i = 0; i < code.length; i++) {
		if (i == index) {
			var name = code[i].key;
			var type = "text/plain;charset=utf-8";
			var data = code[i].value;
			downloader(data, name, type);
		}
	}
}

function downloader(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

// Scroll to bottom
function scrollBtm() {
	window.scrollTo(0,document.body.scrollHeight);
}

function logout() {
	firebase.auth().signOut();
	window.setTimeout(function() {
		reload();
	}, 500);
}

var imageURL = "";

function leak() {
	var title = document.getElementById("nameofcode").value;
	var description = document.getElementById("description").value;
	document.getElementById('uploadbtn').innerHTML = "<i id='loading' class='fa fa-refresh fa-spin'></i>Uploading";
	var loader = document.getElementById("loading");
	loader.style.display = "inline-block";
	var user = firebase.auth().currentUser;
	var userid = user.uid;
	
	if (currentname != "" && title != "" && description != "" && postTime != "" && userid != null) {
		var random_name = random();
		let storageRef = firebase.storage().ref("q" + random_name);
		let fileupload = document.getElementById("postFile");
		let filelabel = document.getElementById("label-file");
		let imageURL = "";
		let firstFile = fileupload.files[0]; // upload the first file only
		let filesize = Math.round((firstFile.size / 1024));
		
		if (firstFile != null && filesize < 2448) {
			let uploadTask = storageRef.put(firstFile).then(function(snapshot){
			storageRef.getDownloadURL().then(function(downloadURL) {
				console.log('success! your image has been uploaded!');
				imageURL = downloadURL;
				console.log('imageURL:', imageURL);
				setImageUrl(imageURL);
			});
			});
		} else {
			loader.style.display = "none";
			document.getElementById('uploadbtn').innerHTML = "<i id='loading' class='fa fa-refresh fa-spin'></i>Leak It!";
			errorupload.style.display = "block";
			errorupload.innerHTML = "Please upload an image less than 3mb";
		}
		
		
		
		window.setTimeout(function() {
			if (imageURL != "" && codefiles != "") {
				//Compiling it
				firebase.database().ref('chat/').push({
				  senderid: userid,
				  sender: currentname,
				  name: title,
				  message: description,
				  time: postTime,
				  image: imageURL,
				  code: codefiles,
				  views: 0,
				  likes: 0
				});
				loader.style.display = "none";
				var done = true;
				document.getElementById('uploadbtn').innerHTML = "<i id='loading' class='fa fa-refresh fa-spin'></i>Leak It!";
				if (done == true) {
					window.location.reload();
				}
			} else {
				loader.style.display = "none";
				document.getElementById('uploadbtn').innerHTML = "<i id='loading' class='fa fa-refresh fa-spin'></i>Leak It!";
				errorupload.style.display = "block";
				errorupload.innerHTML = "Please fill form";
			}
		}, 4500);
		
	} else {
		loader.style.display = "none";
		document.getElementById('uploadbtn').innerHTML = "<i id='loading' class='fa fa-refresh fa-spin'></i>Leak It!";
		errorupload.style.display = "block";
		errorupload.innerHTML = "Please fill form.";
	}
}

function setImageUrl(url) {
	imageURL = url;
}

function postForum() {
	var title = document.getElementById("nameofforum").value;
	var description = document.getElementById("description2").value;
	document.getElementById('uploadbtn2').innerHTML = "<i id='loading2' class='fa fa-refresh fa-spin'></i>Uploading";
	var loader = document.getElementById("loading2");
	loader.style.display = "inline-block";
	
	if (currentname != "" && title != "" && description != "" && postTime != "") {
		var random_name = random();
		let storageRef = firebase.storage().ref("q" + random_name);
		let fileupload = document.getElementById("postFile2");
		let filelabel = document.getElementById("label-file2");
		let imageURL = "";
		let firstFile = fileupload.files[0]; // upload the first file only
		let filesize = Math.round((firstFile.size / 1024));
		
		if (firstFile != null && filesize < 2448) {
			let uploadTask = storageRef.put(firstFile).then(function(snapshot){
			storageRef.getDownloadURL().then(function(downloadURL) {
				console.log('success! your image has been uploaded!');
				imageURL = downloadURL;
				console.log('imageURL:', imageURL);
				setImageUrl(imageURL);
			});
			});
		} else {
			loader.style.display = "none";
			document.getElementById('uploadbtn2').innerHTML = "<i id='loading' class='fa fa-refresh fa-spin'></i>Leak It!";
			errorupload2.style.display = "block";
			errorupload2.innerHTML = "Please upload an image less than 3mb";
		}
		
		
		
		window.setTimeout(function() {
			if (imageURL != "") {
				//Compiling it
				firebase.database().ref('forums/').push({
				  sender: currentname,
				  name: title,
				  message: description,
				  time: postTime,
				  image: imageURL,
				  views: 0,
				  likes: 0
				});
				loader.style.display = "none";
				var done = true;
				document.getElementById('uploadbtn2').innerHTML = "<i id='loading2' class='fa fa-refresh fa-spin'></i>Post It!";
				if (done == true) {
					window.location.reload();
				}
			} else {
				loader.style.display = "none";
				document.getElementById('uploadbtn2').innerHTML = "<i id='loading2' class='fa fa-refresh fa-spin'></i>Post It!";
				errorupload2.style.display = "block";
				errorupload2.innerHTML = "Please fill form";
			}
		}, 4500);
		
	} else {
		loader.style.display = "none";
		document.getElementById('uploadbtn2').innerHTML = "<i id='loading2' class='fa fa-refresh fa-spin'></i>Post It!";
		errorupload2.style.display = "block";
		errorupload2.innerHTML = "Please fill form.";
	}
}

document.getElementById("search").addEventListener("change", function() {
	searchPosts();
});

function openForumByLink(title) {
	history.replaceState(null, "", location.href.split("?")[0]);
	var locate = window.location.href;
	window.location.href = locate + "?forum=" + title.replace(/ /g, '%20');;
}

function searchPosts() {
	document.getElementById('chat-wrap').innerHTML = "";
	var queryText = document.getElementById("search").value;
	document.title = "Code Leak | Search results for '" + queryText + "'";
	var nothingfound = 0;
	chatMsgs.orderByChild('name').startAt(queryText).endAt(queryText+"\uf8ff").once('value', function(snapshot) {
		if (snapshot.exists() != true) {
			nothingfound += 1;
		}
		
		snapshot.forEach(function(childSnapshot) {
			var image = childSnapshot.val().image;
			var description = childSnapshot.val().message;
			var sender = childSnapshot.val().sender;
			var time = childSnapshot.val().time;
			var title = childSnapshot.val().name;
			var views = childSnapshot.val().views;
			
			if (queryText == "") {
				window.location.reload();
			}
			
			var displayMsg = 
			`
			<div class="card message" >
				<div class="img-post" style="background-image: url('`+image+`');"></div><h6 onclick="openPost(this.innerText)" class="title-post">`+title+`</h6><a class="badgesearch">Repository</a>
				<div class="description">`+description+`</div>
				<h6 onclick="author('`+sender+`')" class="author">`+sender+` &nbsp &nbsp<span class="date">`+time+`</span>&nbsp &nbsp<span class="date">`+views+` views</span></h6>
			</div>
			`
			
			document.getElementById('chat-wrap').innerHTML += displayMsg;
		});
	});
	forumMsgs.orderByChild('name').startAt(queryText).endAt(queryText+"\uf8ff").once('value', function(snapshot) {
		if (snapshot.exists() != true) {
			nothingfound += 1;
		}
		
		if (nothingfound == 2) {
			document.getElementById('chat-wrap').style.height = "400px";
			document.getElementById('chat-wrap').innerHTML = "<h5 id='noposts' class='center' >No Results</h5>";
		}
		
		snapshot.forEach(function(childSnapshot) {
			var id = childSnapshot.key;
			var image = childSnapshot.val().image;
			var description = childSnapshot.val().message;
			var sender = childSnapshot.val().sender;
			var time = childSnapshot.val().time;
			var title = childSnapshot.val().name;
			var views = childSnapshot.val().views;
			
			if (queryText == "") {
				window.location.reload();
			}
			
			var displayMsg = 
			`
			<div id='`+id+`' class="card message" >
				<div class="img-post" style="background-image: url('`+image+`');"></div><h6 onclick="openForumByLink(this.innerHTML);" class="title-post">`+title+`</h6><a class="badgesearch">Forum</a>
				<div class="description">`+description+`</div>
				<h6 onclick="author('`+sender+`')" class="author">`+sender+` &nbsp &nbsp<span class="date">`+time+`</span>&nbsp &nbsp<span class="date">`+views+` views</span></h6>
			</div>
			`
			if (document.getElementById(id) == null) {
				document.getElementById('chat-wrap').innerHTML += displayMsg;
			}
		});
	});
}

init();