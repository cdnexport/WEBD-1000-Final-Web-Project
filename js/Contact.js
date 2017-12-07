//Initializes event listeners.
function load(){
	document.getElementById("btnSubmit").addEventListener("click",validate);
	document.getElementById("btnReset").addEventListener("click",resetForm);
	document.getElementById("txtName").focus();
}

//Freezes the form action if an error is found on the page.
function validate(e){
	if(checkErrors()){
		e.preventDefault();
	}
}

//Checks the form for input errors.
function checkErrors(){
	let forms = ["txtName","txtEmail","txtAreaComments", "txtPhone"];
	let isError = false;
	let emailRegEx = new RegExp(/^(?!.*[\._][\._@])[\da-z][\da-z\._]*@[\da-z]+\.[a-z]{2,3}$/,'i');
	let phoneRegEx = new RegExp(/^(?!.*-555-)1-\d{3}-\d{3}-\d{4}$/);

	for (var i = 0; i < forms.length; i++) {
		let element = document.getElementById(forms[i]);
		if(!element.value){
			document.getElementById(forms[i]+"Error").style.display = "inline";
			if(!isError){
				element.focus();
			}
			isError = true;
		}
		else{
			document.getElementById(forms[i]+"Error").style.display = "none";
		}
		if(element == document.getElementById("txtEmail")){
			if(validateWithRegEx(emailRegEx,element)){
				if(document.getElementById(forms[i]+"Error").style.display != "inline"){
					document.getElementById(forms[i]+"Invalid").style.display = "inline";
				}
				if(!isError){
					element.focus();
				}
				isError = true;
			}
			else{
				document.getElementById(forms[i]+"Invalid").style.display = "none";
			}
		}
		if(element == document.getElementById("txtPhone")){
			if(validateWithRegEx(phoneRegEx,element)){
				if(document.getElementById(forms[i]+"Error").style.display != "inline"){
					document.getElementById(forms[i]+"Invalid").style.display = "inline";
				}
				if(!isError){
					element.focus();
				}
				isError = true;
			}
			else{
				document.getElementById(forms[i]+"Invalid").style.display = "none";
			}
		}
	}
	return isError;
}

/* Runs the regex test. Returns true if error.
*
* param regEx The regEx that it will be tested with.
* param element The HTML element that needs to be validated.
*/
function validateWithRegEx(regEx,element){
	var errorFlag = false;
	if(!regEx.test(element.value)){		
		errorFlag = true;
	}
	return errorFlag;
}

//Resets the form to the original blank state.
function resetForm(){
	document.getElementById("txtName").value = "";
	document.getElementById("txtNameError").style.display = "none";
	document.getElementById("txtEmail").value = "";
	document.getElementById("txtEmailError").style.display = "none";
	document.getElementById("txtEmailInvalid").style.display = "none";
	document.getElementById("txtAreaComments").value = "";
	document.getElementById("txtAreaCommentsError").style.display = "none";
	document.getElementById("txtName").focus();
	document.getElementById("txtPhone").value = "";
	document.getElementById("txtPhoneError").style.display = "none";
	document.getElementById("txtPhoneInvalid").style.display = "none";
}

document.addEventListener("DOMContentLoaded",load);