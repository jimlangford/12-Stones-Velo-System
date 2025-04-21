document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("scrollbook-container");
  const res = await fetch("data/scrollbook.json");
  const data = await res.json();

  container.innerHTML = "";

  data.articles.forEach(article => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${article.title}</strong>`;
    container.appendChild(div);
  });

  const scrollList = document.createElement("ul");
  data.scrolls.forEach(scroll => {
    const li = document.createElement("li");
    li.textContent = scroll.name;
    scrollList.appendChild(li);
  });

  container.appendChild(scrollList);
});
