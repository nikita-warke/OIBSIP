const themeToggle =
    document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "☀";
    } else {
        themeToggle.textContent = "☾";
    }
});
const legacyToggle =
    document.getElementById("legacyToggle");
let legacyActive = false;
legacyToggle.addEventListener("click", () => {
    const before =
        document.querySelector(".before");
    const after =
        document.querySelector(".after");
    legacyActive = !legacyActive;
    if (legacyActive) {
        before.style.transform =
            "translateX(-12px)";
        after.style.transform =
            "translateX(12px)";
        legacyToggle.textContent = "←";
    } else {
        before.style.transform =
            "translateX(0)";
        after.style.transform =
            "translateX(0)";
        legacyToggle.textContent = "→";
    }
});
const timeline =
    document.querySelector(".timeline");
let isDragging = false;
let startX = 0;
let startScroll = 0;
timeline.addEventListener("mousedown", (event) => {
    isDragging = true;
    startX = event.pageX;
    startScroll = timeline.scrollLeft;
});
timeline.addEventListener("mouseup", () => {
    isDragging = false;
});
timeline.addEventListener("mouseleave", () => {
    isDragging = false;
});
timeline.addEventListener("mousemove", (event) => {
    if (!isDragging) {
        return;
    }
    event.preventDefault();
    const distance =
        event.pageX - startX;
    timeline.scrollLeft =
        startScroll - distance * 1.5;
});
document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "d") {
        themeToggle.click();
    }
});