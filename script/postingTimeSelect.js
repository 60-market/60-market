const btn = document.querySelector(".postingSelectBtn");
const list = document.querySelector(".postingTimeList");


btn.addEventListener('click', () => {
    btn.classList.toggle('on');
});

list.addEventListener('click', (event) => {
    if (event.target.nodeName === "BUTTON") {
        btn.textContent = event.target.textContent;
        btn.style.color = "black";
        btn.classList.remove('on');
    }
});