var form = document.getElementById("formsubmit");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

function search() {
	var input = document.getElementById("searchinput").value;
	if (input != "") {
		window.location.href = "https://codeleak.dev/app?search=" + input;
	}
}