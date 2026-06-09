(() => {
const { $, addPageCleanup, mountChrome } = window.SeasonApp;
const { quizQuestions, scenicSpots, seasons } = window.SeasonData;

const praisePoems = [
  ["会当凌绝顶，一览众山小。", "杜甫《望岳》"],
  ["长风破浪会有时，直挂云帆济沧海。", "李白《行路难》"],
  ["纸上得来终觉浅，绝知此事要躬行。", "陆游《冬夜读书示子聿》"],
  ["少年辛苦终身事，莫向光阴惰寸功。", "杜荀鹤《题弟侄书堂》"],
  ["不经一番寒彻骨，怎得梅花扑鼻香。", "黄蘖禅师《上堂开示颂》"]
];

const modes = [
  { key: "quiz", label: "问答", title: "节气快问", text: "先校准核心概念。", step: "01" },
  { key: "puzzle", label: "拼图", title: "季节拼图", text: "用图像进入四季。", step: "02" },
  { key: "poem", label: "诗句", title: "诗句补全", text: "从意象认出季节。", step: "03" },
  { key: "match", label: "配对", title: "节气配对", text: "把节气放回季节。", step: "04" },
  { key: "sort", label: "排序", title: "春令排序", text: "理清先后顺序。", step: "05" },
  { key: "memory", label: "翻牌", title: "物候翻牌", text: "用物候巩固记忆。", step: "06" }
];

const matchItems = [
  ["清明", "春"], ["夏至", "夏"], ["白露", "秋"], ["冬至", "冬"],
  ["谷雨", "春"], ["芒种", "夏"], ["霜降", "秋"], ["大寒", "冬"]
];

const sortAnswer = ["立春", "雨水", "惊蛰", "春分", "清明", "谷雨"];

const memoryPairs = [
  ["小满", "麦类渐满而未熟"],
  ["芒种", "有芒谷物忙收忙种"],
  ["白露", "昼夜温差带来露水"],
  ["冬至", "一阳来复"]
];

const poemQuestions = [
  {
    verse: "好雨知时节，当春乃发生。",
    blank: "春",
    source: "杜甫《春夜喜雨》",
    options: ["春", "秋", "冬"],
    note: "雨水、惊蛰前后，春雨常被写成万物苏醒的信号。"
  },
  {
    verse: "接天莲叶无穷碧，映日荷花别样红。",
    blank: "荷花",
    source: "杨万里《晓出净慈寺送林子方》",
    options: ["荷花", "梅花", "菊花"],
    note: "荷花是夏季最鲜明的植物意象之一。"
  },
  {
    verse: "停车坐爱枫林晚，霜叶红于二月花。",
    blank: "霜叶",
    source: "杜牧《山行》",
    options: ["霜叶", "柳色", "麦浪"],
    note: "霜降前后的冷意，让秋叶颜色更鲜明。"
  },
  {
    verse: "千山鸟飞绝，万径人踪灭。",
    blank: "雪",
    source: "柳宗元《江雪》",
    options: ["雪", "雷", "露"],
    note: "冬季诗词常以雪、寒江、孤舟写出天地收束。"
  }
];

let mode = "quiz";
let questionIndex = 0;
let poemIndex = 0;
let score = 0;
let poemScore = 0;
let locked = false;
let selected = null;
let matchedCount = 0;
let sortPicked = [];
let memoryOpen = [];
let memoryDone = 0;
let puzzleTiles = [];
let puzzleSelected = null;
let puzzleMoves = 0;
let puzzleSkipped = false;
let puzzleCompleted = false;
let puzzleAnnounced = false;
let puzzleTarget = null;
let activeMountId = 0;
const timeouts = new Set();

function schedule(callback, delay) {
  const mountId = activeMountId;
  const id = window.setTimeout(() => {
    timeouts.delete(id);
    if (mountId === activeMountId) callback();
  }, delay);
  timeouts.add(id);
  return id;
}

function clearPageTimers() {
  timeouts.forEach((id) => window.clearTimeout(id));
  timeouts.clear();
}

function shuffle(list) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function pickPraise() {
  return praisePoems[Math.floor(Math.random() * praisePoems.length)];
}

function announce(message, detail = "") {
  const target = $("#gameReward");
  if (!target) return;
  const [verse, source] = pickPraise();
  target.innerHTML = `
    <article class="reward-card">
      <p class="eyebrow">${message}</p>
      <blockquote>${verse}</blockquote>
      <span>${source}</span>
      ${detail ? `<p>${detail}</p>` : ""}
    </article>
  `;
}

function clearAnnouncement() {
  const target = $("#gameReward");
  if (target) target.innerHTML = "";
}

function gameShell(title, subtitle, body, actions = "") {
  return `
    <article class="card game-card">
      <div class="game-card-head">
        <div>
          <p class="eyebrow">${title}</p>
          <h2>${subtitle}</h2>
        </div>
        ${actions ? `<div class="game-actions">${actions}</div>` : ""}
      </div>
      ${body}
    </article>
  `;
}

function renderShell() {
  const currentIndex = Math.max(0, modes.findIndex((item) => item.key === mode));
  $("#quizBox").innerHTML = `
    <div class="quiz-layout">
      <aside class="game-menu" aria-label="互动模式">
        <div class="game-menu-intro">
          <p class="eyebrow">Route</p>
          <h2>建议顺序</h2>
          <p>先理解，再动手，最后巩固。</p>
        </div>
        ${modes.map((item) => `
          <button type="button" data-mode="${item.key}" class="${item.key === mode ? "active" : ""}">
            <i>${item.step}</i>
            <strong>${item.label}</strong>
            <span>${item.text}</span>
          </button>
        `).join("")}
      </aside>
      <section class="game-stage">
        <div class="game-route">
          ${modes.map((item, index) => `
            <button type="button" data-mode="${item.key}" class="${item.key === mode ? "active" : ""} ${index < currentIndex ? "passed" : ""}">
              <span>${item.step}</span>${item.label}
            </button>
          `).join("")}
        </div>
        <div class="game-stage-meta">
          <p class="eyebrow">Interactive Lab</p>
          <h2>${modes.find((item) => item.key === mode)?.title || "互动测试"}</h2>
        </div>
        <div id="gameArea"></div>
        <div id="gameReward" aria-live="polite"></div>
      </section>
    </div>
  `;
}

function resetMode(nextMode = mode) {
  mode = nextMode;
  questionIndex = 0;
  poemIndex = 0;
  score = 0;
  poemScore = 0;
  locked = false;
  selected = null;
  matchedCount = 0;
  sortPicked = [];
  memoryOpen = [];
  memoryDone = 0;
  puzzleTiles = [];
  puzzleSelected = null;
  puzzleMoves = 0;
  puzzleSkipped = false;
  puzzleCompleted = false;
  puzzleAnnounced = false;
  puzzleTarget = null;
  renderShell();
  renderGame();
}

function renderQuestion() {
  const item = quizQuestions[questionIndex];
  locked = false;
  $("#gameArea").innerHTML = gameShell(
    `第 ${questionIndex + 1} / ${quizQuestions.length} 题`,
    item.q,
    `
      <div class="answers">
        ${item.options.map((option, optionIndex) => `<button type="button" data-answer="${optionIndex}">${option}</button>`).join("")}
      </div>
      <p class="game-result">当前得分 ${score}</p>
    `
  );
}

function finishQuiz() {
  $("#gameArea").innerHTML = gameShell(
    "完成",
    `你的得分：${score} / ${quizQuestions.length}`,
    `
      <p class="game-copy">可以继续玩拼图、诗句、配对、排序和翻牌，把“看过”变成“记住”。</p>
      <div class="quick-links">
        <button class="button" id="restartQuiz" type="button">再测一次</button>
        <a class="ghost-button" href="solar-terms.html">复习节气图集</a>
      </div>
    `
  );
  announce("答题完成", score === quizQuestions.length ? "全对，很稳。" : "已经抓住主线，继续玩几轮小游戏会更熟。");
  $("#restartQuiz").addEventListener("click", () => resetMode("quiz"));
}

function puzzleLibrary() {
  const seasonPuzzles = seasons.map((season) => ({
    title: `${season.title}拼图`,
    season: season.name,
    image: season.image,
    note: season.summary,
    labels: [...season.keywords, ...season.title.split("").filter(Boolean), "归位"].slice(0, 9)
  }));
  const scenicPuzzles = scenicSpots.slice(0, 12).map((spot) => ({
    title: `${spot.name}拼图`,
    season: spot.season,
    image: spot.image,
    note: spot.note,
    labels: [spot.name, spot.province, `${spot.season}令`, "山水", "节气", "风物", "观察", "记忆", "归位"]
  }));
  return [...seasonPuzzles, ...scenicPuzzles].filter((item) => item.image);
}

function createPuzzleTiles(forceNew = false) {
  const library = puzzleLibrary();
  if (!puzzleTarget || forceNew) {
    const pool = library.length > 1 && puzzleTarget
      ? library.filter((item) => item.image !== puzzleTarget.image)
      : library;
    puzzleTarget = pool[Math.floor(Math.random() * pool.length)] || seasons[0];
  }
  const labels = puzzleTarget.labels?.length ? puzzleTarget.labels : ["立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "春生", "花信", "归位"];
  const ordered = Array.from({ length: 9 }, (_, index) => ({
    id: index,
    image: puzzleTarget.image,
    label: labels[index % labels.length]
  }));
  let shuffled = shuffle(ordered);
  if (shuffled.every((tile, index) => tile.id === index)) {
    shuffled = [shuffled[1], shuffled[0], ...shuffled.slice(2)];
  }
  puzzleTiles = shuffled;
  puzzleSelected = null;
  puzzleMoves = 0;
  puzzleSkipped = false;
  puzzleCompleted = false;
  puzzleAnnounced = false;
}

function renderPuzzle() {
  if (!puzzleTiles.length) createPuzzleTiles();
  const complete = puzzleTiles.every((tile, index) => tile.id === index);
  puzzleCompleted = complete;
  const image = puzzleTarget?.image || puzzleTiles[0]?.image || "";
  const completeMessage = puzzleSkipped
    ? "已跳过，参考图已经展开"
    : "拼图完成，季节图像归位";
  $("#gameArea").innerHTML = gameShell(
    "季节拼图",
    complete ? completeMessage : `交换两块碎片，拼回${puzzleTarget?.season || "季节"}令`,
    `
      <div class="puzzle-board-layout ${complete ? "is-complete" : ""}">
        <figure class="puzzle-reference">
          <img src="${image}" alt="${puzzleTarget?.title || "拼图参考图"}">
          <figcaption>
            <strong>${puzzleTarget?.title || "季节参考图"}</strong>
            <span>${puzzleTarget?.note || "观察参考图，再把碎片拼回原位。"}</span>
          </figcaption>
        </figure>
        <div class="puzzle-play-area">
          <div class="puzzle-wrap" style="--puzzle-image:url('${image}')">
            ${puzzleTiles.map((tile, index) => `
              <button class="puzzle-tile ${puzzleSelected === index ? "selected" : ""}" type="button" data-puzzle="${index}" ${complete ? "disabled" : ""} style="--tile-x:${tile.id % 3};--tile-y:${Math.floor(tile.id / 3)}">
                <span>${tile.label}</span>
              </button>
            `).join("")}
          </div>
          ${complete ? `
            <div class="puzzle-complete-banner">
              <strong>${puzzleSkipped ? "已展示答案" : "拼图完成"}</strong>
              <span>${puzzleSkipped ? "可以换一张重新挑战。" : `你用了 ${puzzleMoves} 次交换完成这张拼图。`}</span>
            </div>
          ` : ""}
        </div>
      </div>
      <p class="game-result" id="puzzleResult">${complete ? (puzzleSkipped ? "跳过后已锁定本局。" : "完成后已锁定棋盘。") : `已交换 ${puzzleMoves} 次。先看参考图，再选择两块碎片交换。`}</p>
    `,
    `
      <button class="ghost-button" id="shufflePuzzle" type="button">重洗本图</button>
      <button class="ghost-button" id="randomPuzzle" type="button">随机下一张</button>
      <button class="ghost-button" id="skipPuzzle" type="button" ${complete ? "disabled" : ""}>跳过</button>
    `
  );
  $("#shufflePuzzle").addEventListener("click", () => {
    createPuzzleTiles(false);
    clearAnnouncement();
    renderPuzzle();
  });
  $("#randomPuzzle").addEventListener("click", () => {
    createPuzzleTiles(true);
    clearAnnouncement();
    renderPuzzle();
  });
  $("#skipPuzzle").addEventListener("click", () => {
    puzzleSkipped = true;
    puzzleTiles = [...puzzleTiles].sort((a, b) => a.id - b.id);
    puzzleSelected = null;
    puzzleCompleted = true;
    renderPuzzle();
    announce("已跳过拼图", "跳过也算一种识时务，先把节气线索看明白更要紧。");
  });
  if (complete && !puzzleSkipped && !puzzleAnnounced) {
    puzzleAnnounced = true;
    announce("拼图完成", `你用了 ${puzzleMoves} 次交换完成“${puzzleTarget?.title || "季节拼图"}”。`);
  }
}

function renderPoem() {
  const item = poemQuestions[poemIndex];
  locked = false;
  $("#gameArea").innerHTML = gameShell(
    `诗句 ${poemIndex + 1} / ${poemQuestions.length}`,
    item.verse.replace(item.blank, "____"),
    `
      <div class="answers poem-options">
        ${item.options.map((option) => `<button type="button" data-poem="${option}">${option}</button>`).join("")}
      </div>
      <p class="game-result">${item.source} · 当前得分 ${poemScore}</p>
    `,
    `<button class="ghost-button" id="skipPoem" type="button">跳过</button>`
  );
  $("#skipPoem").addEventListener("click", () => {
    announce("已跳过诗句", `答案是“${item.blank}”。${item.note}`);
    nextPoem();
  });
}

function finishPoem() {
  $("#gameArea").innerHTML = gameShell(
    "完成",
    `诗句得分：${poemScore} / ${poemQuestions.length}`,
    `
      <p class="game-copy">诗词像季节的记忆标签，认得意象，就更容易记住节气。</p>
      <div class="quick-links">
        <button class="button" id="restartPoem" type="button">再来一轮</button>
        <a class="ghost-button" href="stories.html">读典籍故事</a>
      </div>
    `
  );
  announce("诗句完成", poemScore === poemQuestions.length ? "四季意象都接住了。" : "已经很接近了，再读一遍诗句会更顺。");
  $("#restartPoem").addEventListener("click", () => resetMode("poem"));
}

function renderMatch() {
  const left = matchItems.map(([term]) => ({ type: "term", value: term, pair: term }));
  const right = matchItems.map(([term, season]) => ({ type: "season", value: `${season}令`, pair: term }));
  const cards = shuffle([...left, ...right]);
  $("#gameArea").innerHTML = gameShell(
    "节气配对",
    "把节气与所属季节配成一组",
    `
      <div class="match-grid">
        ${cards.map((card, index) => `<button class="game-pill" type="button" data-match="${card.pair}" data-type="${card.type}" data-index="${index}">${card.value}</button>`).join("")}
      </div>
      <p class="game-result" id="matchResult">已完成 0 / ${matchItems.length} 组</p>
    `
  );
}

function renderSort() {
  const options = shuffle(sortAnswer);
  $("#gameArea").innerHTML = gameShell(
    "节气排序",
    "按春季节气的先后顺序点选",
    `
      <div class="sort-grid">
        ${options.map((item) => `<button class="game-pill" type="button" data-sort="${item}">${item}</button>`).join("")}
      </div>
      <p class="game-result" id="sortResult">已选择：等待开始</p>
    `,
    `<button class="ghost-button" id="resetSort" type="button">重新洗牌</button>`
  );
  $("#resetSort").addEventListener("click", () => resetMode("sort"));
}

function renderMemory() {
  const cards = shuffle(memoryPairs.flatMap(([term, hint]) => [
    { pair: term, value: term },
    { pair: term, value: hint }
  ]));
  $("#gameArea").innerHTML = gameShell(
    "节气翻牌",
    "翻出节气与物候说明的对应关系",
    `
      <div class="match-grid memory-grid">
        ${cards.map((card, index) => `
          <button class="game-pill memory-card" type="button" data-pair="${card.pair}" data-value="${card.value}" data-index="${index}">
            <span>?</span>
          </button>
        `).join("")}
      </div>
      <p class="game-result" id="memoryResult">已完成 0 / ${memoryPairs.length} 组</p>
    `
  );
}

function renderGame() {
  if (mode === "quiz") renderQuestion();
  if (mode === "puzzle") renderPuzzle();
  if (mode === "poem") renderPoem();
  if (mode === "match") renderMatch();
  if (mode === "sort") renderSort();
  if (mode === "memory") renderMemory();
}

function nextPoem() {
  schedule(() => {
    poemIndex += 1;
    if (poemIndex >= poemQuestions.length) finishPoem();
    else renderPoem();
  }, 560);
}

function handleQuiz(button) {
  if (locked) return;
  locked = true;
  const answer = quizQuestions[questionIndex].answer;
  const picked = Number(button.dataset.answer);
  if (picked === answer) score += 1;
  button.classList.add(picked === answer ? "correct" : "wrong");
  schedule(() => {
    questionIndex += 1;
    if (questionIndex >= quizQuestions.length) finishQuiz();
    else renderQuestion();
  }, 650);
}

function handlePuzzle(button) {
  if (puzzleCompleted || puzzleSkipped) return;
  const index = Number(button.dataset.puzzle);
  if (puzzleSelected === null) {
    puzzleSelected = index;
    renderPuzzle();
    return;
  }
  if (puzzleSelected === index) {
    puzzleSelected = null;
    renderPuzzle();
    return;
  }
  [puzzleTiles[puzzleSelected], puzzleTiles[index]] = [puzzleTiles[index], puzzleTiles[puzzleSelected]];
  puzzleSelected = null;
  puzzleMoves += 1;
  renderPuzzle();
}

function handlePoem(button) {
  if (locked) return;
  locked = true;
  const item = poemQuestions[poemIndex];
  const picked = button.dataset.poem;
  const correct = picked === item.blank;
  if (correct) poemScore += 1;
  button.classList.add(correct ? "correct" : "wrong");
  announce(correct ? "答对了" : "这题先记住", item.note);
  nextPoem();
}

function handleMatch(button) {
  if (button.classList.contains("done")) return;
  if (!selected) {
    selected = button;
    button.classList.add("selected");
    return;
  }
  if (selected === button) {
    selected.classList.remove("selected");
    selected = null;
    return;
  }
  const isPair = selected.dataset.match === button.dataset.match && selected.dataset.type !== button.dataset.type;
  if (isPair) {
    selected.classList.remove("selected");
    selected.classList.add("done");
    button.classList.add("done");
    matchedCount += 1;
    $("#matchResult").textContent = matchedCount === matchItems.length
      ? "全部配对完成，可以切到排序继续挑战。"
      : `已完成 ${matchedCount} / ${matchItems.length} 组`;
    if (matchedCount === matchItems.length) announce("配对完成", "四季归位，节气也有了方向。");
  } else {
    button.classList.add("wrong");
    selected.classList.add("wrong");
    schedule(() => {
      button.classList.remove("wrong");
      selected?.classList.remove("wrong", "selected");
      selected = null;
    }, 360);
    return;
  }
  selected = null;
}

function handleSort(button) {
  const value = button.dataset.sort;
  if (button.classList.contains("done")) return;
  const expected = sortAnswer[sortPicked.length];
  if (value === expected) {
    sortPicked.push(value);
    button.classList.add("done");
    $("#sortResult").textContent = sortPicked.length === sortAnswer.length
      ? "春季六节气排序完成。"
      : `已选择：${sortPicked.join(" → ")}`;
    if (sortPicked.length === sortAnswer.length) announce("排序完成", "春令从立春一路走到谷雨，线索很清楚。");
    return;
  }
  button.classList.add("wrong");
  $("#sortResult").textContent = `顺序不对，下一位应是：${expected}`;
  schedule(() => button.classList.remove("wrong"), 420);
}

function handleMemory(button) {
  if (button.classList.contains("done") || button.classList.contains("selected") || memoryOpen.length >= 2) return;
  button.classList.add("selected");
  button.querySelector("span").textContent = button.dataset.value;
  memoryOpen.push(button);
  if (memoryOpen.length < 2) return;
  const [first, second] = memoryOpen;
  if (first.dataset.pair === second.dataset.pair) {
    first.classList.add("done");
    second.classList.add("done");
    first.classList.remove("selected");
    second.classList.remove("selected");
    memoryDone += 1;
    $("#memoryResult").textContent = memoryDone === memoryPairs.length
      ? "全部翻牌完成，节气和物候已经对上了。"
      : `已完成 ${memoryDone} / ${memoryPairs.length} 组`;
    if (memoryDone === memoryPairs.length) announce("翻牌完成", "物候和节气能互相提醒，记忆就更牢了。");
    memoryOpen = [];
    return;
  }
  first.classList.add("wrong");
  second.classList.add("wrong");
  schedule(() => {
    memoryOpen.forEach((card) => {
      card.classList.remove("selected", "wrong");
      card.querySelector("span").textContent = "?";
    });
    memoryOpen = [];
  }, 680);
}

function renderQuizPage() {
  clearPageTimers();
  activeMountId += 1;
  const mountId = activeMountId;
  mountChrome();
  resetMode();

  const quizBox = $("#quizBox");
  if (!quizBox) return;

  quizBox.addEventListener("click", (event) => {
    const tab = event.target.closest("button[data-mode]");
    if (tab) {
      resetMode(tab.dataset.mode);
      return;
    }
    const answer = event.target.closest("button[data-answer]");
    if (answer) handleQuiz(answer);
    const puzzle = event.target.closest("button[data-puzzle]");
    if (puzzle) handlePuzzle(puzzle);
    const poem = event.target.closest("button[data-poem]");
    if (poem) handlePoem(poem);
    const match = event.target.closest("button[data-match]");
    if (match) handleMatch(match);
    const sort = event.target.closest("button[data-sort]");
    if (sort) handleSort(sort);
    const memory = event.target.closest("button[data-pair]");
    if (memory) handleMemory(memory);
  });

  addPageCleanup(() => {
    if (activeMountId === mountId) activeMountId += 1;
    clearPageTimers();
  });
}

Object.assign(window.SeasonApp, { renderQuizPage });
})();
