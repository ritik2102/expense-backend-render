const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const emailMessage = document.querySelector('.email-message');


async function submitHandler(e) {

    try {
        e.preventDefault();

        const name = nameField.value;
        const email = emailField.value;
        const password = passwordField.value;

        const data = {
            "name": name,
            "email": email,
            "password": password
        }
        console.log(data);
        const res = await axios.post("http://localhost:3000/users/add-user", data);
        console.log(res.data.resData);
        if (res.data.resData !== "success") {
            alert("User already registered")
        }
        window.location.href = 'login.html';
    }
    catch (err) {
        console.log(err);
    }


}

function init() {
    try {
        emailMessage.style.visibility = 'hidden';
        emailField.value = "";
        passwordField.value = "";
    }
    catch(err){
        throw new Error(err);
    }
}
init();

