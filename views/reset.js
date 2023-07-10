const recoverButton = document.getElementById('reset');
const emailField = document.getElementById('email');
const passwordResetSent = document.getElementById('password-reset-sent');
const loginMessage=document.querySelector('.login-message');
recoverButton.onclick = async (e) => {
    try {
        e.preventDefault();

        const email = emailField.value;
        const data = {
            "email": email
        }
        const res = await axios.post('http://localhost:3000/password/forgotPassword', data);
        const result = res.data.success;
        console.log(result);
        if (result === true) {
            passwordResetSent.style.visibility = 'visible';
        }
    } catch(err){
        console.log(err);
    }
}

function init() {
    try {
        passwordResetSent.style.visibility = 'hidden';
        loginMessage.style.visibility='hidden';
    } catch (err) {
        throw new Error(err);
    }
}

init();