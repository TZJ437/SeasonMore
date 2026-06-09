(() => {
const {
  animals,
  branches,
  classicStories,
  records,
  scenicSpots,
  seasons,
  solarTerms,
  storyChapters,
  storyTimeline,
  stems
} = window.SeasonData;

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const FALLBACK_TODAY = new Date(2026, 5, 9);
const SAFE_YEAR_MIN = 1900;
const SAFE_YEAR_MAX = 2100;

function mod(n, m) {
  return ((n % m) + m) % m;
}

function cloneDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isValidDate(date) {
  return date instanceof Date && Number.isFinite(date.getTime());
}

function getSafeToday() {
  const today = new Date();
  const year = today.getFullYear();
  if (!isValidDate(today) || year < SAFE_YEAR_MIN || year > SAFE_YEAR_MAX) {
    return cloneDate(FALLBACK_TODAY);
  }
  return cloneDate(today);
}

function normalizeYear(value, fallback = getSafeToday().getFullYear()) {
  const year = Number(value);
  return Number.isFinite(year) ? Math.trunc(year) : Math.trunc(fallback);
}

function getGanzhiYear(year) {
  const safeYear = normalizeYear(year);
  const index = mod(safeYear - 4, 60);
  return {
    index,
    name: `${stems[index % 10]}${branches[index % 12]}`,
    animal: animals[index % 12],
    stem: stems[index % 10],
    branch: branches[index % 12]
  };
}

function getGanzhiDay(date = getSafeToday()) {
  const safeDate = isValidDate(date) ? date : getSafeToday();
  const base = new Date(Date.UTC(2000, 0, 7));
  const now = Date.UTC(safeDate.getFullYear(), safeDate.getMonth(), safeDate.getDate());
  const days = Math.floor((now - base.getTime()) / 86400000);
  const index = mod(days, 60);
  return `${stems[index % 10]}${branches[index % 12]}`;
}

function getNearbyTerm(date = getSafeToday()) {
  const safeDate = isValidDate(date) ? date : getSafeToday();
  const month = safeDate.getMonth() + 1;
  const day = safeDate.getDate();
  const anchors = [
    [2, 4, "立春"], [2, 19, "雨水"], [3, 6, "惊蛰"], [3, 21, "春分"],
    [4, 5, "清明"], [4, 20, "谷雨"], [5, 6, "立夏"], [5, 21, "小满"],
    [6, 6, "芒种"], [6, 21, "夏至"], [7, 7, "小暑"], [7, 23, "大暑"],
    [8, 8, "立秋"], [8, 23, "处暑"], [9, 8, "白露"], [9, 23, "秋分"],
    [10, 8, "寒露"], [10, 23, "霜降"], [11, 7, "立冬"], [11, 22, "小雪"],
    [12, 7, "大雪"], [12, 22, "冬至"], [1, 6, "小寒"], [1, 20, "大寒"]
  ];
  const current = month * 40 + day;
  return anchors.map(([m, d, name]) => {
    let value = m * 40 + d;
    if (m === 1 && month === 12) value += 480;
    if (m === 12 && month === 1) value -= 480;
    return { name, distance: Math.abs(value - current) };
  }).sort((a, b) => a.distance - b.distance)[0].name;
}

function getCurrentSeason(date = getSafeToday()) {
  const term = solarTerms.find((item) => item.name === getNearbyTerm(date)) || solarTerms[0];
  return seasons.find((season) => season.name === term.season) || seasons[0];
}

function termByName(name) {
  return solarTerms.find((term) => term.name === name) || solarTerms[0];
}

function termsBySeason(seasonName) {
  return solarTerms.filter((term) => term.season === seasonName);
}

function icon(name) {
  const paths = {
    "book-open-text": '<path d="M12 7v14"/><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H12v18H5.5A2.5 2.5 0 0 1 3 18.5z"/><path d="M21 5.5A2.5 2.5 0 0 0 18.5 3H12v18h6.5a2.5 2.5 0 0 0 2.5-2.5z"/><path d="M7 8h2"/><path d="M7 12h2"/><path d="M15 8h2"/><path d="M15 12h2"/>',
    "calendar-search": '<path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="M19 14.5V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7"/><circle cx="17" cy="17" r="3"/><path d="m21 21-1.7-1.7"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "circle-help": '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c-.5 1.1-1.7 1.6-2.4 2.4-.4.4-.5.9-.5 1.6"/><path d="M12 17h.01"/>',
    "gallery-horizontal-end": '<rect x="3" y="5" width="12" height="14" rx="2"/><path d="M19 7v10"/><path d="M21 9v6"/><path d="m7 13 2-2 2 2 2-3"/>',
    images: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    landmark: '<path d="M3 21h18"/><path d="M5 21V10"/><path d="M19 21V10"/><path d="M12 3 3 8h18z"/><path d="M8 21V10"/><path d="M16 21V10"/>',
    orbit: '<circle cx="12" cy="12" r="3"/><path d="M3.5 12c0-2.5 3.8-4.5 8.5-4.5s8.5 2 8.5 4.5-3.8 4.5-8.5 4.5-8.5-2-8.5-4.5Z"/><path d="M7 5.5c2.1-1.2 5.7.5 8 3.8s2.5 7 .4 8.2-5.7-.5-8-3.8-2.5-7-.4-8.2Z"/>',
    "moon-star": '<path d="M12 3a7 7 0 1 0 7 7 5.5 5.5 0 0 1-7-7Z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
    "scroll-text": '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M19 3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/><path d="M7 8h10"/><path d="M7 12h6"/>',
    snowflake: '<path d="m10 20 2-2 2 2"/><path d="m10 4 2 2 2-2"/><path d="M12 2v20"/><path d="m17 20-5-5-5 5"/><path d="m17 4-5 5-5-5"/><path d="M2 12h20"/><path d="m20 10-2 2 2 2"/><path d="m4 10 2 2-2 2"/>',
    sprout: '<path d="M7 20h10"/><path d="M12 20V10"/><path d="M12 10C9 5 5 4 3 5c0 4 3 7 9 5Z"/><path d="M12 10c3-5 7-6 9-5 0 4-3 7-9 5Z"/>',
    "sun-moon": '<path d="M12 3v2"/><path d="M12 19v2"/><path d="m4.2 4.2 1.4 1.4"/><path d="m18.4 18.4 1.4 1.4"/><path d="M3 12h2"/><path d="M19 12h2"/><path d="m4.2 19.8 1.4-1.4"/><path d="M18 6a6 6 0 1 1-6-6 7 7 0 1 0 6 6Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.9 19.1 1.4-1.4"/><path d="m17.7 6.3 1.4-1.4"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-6 8-10 16-9-1 8-5 16-11 16Z"/><path d="M4 20c4-7 9-10 16-16"/>',
    wheat: '<path d="M12 22V2"/><path d="m8 6 4 4 4-4"/><path d="m8 10 4 4 4-4"/><path d="m8 14 4 4 4-4"/><path d="M5 22h14"/>'
  };
  return `<svg class="local-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.images}</svg>`;
}

function fallbackImage(label = "四时中国") {
  const safeLabel = String(label).replace(/[<>&"']/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620">
      <defs>
        <linearGradient id="paper" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#f7f1e2"/>
          <stop offset="1" stop-color="#dfe8dd"/>
        </linearGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="20"/></filter>
      </defs>
      <rect width="960" height="620" fill="url(#paper)"/>
      <path d="M50 420C240 250 390 520 590 270S850 220 930 115" fill="none" stroke="#1f2726" stroke-opacity=".22" stroke-width="38" stroke-linecap="round" filter="url(#blur)"/>
      <path d="M70 455C260 280 400 540 610 285S850 245 925 145" fill="none" stroke="#1f2726" stroke-opacity=".32" stroke-width="6" stroke-linecap="round"/>
      <circle cx="760" cy="150" r="72" fill="#a93f33" fill-opacity=".13"/>
      <text x="80" y="520" fill="#33413d" font-size="48" font-family="serif" font-weight="700">${safeLabel}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function installImageFallbacks() {
  if (document.documentElement.dataset.imageFallbacks === "ready") return;
  document.documentElement.dataset.imageFallbacks = "ready";

  const applyFallback = (image) => {
    if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = "true";
    image.src = fallbackImage(image.alt || "四时中国");
  };

  const watchImage = (image) => {
    if (!(image instanceof HTMLImageElement) || image.dataset.fallbackWatching) return;
    image.dataset.fallbackWatching = "true";
    window.setTimeout(() => {
      if (!image.complete || image.naturalWidth === 0) applyFallback(image);
    }, 4200);
  };

  document.addEventListener("error", (event) => {
    applyFallback(event.target);
  }, true);

  const scan = (root = document) => {
    root.querySelectorAll?.("img").forEach(watchImage);
  };

  scan();
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLImageElement) watchImage(node);
        scan(node);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
}

function setupPageTransitions() {
  if (document.documentElement.dataset.pageTransitions === "ready") return;
  document.documentElement.dataset.pageTransitions = "ready";

  const scrollToTarget = (id) => {
    const target = document.getElementById(id);
    if (!target) return false;
    const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height"), 10) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    target.setAttribute("tabindex", "-1");
    window.setTimeout(() => target.focus({ preventScroll: true }), 320);
    return true;
  };

  document.addEventListener("click", (event) => {
    const scrollButton = event.target.closest("[data-scroll-target]");
    if (scrollButton) {
      event.preventDefault();
      scrollToTarget(scrollButton.dataset.scrollTarget);
      return;
    }

    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    const href = link.getAttribute("href") || "";
    if (!href || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }

    const samePage = url.origin === window.location.origin && url.pathname === window.location.pathname && url.search === window.location.search;
    if (samePage && url.hash) {
      event.preventDefault();
      scrollToTarget(decodeURIComponent(url.hash.slice(1)));
      return;
    }

    const isLocalHtml = url.origin === window.location.origin && /\.(html|htm)$/i.test(url.pathname);
    if (!isLocalHtml) return;

    if (url.href === window.location.href) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    event.preventDefault();
    document.documentElement.classList.add("page-leaving");
    window.setTimeout(() => {
      window.location.assign(href);
    }, 170);
  });

  const markReady = () => {
    document.documentElement.classList.remove("page-leaving");
    document.documentElement.classList.add("page-ready");
  };

  window.addEventListener("pageshow", markReady);
  markReady();

  if (window.location.hash) {
    const id = decodeURIComponent(window.location.hash.slice(1));
    window.setTimeout(() => {
      if (scrollToTarget(id) && window.history?.replaceState) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
    }, 80);
  }
}

function mountChrome() {
  $("#appHeader").innerHTML = `
    <header class="site-header">
      <a class="brand" href="index.html"><span>时</span><strong>四时中国</strong></a>
      <nav class="site-nav" aria-label="主导航">
        <a data-page="home" href="index.html">首页</a>
        <a data-page="seasons" href="seasons.html">四季</a>
        <a data-page="principles" href="principles.html">原理</a>
        <a data-page="terms" href="solar-terms.html">节气图集</a>
        <a data-page="stories" href="stories.html">典籍故事</a>
        <a data-page="ganzhi" href="ganzhi.html">干支</a>
        <a data-page="calculator" href="calculator.html">查询</a>
        <a data-page="quiz" href="quiz.html">测试</a>
      </nav>
      <button class="icon-button" id="themeToggle" type="button" aria-label="切换深浅色">${icon("sun-moon")}</button>
    </header>
  `;

  $("#appFooter").innerHTML = `
    <footer class="site-footer">
      <p>节气日期为常见近似范围，精确时刻需按天文历算。</p>
      <div>
        <a href="principles.html">理解节气原理</a>
        <a href="solar-terms.html">浏览二十四节气</a>
        <a href="stories.html">阅读典籍故事</a>
        <a href="calculator.html">查询干支与节气</a>
        <a href="quiz.html">做一组测试</a>
      </div>
    </footer>
  `;

  const page = document.body.dataset.page;
  $$(".site-nav a").forEach((link) => {
    const active = link.dataset.page === page;
    link.classList.toggle("active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
      link.dataset.href = link.getAttribute("href") || "";
      link.removeAttribute("href");
    }
  });

  document.documentElement.classList.remove("nav-mounted", "nav-entering");
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.documentElement.classList.add("nav-mounted", "nav-entering");
      window.setTimeout(() => document.documentElement.classList.remove("nav-entering"), 680);
    });
  });

  $("#themeToggle")?.addEventListener("click", (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    document.documentElement.style.setProperty("--theme-x", `${rect.left + rect.width / 2}px`);
    document.documentElement.style.setProperty("--theme-y", `${rect.top + rect.height / 2}px`);
    document.documentElement.classList.add("theme-ripple");
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("season-theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
    window.setTimeout(() => document.documentElement.classList.remove("theme-ripple"), 640);
  });

  if (localStorage.getItem("season-theme") === "dark") {
    document.documentElement.classList.add("dark");
  }

  installImageFallbacks();
  setupPageTransitions();

  const syncHeaderHeight = () => {
    const header = $(".site-header");
    if (!header) return;
    document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
  };
  const updateHeader = () => {
    $(".site-header")?.classList.toggle("is-scrolled", window.scrollY > 18);
    syncHeaderHeight();
  };
  syncHeaderHeight();
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("resize", syncHeaderHeight);
}

function imageForTerm(term, index = 0) {
  const pool = scenicSpots.filter((spot) => spot.season === term.season);
  return pool[index % Math.max(1, pool.length)] || scenicSpots[index % scenicSpots.length] || { image: term.image, name: term.name };
}

function renderStoryAccordion(targetSelector) {
  const target = $(targetSelector);
  if (!target) return;
  target.innerHTML = classicStories.map((story, index) => `
    <article class="story-item ${index === 0 ? "open" : ""}">
      <button type="button">
        <span>${story.tag}</span>
        <strong>${story.title}</strong>
        ${icon("chevron-down")}
      </button>
      <p>${story.text}</p>
    </article>
  `).join("");
  target.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    button.closest(".story-item")?.classList.toggle("open");
  });
}

