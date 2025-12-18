document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".credit-item");

  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add("show");
    }, index * 150);
  });
});


document.addEventListener("mousemove", (e) => {
  const card = document.querySelector(".credits-card");
  if (!card) return;

  const x = (window.innerWidth / 2 - e.clientX) / 30;
  const y = (window.innerHeight / 2 - e.clientY) / 30;

  card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});

