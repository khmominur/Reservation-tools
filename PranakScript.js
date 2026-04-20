// redirect to prank html

// function calculateFare() {
//     document.body.style.opacity = "0.5"; // fade effect
//     setTimeout(() => {
//         window.location.href = "prank.html";
//     }, 300);
// }




// prank (Random Position)
    const btn = document.getElementById("runBtn");

btn.addEventListener("mouseover", () => {
    btn.style.position = "absolute";

    // random position (screen এর ভিতরে)
    const x = Math.random() * (window.innerWidth - btn.offsetWidth);
    const y = Math.random() * (window.innerHeight - btn.offsetHeight);

    btn.style.left = x + "px";
    btn.style.top = y + "px";
});