function scenicStory(spot) {
  const stories = {
    "杭州西湖": "雨水、春分前后，湖面和柳色最能说明“春生”：水气先软下来，城市也跟着从冬天里醒过来。",
    "黄山云海": "山中云气一动，季节就有了形状。黄山适合放在春夏之交，看湿润空气怎样把山峰推远又拉近。",
    "桂林漓江": "夏令水势渐盛，漓江的山影和舟行把“夏长”变成一条缓慢展开的长卷。",
    "张家界": "盛夏林木繁密，云雾从峰柱之间穿行，像把小暑、大暑的湿热写进山谷。",
    "龙脊梯田": "芒种前后，梯田不是风景背景，而是农事本身：插秧、蓄水、坡线都在提醒时间正在赶路。",
    "九寨沟": "入秋后水色和林色同时变化，白露、秋分的清寒在这里变成非常直观的层次。",
    "红枫叶": "霜降前后，一片叶子就能把秋令讲清楚：暑气退去，颜色沉下来，归途也慢下来。",
    "苏州狮子林": "园林里的秋不靠辽阔取胜，而靠转折、窗景和石影，把寒露后的清气收进城市。",
    "雪后故宫": "小雪、大雪之后，红墙与白雪让冬藏有了礼制感：热闹退后，天地和建筑一起安静。",
    "天坛祈年殿": "冬至祭天把天文、历法和礼仪连在一起，天坛适合讲“一阳来复”的制度记忆。",
    "颐和园万寿山": "北方冬令里的湖山最会留白，万寿山的轮廓让寒意不只是温度，也是一种空间秩序。",
    "清明上河图局部": "清明不只是节气，也是城市生活的节点。桥、市、舟、人流让春天有了社会烟火。",
    "春日油菜花": "成片花田把春分、清明前后的花信直接铺开，节气在这里不抽象，是一眼看见的农田节奏。",
    "布达拉宫": "高原春光来得清亮，建筑、山体和天空把春末的开阔感推到很高很远。",
    "黄果树瀑布": "夏季水声最盛，瀑布把暑热、雨季和山地湿气合成一种扑面而来的身体经验。",
    "龙脊梯田山路": "山路连着田块和村寨，芒种、小暑之间的劳作路径比单张风景更能说明农时。",
    "元阳哈尼梯田": "水田像镜面一样接住天光，南方夏令的农事、地形和水气在这里合为一体。",
    "喀纳斯湖": "秋季的喀纳斯不只是金黄，湖水的冷色让白露后的清寒更明显。",
    "黄山雪景": "雪后的黄山把冬令山水压成黑白层次，松、石、云海都像水墨里的笔触。",
    "哈尔滨冰雪大世界": "大寒前后，严寒被城市做成可进入的冰雪空间，冬天从气温变成可游历的场景。"
  };
  return stories[spot.name] || `${spot.name}的${spot.season}令故事，藏在${spot.province}的风物细节里：${spot.note}`;
}

