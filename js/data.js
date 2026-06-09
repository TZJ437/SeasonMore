(() => {
const seasons = [
  {
    key: "spring",
    name: "春",
    title: "春生",
    range: "立春 - 谷雨",
    color: "#2f7a62",
    icon: "sprout",
    image: "./images/photos/along-river-qingming.jpg",
    summary: "春令重在生发。雨水、雷声、花信与春耕共同打开一年的秩序。",
    keywords: ["迎春", "春耕", "花信", "踏青"]
  },
  {
    key: "summer",
    name: "夏",
    title: "夏长",
    range: "立夏 - 大暑",
    color: "#c58d32",
    icon: "sun",
    image: "./images/photos/lotus-flower.jpg",
    summary: "夏令重在繁盛。小满、芒种、夏至把农事与太阳高度推到一年中最醒目的位置。",
    keywords: ["麦熟", "插秧", "长日", "伏暑"]
  },
  {
    key: "autumn",
    name: "秋",
    title: "秋收",
    range: "立秋 - 霜降",
    color: "#a93f33",
    icon: "leaf",
    image: "./images/photos/red-maple-leaves.jpg",
    summary: "秋令重在收敛。暑退、露寒、霜降让丰收、怀远与肃杀进入同一季节。",
    keywords: ["收获", "白露", "登高", "霜叶"]
  },
  {
    key: "winter",
    name: "冬",
    title: "冬藏",
    range: "立冬 - 大寒",
    color: "#2f6690",
    icon: "snowflake",
    image: "./images/photos/temple-of-heaven-winter.jpg",
    summary: "冬令重在收藏。冬至一阳来复，严寒之中已经藏着下一轮春意。",
    keywords: ["冬藏", "祭天", "围炉", "阳生"]
  }
];

const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

const solarTerms = [
  ["立春", "春", "约 2 月 3-5 日", 315, "sprout", "律回岁晚冰霜少，春到人间草木知。", "张栻《立春偶成》", "迎春、鞭春牛等习俗提醒农事将起。"],
  ["雨水", "春", "约 2 月 18-20 日", 330, "cloud-rain", "好雨知时节，当春乃发生。", "杜甫《春夜喜雨》", "降水增多，冬雪渐消，春耕准备开始急切。"],
  ["惊蛰", "春", "约 3 月 5-7 日", 345, "zap", "微雨众卉新，一雷惊蛰始。", "韦应物《观田家》", "春雷唤醒蛰虫，把听觉中的雷声转化为物候节点。"],
  ["春分", "春", "约 3 月 20-22 日", 0, "circle-divide", "仲春初四日，春色正中分。", "徐铉《春分日》", "昼夜近乎平分，呈现阴阳均衡的古典时间观。"],
  ["清明", "春", "约 4 月 4-6 日", 15, "flower-2", "清明时节雨纷纷，路上行人欲断魂。", "杜牧《清明》", "兼有节气与节日身份，祭扫、踏青和游赏并行。"],
  ["谷雨", "春", "约 4 月 19-21 日", 30, "wheat", "谷雨洗纤素，裁为白牡丹。", "王贞白《白牡丹》", "雨生百谷，茶事、牡丹与晚春农事在此时交织。"],
  ["立夏", "夏", "约 5 月 5-7 日", 45, "sun", "槐柳阴初密，帘栊暑尚微。", "陆游《立夏》", "夏令起笔，尝新、秤人等习俗记录身体感知。"],
  ["小满", "夏", "约 5 月 20-22 日", 60, "gauge", "小满田塍寻草药，农闲莫问动三车。", "农谚意象", "麦类籽粒渐满而未熟，名字保留了克制的分寸。"],
  ["芒种", "夏", "约 6 月 5-7 日", 75, "tractor", "时雨及芒种，四野皆插秧。", "陆游《时雨》", "带芒谷物收割，水稻移栽，农事节奏明显加快。"],
  ["夏至", "夏", "约 6 月 21-22 日", 90, "sun-medium", "昼晷已云极，宵漏自此长。", "韦应物《夏至避暑北池》", "白昼最长，测影定节气让天文与生活相接。"],
  ["小暑", "夏", "约 7 月 6-8 日", 105, "thermometer-sun", "倏忽温风至，因循小暑来。", "元稹《咏廿四气诗》", "暑气逼近极盛，荷花、蝉鸣和雷雨成为常见景象。"],
  ["大暑", "夏", "约 7 月 22-24 日", 120, "flame", "大暑三秋近，林钟九夏移。", "元稹《咏廿四气诗》", "一年暑热高峰，伏天、避暑与祈雨都与身体经验相关。"],
  ["立秋", "秋", "约 8 月 7-9 日", 135, "leaf", "云天收夏色，木叶动秋声。", "刘言史《立秋》", "天气未必立刻凉爽，但叙事已从生长转向成熟。"],
  ["处暑", "秋", "约 8 月 22-24 日", 150, "cloud-sun", "离离暑云散，袅袅凉风起。", "白居易《早秋曲江感怀》", "暑气将止，出游、开渔、晒秋等习俗迎接热退。"],
  ["白露", "秋", "约 9 月 7-9 日", 165, "droplets", "蒹葭苍苍，白露为霜。", "《诗经·蒹葭》", "昼夜温差带来露水，秋意从视觉和触感上变得鲜明。"],
  ["秋分", "秋", "约 9 月 22-24 日", 180, "circle-divide", "金气秋分，风清露冷秋期半。", "谢逸《点绛唇》", "昼夜再次近乎等长，也是丰收叙事的重要节点。"],
  ["寒露", "秋", "约 10 月 8-9 日", 195, "cloud-fog", "袅袅凉风动，凄凄寒露零。", "白居易《池上》", "比白露更冷，菊花、登高和深秋出行在此时交织。"],
  ["霜降", "秋", "约 10 月 23-24 日", 210, "snowflake", "霜降水返壑，风落木归山。", "白居易《岁晚》", "提示初霜出现，柿、菊、红叶成为这一时段的文化标识。"],
  ["立冬", "冬", "约 11 月 7-8 日", 225, "cloud-snow", "冻笔新诗懒写，寒炉美酒时温。", "冬令诗歌意象", "收藏开始，进补、酿酒、修仓都是迎接冬藏的安排。"],
  ["小雪", "冬", "约 11 月 22-23 日", 240, "cloud-snow", "小雪晴沙不作泥，疏帘红日弄朝晖。", "黄庭坚《春近四绝句》", "并非必然下大雪，而是寒潮与降水形态转换的提示。"],
  ["大雪", "冬", "约 12 月 6-8 日", 255, "snowflake", "夜深知雪重，时闻折竹声。", "白居易《夜雪》", "寒意更深，围炉、赏雪、咏梅让冬天拥有审美维度。"],
  ["冬至", "冬", "约 12 月 21-23 日", 270, "moon-star", "天时人事日相催，冬至阳生春又来。", "杜甫《小至》", "一阳来复之日，祭天礼制与民间饮食都赋予它高地位。"],
  ["小寒", "冬", "约 1 月 5-7 日", 285, "wind", "小寒连大吕，欢鹊垒新巢。", "元稹《咏廿四气诗》", "严寒期开端，候鸟、梅信与岁末准备共同进入感知。"],
  ["大寒", "冬", "约 1 月 20-21 日", 300, "thermometer-snowflake", "旧雪未及消，新雪又拥户。", "邵雍《大寒吟》意象", "节气循环的末尾。寒极之后，下一站便是立春。"]
].map(([name, season, date, angle, icon, poem, source, story], index) => ({
  id: index + 1,
  name,
  season,
  date,
  angle,
  icon,
  poem,
  source,
  story,
  image: season === "春" ? seasons[0].image : season === "夏" ? seasons[1].image : season === "秋" ? seasons[2].image : seasons[3].image
}));

const records = [
  { era: "先秦", title: "《礼记·月令》", icon: "scroll-text", text: "以孟、仲、季三月组织四时政令、农事、祭祀和禁令。" },
  { era: "汉代", title: "《淮南子·天文训》", icon: "orbit", text: "用天象、阴阳和气候解释四时运行。" },
  { era: "唐宋", title: "节令进入诗文与城市生活", icon: "book-open-text", text: "清明、寒食、重阳、冬至等节令频繁进入诗词和都市风俗。" },
  { era: "元代", title: "《授时历》", icon: "telescope", text: "郭守敬等改进历法推步，使节气计算更精密。" },
  { era: "明清", title: "冬至祭天与时宪历", icon: "landmark", text: "冬至祭天、颁历和节气推算共同服务国家礼制与民间日用。" }
];

const quizQuestions = [
  { q: "二十四节气主要依据什么划分？", options: ["太阳黄经", "月相圆缺", "生肖顺序"], answer: 0 },
  { q: "一季通常包含几个节气？", options: ["4 个", "6 个", "8 个"], answer: 1 },
  { q: "“冬至阳生春又来”强调的是？", options: ["阴极阳生", "秋收冬种", "雨生百谷"], answer: 0 },
  { q: "“芒种”最贴近哪类经验？", options: ["农事繁忙", "祭天礼制", "赏雪咏梅"], answer: 0 },
  { q: "六十甲子由什么组合而成？", options: ["十天干与十二地支", "四季与二十四节气", "七十二候与生肖"], answer: 0 }
];

const scenicSpots = [
  {
    name: "杭州西湖",
    season: "春",
    province: "浙江",
    image: "./images/photos/west-lake-hangzhou.jpg",
    source: "https://commons.wikimedia.org/wiki/File:West_Lake,_Hangzhou_(Wanzi_Pavilion).jpg",
    note: "湖山、柳色与春游传统相接，适合放在雨水、春分、清明语境中阅读。"
  },
  {
    name: "黄山云海",
    season: "春",
    province: "安徽",
    image: "./images/photos/mount-huangshan-clouds.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Mount-huangshan_53319729912.jpg",
    note: "山气、云雾、松石构成春夏之交的山水观看经验。"
  },
  {
    name: "桂林漓江",
    season: "夏",
    province: "广西",
    image: "./images/photos/li-river-guilin.jpg",
    source: "https://commons.wikimedia.org/wiki/File:1_li_jiang_guilin_yangshuo_2011.jpg",
    note: "夏令水气充盈，江面、峰林与舟行构成南方暑季图像。"
  },
  {
    name: "张家界",
    season: "夏",
    province: "湖南",
    image: "./images/photos/zhangjiajie-forest.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Zhangjiajie_National_Forest_Park.jpg",
    note: "盛夏山林繁茂，云雾与峰柱让物候空间更有层次。"
  },
  {
    name: "龙脊梯田",
    season: "夏",
    province: "广西",
    image: "./images/photos/longji-rice-terraces.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Longji_Rice_Terraces_004.jpg",
    note: "芒种前后稻作节奏鲜明，梯田能把农事时间可视化。"
  },
  {
    name: "九寨沟",
    season: "秋",
    province: "四川",
    image: "./images/photos/jiuzhaigou-sichuan.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Jiuzhaigou_Sichuan_China_Jiuzhaigou-Tibetan-Mystery-Theater-07.jpg",
    note: "秋令水色与林色变化明显，适合表现白露、秋分后的清寒。"
  },
  {
    name: "红枫叶",
    season: "秋",
    province: "秋景",
    image: "./images/photos/red-maple-leaves.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Red_Maple_Leaves_in_Yahiko.JPG",
    note: "霜叶、红叶与秋令收敛感相连。"
  },
  {
    name: "苏州狮子林",
    season: "秋",
    province: "江苏",
    image: "./images/photos/lion-grove-garden-suzhou.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Lion_Grove_Garden_Suzhou_November_2017_009.jpg",
    note: "园林让秋令不只在山野，也进入城市与文人生活。"
  },
  {
    name: "雪后故宫",
    season: "冬",
    province: "北京",
    image: "./images/photos/forbidden-city-snow.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Forbidden_City_after_snow_(20200106114845).jpg",
    note: "冬雪与宫城礼制空间相遇，适合连接小雪、大雪与冬至。"
  },
  {
    name: "天坛祈年殿",
    season: "冬",
    province: "北京",
    image: "./images/photos/temple-of-heaven-winter.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Temple_of_Heaven_-_Hall_of_Prayer_for_Good_Harvests_01_(cropped).jpg",
    note: "冬至祭天把天文、历法与国家礼制连接到一起。"
  },
  {
    name: "颐和园万寿山",
    season: "冬",
    province: "北京",
    image: "./images/photos/longevity-hill-summer-palace.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Longevity_Hill_of_the_Summer_Palace.jpg",
    note: "北方园林在冬令中呈现山、湖、宫殿与寒色。"
  },
  {
    name: "清明上河图局部",
    season: "春",
    province: "图像史",
    image: "./images/photos/along-river-qingming.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Along_the_River_During_the_Qingming_Festival_(Qing_Court_Version)_08.jpg",
    note: "节气进入城市生活后，交通、贸易、祭扫与游赏都成为岁时图像。"
  },
  {
    name: "春日油菜花",
    season: "春",
    province: "田野花信",
    image: "./images/photos/rapeseed-flowers.jpg",
    source: "https://commons.wikimedia.org/wiki/Category:Brassica_napus_(flowers)",
    note: "成片油菜花把春分、清明前后的花信与农田景观看得很直观。"
  },
  {
    name: "布达拉宫",
    season: "春",
    province: "西藏",
    image: "./images/photos/potala-palace-lhasa.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Potala_Palace,_Lhasa,_Tibet,_China.JPG",
    note: "高原春光让建筑、山体与天空形成开阔层次，适合放入春末游观语境。"
  },
  {
    name: "黄果树瀑布",
    season: "夏",
    province: "贵州",
    image: "./images/photos/huangguoshu-fall.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Huangguoshu_Fall_Classic_View.jpg",
    note: "夏令水势充沛，瀑布声量与暑热、雨季、山地湿气相互呼应。"
  },
  {
    name: "龙脊梯田山路",
    season: "夏",
    province: "广西",
    image: "./images/photos/longji-rice-terraces-path.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Longji_rice_terraces_in_China.jpg",
    note: "梯田坡线和劳作路径能把芒种、小暑前后的田间节奏表现出来。"
  },
  {
    name: "元阳哈尼梯田",
    season: "夏",
    province: "云南",
    image: "./images/photos/yuanyang-rice-terraces.jpg",
    source: "https://en.wikipedia.org/wiki/Honghe_Hani_Rice_Terraces",
    note: "水田镜面与山地农业相连，适合作为南方夏令农事图像。"
  },
  {
    name: "喀纳斯湖",
    season: "秋",
    province: "新疆",
    image: "./images/photos/kanas-lake-altay.jpg",
    source: "https://commons.wikimedia.org/wiki/Category:Lake_Kanas",
    note: "秋季湖色、林色与冷空气交叠，适合表现白露之后的清寒。"
  },
  {
    name: "黄山雪景",
    season: "冬",
    province: "安徽",
    image: "./images/photos/huangshan-snow.jpg",
    source: "https://commons.wikimedia.org/wiki/Category:Huangshan_in_winter",
    note: "松石、云海与积雪形成冬季山水的层次，适合连接小雪、大雪。"
  },
  {
    name: "哈尔滨冰雪大世界",
    season: "冬",
    province: "黑龙江",
    image: "./images/photos/ice-snow-world.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Ice_Snow_World.jpg",
    note: "冰雕把严寒变成可游览的城市景观，让大寒不只是气温数字。"
  },
  {
    name: "桃花初放",
    season: "春",
    province: "物候插图",
    image: "./images/photos/spring-peach-blossom.jpg",
    source: "./images/photos/spring-peach-blossom.jpg",
    note: "桃花、春枝与轻暖气息适合表现惊蛰、春分前后的花信推进。"
  },
  {
    name: "春日茶山",
    season: "春",
    province: "农事插图",
    image: "./images/photos/spring-tea-terraces.jpg",
    source: "./images/photos/spring-tea-terraces.jpg",
    note: "茶垄和新绿把谷雨前后的采茶、雨水与晚春农事放在同一画面里。"
  },
  {
    name: "柳雨春堤",
    season: "春",
    province: "江南物候",
    image: "./images/photos/spring-willow-rain.jpg",
    source: "./images/photos/spring-willow-rain.jpg",
    note: "柳色、细雨和水岸适合补充雨水、清明一类潮湿明净的春令图像。"
  },
  {
    name: "麦浪小满",
    season: "夏",
    province: "农田插图",
    image: "./images/photos/summer-wheat-field.jpg",
    source: "./images/photos/summer-wheat-field.jpg",
    note: "麦穗渐满而未熟，能把小满、芒种之间的农事节奏讲得更直观。"
  },
  {
    name: "林间蝉声",
    season: "夏",
    province: "物候插图",
    image: "./images/photos/summer-cicada-woods.jpg",
    source: "./images/photos/summer-cicada-woods.jpg",
    note: "蝉鸣、浓荫和湿热空气适合表现小暑、大暑前后的盛夏感官。"
  },
  {
    name: "荷塘雷雨",
    season: "夏",
    province: "水泽插图",
    image: "./images/photos/summer-lotus-thunder.jpg",
    source: "./images/photos/summer-lotus-thunder.jpg",
    note: "荷叶、雷光与水面把暑热、阵雨和夏季植物繁盛放在一起。"
  },
  {
    name: "晒秋场景",
    season: "秋",
    province: "收获民俗",
    image: "./images/photos/autumn-harvest-drying.jpg",
    source: "./images/photos/autumn-harvest-drying.jpg",
    note: "晒秋能补充处暑、秋分之后的收获经验，让秋令不只停在山水色彩。"
  },
  {
    name: "蒹葭白露",
    season: "秋",
    province: "水岸物候",
    image: "./images/photos/autumn-reeds-white-dew.jpg",
    source: "./images/photos/autumn-reeds-white-dew.jpg",
    note: "芦苇和露珠适合连接白露、寒露的触感，也回应《诗经》里的秋水意象。"
  },
  {
    name: "菊花秋圃",
    season: "秋",
    province: "花事插图",
    image: "./images/photos/autumn-chrysanthemum-garden.jpg",
    source: "./images/photos/autumn-chrysanthemum-garden.jpg",
    note: "菊花、重阳与深秋出行相连，可补足寒露、霜降前后的花事线索。"
  },
  {
    name: "雪中梅信",
    season: "冬",
    province: "岁寒物候",
    image: "./images/photos/winter-plum-snow.jpg",
    source: "./images/photos/winter-plum-snow.jpg",
    note: "梅花和雪景把小寒、大寒的严冷转成可被记忆的岁末花信。"
  },
  {
    name: "冰封河面",
    season: "冬",
    province: "北方寒候",
    image: "./images/photos/winter-frozen-river.jpg",
    source: "./images/photos/winter-frozen-river.jpg",
    note: "冰裂、水面和远山适合表现小雪、大雪之后的寒候层次。"
  },
  {
    name: "冬至圜丘",
    season: "冬",
    province: "礼制意象",
    image: "./images/photos/winter-solstice-altar.jpg",
    source: "./images/photos/winter-solstice-altar.jpg",
    note: "圜丘、日影和寒色呼应冬至祭天，把天文节点转化为礼制空间。"
  }
];

const classicStories = [
  {
    title: "《礼记·月令》：四季进入制度",
    tag: "典籍",
    text: "《月令》把四时分成孟、仲、季三段，安排政令、农事、祭祀和禁令。它说明季节不是背景，而是古代治理秩序的一部分。"
  },
  {
    title: "清明：节气如何变成节日",
    tag: "故事",
    text: "清明兼有节气和节日身份，祭扫、踏青、游赏并行。《清明上河图》的城市烟火，也让清明从气候节点变成社会生活的场景。"
  },
  {
    title: "冬至：一阳来复",
    tag: "礼制",
    text: "冬至白昼至短，古人称一阳来复。明清时期冬至祭天隆重举行，天文、历法与王朝礼制在这一日汇合。"
  },
  {
    title: "芒种：忙种也是忙收",
    tag: "农事",
    text: "芒种前后，带芒谷物收割，水稻移栽，农事节奏明显加快。它比单纯的日期更接近身体和田野的时间。"
  }
];

const storyChapters = [
  {
    tag: "典籍",
    title: "《礼记·月令》：把四时写成治理秩序",
    subtitle: "月份、物候、政令、祭祀和禁忌被放在同一张时间表里。",
    season: "四时",
    icon: "scroll-text",
    image: "./images/photos/classic-monthly-scroll.jpg",
    imageAlt: "《月令》卷轴与月序插图",
    imageNote: "卷轴、月序和格线强调《月令》把四时写成可执行的秩序。",
    excerpt: "孟春之月，日在营室。",
    plain: "这句把春季第一个月和天象位置放在一起，说明古人不是单看天气，而是用天文坐标组织月份、政令和农事。",
    summary: "《月令》的重要性不只在于记录季节，而在于它把季节变成可执行的社会秩序：何时劝农、何时修仓、何时祭祀、何时禁止砍伐，都跟天时相连。",
    points: ["孟仲季三月结构", "政令与农事同表", "礼制化的季节观"],
    details: [
      {
        heading: "从自然时间到制度时间",
        text: "《月令》把一年拆成春、夏、秋、冬四组，每组又分孟、仲、季三月。这样的划分不是简单记日子，而是把气候、农事、祭祀、赏罚、修造和禁令编入同一套节奏。对古人来说，顺时不是诗意姿态，而是治理是否得当的判断标准。"
      },
      {
        heading: "为什么适合科普节气",
        text: "现代人常把节气理解成天气提醒，但《月令》提示我们：节气背后还有社会组织。春天强调生发，所以少杀伐、劝农桑；秋天强调收敛，所以讲仓储、审刑和肃杀。它把抽象的阴阳气候，转译为可操作的生活安排。"
      },
      {
        heading: "阅读线索",
        text: "读《月令》时可以抓住三个层次：先看月序如何排列，再看每月标出的物候，最后看政令如何跟季节相配。这样就能明白，四时在古代并不是背景板，而是一种把天地、国家和日常生活接起来的知识系统。"
      }
    ]
  },
  {
    tag: "天文",
    title: "《淮南子·天文训》：节气为什么和太阳有关",
    subtitle: "二十四节气的核心，是太阳周年运动造成的寒暑与昼夜变化。",
    season: "全年",
    icon: "orbit",
    image: "./images/photos/classic-star-map.jpg",
    imageAlt: "星图与太阳周年运动插图",
    imageNote: "星点、弧线和黄道感帮助读者把节气重新放回天文坐标里。",
    excerpt: "斗指子，则冬至。",
    plain: "古人曾借北斗斗柄指向来标定冬至。今天讲节气，可以把这种观象授时转译为太阳年中的位置刻度。",
    summary: "节气看起来像农历内容，其实主要依据太阳位置。太阳黄经每运行十五度，对应一个节气，这也是为什么节气能较稳定地落在公历日期附近。",
    points: ["太阳黄经", "寒暑推移", "昼夜长短"],
    details: [
      {
        heading: "节气不是按月亮圆缺划分",
        text: "农历月份重视月相，朔望决定月的起止；节气则重视太阳周年运动。春分、秋分昼夜近均，夏至白昼最长，冬至白昼最短，这些都来自地球绕太阳公转与地轴倾斜造成的光照差异。"
      },
      {
        heading: "古人如何把天象变成日用",
        text: "《淮南子·天文训》一类文本会把星辰、阴阳、方位、四时放在一个解释框架中。它不等同于现代天文学，但它说明古人很早就试图用可观察的天象去解释季节更替，并进一步安排农事和礼俗。"
      },
      {
        heading: "今天怎么理解",
        text: "科普节气时，可以把它放在两个坐标里：天文学上，它是太阳位置的分段；生活经验上，它是气温、降水、物候和农事的提示。两者叠在一起，才构成二十四节气的完整意义。"
      }
    ]
  },
  {
    tag: "物候",
    title: "七十二候：把季节拆成可观察的细节",
    subtitle: "鸟兽、草木、雷声、露霜，都是古人记录时间的传感器。",
    season: "全年",
    icon: "leaf",
    image: "./images/photos/classic-phenology-circles.jpg",
    imageAlt: "七十二候物候观察插图",
    imageNote: "花、叶、霜雪和谷物被放进同一张观察图，提示一节三候的细密变化。",
    excerpt: "五日谓之候，三候谓之气。",
    plain: "候是比节气更细的观察单位。把一个节气再拆成三段，就能记录花开、雷动、露凝这类渐变细节。",
    summary: "二十四节气每气再分三候，共七十二候。它们把宏观季节拆成更细的观察单位，让时间通过自然现象被看见、听见和触摸到。",
    points: ["一节三候", "物候观察", "地域差异"],
    details: [
      {
        heading: "候是更细的时间颗粒",
        text: "如果说节气像一年中的二十四个节点，那么候就是节点之间的微小变化。雷声初动、桃花开放、鸿雁来去、露水凝结，这些现象让人感到季节不是突然切换，而是逐步推进。"
      },
      {
        heading: "为什么会有不准确感",
        text: "七十二候来自特定历史经验，不能机械套用到所有地区。中国南北纬度、海拔和水陆环境差异很大，同一个节气在岭南、江南、华北和高原会呈现不同物候。科普时要把它看成观察传统，而不是全国统一的天气预报。"
      },
      {
        heading: "适合怎样阅读",
        text: "读七十二候，重点不是背诵每一候，而是学会观察：春天看芽和花，夏天听雷和蝉，秋天看露和叶，冬天看霜雪与水面。它让时间从数字重新回到感官。"
      }
    ]
  },
  {
    tag: "节日",
    title: "清明：一个节气怎样长成节日",
    subtitle: "清明连接了天气、踏青、祭扫、城市生活和家族记忆。",
    season: "春",
    icon: "book-open-text",
    image: "./images/photos/along-river-qingming.jpg",
    imageAlt: "清明城市生活图像",
    imageNote: "清明的天气、出行与城市烟火，在图像里自然连到社会生活。",
    excerpt: "清明时节雨纷纷。",
    plain: "这句保留了人们对清明最熟悉的感受：湿润天气、出行路途和情绪记忆叠在一起，使节气长成节日。",
    summary: "清明本是春季节气，后来与寒食、上巳等习俗交织，逐渐形成扫墓、踏青、插柳、郊游并存的节日形态。",
    points: ["节气与节日重叠", "寒食与祭扫", "踏青游赏"],
    details: [
      {
        heading: "节气身份",
        text: "清明在春分之后、谷雨之前，空气转暖，草木繁茂，雨水增多。它的名字本身就带有天气和景观意味：清而明，正适合描述暮春时节的光线、湿度和植物状态。"
      },
      {
        heading: "节日身份",
        text: "清明又不只是天气节点。扫墓祭祖让它通向家族记忆，踏青郊游让它通向身体经验，城市商业和出行活动又让它进入社会生活。《清明上河图》之所以常被放进清明语境，也因为它呈现了春日城市的流动与烟火。"
      },
      {
        heading: "科普重点",
        text: "清明最适合说明节气与节日的区别：节气偏向天文和物候，节日偏向社会习俗。清明恰好兼有两种身份，所以它比许多节气更容易被现代人持续感知。"
      }
    ]
  },
  {
    tag: "农事",
    title: "芒种：忙种，也是忙收",
    subtitle: "一个名字里同时藏着麦熟、收割、插秧和雨季。",
    season: "夏",
    icon: "wheat",
    image: "./images/photos/summer-wheat-field.jpg",
    imageAlt: "芒种麦浪农事插图",
    imageNote: "麦穗和田间线条把“该收的收、该种的种”变成可见的农事节奏。",
    excerpt: "时雨及芒种，四野皆插秧。",
    plain: "芒种不是抽象日期，而是雨热同季下的劳动节拍：有的地方收麦，有的地方插秧，收与种同时赶路。",
    summary: "芒种处在初夏农事最紧密的阶段，北方麦类成熟，南方水稻移栽，收与种交错发生。",
    points: ["麦熟收割", "水稻移栽", "雨热同季"],
    details: [
      {
        heading: "为什么叫芒种",
        text: "“芒”指有芒的谷物，如麦、稻等。芒种不是单指播种，而是提醒带芒作物该收的收、该种的种。它让农事时间变得非常紧迫，也因此民间常把它理解成“忙种”。"
      },
      {
        heading: "它说明了什么",
        text: "芒种把中国农业的区域差异集中呈现出来：有些地方正忙着收麦，有些地方正忙着插秧；雨水、温度和田间劳作同时加速。节气在这里不是抽象日期，而是劳动节奏。"
      },
      {
        heading: "适合放进哪些故事",
        text: "讲芒种，可以配合梯田、水田、麦浪和农具，也可以讲“送花神”等暮春入夏的民俗。这样观众会明白，节气既关乎庄稼，也关乎人如何安排体力、节奏和期待。"
      }
    ]
  },
  {
    tag: "礼制",
    title: "冬至：一阳来复与国家礼仪",
    subtitle: "最短白昼并不是终点，而是新一轮阳气回升的开始。",
    season: "冬",
    icon: "moon-star",
    image: "./images/photos/winter-solstice-altar.jpg",
    imageAlt: "冬至圜丘礼制插图",
    imageNote: "冬日圜丘与低日影对应冬至，把天文转折落到礼制空间中。",
    excerpt: "冬至阳生春又来。",
    plain: "冬至不是寒冷的终点叙事，而是阳气回升的起点叙事。最短白昼之后，新的循环已经开始。",
    summary: "冬至在古代地位很高，因为它把天文转折、历法节点、祭天礼仪和民间饮食都聚集到一天。",
    points: ["昼短夜长", "一阳来复", "祭天与团聚"],
    details: [
      {
        heading: "天文意义",
        text: "冬至前后，北半球白昼达到一年中较短阶段，随后日照时间开始回升。古人用“一阳来复”理解这种转折：寒冷仍在，但新的生机已经开始积蓄。"
      },
      {
        heading: "礼制意义",
        text: "在国家礼仪中，冬至常与祭天相连。天坛等礼制空间让冬至不只是自然现象，而成为王朝秩序与宇宙秩序相互确认的时刻。天文、历法和政治象征在这里汇合。"
      },
      {
        heading: "民间意义",
        text: "民间冬至有吃饺子、汤圆、羊肉等习俗，不同地区各有侧重。共同点是把寒冷时节转化为团聚、进补和守望新岁的生活经验。"
      }
    ]
  },
  {
    tag: "诗词",
    title: "诗词里的四季：感官如何保存时间",
    subtitle: "春雨、夏荷、秋霜、冬雪，让节气从历法走进记忆。",
    season: "四时",
    icon: "book-open-text",
    image: "./images/photos/winter-plum-snow.jpg",
    imageAlt: "雪中梅花诗词意象",
    imageNote: "梅花、雪色和枝影适合说明诗词怎样把季节保存为可反复阅读的意象。",
    excerpt: "好雨知时节，当春乃发生。",
    plain: "诗词把抽象节令转成感官记忆。读到雨声、花信、蝉鸣和雪夜，节气就不只是历法表格。",
    summary: "诗词并不负责解释节气原理，却负责保存季节经验。它把雨声、花信、蝉鸣、霜叶和雪夜变成可反复阅读的时间记忆。",
    points: ["春雨花信", "夏荷蝉声", "秋霜冬雪"],
    details: [
      {
        heading: "诗词补足了什么",
        text: "节气提供结构，诗词提供感受。比如春天不只是立春、雨水、惊蛰的排列，也是一场雨、一枝花、一阵东风；秋天不只是白露、秋分、霜降，也是一片叶、一层露、一段登高远望。"
      },
      {
        heading: "为什么要放在科普里",
        text: "纯讲历法容易变成知识表格，纯讲诗词又容易脱离节气原理。把二者放在一起，可以让观众既知道节气为何发生，也知道它为何被人记住。"
      },
      {
        heading: "阅读方式",
        text: "读季节诗词时，可以先问三个问题：它写的是哪种天气？对应哪类物候？人正在做什么？这三个问题能把诗意重新接回节气、农事和生活现场。"
      }
    ]
  },
  {
    tag: "历法",
    title: "干支与节气：两套循环怎样并行",
    subtitle: "六十甲子记录循环，节气标定太阳年的节点。",
    season: "全年",
    icon: "calendar-search",
    image: "./images/photos/classic-calendar-chart.jpg",
    imageAlt: "干支与节气循环图",
    imageNote: "表格、圆盘和二十四刻度提示干支循环与太阳年节点并行存在。",
    excerpt: "中冬十一月甲子朔旦冬至。",
    plain: "这类历法表述会同时出现月份、干支、朔日和节气，说明传统时间系统常把多套循环并排记录。",
    summary: "干支和节气常一起出现在传统历法中，但它们承担的任务不同。干支强调周期编号，节气强调太阳年中的气候节点。",
    points: ["天干地支", "六十甲子", "太阳年节点"],
    details: [
      {
        heading: "干支是什么",
        text: "十天干与十二地支相配，形成六十个组合，称为六十甲子。它可以用来纪年、纪月、纪日、纪时，重在给时间建立循环编号。"
      },
      {
        heading: "节气是什么",
        text: "节气对应太阳在黄道上的位置，重在标定一年中寒暑、昼夜、降水和物候的推进。它与农业和季节感密切相关，因此常被用来判断春耕、夏长、秋收、冬藏的节奏。"
      },
      {
        heading: "为什么会一起出现",
        text: "传统历书需要同时回答两类问题：今天在循环中排第几位，当前处在太阳年的什么阶段。干支回答前者，节气回答后者。把它们并读，才更接近古人使用时间的方式。"
      }
    ]
  }
];

const storyTimeline = [
  {
    era: "先秦",
    title: "月令传统成形",
    text: "以月序组织物候、政令和祭祀，四时开始成为制度化知识。"
  },
  {
    era: "秦汉",
    title: "天文与历法解释加强",
    text: "阴阳、星象、方位和四时被纳入更完整的宇宙论叙述。"
  },
  {
    era: "唐宋",
    title: "节令进入诗词与城市生活",
    text: "清明、寒食、重阳、冬至等节令在诗文、游赏和市井生活中更加鲜明。"
  },
  {
    era: "元明清",
    title: "历法推算与礼仪空间精细化",
    text: "授时历等历法推进节气计算，冬至祭天等礼制持续强化节令象征。"
  },
  {
    era: "现代",
    title: "从农事经验到公共科普",
    text: "节气被重新用于教育、文旅、饮食、气象传播和文化记忆。"
  }
];

window.SeasonData = {
  animals,
  branches,
  classicStories,
  records,
  quizQuestions,
  scenicSpots,
  seasons,
  solarTerms,
  storyChapters,
  storyTimeline,
  stems
};
})();
