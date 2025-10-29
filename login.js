function togglePassword() {
        const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("error");

    const admin = { user: "admin", pass: "admin123" };
    const user = { user: "user" , pass: "user123" };

    if (username === admin.user && password === admin.pass) {
        window.location.href = "Admin_Interface/admin.html";
    }
    else if (username === user.user && password === user.pass) {
        window.location.href = "User_Interface/user.html";
    }
    else {
        errorMsg.textContent = "Invalid username or password!";
    }
}