function setupSeasonHero() {
  const hero = $(".portal-hero");
  const board = $("#seasonBoard");
  const canvas = $("#season-particles");
  if (!hero || !board || !canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const scenes = {
    "春": {
      accent: "#2f7a62",
      type: "rain",
      count: 180,
      poems: [
        ["好雨知时节，当春乃发生。", "杜甫《春夜喜雨》"],
        ["等闲识得东风面，万紫千红总是春。", "朱熹《春日》"],
        ["竹外桃花三两枝，春江水暖鸭先知。", "苏轼《惠崇春江晚景》"]
      ]
    },
    "夏": {
      accent: "#2f82c9",
      type: "light",
      count: 46,
      poems: [
        ["连雨不知春去，一晴方觉夏深。", "范成大《喜晴》"],
        ["小荷才露尖尖角，早有蜻蜓立上头。", "杨万里《小池》"],
        ["接天莲叶无穷碧，映日荷花别样红。", "杨万里《晓出净慈寺送林子方》"]
      ]
    },
    "秋": {
      accent: "#a93f33",
      type: "leaf",
      count: 92,
      poems: [
        ["空山新雨后，天气晚来秋。", "王维《山居秋暝》"],
        ["停车坐爱枫林晚，霜叶红于二月花。", "杜牧《山行》"],
        ["自古逢秋悲寂寥，我言秋日胜春朝。", "刘禹锡《秋词》"]
      ]
    },
    "冬": {
      accent: "#2f6690",
      type: "snow",
      count: 160,
      poems: [
        ["晚来天欲雪，能饮一杯无。", "白居易《问刘十九》"],
        ["千山鸟飞绝，万径人踪灭。", "柳宗元《江雪》"],
        ["忽如一夜春风来，千树万树梨花开。", "岑参《白雪歌送武判官归京》"]
      ]
    }
  };
  const names = Object.keys(scenes);
  const poemState = {};
  const layers = Object.fromEntries(names.map((name) => [name, {
    alpha: name === "春" ? 1 : 0,
    target: name === "春" ? 1 : 0,
    particles: []
  }]));
  const bursts = [];

  let active = "春";
  let width = 0;
  let height = 0;
  let dpr = 1;
  let rafId = 0;
  let lastTime = 0;

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function pickPoem(name) {
    const poems = scenes[name].poems;
    const current = poemState[name]?.verse;
    const pool = poems.filter(([verse]) => verse !== current);
    const [verse, source] = (pool.length ? pool : poems)[Math.floor(random(0, pool.length || poems.length))];
    poemState[name] = { verse, source };
    return poemState[name];
  }

  names.forEach(pickPoem);

  function renderStage() {
    board.innerHTML = `
      ${names.map((name) => `
        <section class="season-scene ${name === active ? "active" : ""}" data-season="${name}" aria-hidden="${name === active ? "false" : "true"}">
          <button class="season-wordmark" type="button" data-season-burst="${name}" aria-label="触发${name}季彩蛋">${name}</button>
          <div class="ink-poem is-writing">
            <span>${poemState[name].verse}</span>
            <small>${poemState[name].source}</small>
          </div>
        </section>
      `).join("")}
      <div class="season-dock" aria-label="切换四季">
        ${names.map((name) => `<button type="button" data-season="${name}" class="${name === active ? "active" : ""}" aria-label="切换到${name}季">${name}</button>`).join("")}
      </div>
    `;
  }

  function resetParticle(particle, name, fresh = false) {
    const type = scenes[name].type;
    particle.type = type;
    particle.seed = random(0, Math.PI * 2);
    particle.spin = random(-1, 1);
    particle.rotation = random(0, Math.PI * 2);

    if (type === "rain") {
      particle.x = random(-width * 0.12, width * 1.12);
      particle.y = fresh ? random(0, height) : random(-height * 0.2, -20);
      particle.vx = random(-110, -42);
      particle.vy = random(520, 880);
      particle.size = random(0.55, 1.35);
      particle.length = random(18, 42);
      particle.opacity = random(0.18, 0.48);
      return;
    }

    if (type === "light") {
      particle.x = random(0, width);
      particle.y = fresh ? random(0, height) : random(height * 0.15, height * 1.05);
      particle.vx = random(-8, 12);
      particle.vy = random(-14, 8);
      particle.size = random(0.8, 2.2);
      particle.opacity = random(0.08, 0.24);
      particle.radius = random(10, 30);
      return;
    }

    if (type === "leaf") {
      particle.x = fresh ? random(-width * 0.08, width * 1.08) : random(-width * 0.12, width * 0.85);
      particle.y = fresh ? random(0, height) : random(-height * 0.28, -24);
      particle.vx = random(28, 110);
      particle.vy = random(44, 128);
      particle.size = random(7, 17);
      particle.opacity = random(0.36, 0.78);
      particle.swing = random(20, 72);
      particle.color = ["#d94f32", "#c97532", "#e5a33c", "#9d3f30"][Math.floor(random(0, 4))];
      return;
    }

    particle.x = random(-width * 0.05, width * 1.05);
    particle.y = fresh ? random(0, height) : random(-height * 0.18, -18);
    particle.vx = random(-28, 38);
    particle.vy = random(28, 90);
    particle.size = random(1.5, 5.5);
    particle.opacity = random(0.28, 0.84);
    particle.swing = random(10, 44);
  }

  function createParticles(name) {
    layers[name].particles = Array.from({ length: scenes[name].count }, () => {
      const particle = {};
      resetParticle(particle, name, true);
      return particle;
    });
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    names.forEach(createParticles);
  }

  function applySeason(name, options = {}) {
    if (!scenes[name]) return;
    const sameSeason = active === name;
    const refreshPoem = options.refreshPoem ?? !sameSeason;
    active = name;
    hero.dataset.season = name;
    hero.style.setProperty("--scene-accent", scenes[name].accent);
    const poem = refreshPoem ? pickPoem(name) : poemState[name];
    names.forEach((item) => {
      layers[item].target = item === name ? 1 : 0;
    });
    $$(".season-scene", board).forEach((scene) => {
      const isActive = scene.dataset.season === name;
      scene.classList.toggle("active", isActive);
      scene.setAttribute("aria-hidden", isActive ? "false" : "true");
      const wordmark = $(".season-wordmark", scene);
      if (wordmark) {
        wordmark.tabIndex = isActive ? 0 : -1;
      }
    });
    $$(".season-dock button", board).forEach((button) => button.classList.toggle("active", button.dataset.season === name));
    const poemNode = $(`.season-scene[data-season="${name}"] .ink-poem`, board);
    if (poemNode && poem) {
      $("span", poemNode).textContent = poem.verse;
      $("small", poemNode).textContent = poem.source;
      if (refreshPoem) {
        poemNode.classList.remove("is-writing");
        void poemNode.offsetWidth;
        poemNode.classList.add("is-writing");
      }
    }
  }

  function burstOrigin(target) {
    const heroRect = hero.getBoundingClientRect();
    const targetRect = target?.getBoundingClientRect?.();
    if (!targetRect) {
      return { x: width * 0.25, y: height * 0.72 };
    }
    return {
      x: targetRect.left + targetRect.width * 0.45 - heroRect.left,
      y: targetRect.top + targetRect.height * 0.45 - heroRect.top
    };
  }

  function addBurstParticle(type, x, y, options = {}) {
    bursts.push({
      type,
      x,
      y,
      startX: x,
      startY: y,
      vx: options.vx ?? random(-80, 80),
      vy: options.vy ?? random(-120, 80),
      gravity: options.gravity ?? 60,
      life: options.life ?? random(0.9, 1.6),
      age: 0,
      size: options.size ?? random(4, 12),
      radius: options.radius ?? random(20, 80),
      opacity: options.opacity ?? random(0.55, 0.95),
      rotation: options.rotation ?? random(0, Math.PI * 2),
      spin: options.spin ?? random(-3, 3),
      sway: options.sway ?? random(18, 72),
      color: options.color,
      accent: options.accent
    });
  }

  function triggerSeasonBurst(name, target) {
    if (!scenes[name]) return;
    applySeason(name, { refreshPoem: active !== name });

    const origin = burstOrigin(target);
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const scale = reduced ? 0.45 : 1;

    if (name === "春") {
      const drops = Math.floor(34 * scale);
      const leaves = Math.floor(20 * scale);
      for (let index = 0; index < drops; index += 1) {
        addBurstParticle("spring-drop", origin.x + random(-46, 52), origin.y + random(-24, 14), {
          vx: random(-180, 110),
          vy: random(180, 420),
          gravity: random(250, 420),
          life: random(0.65, 1.05),
          size: random(1.3, 3.2),
          opacity: random(0.38, 0.76)
        });
      }
      for (let index = 0; index < leaves; index += 1) {
        addBurstParticle("willow-leaf", origin.x + random(-24, 60), origin.y + random(-28, 20), {
          vx: random(80, 240),
          vy: random(-70, 90),
          gravity: random(20, 80),
          life: random(1.5, 2.5),
          size: random(9, 18),
          color: ["#79b46c", "#9fcf86", "#6fae75"][Math.floor(random(0, 3))]
        });
      }
      return;
    }

    if (name === "夏") {
      const lights = Math.floor(24 * scale);
      for (let index = 0; index < lights; index += 1) {
        const angle = random(0, Math.PI * 2);
        const speed = random(28, 108);
        addBurstParticle("summer-glow", origin.x + random(-22, 22), origin.y + random(-20, 20), {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: random(-18, 18),
          life: random(0.65, 1.15),
          radius: random(10, 38),
          size: random(1.1, 2.8),
          opacity: random(0.18, 0.42)
        });
      }
      return;
    }

    if (name === "秋") {
      const leaves = Math.floor(42 * scale);
      for (let index = 0; index < leaves; index += 1) {
        addBurstParticle("maple-leaf", -40 + random(-80, 70), origin.y + random(-150, 120), {
          vx: random(380, 660),
          vy: random(-18, 170),
          gravity: random(14, 80),
          life: random(1.2, 2.2),
          size: random(9, 22),
          spin: random(-8, 8),
          color: ["#c8472e", "#df7d2f", "#b9352d", "#e8a13e"][Math.floor(random(0, 4))]
        });
      }
      return;
    }

    const blossoms = Math.floor(34 * scale);
    for (let index = 0; index < blossoms; index += 1) {
      addBurstParticle("plum-blossom", origin.x + random(-110, 120), -30 + random(-80, 20), {
        vx: random(-46, 76),
        vy: random(76, 170),
        gravity: random(10, 48),
        life: random(2, 3.2),
        size: random(6, 14),
        spin: random(-2.8, 2.8),
        color: ["#f4b6c8", "#fff0f5", "#df789a"][Math.floor(random(0, 3))]
      });
    }
  }

  function moveParticle(particle, name, dt, time) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.rotation += particle.spin * dt;

    if (particle.type === "leaf" || particle.type === "snow" || particle.type === "light") {
      particle.x += Math.sin(time * 0.001 + particle.seed) * (particle.swing || 12) * dt;
    }

    if (particle.y > height + 80 || particle.x < -120 || particle.x > width + 120) {
      resetParticle(particle, name);
    }
  }

  function drawRain(particle, alpha) {
    const dark = document.documentElement.classList.contains("dark");
    ctx.save();
    ctx.globalAlpha = particle.opacity * alpha;
    ctx.strokeStyle = dark ? "rgba(135, 174, 185, 0.48)" : "rgba(210, 248, 232, 0.78)";
    ctx.lineWidth = particle.size;
    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y);
    ctx.lineTo(particle.x + particle.vx * 0.035, particle.y + particle.length);
    ctx.stroke();
    ctx.restore();
  }

  function drawLight(particle, alpha) {
    const dark = document.documentElement.classList.contains("dark");
    ctx.save();
    ctx.globalAlpha = particle.opacity * alpha;
    const glow = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius);
    glow.addColorStop(0, dark ? "rgba(190, 216, 255, 0.34)" : "rgba(255, 244, 170, 0.46)");
    glow.addColorStop(0.28, dark ? "rgba(124, 160, 220, 0.14)" : "rgba(255, 222, 118, 0.14)");
    glow.addColorStop(1, dark ? "rgba(124, 160, 220, 0)" : "rgba(255, 222, 118, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawLeaf(particle, alpha) {
    const dark = document.documentElement.classList.contains("dark");
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation + Math.sin(particle.seed) * 0.55);
    ctx.globalAlpha = particle.opacity * alpha;
    ctx.fillStyle = dark ? "rgba(155, 93, 62, 0.72)" : particle.color;
    ctx.beginPath();
    ctx.moveTo(0, -particle.size);
    ctx.bezierCurveTo(particle.size * 0.9, -particle.size * 0.5, particle.size * 1.1, particle.size * 0.42, 0, particle.size * 1.15);
    ctx.bezierCurveTo(-particle.size * 0.95, particle.size * 0.36, -particle.size * 0.74, -particle.size * 0.58, 0, -particle.size);
    ctx.fill();
    ctx.strokeStyle = dark ? "rgba(255, 220, 165, 0.28)" : "rgba(255, 226, 178, 0.55)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, -particle.size * 0.72);
    ctx.lineTo(0, particle.size * 0.82);
    ctx.stroke();
    ctx.restore();
  }

  function drawSnow(particle, alpha) {
    const dark = document.documentElement.classList.contains("dark");
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = particle.opacity * alpha;
    ctx.strokeStyle = dark ? "rgba(205, 226, 255, 0.68)" : "rgba(255, 255, 255, 0.86)";
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 6; i += 1) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(-particle.size, 0);
      ctx.lineTo(particle.size, 0);
      ctx.stroke();
    }
    ctx.fillStyle = dark ? "rgba(205, 226, 255, 0.52)" : "rgba(255, 255, 255, 0.72)";
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(0.8, particle.size * 0.28), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawWillowLeaf(particle, alpha, dark) {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = particle.opacity * alpha;
    ctx.fillStyle = dark ? "rgba(160, 218, 168, 0.8)" : particle.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, particle.size * 0.28, particle.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = dark ? "rgba(225, 255, 222, 0.42)" : "rgba(237, 255, 222, 0.58)";
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(0, -particle.size * 0.72);
    ctx.lineTo(0, particle.size * 0.72);
    ctx.stroke();
    ctx.restore();
  }

  function drawMapleLeaf(particle, alpha, dark) {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = particle.opacity * alpha;
    ctx.fillStyle = dark ? "rgba(231, 127, 74, 0.82)" : particle.color;
    const s = particle.size;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.28, -s * 0.3);
    ctx.lineTo(s * 0.92, -s * 0.58);
    ctx.lineTo(s * 0.52, s * 0.02);
    ctx.lineTo(s, s * 0.24);
    ctx.lineTo(s * 0.28, s * 0.36);
    ctx.lineTo(s * 0.14, s);
    ctx.lineTo(0, s * 0.48);
    ctx.lineTo(-s * 0.14, s);
    ctx.lineTo(-s * 0.28, s * 0.36);
    ctx.lineTo(-s, s * 0.24);
    ctx.lineTo(-s * 0.52, s * 0.02);
    ctx.lineTo(-s * 0.92, -s * 0.58);
    ctx.lineTo(-s * 0.28, -s * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = dark ? "rgba(255, 220, 166, 0.3)" : "rgba(255, 226, 170, 0.42)";
    ctx.lineWidth = 0.75;
    ctx.stroke();
    ctx.restore();
  }

  function drawPlumBlossom(particle, alpha, dark) {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = particle.opacity * alpha;
    const petal = particle.size * 0.42;
    ctx.fillStyle = dark ? "rgba(255, 196, 216, 0.82)" : particle.color;
    for (let index = 0; index < 5; index += 1) {
      ctx.rotate((Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.ellipse(0, -particle.size * 0.52, petal, particle.size * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = dark ? "rgba(255, 224, 150, 0.82)" : "rgba(198, 128, 44, 0.72)";
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(1.2, particle.size * 0.18), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBurstParticle(particle, alpha, dark) {
    if (particle.type === "spring-drop") {
      ctx.save();
      ctx.globalAlpha = particle.opacity * alpha;
      ctx.strokeStyle = dark ? "rgba(154, 218, 218, 0.72)" : "rgba(205, 248, 234, 0.88)";
      ctx.lineWidth = particle.size;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(particle.x - particle.vx * 0.018, particle.y + particle.size * 8);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (particle.type === "summer-glow") {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = particle.opacity * alpha;
      const glow = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * (1 + particle.age));
      glow.addColorStop(0, dark ? "rgba(208, 232, 255, 0.46)" : "rgba(255, 252, 176, 0.5)");
      glow.addColorStop(0.24, dark ? "rgba(108, 158, 236, 0.14)" : "rgba(255, 224, 100, 0.16)");
      glow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * (1 + particle.age), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    if (particle.type === "willow-leaf") {
      drawWillowLeaf(particle, alpha, dark);
      return;
    }

    if (particle.type === "maple-leaf") {
      drawMapleLeaf(particle, alpha, dark);
      return;
    }

    drawPlumBlossom(particle, alpha, dark);
  }

  function drawBursts(dt, time) {
    const dark = document.documentElement.classList.contains("dark");
    for (let index = bursts.length - 1; index >= 0; index -= 1) {
      const particle = bursts[index];
      particle.age += dt;
      if (particle.age >= particle.life) {
        bursts.splice(index, 1);
        continue;
      }

      const progress = particle.age / particle.life;
      particle.x += particle.vx * dt + Math.sin(time * 0.004 + particle.startX) * particle.sway * dt;
      particle.y += particle.vy * dt;
      particle.vy += particle.gravity * dt;
      particle.rotation += particle.spin * dt;
      drawBurstParticle(particle, Math.max(0, 1 - progress), dark);
    }
  }

  function drawLayer(name, dt, time) {
    const layer = layers[name];
    layer.alpha += (layer.target - layer.alpha) * Math.min(1, dt * 3);
    if (layer.alpha < 0.01) return;
    ctx.globalCompositeOperation = "source-over";
    const draw = {
      rain: drawRain,
      light: drawLight,
      leaf: drawLeaf,
      snow: drawSnow
    }[scenes[name].type];
    layer.particles.forEach((particle) => {
      moveParticle(particle, name, dt, time);
      draw(particle, layer.alpha);
    });
  }

  function tick(time = 0) {
    const dt = Math.min(0.04, (time - lastTime || 16) / 1000);
    lastTime = time;
    ctx.clearRect(0, 0, width, height);
    names.forEach((name) => drawLayer(name, dt, time));
    drawBursts(dt, time);
    ctx.globalCompositeOperation = "source-over";
    rafId = requestAnimationFrame(tick);
  }

  renderStage();
  resize();
  applySeason(active);
  cancelAnimationFrame(rafId);
  tick();

  board.addEventListener("click", (event) => {
    const burstButton = event.target.closest("button[data-season-burst]");
    if (burstButton) {
      triggerSeasonBurst(burstButton.dataset.seasonBurst, burstButton);
      return;
    }

    const button = event.target.closest("button[data-season]");
    if (button) triggerSeasonBurst(button.dataset.season, button);
  });
  board.addEventListener("pointerover", (event) => {
    const button = event.target.closest("button[data-season]");
    if (button) applySeason(button.dataset.season);
  });
  window.addEventListener("resize", resize);
}

function renderHome() {
  mountChrome();
  const today = getSafeToday();
  const current = getCurrentSeason(today);
  const near = getNearbyTerm(today);
  const year = getGanzhiYear(today.getFullYear());
  $("#todayCard").innerHTML = `
    <strong>${current.title}</strong>
    <span>近 ${near} · ${year.name}年 · ${getGanzhiDay(today)}日</span>
  `;
  const routes = [
    ["四季展厅", "seasons.html", "gallery-horizontal-end", "以春夏秋冬组织全年叙事。"],
    ["节气原理", "principles.html", "orbit", "讲清太阳黄经、公历日期与农历差异。"],
    ["节气图集", "solar-terms.html", "images", "按季节筛选二十四节气图像与故事。"],
    ["典籍故事", "stories.html", "scroll-text", "从典籍、节俗与农事理解节气。"],
    ["天干地支", "ganzhi.html", "orbit", "理解六十甲子的循环时间。"],
    ["查询工具", "calculator.html", "calendar-search", "查询日期、近节气与干支。"],
    ["互动测试", "quiz.html", "circle-help", "用几道题检查理解程度。"],
    ["节气详情", "term-detail.html?term=清明", "book-open-text", "从单个节气进入诗词与物候。"]
  ];
  $("#seasonPreview").innerHTML = routes.map(([title, href, iconName, text]) => `
    <article class="card route-card">
      <div class="card-body">
        <div class="icon-wrap">${icon(iconName)}</div>
        <h3>${title}</h3>
        <p>${text}</p>
      </div>
      <div class="card-body">
        <a class="ghost-button" href="${href}">打开</a>
      </div>
    </article>
  `).join("");
  setupSeasonHero();
}

function renderSeasons() {
  mountChrome();
  $("#seasonGallery").innerHTML = seasons.map((season) => {
    const termNames = termsBySeason(season.name).map((term) => term.name).join("、");
    return `
      <article class="card season-card" id="${season.key}" style="--season-color:${season.color}">
        <img src="${season.image}" alt="${season.title}意象图">
        <div class="card-body">
          <p class="eyebrow">${season.range}</p>
          <h3>${icon(season.icon)}${season.title}</h3>
          <p>${season.summary}</p>
          <div class="season-keywords">${season.keywords.map((item) => `<span>${item}</span>`).join("")}</div>
          <p class="season-terms">本季节气：${termNames}</p>
        </div>
      </article>
    `;
  }).join("");
  const scenic = $("#scenicGallery");
  if (scenic) {
    scenic.innerHTML = scenicSpots.map((spot) => `
      <article class="card scenic-card">
        <img src="${spot.image}" alt="${spot.name}">
        <div class="card-body">
          <p class="eyebrow">${spot.season}令 · ${spot.province}</p>
          <h3>${spot.name}</h3>
          <p>${spot.note}</p>
          <p class="scenic-story"><strong>小故事</strong>${scenicStory(spot)}</p>
        </div>
      </article>
    `).join("");
  }
}

function renderStoriesPage() {
  mountChrome();

  const lines = [
    {
      id: "astronomy",
      title: "天文历法",
      icon: "orbit",
      num: "365¼",
      label: "回归年近似日数",
      quote: "日月运行，寒暑相推。",
      desc: "以太阳周年运动为切入点，二十四节气把黄道划成可感知的时间刻度。春分、夏至、秋分、冬至不是孤立名词，而是昼夜与寒暑变化的骨架。"
    },
    {
      id: "phenology",
      title: "物候演变",
      icon: "leaf",
      num: "72",
      label: "候应节点",
      quote: "五日为候，三候为气。",
      desc: "风、水、鸟兽、草木把抽象节气落到眼前。雷声、露水、花信与霜叶，让时间不只被计算，也被看见、听见和触摸。"
    },
    {
      id: "agriculture",
      title: "农事时令",
      icon: "wheat",
      num: "24",
      label: "农家节令准绳",
      quote: "春耕夏耘，秋收冬藏。",
      desc: "节气最贴近土地的一面，是它能提示劳作节奏。清明、谷雨、小满、芒种，把雨热、作物和人的体力安排在同一张时间表里。"
    },
    {
      id: "ritual",
      title: "岁时礼俗",
      icon: "book-open-text",
      num: "100+",
      label: "民间岁时经验",
      quote: "岁时交接，礼以敬之。",
      desc: "清明祭扫、重阳登高、冬至团圆，把天时转化为人事。礼俗让季节拥有记忆，也让抽象时间进入家族、城市和饮食。"
    }
  ];

  const glossaryEntries = [
    { term: "节气", category: "天文", text: "太阳黄经每十五度划分一段，用来标定太阳年中的季节节点。" },
    { term: "黄道", category: "天文", text: "从地球视角看，太阳一年中在天球上运行的路径，是节气划分的坐标。" },
    { term: "物候", category: "物候", text: "动植物和天气随季节呈现的变化，如花开、雷鸣、露凝。" },
    { term: "七十二候", category: "物候", text: "二十四节气每气分三候，用更细颗粒记录自然变化。" },
    { term: "月令", category: "历法", text: "按月份安排政令、农事、祭祀和禁忌的传统文本类型。" },
    { term: "干支", category: "历法", text: "十天干与十二地支相配形成的循环纪时系统。" },
    { term: "一阳来复", category: "礼俗", text: "冬至后白昼渐长，象征阳气开始回升的传统说法。" },
    { term: "花信", category: "物候", text: "以花开次第标记春季推进的观察方式。" }
  ];

  let activeLine = lines[0].id;
  let activeStory = storyChapters[0]?.title || "";
  let activeTimeline = 0;
  let glossaryFilter = "全部";

  const renderLines = () => {
    const tabs = $("#storyLineTabs");
    const panel = $("#storyLinePanel");
    if (!tabs || !panel) return;

    tabs.innerHTML = lines.map((line) => `
      <button type="button" data-line="${line.id}" class="${line.id === activeLine ? "active" : ""}">
        <span>Dimension</span>
        <strong>${icon(line.icon)}${line.title}</strong>
      </button>
    `).join("");

    const line = lines.find((item) => item.id === activeLine) || lines[0];
    panel.innerHTML = `
      <div class="line-panel-copy">
        <p class="eyebrow">${line.title}</p>
        <h3>${line.quote}</h3>
        <p>${line.desc}</p>
      </div>
      <div class="line-panel-number">
        <span>Quantitative Data</span>
        <strong>${line.num}</strong>
        <small>${line.label}</small>
      </div>
    `;
  };

  const renderReader = () => {
    const nav = $("#storyReaderNav");
    const content = $("#storyReaderContent");
    if (!nav || !content) return;

    nav.innerHTML = storyChapters.map((chapter, index) => `
      <button type="button" data-story-title="${chapter.title}" class="${chapter.title === activeStory ? "active" : ""}">
        <span>Chapter ${String(index + 1).padStart(2, "0")}</span>
        <strong>${chapter.title}</strong>
      </button>
    `).join("");

    const chapter = storyChapters.find((item) => item.title === activeStory) || storyChapters[0];
    if (!chapter) return;
    content.innerHTML = `
      <div class="reader-tags">
        <span>${chapter.tag}</span>
        <span>${chapter.season}</span>
        ${chapter.points.map((point) => `<span>${point}</span>`).join("")}
      </div>
      <header class="reader-title">
        <h3>${chapter.title}</h3>
        <p>${chapter.subtitle}</p>
      </header>
      ${chapter.image ? `
        <figure class="reader-visual">
          <img src="${chapter.image}" alt="${chapter.imageAlt || chapter.title}">
          ${chapter.imageNote ? `<figcaption>${chapter.imageNote}</figcaption>` : ""}
        </figure>
      ` : ""}
      ${chapter.excerpt ? `
        <section class="reader-excerpt">
          <p class="eyebrow">原文摘句</p>
          <blockquote>${chapter.excerpt}</blockquote>
          ${chapter.plain ? `<p><strong>白话解释</strong>${chapter.plain}</p>` : ""}
        </section>
      ` : ""}
      <blockquote class="reader-quote">
        ${chapter.summary}
      </blockquote>
      <div class="reader-columns">
        ${chapter.details.map((part) => `
          <section>
            <h4>${part.heading}</h4>
            <p>${part.text}</p>
          </section>
        `).join("")}
      </div>
    `;
  };

  const renderTimeline = () => {
    const steps = $("#storyTimelineSteps");
    const progress = $("#storyTimelineProgress");
    const focus = $("#storyTimelineFocus");
    if (!steps || !progress || !focus) return;

    steps.innerHTML = storyTimeline.map((item, index) => `
      <button type="button" data-timeline-index="${index}" class="${index === activeTimeline ? "active" : ""}">
        <span>${index + 1}</span>
        <strong>${item.era}</strong>
      </button>
    `).join("");

    progress.style.width = storyTimeline.length > 1
      ? `${(activeTimeline / (storyTimeline.length - 1)) * 100}%`
      : "0%";

    const item = storyTimeline[activeTimeline] || storyTimeline[0];
    focus.innerHTML = `
      <span>${item.era}</span>
      <div>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </div>
    `;
  };

  const renderGlossary = () => {
    const filters = $("#storyGlossaryFilters");
    const grid = $("#storyGlossary");
    if (!filters || !grid) return;

    const categories = ["全部", ...Array.from(new Set(glossaryEntries.map((item) => item.category)))];
    filters.innerHTML = categories.map((category) => `
      <button type="button" data-glossary-filter="${category}" class="${category === glossaryFilter ? "active" : ""}">${category}</button>
    `).join("");

    const entries = glossaryFilter === "全部"
      ? glossaryEntries
      : glossaryEntries.filter((item) => item.category === glossaryFilter);

    grid.innerHTML = entries.map((item) => `
      <article class="glossary-card">
        <div>
          <span>${item.category}</span>
          <h3>${item.term}</h3>
          <p>${item.text}</p>
        </div>
      </article>
    `).join("");
  };

  renderLines();
  renderReader();
  renderTimeline();
  renderGlossary();

  $("#storyLineTabs")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-line]");
    if (!button) return;
    activeLine = button.dataset.line;
    renderLines();
  });

  $("#storyReaderNav")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-story-title]");
    if (!button) return;
    activeStory = button.dataset.storyTitle;
    renderReader();
  });

  $("#storyTimelineSteps")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-timeline-index]");
    if (!button) return;
    activeTimeline = Number(button.dataset.timelineIndex);
    renderTimeline();
  });

  $("#storyGlossaryFilters")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-glossary-filter]");
    if (!button) return;
    glossaryFilter = button.dataset.glossaryFilter;
    renderGlossary();
  });
}

