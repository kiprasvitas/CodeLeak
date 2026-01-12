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

chatMsgs.on('value', function(chatMsgs) {
		size = chatMsgs.numChildren();
		animateValue("repos", 0, size, 1000);
});

forumMsgs.on('value', function(chatMsgs) {
		size = chatMsgs.numChildren();
		animateValue("forums", 0, size, 1000);
});

firebase.database().ref('users').on('value', function(snapshot) {
	var size = snapshot.val().num;
	animateValue("users", 0, size, 1000);
});

function animateValue(id, start, end, duration) {
    if (start === end) return;
    var range = end - start;
    var current = start;
    var increment = end > start? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

function searchPosts() {
	var search_item = document.getElementById("search").value;
	window.location.href = "https://codeleak.dev/app?search=" + search_item;
}

function account() {
	window.location.href = "https://codeleak.dev/app?open=login";
}