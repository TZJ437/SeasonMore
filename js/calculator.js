(() => {
const {
  $,
  getCurrentSeason,
  getGanzhiDay,
  getGanzhiYear,
  getNearbyTerm,
  getSafeToday,
  mountChrome,
  normalizeYear,
  termByName,
  termsBySeason
} = window.SeasonApp;
const { classicStories, scenicSpots } = window.SeasonData;

function formatDate(date) {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

function dateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function pickScenicSpot(seasonName, termId = 0) {
  const pool = scenicSpots.filter((spot) => spot.season === seasonName);
  return pool[termId % Math.max(1, pool.length)] || scenicSpots[termId % scenicSpots.length];
}

function pickStory(termName) {
  return classicStories.find((item) => item.text.includes(termName)) || classicStories[0];
}

function neighborTerms(seasonTerms, termName) {
  const index = Math.max(0, seasonTerms.findIndex((term) => term.name === termName));
  return {
    prev: seasonTerms[Math.max(0, index - 1)] || seasonTerms[0],
    current: seasonTerms[index] || seasonTerms[0],
    next: seasonTerms[Math.min(seasonTerms.length - 1, index + 1)] || seasonTerms[seasonTerms.length - 1]
  };
}

function parseInputDate(value) {
  if (!value) return getSafeToday();
  const date = new Date(`${value}T00:00:00`);
  return Number.isFinite(date.getTime()) ? date : getSafeToday();
}

function update() {
  const dateInput = $("#dateInput");
  const yearInput = $("#yearInput");
  const date = parseInputDate(dateInput.value);
  const year = normalizeYear(yearInput.value, date.getFullYear());
  const ganzhiYear = getGanzhiYear(year);
  const ganzhiDay = getGanzhiDay(date);
  const season = getCurrentSeason(date);
  const nearTerm = termByName(getNearbyTerm(date));
  const seasonTerms = termsBySeason(season.name);
  const terms = neighborTerms(seasonTerms, nearTerm.name);
  const place = pickScenicSpot(season.name, nearTerm.id);
  const story = pickStory(nearTerm.name);

  $("#resultPanel").innerHTML = `
    <section class="calendar-reading">
      <article class="calendar-overview">
        <div class="calendar-overview-seal">${ganzhiYear.name}</div>
        <div class="calendar-overview-copy">
          <p class="eyebrow">Reading This Day</p>
          <h2>${formatDate(date)}</h2>
          <p>这一天落在 <strong>${season.title}</strong> 的节奏里，靠近 <strong>${nearTerm.name}</strong>，常用干支纪年为 <strong>${ganzhiYear.name}年</strong>。</p>
          <div class="calendar-summary-flow">
            <span>${ganzhiYear.name}年</span>
            <span>${ganzhiYear.animal}年</span>
            <span>${season.title}</span>
            <span>${ganzhiDay}日</span>
          </div>
        </div>
      </article>

      <div class="calendar-dashboard">
      <article class="card calendar-focus-card">
        <div class="card-body">
          <p class="eyebrow">Ganzhi</p>
          <h3>干支纪时</h3>
          <div class="query-facts">
            <span><small>纪年</small><strong>${ganzhiYear.name}</strong></span>
            <span><small>生肖</small><strong>${ganzhiYear.animal}</strong></span>
            <span><small>干支日</small><strong>${ganzhiDay}</strong></span>
          </div>
          <p>${year} 年常用干支纪年为 <strong>${ganzhiYear.name}</strong>。干支日为近似换算，适合科普阅读和节奏理解。</p>
          <a class="ghost-button" href="ganzhi.html">查看六十甲子</a>
        </div>
      </article>

      <article class="card calendar-focus-card">
        <div class="card-body">
          <p class="eyebrow">Solar Term</p>
          <h3>节气位置</h3>
          <div class="term-flow">
            <a href="term-detail.html?term=${encodeURIComponent(terms.prev.name)}">
              <small>前序</small><strong>${terms.prev.name}</strong><span>${terms.prev.date}</span>
            </a>
            <a class="current" href="term-detail.html?term=${encodeURIComponent(nearTerm.name)}">
              <small>当前</small><strong>${nearTerm.name}</strong><span>${nearTerm.date}</span>
            </a>
            <a href="term-detail.html?term=${encodeURIComponent(terms.next.name)}">
              <small>后续</small><strong>${terms.next.name}</strong><span>${terms.next.date}</span>
            </a>
          </div>
          <p>${nearTerm.story}</p>
        </div>
      </article>
      </div>

      <div class="calendar-secondary-grid">
      <article class="card poem-card soft-card">
        <div class="card-body">
          <p class="eyebrow">Verse & Story</p>
          <blockquote>${nearTerm.poem}<small>${nearTerm.source}</small></blockquote>
          <p>${story.text}</p>
        </div>
      </article>

      <article class="card place-card soft-card">
        <img src="${place.image}" alt="${place.name}">
        <div class="card-body">
          <p class="eyebrow">${place.province} · ${season.name}令风物</p>
          <h3>${place.name}</h3>
          <p>${place.note}</p>
          <div class="quick-links">
            <a class="button" href="term-detail.html?term=${encodeURIComponent(nearTerm.name)}">打开节气详情</a>
            <a class="ghost-button" href="ganzhi.html">看六十甲子</a>
          </div>
        </div>
      </article>
      </div>
    </section>
  `;
}

function resetToday() {
  const today = getSafeToday();
  $("#dateInput").value = dateInputValue(today);
  $("#yearInput").value = today.getFullYear();
  update();
}

function renderCalculatorPage() {
  mountChrome();
  resetToday();
  $("#queryForm").addEventListener("submit", (event) => {
    event.preventDefault();
    update();
  });
  $("#todayButton").addEventListener("click", resetToday);
}

Object.assign(window.SeasonApp, { renderCalculatorPage });
})();