function renderGanzhiPage() {
  mountChrome();
  const cycle = Array.from({ length: 60 }, (_, index) => `${stems[index % 10]}${branches[index % 12]}`);
  const elementNames = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
  const elementClass = { 木: "wood", 火: "fire", 土: "earth", 金: "metal", 水: "water" };
  const cycleDescriptions = [
    ["甲子 · 岁始首位", "甲为木之阳，子为水之阳。水木相生，藏着严寒之下万物复苏的初萌动力。"],
    ["乙丑 · 晨光微熹", "乙为草木之阴，丑为寒土。像幼芽探出覆雪土壤，柔弱却韧劲非凡。"],
    ["丙寅 · 猛虎出林", "丙为阳火，寅为春木。火乘木势，如春雷初动，带着明显的伸展与生发。"],
    ["丁卯 · 炉火融融", "丁火幽微，卯木清朗。它更像稳定的温光，在秩序中推动生命向前。"]
  ];
  let activeRange = "all";
  let activeCycleIndex = 0;
  let activeYearIndex = 0;

  const cycleItems = cycle.map((name, index) => ({
    index,
    order: index + 1,
    name,
    stem: stems[index % 10],
    branch: branches[index % 12],
    animal: animals[index % 12],
    element: elementNames[index % 10]
  }));

  const rangeMap = {
    all: [0, 60],
    "1-20": [0, 20],
    "21-40": [20, 40],
    "41-60": [40, 60]
  };

  const renderFilters = () => {
    const filters = $("#jiaziFilters");
    if (!filters) return;
    const options = [
      ["all", "全部展示"],
      ["1-20", "前二十"],
      ["21-40", "中二十"],
      ["41-60", "后二十"]
    ];
    filters.innerHTML = options.map(([value, label]) => `
      <button class="pill-btn ${value === activeRange ? "active" : ""}" type="button" data-range="${value}">${label}</button>
    `).join("");
  };

  const renderJiaziGrid = () => {
    const table = $("#ganzhiTable");
    if (!table) return;
    const [start, end] = rangeMap[activeRange] || rangeMap.all;
    const visible = cycleItems.slice(start, end);
    table.innerHTML = visible.map((item) => `
      <button class="cell-jiazi ${item.index === activeYearIndex ? "highlight" : ""} ${item.index === activeCycleIndex ? "selected" : ""}" type="button" data-cycle-index="${item.index}">
        <strong>${item.name}</strong>
        <span>${String(item.order).padStart(2, "0")} · ${item.animal}</span>
      </button>
    `).join("");
  };

  const ensureRangeForIndex = (index) => {
    if (activeRange === "all") return;
    const [start, end] = rangeMap[activeRange] || rangeMap.all;
    if (index < start || index >= end) activeRange = "all";
  };

  const updateCycleDial = (index) => {
    activeCycleIndex = mod(index, 60);
    const item = cycleItems[activeCycleIndex];
    const progress = $("#dialProgress");
    if (progress) {
      const circumference = 2 * Math.PI * 130;
      progress.style.strokeDasharray = `${circumference}`;
      progress.style.strokeDashoffset = `${circumference - (circumference * (activeCycleIndex + 1)) / 60}`;
    }
    $("#dialIndex").textContent = String(item.order).padStart(2, "0");
    $("#dialName").textContent = item.name;
    const desc = cycleDescriptions[activeCycleIndex] || [
      `${item.name} · 甲子第 ${item.order} 步`,
      `天干“${item.stem}”配地支“${item.branch}”，生肖为“${item.animal}”。它位于六十甲子的第 ${item.order} 位，是天干十步与地支十二步交错后的一个刻度。`
    ];
    $("#cycleTitle").textContent = desc[0];
    $("#cycleDesc").textContent = desc[1];
    $$("#ganzhiTable .cell-jiazi").forEach((cell) => {
      cell.classList.toggle("selected", Number(cell.dataset.cycleIndex) === activeCycleIndex);
    });
  };

  const monthMap = $("#monthBranchMap");
  if (monthMap) {
    const seasonsMap = [
      ["春季", "Spring", "spring", [["寅月", "立春 - 惊蛰", "虎"], ["卯月", "惊蛰 - 清明", "兔"], ["辰月", "清明 - 立夏", "龙"]]],
      ["夏季", "Summer", "summer", [["巳月", "立夏 - 芒种", "蛇"], ["午月", "芒种 - 小暑", "马"], ["未月", "小暑 - 立秋", "羊"]]],
      ["秋季", "Autumn", "autumn", [["申月", "立秋 - 白露", "猴"], ["酉月", "白露 - 寒露", "鸡"], ["戌月", "寒露 - 立冬", "狗"]]],
      ["冬季", "Winter", "winter", [["亥月", "立冬 - 大雪", "猪"], ["子月", "大雪 - 小寒", "鼠"], ["丑月", "小寒 - 立春", "牛"]]]
    ];
    monthMap.innerHTML = seasonsMap.map(([seasonName, english, type, months]) => `
      <article class="season-branch-card ${type}">
        <div class="season-title">
          <span>${seasonName}</span>
          <small>${english}</small>
        </div>
        <ul>
          ${months.map(([branch, range, animal]) => `
            <li>
              <strong>${branch}</strong>
              <span>${range} · ${animal}</span>
            </li>
          `).join("")}
        </ul>
      </article>
    `).join("");
  }
  $("#recordList").innerHTML = records.map((item) => `
    <article class="record-item">
      <p class="eyebrow">${item.era}</p>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");

  const update = () => {
    const year = normalizeYear($("#yearInput").value);
    const result = getGanzhiYear(year);
    const stemIndex = stems.indexOf(result.stem);
    const element = elementNames[stemIndex] || "火";
    activeYearIndex = result.index;
    ensureRangeForIndex(activeYearIndex);
    $("#yearSeal").textContent = result.name;
    $("#yearSeal").classList.remove("changed", "wood", "fire", "earth", "metal", "water");
    $("#yearSeal").classList.add(elementClass[element] || "fire");
    void $("#yearSeal").offsetWidth;
    $("#yearSeal").classList.add("changed");
    $("#yearExplain").innerHTML = `
      <strong>公历 ${year} 年</strong> 常用干支纪年为 <strong>${result.name}年</strong>。<br>
      天干 <strong>${result.stem}</strong> 属 ${element}，地支 <strong>${result.branch}</strong> 对应生肖 <strong>${result.animal}</strong>。<br>
      <span>严格历法场景需按立春或农历年界定，这里用于科普理解。</span>
    `;
    renderFilters();
    renderJiaziGrid();
    updateCycleDial(activeYearIndex);
  };

  renderFilters();
  renderJiaziGrid();
  updateCycleDial(0);
  $("#yearInput").value = getSafeToday().getFullYear();
  $("#yearInput").addEventListener("input", update);
  $("#jiaziFilters")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-range]");
    if (!button) return;
    activeRange = button.dataset.range;
    renderFilters();
    renderJiaziGrid();
  });
  $("#ganzhiTable")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-cycle-index]");
    if (!button) return;
    updateCycleDial(Number(button.dataset.cycleIndex));
  });
  $("#prevCycleBtn")?.addEventListener("click", () => updateCycleDial(activeCycleIndex - 1));
  $("#nextCycleBtn")?.addEventListener("click", () => updateCycleDial(activeCycleIndex + 1));
  update();
}


window.SeasonApp = {
  $,
  $$,
  getCurrentSeason,
  getGanzhiDay,
  getGanzhiYear,
  getNearbyTerm,
  getSafeToday,
  mountChrome,
  normalizeYear,
  renderGanzhiPage,
  renderHome,
  renderSeasons,
  renderStoriesPage,
  termByName,
  termsBySeason
};
})();
