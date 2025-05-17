// verify the username, email and password input is valid or not

class Validation {
    static username(username) {
        return username && username.length >= 8;    
    }

    static email(email) {
    return email && email.includes('@');
    }

    static password(password) {
        return  password && 
                password.length >= 8 &&
                /[A-Z]/.test(password) && 
                /[a-z]/.test(password) && 
                /[0-9]/.test(password) && 
                /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    }
}

module.exports = Validation;