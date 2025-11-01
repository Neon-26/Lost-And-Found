function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("error");

    const admin = { user: "admin", pass: "admin123" };
    const admin1 = { user: "Jericho", pass: "lejano26" };
    const user = { user: "user", pass: "user123" };
    const user1 = { user: "Charles", pass: "gaviola" };

    if ((username === admin.user && password === admin.pass) || (username === admin1.user && password === admin1.pass)) {
        sessionStorage.setItem('adminUsername', username); 
        window.location.href = "Admin_Interface/admin.html";
    } else if ((username === user.user && password === user.pass) || (username === user1.user && password === user1.pass)) {
        sessionStorage.setItem('userUsername', username); 
        window.location.href = "User_Interface/user.html";
    } else {
        errorMsg.textContent = "Invalid username or password!";
    }
}