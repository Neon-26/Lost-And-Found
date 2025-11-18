function resetPassword() {
    const email = document.getElementById("email").value.trim();
    const errorMsg = document.getElementById("error");
    const successMsg = document.getElementById("successMessage");

    errorMsg.textContent = "";
    successMsg.style.display = "none";

    if (!email) {
        errorMsg.textContent = "Please enter your email address.";
        return;
    }
}