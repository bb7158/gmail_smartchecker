document.addEventListener("DOMContentLoaded", function () {
    let continueBtn = document.getElementById("continue");
    let toggleDarkBtn = document.getElementById("toggle-dark");
    let popup = document.querySelector(".popup-container");

    // Button click animation
    function animateButton(button) {
        button.style.transform = "scale(0.95)";
        setTimeout(() => { button.style.transform = "scale(1)"; }, 100);
    }

    continueBtn.addEventListener("click", function () {
        animateButton(this);
        window.close();
    });

    toggleDarkBtn.addEventListener("click", function () {
        popup.classList.toggle("dark-mode");
        animateButton(this);
    });
});
