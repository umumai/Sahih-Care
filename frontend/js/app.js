(function () {
  "use strict";

  var SCALE_MIN = 100;
  var SCALE_MAX = 160;
  var SCALE_STEP = 10;
  var BASE_PX = 18;
  var API_URL = "/api/health/check";

  var LANGS = {
    ms: { flag: "ASSET/LOGO/melayu.png", dir: "ltr", name: "Bahasa Melayu" },
    en: { flag: "ASSET/LOGO/english.png", dir: "ltr", name: "English" },
    zh: { flag: "ASSET/LOGO/mandarin.png", dir: "ltr", name: "中文" },
    ar: { flag: "ASSET/LOGO/arab.png", dir: "rtl", name: "العربية" },
    ta: { flag: "ASSET/LOGO/tamil.png", dir: "ltr", name: "தமிழ்" },
  };

  var STRINGS = {
    ms: {
      skip: "Langkau ke kandungan",
      chooseLanguage: "Pilih bahasa",
      textSize: "Saiz teks",
      smallerText: "Kecilkan teks",
      largerText: "Besarkan teks",
      home: "Utama",
      switchView: "Tukar paparan",
      healthNews: "Berita kesihatan",
      checkMessage: "Semak mesej",
      heroTitle: "Semak Sebelum Percaya",
      heroSubtitle: "Semak kesahihan mesej kesihatan anda di sini.",
      newsTitle: "Jangan Kongsi Dulu",
      newsSubtitle: "Semak amaran scam & tip rasmi sebelum teruskan mesej WhatsApp.",
      newsSource: "Sumber",
      pastedMessage: "Mesej yang ditampal",
      loading: "Mencari sumber yang disahkan",
      source: "SUMBER",
      readMore: "BACA LAGI ▾",
      readLess: "TUTUP ▴",
      officialSources: "Sumber rasmi",
      checkAnother: "Semak mesej lain",
      pasteLabel: "Tampal mesej kesihatan di sini",
      pastePlaceholder: "Tampal mesej WhatsApp di sini...",
      photo: "Foto",
      paste: "Tampal",
      check: "SEMAK SEKARANG",
      healthInfo: "Maklumat kesihatan",
      empty: "Sila tampal atau taip mesej kesihatan dahulu.",
      clipboardUnsupported: "Tidak dapat baca papan keratan. Tekan lama dalam kotak dan pilih Tampal.",
      clipboardEmpty: "Papan keratan kosong. Salin mesej WhatsApp dahulu.",
      clipboardDenied: "Benarkan akses papan keratan, atau tampal secara manual dalam kotak.",
      photoSoon: "Fungsi foto (OCR) akan datang. Sila tampal teks mesej untuk semakan.",
      unavailable: "Maaf, perkhidmatan semakan tidak tersedia. Cuba lagi.",
      trustedTitle: "Dipercayai Ramai",
      totalVisitors: "Jumlah Pelawat",
      visitorsTrend: "▲ 12% berbanding minggu lalu",
      telegramFaster: "Lebih Pantas",
      telegramReady: "Sedia membantu di Telegram",
      telegramAria: "Buka @sahihcare_bot di Telegram",
      verdicts: {
        VERIFIED: "BENAR",
        FALSE: "FALSE",
        MISLEADING: "MENGELIRUKAN",
        UNVERIFIED: "TIDAK PASTI",
        NOT_HEALTH: "BUKAN KESIHATAN",
      },
    },
    en: {
      skip: "Skip to content",
      chooseLanguage: "Choose language",
      textSize: "Text size",
      smallerText: "Make text smaller",
      largerText: "Make text larger",
      home: "Home",
      switchView: "Switch view",
      healthNews: "Health news",
      checkMessage: "Check a message",
      heroTitle: "Check Before Believing",
      heroSubtitle: "Verify your health message here.",
      newsTitle: "Don't Share Yet",
      newsSubtitle: "Check scam alerts & official tips before forwarding WhatsApp health messages.",
      newsSource: "Source",
      pastedMessage: "Pasted message",
      loading: "Fetching verified sources",
      source: "SOURCE",
      readMore: "READ MORE ▾",
      readLess: "READ LESS ▴",
      officialSources: "Official sources",
      checkAnother: "Check another message",
      pasteLabel: "Paste a health message here",
      pastePlaceholder: "Paste WhatsApp message here...",
      photo: "Photo",
      paste: "Paste",
      check: "CHECK NOW",
      healthInfo: "Health information",
      empty: "Please paste or type a health message first.",
      clipboardUnsupported: "Cannot read the clipboard. Long-press in the box and choose Paste.",
      clipboardEmpty: "Clipboard is empty. Copy a WhatsApp message first.",
      clipboardDenied: "Allow clipboard access, or paste into the box yourself.",
      photoSoon: "Photo check (OCR) is coming soon. Please paste the message text.",
      unavailable: "Sorry, the checking service is unavailable. Try again.",
      trustedTitle: "Trusted by Many",
      totalVisitors: "Total Visitors",
      visitorsTrend: "▲ 12% vs last week",
      telegramFaster: "Faster",
      telegramReady: "Ready to help on Telegram",
      telegramAria: "Open @sahihcare_bot on Telegram",
      verdicts: {
        VERIFIED: "TRUE",
        FALSE: "FALSE",
        MISLEADING: "MISLEADING",
        UNVERIFIED: "UNVERIFIED",
        NOT_HEALTH: "NOT HEALTH",
      },
    },
    zh: {
      skip: "跳到正文",
      chooseLanguage: "选择语言",
      textSize: "文字大小",
      smallerText: "缩小文字",
      largerText: "放大文字",
      home: "主页",
      switchView: "切换页面",
      healthNews: "健康新闻",
      checkMessage: "核查讯息",
      heroTitle: "有疑问？",
      heroSubtitle: "在这里核查健康讯息是否属实。",
      newsTitle: "先别转发",
      newsSubtitle: "转发健康讯息前，先看诈骗警示与官方提示。",
      newsSource: "来源",
      pastedMessage: "已粘贴的讯息",
      loading: "正在查找可靠来源",
      source: "来源",
      readMore: "阅读更多 ▾",
      readLess: "收起 ▴",
      officialSources: "官方来源",
      checkAnother: "核查另一则讯息",
      pasteLabel: "在此粘贴健康讯息",
      pastePlaceholder: "粘贴到这里",
      photo: "照片",
      paste: "粘贴",
      check: "核查",
      healthInfo: "健康资讯",
      empty: "请先粘贴或输入健康讯息。",
      clipboardUnsupported: "无法读取剪贴板。请在输入框长按并选择粘贴。",
      clipboardEmpty: "剪贴板是空的。请先复制 WhatsApp 讯息。",
      clipboardDenied: "请允许剪贴板权限，或自行粘贴到输入框。",
      photoSoon: "照片识别即将推出。请先粘贴文字。",
      unavailable: "抱歉，核查服务暂时无法使用。请再试一次。",
      trustedTitle: "深受信赖",
      totalVisitors: "总访问量",
      visitorsTrend: "▲ 较上周增长 12%",
      telegramFaster: "更快",
      telegramReady: "Telegram 随时为您服务",
      telegramAria: "在 Telegram 打开 @sahihcare_bot",
      verdicts: {
        VERIFIED: "属实",
        FALSE: "虚假",
        MISLEADING: "误导",
        UNVERIFIED: "无法确认",
        NOT_HEALTH: "非健康问题",
      },
    },
    ar: {
      skip: "تخطي إلى المحتوى",
      chooseLanguage: "اختر اللغة",
      textSize: "حجم النص",
      smallerText: "تصغير النص",
      largerText: "تكبير النص",
      home: "الرئيسية",
      switchView: "تغيير العرض",
      healthNews: "أخبار الصحة",
      checkMessage: "تحقق من الرسالة",
      heroTitle: "لديك سؤال؟",
      heroSubtitle: "تحقق من صحة رسالة صحية هنا.",
      newsTitle: "لا تشارك بعد",
      newsSubtitle: "تحقق من تحذيرات الاحتيال والنصائح الرسمية قبل إعادة إرسال رسائل واتساب الصحية.",
      newsSource: "المصدر",
      pastedMessage: "الرسالة الملصقة",
      loading: "جاري جلب مصادر موثوقة",
      source: "المصدر",
      readMore: "اقرأ المزيد ▾",
      readLess: "عرض أقل ▴",
      officialSources: "مصادر رسمية",
      checkAnother: "تحقق من رسالة أخرى",
      pasteLabel: "الصق رسالة صحية هنا",
      pastePlaceholder: "الصق هنا",
      photo: "صورة",
      paste: "لصق",
      check: "تحقق",
      healthInfo: "معلومات صحية",
      empty: "يرجى لصق أو كتابة رسالة صحية أولاً.",
      clipboardUnsupported: "تعذر قراءة الحافظة. اضغط مطولاً في الصندوق واختر لصق.",
      clipboardEmpty: "الحافظة فارغة. انسخ رسالة واتساب أولاً.",
      clipboardDenied: "اسمح بالوصول إلى الحافظة، أو الصق النص بنفسك.",
      photoSoon: "فحص الصور قادم قريباً. يرجى لصق نص الرسالة.",
      unavailable: "عذراً، خدمة التحقق غير متاحة. حاول مرة أخرى.",
      trustedTitle: "موثوق به من الكثيرين",
      totalVisitors: "إجمالي الزوار",
      visitorsTrend: "▲ 12٪ مقارنة بالأسبوع الماضي",
      telegramFaster: "أسرع",
      telegramReady: "جاهزون للمساعدة على تيليجرام",
      telegramAria: "افتح @sahihcare_bot على تيليجرام",
      verdicts: {
        VERIFIED: "صحيح",
        FALSE: "زائف",
        MISLEADING: "مضلل",
        UNVERIFIED: "غير مؤكد",
        NOT_HEALTH: "ليس صحياً",
      },
    },
    ta: {
      skip: "உள்ளடக்கத்திற்குச் செல்",
      chooseLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
      textSize: "எழுத்து அளவு",
      smallerText: "எழுத்தைச் சிறிதாக்கு",
      largerText: "எழுத்தைப் பெரிதாக்கு",
      home: "முகப்பு",
      switchView: "காட்சியை மாற்று",
      healthNews: "சுகாதாரச் செய்திகள்",
      checkMessage: "செய்தியைச் சரிபார்",
      heroTitle: "கேள்வி உள்ளதா?",
      heroSubtitle: "உங்கள் சுகாதாரச் செய்தியை இங்கே சரிபாருங்கள்.",
      newsTitle: "இன்னும் பகிர வேண்டாம்",
      newsSubtitle: "வாட்ஸ்அப் சுகாதாரச் செய்தியைப் பகிரும் முன் மோசடி எச்சரிக்கையையும் அதிகாரப்பூர்வ குறிப்புகளையும் பாருங்கள்.",
      newsSource: "ஆதாரம்",
      pastedMessage: "ஒட்டப்பட்ட செய்தி",
      loading: "சரிபார்க்கப்பட்ட ஆதாரங்களைப் பெறுகிறது",
      source: "ஆதாரம்",
      readMore: "மேலும் படி ▾",
      readLess: "சுருக்கு ▴",
      officialSources: "அதிகாரப்பூர்வ ஆதாரங்கள்",
      checkAnother: "வேறு செய்தியைச் சரிபார்",
      pasteLabel: "சுகாதாரச் செய்தியை இங்கே ஒட்டவும்",
      pastePlaceholder: "இங்கே ஒட்டவும்",
      photo: "புகைப்படம்",
      paste: "ஒட்டு",
      check: "சரிபார்",
      healthInfo: "சுகாதாரத் தகவல்",
      empty: "முதலில் ஒரு சுகாதாரச் செய்தியை ஒட்டவும் அல்லது தட்டச்சு செய்யவும்.",
      clipboardUnsupported: "கிளிப்போர்டைப் படிக்க முடியவில்லை. பெட்டியில் நீண்ட நேரம் அழுத்தி ஒட்டு என்பதைத் தேர்வு செய்யவும்.",
      clipboardEmpty: "கிளிப்போர்டு காலியாக உள்ளது. முதலில் வாட்ஸ்அப் செய்தியை நகலெடுக்கவும்.",
      clipboardDenied: "கிளிப்போர்டு அனுமதியை அளிக்கவும், அல்லது நீங்களே ஒட்டவும்.",
      photoSoon: "புகைப்படச் சரிபார்ப்பு விரைவில் வரும். செய்தி உரையை ஒட்டவும்.",
      unavailable: "மன்னிக்கவும், சரிபார்ப்பு சேவை கிடைக்கவில்லை. மீண்டும் முயற்சிக்கவும்.",
      trustedTitle: "பலரால் நம்பப்படுகிறது",
      totalVisitors: "மொத்த பார்வையாளர்கள்",
      visitorsTrend: "▲ கடந்த வாரத்தை விட 12%",
      telegramFaster: "வேகமாக",
      telegramReady: "டெலிகிராமில் உதவ தயார்",
      telegramAria: "டெலிகிராமில் @sahihcare_bot ஐத் திறக்கவும்",
      verdicts: {
        VERIFIED: "உண்மை",
        FALSE: "பொய்",
        MISLEADING: "தவறாக வழிநடத்தும்",
        UNVERIFIED: "உறுதிப்படுத்தப்படவில்லை",
        NOT_HEALTH: "சுகாதாரம் அல்ல",
      },
    },
  };


  var TAG_LABELS = {
    alert: { ms: "AMARAN", en: "ALERT", zh: "警示", ar: "تحذير", ta: "எச்சரிக்கை" },
    misleading: { ms: "MENGELIRUKAN", en: "MISLEADING", zh: "误导", ar: "مضلل", ta: "தவறானது" },
    verified: { ms: "DISAHKAN", en: "VERIFIED", zh: "属实", ar: "موثق", ta: "உறுதி" },
    guide: { ms: "PANDUAN", en: "GUIDE", zh: "指南", ar: "إرشاد", ta: "வழிகாட்டி" },
  };

  var NEWS_POSTS = [
    {
      id: "quantum",
      tag: "alert",
      image: "ASSET/news-quantum-pendant.png",
      sourceName: "KKM",
      sourceUrl: "https://www.moh.gov.my",
      title: {
        ms: "Gelang Kuantum? Itu scam.",
        en: "Quantum bracelet? It's a scam.",
        zh: "量子手环？这是诈骗。",
        ar: "سوار كوانتم؟ هذا احتيال.",
        ta: "குவாண்டம் வளையலா? இது மோசடி.",
      },
      caption: {
        ms: "Mesej WhatsApp yang janji sembuhkan kencing manis dalam 3 hari dengan harga RM150 adalah tipu. KKM tidak luluskan produk sebegini. Jangan pindah wang.",
        en: "WhatsApp messages promising a 3-day diabetes cure for RM150 are fraud. KKM has not approved products like this. Do not transfer money.",
        zh: "声称 RM150 可在 3 天内治好糖尿病的 WhatsApp 讯息是诈骗。卫生部未批准此类产品。请勿转账。",
        ar: "رسائل واتساب التي تعد بعلاج السكري خلال 3 أيام مقابل 150 رينغيت احتيال. الوزارة لم تعتمد منتجات كهذه. لا تحول أموالاً.",
        ta: "RM150-க்கு 3 நாளில் நீரிழிவு குணமாகும் எனும் வாட்ஸ்அப் செய்தி மோசடி. KKM இதை அங்கீகரிக்கவில்லை. பணம் அனுப்ப வேண்டாம்.",
      },
    },
    {
      id: "fake-kkm",
      tag: "alert",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=70",
      sourceName: "KKM",
      sourceUrl: "https://www.moh.gov.my",
      title: {
        ms: "WhatsApp “dari KKM”? Padam.",
        en: "WhatsApp “from KKM”? Delete it.",
        zh: "自称“卫生部”的 WhatsApp？删掉。",
        ar: "واتساب «من الوزارة»؟ احذفه.",
        ta: "KKM வாட்ஸ்அப்பா? நீக்குங்கள்.",
      },
      caption: {
        ms: "KKM tidak menghantar pautan pendek atau minta OTP melalui WhatsApp. Abaikan, padam, dan jangan klik apa-apa.",
        en: "KKM does not send short links or ask for OTPs on WhatsApp. Ignore, delete, and do not click anything.",
        zh: "卫生部不会通过 WhatsApp 发送短链接或索取 OTP。请忽略、删除，不要点击任何内容。",
        ar: "الوزارة لا ترسل روابط قصيرة ولا تطلب رمز OTP عبر واتساب. تجاهل واحذف ولا تضغط أي شيء.",
        ta: "KKM வாட்ஸ்அப்பில் குறுகிய இணைப்பு அல்லது OTP கேட்காது. புறக்கணித்து நீக்கவும், எதையும் கிளிக் செய்ய வேண்டாம்.",
      },
    },
    {
      id: "papaya",
      tag: "misleading",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=70",
      sourceName: "MyHealth",
      sourceUrl: "https://myhealth.moh.gov.my",
      title: {
        ms: "Daun betik bukan penawar denggi.",
        en: "Papaya leaves are not a dengue cure.",
        zh: "木瓜叶治不好登革热。",
        ar: "أوراق البابايا ليست علاجاً لحمى الضنك.",
        ta: "பப்பாளி இலை டெங்குக்கு மருந்து அல்ல.",
      },
      caption: {
        ms: "Jus daun betik tidak gantikan rawatan klinik. Demam denggi boleh berbahaya — dapatkan rawatan awal dan buang air bertakung.",
        en: "Papaya leaf juice does not replace clinic care. Dengue can turn dangerous — seek care early and remove standing water.",
        zh: "木瓜叶汁不能代替诊所治疗。登革热可能迅速恶化——请尽早就医并清除积水。",
        ar: "عصير أوراق البابايا لا يغني عن العيادة. حمى الضنك قد تشتد — اطلب العلاج مبكراً وأزل المياه الراكدة.",
        ta: "பப்பாளி இலைச் சாறு கிளினிக் சிகிச்சைக்கு மாற்றாகாது. டெங்கு ஆபத்தானது — உடனடி சிகிச்சை பெறுங்கள், தேங்கிய நீரை அகற்றுங்கள்.",
      },
    },
    {
      id: "handwash",
      tag: "verified",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=70",
      sourceName: "WHO",
      sourceUrl: "https://www.who.int/health-topics/hand-hygiene",
      title: {
        ms: "Cuci tangan — tip yang benar.",
        en: "Handwashing — a tip that is true.",
        zh: "洗手——这是靠谱提示。",
        ar: "غسل اليدين — نصيحة صحيحة.",
        ta: "கைகழுவுதல் — உண்மையான குறிப்பு.",
      },
      caption: {
        ms: "KKM dan WHO sahkan cuci tangan dengan sabun sekurang-kurangnya 20 saat membantu cegah jangkitan. Amalan mudah, bukti kukuh.",
        en: "KKM and WHO confirm washing hands with soap for at least 20 seconds helps prevent infections. Simple habit, strong evidence.",
        zh: "卫生部与世卫确认用肥皂洗手至少 20 秒有助预防感染。习惯简单，证据充分。",
        ar: "تؤكد الوزارة ومنظمة الصحة العالمية أن غسل اليدين بالصابون لمدة 20 ثانية على الأقل يقلل العدوى. عادة بسيطة ودليل قوي.",
        ta: "KKM மற்றும் WHO சோப்புடன் குறைந்தது 20 வினாடிகள் கைகழுவுவது தொற்றைத் தடுக்க உதவும் என உறுதிப்படுத்துகின்றனர்.",
      },
    },
    {
      id: "verify-share",
      tag: "guide",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=70",
      sourceName: "MyHealth",
      sourceUrl: "https://myhealth.moh.gov.my",
      title: {
        ms: "Sebelum kongsi — semak 3 perkara.",
        en: "Before sharing — check 3 things.",
        zh: "转发前先查这 3 点。",
        ar: "قبل المشاركة — تحقق من 3 أشياء.",
        ta: "பகிரும் முன் — 3 விஷயத்தைச் சரிபாருங்கள்.",
      },
      caption: {
        ms: "Ada nama pengirim? Ada tarikh? Ada pautan rasmi KKM/WHO? Jika tiada — jangan teruskan. Gunakan butang SEMAK SEKARANG SahihCare.",
        en: "Is there a sender name? A date? An official KKM/WHO link? If not — do not forward. Use SahihCare’s CHECK button.",
        zh: "有寄件人姓名吗？有日期吗？有卫生部/世卫官方链接吗？若没有——请勿转发。请用 SahihCare 的 CHECK。",
        ar: "هل يوجد اسم المرسل؟ تاريخ؟ رابط رسمي؟ إن لم يوجد — لا تعِد الإرسال. استخدم زر CHECK في SahihCare.",
        ta: "அனுப்புநர் பெயர் உள்ளதா? தேதி உள்ளதா? KKM/WHO இணைப்பு உள்ளதா? இல்லையெனில் பகிர வேண்டாம். SahihCare CHECK-ஐப் பயன்படுத்துங்கள்.",
      },
    },
  ];

  var VERDICT_UI = {
    VERIFIED: { card: "bg-emerald-100 text-emerald-800 border-emerald-700", badge: "bg-emerald-700", icon: "fa-solid fa-check" },
    FALSE: { card: "bg-red-100 text-red-800 border-red-700", badge: "bg-red-600", icon: "fa-solid fa-xmark" },
    MISLEADING: { card: "bg-orange-100 text-orange-800 border-orange-700", badge: "bg-orange-600", icon: "fa-solid fa-triangle-exclamation" },
    UNVERIFIED: { card: "bg-gray-100 text-gray-800 border-gray-600", badge: "bg-gray-600", icon: "fa-solid fa-circle-question" },
    NOT_HEALTH: { card: "bg-gray-100 text-gray-800 border-gray-600", badge: "bg-gray-600", icon: "fa-solid fa-ban" },
  };

  var scale = 100;
  var currentView = "check";
  var currentLang = "ms";
  var resultExpanded = false;
  var currentResult = null;

  var els = {
    langBtn: document.getElementById("langBtn"),
    langFlag: document.getElementById("langFlag"),
    langMenu: document.getElementById("langMenu"),
    scaleLabel: document.getElementById("scaleLabel"),
    scaleDown: document.getElementById("scaleDown"),
    scaleUp: document.getElementById("scaleUp"),
    tabNews: document.getElementById("tabNews"),
    tabCheck: document.getElementById("tabCheck"),
        checkHero: document.getElementById("checkHero"),
        newsHero: document.getElementById("newsHero"),
        checkerPanel: document.getElementById("checkerPanel"),
        newsPanel: document.getElementById("newsPanel"),
        searchPanel: document.getElementById("searchPanel"),
    searchBox: document.getElementById("searchBox"),
    claimInput: document.getElementById("claimInput"),
    photoBtn: document.getElementById("photoBtn"),
    photoInput: document.getElementById("photoInput"),
    pasteBtn: document.getElementById("pasteBtn"),
    checkBtn: document.getElementById("checkBtn"),
    pastedPreview: document.getElementById("pastedPreview"),
    pastedText: document.getElementById("pastedText"),
    loadingState: document.getElementById("loadingState"),
    resultCard: document.getElementById("resultCard"),
    resultTitle: document.getElementById("resultTitle"),
    resultBody: document.getElementById("resultBody"),
    resultMore: document.getElementById("resultMore"),
    resultBadge: document.getElementById("resultBadge"),
    resultIcon: document.getElementById("resultIcon"),
    resultLabel: document.getElementById("resultLabel"),
    sourceBtn: document.getElementById("sourceBtn"),
    sourcePanel: document.getElementById("sourcePanel"),
    sourceList: document.getElementById("sourceList"),
    readMoreBtn: document.getElementById("readMoreBtn"),
    resetBtn: document.getElementById("resetBtn"),
    toast: document.getElementById("toast"),
    newsFeed: document.getElementById("newsFeed"),
  };

  function t(key) {
    var pack = STRINGS[currentLang] || STRINGS.ms;
    return pack[key] || STRINGS.ms[key] || key;
  }

  function verdictLabel(verdict) {
    var pack = STRINGS[currentLang] || STRINGS.ms;
    return (pack.verdicts && pack.verdicts[verdict]) || verdict;
  }

  function pickLang(map) {
    if (!map) return "";
    return map[currentLang] || map.en || map.ms || "";
  }

  function renderNewsFeed() {
    if (!els.newsFeed) return;
    els.newsFeed.innerHTML = "";
    NEWS_POSTS.forEach(function (post) {
      var article = document.createElement("article");
      article.className = "news-card";
      article.setAttribute("role", "article");

      var media = document.createElement("div");
      media.className = "news-card__media";
      var img = document.createElement("img");
      img.src = post.image;
      img.alt = pickLang(post.title);
      img.loading = "lazy";
      media.appendChild(img);

      var body = document.createElement("div");
      body.className = "news-card__body";

      var tag = document.createElement("span");
      tag.className = "news-card__tag news-card__tag--" + post.tag;
      tag.textContent = (TAG_LABELS[post.tag] && pickLang(TAG_LABELS[post.tag])) || post.tag;

      var title = document.createElement("h2");
      title.className = "news-card__title";
      title.textContent = pickLang(post.title);

      var caption = document.createElement("p");
      caption.className = "news-card__caption";
      caption.textContent = pickLang(post.caption);

      var sourceRow = document.createElement("div");
      sourceRow.className = "news-card__source";
      var sourceLabel = document.createElement("span");
      sourceLabel.className = "news-card__source-label";
      sourceLabel.textContent = t("newsSource");
      var sourceLink = document.createElement("a");
      sourceLink.href = post.sourceUrl;
      sourceLink.target = "_blank";
      sourceLink.rel = "noopener noreferrer";
      sourceLink.textContent = post.sourceName;
      sourceRow.appendChild(sourceLabel);
      sourceRow.appendChild(sourceLink);

      body.appendChild(tag);
      body.appendChild(title);
      body.appendChild(caption);
      body.appendChild(sourceRow);

      article.appendChild(media);
      article.appendChild(body);
      els.newsFeed.appendChild(article);
    });
  }

  function applyLanguage() {
    var meta = LANGS[currentLang] || LANGS.ms;
    var pack = STRINGS[currentLang] || STRINGS.ms;
    document.documentElement.lang = currentLang;
    document.documentElement.dir = meta.dir;
    document.title = "SahihCare";
    els.langFlag.src = meta.flag;
    els.langBtn.setAttribute("aria-label", pack.chooseLanguage);

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      if (pack[key]) node.textContent = pack[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
      var key = node.getAttribute("data-i18n-placeholder");
      if (pack[key]) node.setAttribute("placeholder", pack[key]);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (node) {
      var key = node.getAttribute("data-i18n-aria");
      if (pack[key]) node.setAttribute("aria-label", pack[key]);
    });

    renderNewsFeed();

    document.querySelectorAll("#langMenu [data-lang]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === currentLang);
    });

    if (currentResult) {
      renderResult(currentResult);
    } else if (els.readMoreBtn) {
      els.readMoreBtn.textContent = pack.readMore;
    }

    try {
      localStorage.setItem("sahihcare-lang", currentLang);
    } catch (err) {}
  }

  function setLanguage(lang) {
    if (!LANGS[lang]) return;
    currentLang = lang;
    els.langMenu.classList.add("hidden");
    els.langBtn.setAttribute("aria-expanded", "false");
    applyLanguage();
  }

  function toggleLangMenu(forceClose) {
    var shouldHide = forceClose === true || !els.langMenu.classList.contains("hidden");
    els.langMenu.classList.toggle("hidden", shouldHide);
    els.langBtn.setAttribute("aria-expanded", shouldHide ? "false" : "true");
  }

  async function fetchCheck(message) {
    var response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, language: currentLang }),
    });
    if (!response.ok) {
      throw new Error("Backend error");
    }
    var data = await response.json();
    var verdict = String(data.verdict || "UNVERIFIED").toUpperCase();
    if (!VERDICT_UI[verdict]) verdict = "UNVERIFIED";
    return {
      verdict: verdict,
      title: data.title || "",
      summary: data.summary || "",
      details: data.details || "",
      sources: data.sources || [],
    };
  }

  function applyScale() {
    document.documentElement.style.fontSize = (BASE_PX * scale) / 100 + "px";
    els.scaleLabel.textContent = scale + "%";
    els.scaleDown.disabled = scale <= SCALE_MIN;
    els.scaleUp.disabled = scale >= SCALE_MAX;
    try {
      localStorage.setItem("sahihcare-scale", String(scale));
    } catch (err) {}
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.remove("hidden");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      els.toast.classList.add("hidden");
    }, 2800);
  }

  function syncTextareaAlign() {
    if (els.claimInput.value.trim()) {
      els.claimInput.classList.remove("is-empty");
    } else {
      els.claimInput.classList.add("is-empty");
    }
  }

  function setView(view) {
    currentView = view;
    var isCheck = view === "check";
    var hasResult = currentResult !== null;
    els.tabCheck.setAttribute("aria-selected", isCheck ? "true" : "false");
    els.tabNews.setAttribute("aria-selected", isCheck ? "false" : "true");
    els.tabCheck.classList.toggle("text-brand-deep", isCheck);
    els.tabCheck.classList.toggle("text-slate-500", !isCheck);
    els.tabNews.classList.toggle("text-brand-deep", !isCheck);
    els.tabNews.classList.toggle("text-slate-500", isCheck);
    els.checkHero.classList.toggle("hidden", !isCheck);
    els.newsHero.classList.toggle("hidden", isCheck);
    els.checkerPanel.classList.toggle("hidden", !isCheck);
    els.newsPanel.classList.toggle("hidden", isCheck);
    els.searchPanel.classList.toggle("hidden", !isCheck || hasResult);
    els.resultCard.classList.toggle("hidden", !isCheck || !hasResult);
    els.pastedPreview.classList.toggle("hidden", !isCheck || !hasResult);
    if (!isCheck) {
      els.loadingState.classList.add("hidden");
      els.loadingState.classList.remove("flex");
    }
  }

  function hideResult() {
    els.resultCard.classList.add("hidden");
    els.pastedPreview.classList.add("hidden");
    els.sourcePanel.classList.add("hidden");
    els.resultMore.classList.add("hidden");
    resultExpanded = false;
    currentResult = null;
    els.readMoreBtn.textContent = t("readMore");
  }

  function showSearch() {
    if (currentView === "check") {
      els.searchPanel.classList.remove("hidden");
    }
  }

  function renderSources(sources) {
    els.sourceList.innerHTML = "";
    (sources || []).forEach(function (src) {
      var name = src.name || src.url;
      if (!name) return;
      var li = document.createElement("li");
      if (src.url) {
        var a = document.createElement("a");
        a.href = src.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "font-semibold text-blue-700 underline";
        a.textContent = name;
        li.appendChild(a);
      } else {
        li.textContent = name;
      }
      els.sourceList.appendChild(li);
    });
  }

  function renderResult(data) {
    currentResult = data;
    resultExpanded = false;
    var ui = VERDICT_UI[data.verdict] || VERDICT_UI.UNVERIFIED;
    els.resultCard.className = "mb-4 rounded-2xl border-2 px-4 py-4 " + ui.card;
    els.resultTitle.textContent = data.title;
    els.resultBody.textContent = data.summary;
    els.resultMore.textContent = data.details;
    els.resultMore.classList.add("hidden");
    els.resultBadge.className =
      "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-extrabold tracking-wide text-white " +
      ui.badge;
    els.resultIcon.className = ui.icon;
    els.resultLabel.textContent = verdictLabel(data.verdict);
    els.readMoreBtn.textContent = t("readMore");
    els.sourcePanel.classList.add("hidden");
    renderSources(data.sources);
    els.resultCard.classList.remove("hidden");
    els.searchPanel.classList.add("hidden");
    els.resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onCheck() {
    var question = els.claimInput.value.trim();
    if (!question) {
      els.searchBox.classList.remove("shake");
      void els.searchBox.offsetWidth;
      els.searchBox.classList.add("shake");
      showToast(t("empty"));
      els.claimInput.focus();
      return;
    }

    els.toast.classList.add("hidden");
    els.checkBtn.disabled = true;
    els.pastedText.textContent = question;
    els.pastedPreview.classList.remove("hidden");
    els.loadingState.classList.remove("hidden");
    els.loadingState.classList.add("flex");
    els.resultCard.classList.add("hidden");
    document.getElementById("main").setAttribute("aria-busy", "true");

    try {
      var data = await fetchCheck(question);
      els.loadingState.classList.add("hidden");
      els.loadingState.classList.remove("flex");
      renderResult(data);
    } catch (err) {
      els.loadingState.classList.add("hidden");
      els.loadingState.classList.remove("flex");
      els.pastedPreview.classList.add("hidden");
      showToast(t("unavailable"));
      showSearch();
    } finally {
      els.checkBtn.disabled = false;
      document.getElementById("main").setAttribute("aria-busy", "false");
    }
  }

  async function onPaste() {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        showToast(t("clipboardUnsupported"));
        els.claimInput.focus();
        return;
      }
      var text = await navigator.clipboard.readText();
      if (!text.trim()) {
        showToast(t("clipboardEmpty"));
        return;
      }
      els.claimInput.value = text.trim();
      syncTextareaAlign();
      els.claimInput.focus();
    } catch (err) {
      showToast(t("clipboardDenied"));
      els.claimInput.focus();
    }
  }

  try {
    var savedScale = parseInt(localStorage.getItem("sahihcare-scale") || "100", 10);
    if (!isNaN(savedScale)) {
      scale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, savedScale));
    }
  } catch (err) {}

  try {
    var savedLang = localStorage.getItem("sahihcare-lang");
    if (savedLang && LANGS[savedLang]) currentLang = savedLang;
  } catch (err) {}

  applyScale();
  applyLanguage();
  setView("check");

  els.scaleDown.addEventListener("click", function () {
    scale = Math.max(SCALE_MIN, scale - SCALE_STEP);
    applyScale();
  });
  els.scaleUp.addEventListener("click", function () {
    scale = Math.min(SCALE_MAX, scale + SCALE_STEP);
    applyScale();
  });
  els.langBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleLangMenu();
  });
  els.langMenu.addEventListener("click", function (event) {
    event.stopPropagation();
    var btn = event.target.closest("[data-lang]");
    if (btn) setLanguage(btn.getAttribute("data-lang"));
  });
  document.addEventListener("click", function () {
    toggleLangMenu(true);
  });
  els.tabNews.addEventListener("click", function () {
    setView("news");
  });
  els.tabCheck.addEventListener("click", function () {
    setView("check");
  });
  els.claimInput.addEventListener("input", syncTextareaAlign);
  els.pasteBtn.addEventListener("click", onPaste);
  els.photoBtn.addEventListener("click", function () {
    els.photoInput.click();
  });
  els.photoInput.addEventListener("change", function () {
    var file = els.photoInput.files && els.photoInput.files[0];
    els.photoInput.value = "";
    if (!file) return;
    showToast(t("photoSoon"));
  });
  els.checkBtn.addEventListener("click", onCheck);
  els.readMoreBtn.addEventListener("click", function () {
    resultExpanded = !resultExpanded;
    els.resultMore.classList.toggle("hidden", !resultExpanded);
    els.readMoreBtn.textContent = resultExpanded ? t("readLess") : t("readMore");
  });
  els.sourceBtn.addEventListener("click", function () {
    els.sourcePanel.classList.toggle("hidden");
  });
  els.resetBtn.addEventListener("click", function () {
    hideResult();
    showSearch();
    els.claimInput.focus();
  });
})();
