(() => {
const { $, $$, mountChrome, termByName, termsBySeason } = window.SeasonApp;
const { scenicSpots, seasons, solarTerms } = window.SeasonData;

function imageForTerm(term, index = 0) {
  const pool = scenicSpots.filter((spot) => spot.season === term.season);
  return pool[index % Math.max(1, pool.length)] || {
    image: term.image,
    name: `${term.name}意象`,
    province: term.season,
    note: term.story,
    source: "#"
  };
}

function renderFilters() {
  const filters = $("#termFilters");
  if (!filters) return;
  filters.innerHTML = ["全部", ...seasons.map((season) => season.name)].map((name) => (
    `<button type="button" data-season="${name}" class="${name === "全部" ? "active" : ""}">${name}</button>`
  )).join("");
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-season]");
    if (!button) return;
    $$("#termFilters button").forEach((item) => item.classList.toggle("active", item === button));
    renderTermGallery(button.dataset.season);
  });
}

function renderTermGallery(seasonName = "全部") {
  const grid = $("#termGallery");
  if (!grid) return;
  const list = seasonName === "全部" ? solarTerms : termsBySeason(seasonName);
  grid.innerHTML = list.map((term, index) => {
    const visual = imageForTerm(term, index);
    return `
    <article class="card term-card">
      <img src="${visual.image}" alt="${term.name}图集：${visual.name}">
      <div class="card-body">
        <strong>${term.name}</strong>
        <div class="term-meta">${term.season}令 · ${term.date} · 黄经约 ${term.angle}° · ${visual.name}</div>
        <p>${term.story}</p>
        <p class="term-place">${visual.province} · ${visual.note}</p>
        <div class="quick-links">
          <a class="ghost-button" href="term-detail.html?term=${encodeURIComponent(term.name)}">查看详情</a>
        </div>
      </div>
    </article>
  `;
  }).join("");
}

function renderTermDetail() {
  const detail = $("#termDetail");
  if (!detail) return;
  const params = new URLSearchParams(location.search);
  const term = termByName(params.get("term") || "立春");
  const related = scenicSpots.filter((spot) => spot.season === term.season).slice(0, 4);
  const hero = related[0] || { image: term.image, name: term.name };
  document.title = `${term.name} | 节气详情`;
  detail.innerHTML = `
    <article class="card term-detail-layout">
      <img src="${hero.image}" alt="${term.name}意象图">
      <div class="detail-panel">
        <p class="eyebrow">${term.season}令 · ${term.date} · 太阳黄经约 ${term.angle}°</p>
        <h2>${term.name}</h2>
        <p>${term.story}</p>
        <blockquote>${term.poem}<br><small>${term.source}</small></blockquote>
        <div class="quick-links">
          <a class="button" href="solar-terms.html">返回图集</a>
          <a class="ghost-button" href="calculator.html">查询今日节气</a>
        </div>
      </div>
    </article>
    <div class="related-gallery">
      ${related.map((spot) => `
        <a class="card related-card" href="${spot.source}" target="_blank" rel="noreferrer">
          <img src="${spot.image}" alt="${spot.name}">
          <span>${spot.name}</span>
        </a>
      `).join("")}
    </div>
  `;
}

mountChrome();
renderFilters();
renderTermGallery();
renderTermDetail();
})();
