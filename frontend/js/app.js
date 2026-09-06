(function () {
  "use strict";

  var SCALE_MIN = 100;
  var SCALE_MAX = 160;
  var SCALE_STEP = 10;
  var BASE_PX = 18;
  var API_URL = "/api/ask";

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
      heroTitle: "Got Questions?",
      heroSubtitle: "Semak kesahihan mesej kesihatan anda di sini.",
      newsTitle: "Health News",
      newsSubtitle: "Ikuti berita dan amaran kesihatan rasmi.",
      pastedMessage: "Mesej yang ditampal",
      pastedFrom: "// Ditampal dari WhatsApp",
      loading: "Fetching verified sources",
      source: "SOURCE",
      readMore: "READ MORE ▾",
      readLess: "READ LESS ▴",
      officialSources: "Sumber rasmi",
      checkAnother: "Semak mesej lain",
      pasteLabel: "Tampal mesej kesihatan di sini",
      pastePlaceholder: "Paste it here",
      photo: "Photo",
      paste: "Paste",
      check: "CHECK",
      healthInfo: "Maklumat kesihatan",
      scamTitle: "🚨 Amaran Scam Terkini",
      officialTitle: "✅ Info Kesihatan Rasmi",
      empty: "Sila tampal atau taip mesej kesihatan dahulu.",
      clipboardUnsupported: "Tidak dapat baca papan keratan. Tekan lama dalam kotak dan pilih Tampal.",
      clipboardEmpty: "Papan keratan kosong. Salin mesej WhatsApp dahulu.",
      clipboardDenied: "Benarkan akses papan keratan, atau tampal secara manual dalam kotak.",
      photoSoon: "Fungsi foto (OCR) akan datang. Sila tampal teks mesej untuk semakan.",
      unavailable: "Maaf, perkhidmatan semakan tidak tersedia. Cuba lagi.",
      verdicts: {
        VERIFIED: "BENAR",
        FALSE: "FALSE",
        MISLEADING: "MENGELIRUKAN",
        UNVERIFIED: "TIDAK PASTI",
        NOT_HEALTH: "BUKAN KESIHATAN",
      },
      scamItems: [
        "<strong>Gelang Kuantum Nano</strong> — mesej WhatsApp kononnya sembuhkan kencing manis dalam 3 hari dengan harga RM150. Ini scam. Jangan pindah wang.",
        "<strong>WhatsApp “dari KKM”</strong> — KKM tidak menghantar pautan pendek atau minta OTP melalui WhatsApp. Abaikan dan padam.",
        "<strong>Ubat ajaib kanser / HIV</strong> — tiada produk viral dalam kumpulan yang diluluskan sebagai penawar. Dapatkan rawatan di fasiliti kesihatan.",
      ],
      officialItems: [
        'Semak maklumat di laman <a class="font-bold text-blue-700 underline" href="https://www.moh.gov.my" target="_blank" rel="noopener noreferrer">moh.gov.my</a> atau <a class="font-bold text-blue-700 underline" href="https://myhealth.moh.gov.my" target="_blank" rel="noopener noreferrer">MyHealth</a>.',
        "Demam denggi: buang air bertakung, dapatkan rawatan awal. Daun betik <em>bukan</em> penawar denggi.",
        "Jangan kongsi mesej kesihatan yang tiada nama pengirim, tarikh, atau pautan rasmi KKM / WHO.",
      ],
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
      heroTitle: "Got Questions?",
      heroSubtitle: "Verify your health message here.",
      newsTitle: "Health News",
      newsSubtitle: "Follow official health news and alerts.",
      pastedMessage: "Pasted message",
      pastedFrom: "// Pasted from WhatsApp",
      loading: "Fetching verified sources",
      source: "SOURCE",
      readMore: "READ MORE ▾",
      readLess: "READ LESS ▴",
      officialSources: "Official sources",
      checkAnother: "Check another message",
      pasteLabel: "Paste a health message here",
      pastePlaceholder: "Paste it here",
      photo: "Photo",
      paste: "Paste",
      check: "CHECK",
      healthInfo: "Health information",
      scamTitle: "🚨 Latest scam alerts",
      officialTitle: "✅ Official health info",
      empty: "Please paste or type a health message first.",
      clipboardUnsupported: "Cannot read the clipboard. Long-press in the box and choose Paste.",
      clipboardEmpty: "Clipboard is empty. Copy a WhatsApp message first.",
      clipboardDenied: "Allow clipboard access, or paste into the box yourself.",
      photoSoon: "Photo check (OCR) is coming soon. Please paste the message text.",
      unavailable: "Sorry, the checking service is unavailable. Try again.",
      verdicts: {
        VERIFIED: "TRUE",
        FALSE: "FALSE",
        MISLEADING: "MISLEADING",
        UNVERIFIED: "UNVERIFIED",
        NOT_HEALTH: "NOT HEALTH",
      },
      scamItems: [
        "<strong>Quantum Nano bracelet</strong> — WhatsApp messages claim it cures diabetes in 3 days for RM150. This is a scam. Do not transfer money.",
        "<strong>WhatsApp “from KKM”</strong> — KKM does not send short links or ask for OTPs on WhatsApp. Ignore and delete.",
        "<strong>Miracle cancer / HIV cures</strong> — no viral group product is an approved cure. Get care at a health facility.",
      ],
      officialItems: [
        'Check facts at <a class="font-bold text-blue-700 underline" href="https://www.moh.gov.my" target="_blank" rel="noopener noreferrer">moh.gov.my</a> or <a class="font-bold text-blue-700 underline" href="https://myhealth.moh.gov.my" target="_blank" rel="noopener noreferrer">MyHealth</a>.',
        "Dengue: remove standing water and seek care early. Papaya leaves are <em>not</em> a dengue cure.",
        "Do not share health messages with no sender, date, or official KKM / WHO link.",
      ],
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
      newsTitle: "健康新闻",
      newsSubtitle: "关注官方健康新闻与警示。",
      pastedMessage: "已粘贴的讯息",
      pastedFrom: "// 从 WhatsApp 粘贴",
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
      scamTitle: "🚨 最新诈骗警示",
      officialTitle: "✅ 官方健康资讯",
      empty: "请先粘贴或输入健康讯息。",
      clipboardUnsupported: "无法读取剪贴板。请在输入框长按并选择粘贴。",
      clipboardEmpty: "剪贴板是空的。请先复制 WhatsApp 讯息。",
      clipboardDenied: "请允许剪贴板权限，或自行粘贴到输入框。",
      photoSoon: "照片识别即将推出。请先粘贴文字。",
      unavailable: "抱歉，核查服务暂时无法使用。请再试一次。",
      verdicts: {
        VERIFIED: "属实",
        FALSE: "虚假",
        MISLEADING: "误导",
        UNVERIFIED: "无法确认",
        NOT_HEALTH: "非健康问题",
      },
      scamItems: [
        "<strong>量子纳米手环</strong> — WhatsApp 声称 RM150 可在 3 天内治好糖尿病。这是诈骗。请勿转账。",
        "<strong>自称卫生部 KKM 的 WhatsApp</strong> — 卫生部不会通过 WhatsApp 发送短链接或索取 OTP。请忽略并删除。",
        "<strong>神药治疗癌症 / HIV</strong> — 群组热销产品并非获批疗法。请到正规医疗机构就诊。",
      ],
      officialItems: [
        '请到 <a class="font-bold text-blue-700 underline" href="https://www.moh.gov.my" target="_blank" rel="noopener noreferrer">moh.gov.my</a> 或 <a class="font-bold text-blue-700 underline" href="https://myhealth.moh.gov.my" target="_blank" rel="noopener noreferrer">MyHealth</a> 查证。',
        "登革热：清除积水并尽早就医。木瓜叶<em>不能</em>治愈登革热。",
        "不要转发没有寄件人、日期或卫生部 / 世卫官方链接的健康讯息。",
      ],
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
      newsTitle: "أخبار الصحة",
      newsSubtitle: "تابع الأخبار والتحذيرات الصحية الرسمية.",
      pastedMessage: "الرسالة الملصقة",
      pastedFrom: "// ملصق من واتساب",
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
      scamTitle: "🚨 تحذيرات الاحتيال",
      officialTitle: "✅ معلومات صحية رسمية",
      empty: "يرجى لصق أو كتابة رسالة صحية أولاً.",
      clipboardUnsupported: "تعذر قراءة الحافظة. اضغط مطولاً في الصندوق واختر لصق.",
      clipboardEmpty: "الحافظة فارغة. انسخ رسالة واتساب أولاً.",
      clipboardDenied: "اسمح بالوصول إلى الحافظة، أو الصق النص بنفسك.",
      photoSoon: "فحص الصور قادم قريباً. يرجى لصق نص الرسالة.",
      unavailable: "عذراً، خدمة التحقق غير متاحة. حاول مرة أخرى.",
      verdicts: {
        VERIFIED: "صحيح",
        FALSE: "زائف",
        MISLEADING: "مضلل",
        UNVERIFIED: "غير مؤكد",
        NOT_HEALTH: "ليس صحياً",
      },
      scamItems: [
        "<strong>سوار كوانتم نانو</strong> — رسائل واتساب تزعم أنه يشفي السكري خلال 3 أيام مقابل 150 رينغيت. هذا احتيال. لا تحول أموالاً.",
        "<strong>واتساب «من وزارة الصحة»</strong> — الوزارة لا ترسل روابط قصيرة ولا تطلب رمز OTP عبر واتساب. تجاهل واحذف.",
        "<strong>علاج سحري للسرطان / HIV</strong> — لا يوجد منتج في المجموعات معتمد كعلاج. راجع منشأة صحية.",
      ],
      officialItems: [
        'تحقق من المعلومات عبر <a class="font-bold text-blue-700 underline" href="https://www.moh.gov.my" target="_blank" rel="noopener noreferrer">moh.gov.my</a> أو <a class="font-bold text-blue-700 underline" href="https://myhealth.moh.gov.my" target="_blank" rel="noopener noreferrer">MyHealth</a>.',
        "حمى الضنك: أزل المياه الراكدة واطلب العلاج مبكراً. أوراق البابايا <em>ليست</em> علاجاً.",
        "لا تشارك رسائل صحية بلا اسم مرسل أو تاريخ أو رابط رسمي لوزارة الصحة / منظمة الصحة العالمية.",
      ],
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
      newsTitle: "சுகாதாரச் செய்திகள்",
      newsSubtitle: "அதிகாரப்பூர்வ சுகாதாரச் செய்திகளையும் எச்சரிக்கைகளையும் பின்தொடருங்கள்.",
      pastedMessage: "ஒட்டப்பட்ட செய்தி",
      pastedFrom: "// வாட்ஸ்அப்பிலிருந்து ஒட்டப்பட்டது",
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
      scamTitle: "🚨 சமீபத்திய மோசடி எச்சரிக்கை",
      officialTitle: "✅ அதிகாரப்பூர்வ சுகாதாரத் தகவல்",
      empty: "முதலில் ஒரு சுகாதாரச் செய்தியை ஒட்டவும் அல்லது தட்டச்சு செய்யவும்.",
      clipboardUnsupported: "கிளிப்போர்டைப் படிக்க முடியவில்லை. பெட்டியில் நீண்ட நேரம் அழுத்தி ஒட்டு என்பதைத் தேர்வு செய்யவும்.",
      clipboardEmpty: "கிளிப்போர்டு காலியாக உள்ளது. முதலில் வாட்ஸ்அப் செய்தியை நகலெடுக்கவும்.",
      clipboardDenied: "கிளிப்போர்டு அனுமதியை அளிக்கவும், அல்லது நீங்களே ஒட்டவும்.",
      photoSoon: "புகைப்படச் சரிபார்ப்பு விரைவில் வரும். செய்தி உரையை ஒட்டவும்.",
      unavailable: "மன்னிக்கவும், சரிபார்ப்பு சேவை கிடைக்கவில்லை. மீண்டும் முயற்சிக்கவும்.",
      verdicts: {
        VERIFIED: "உண்மை",
        FALSE: "பொய்",
        MISLEADING: "தவறாக வழிநடத்தும்",
        UNVERIFIED: "உறுதிப்படுத்தப்படவில்லை",
        NOT_HEALTH: "சுகாதாரம் அல்ல",
      },
      scamItems: [
        "<strong>குவாண்டம் நானோ வளையல்</strong> — 3 நாளில் நீரிழிவைக் குணப்படுத்தும் என RM150-க்கு வாட்ஸ்அப் செய்தி. இது மோசடி. பணம் அனுப்ப வேண்டாம்.",
        "<strong>KKM வாட்ஸ்அப்</strong> — சுகாதார அமைச்சு வாட்ஸ்அப்பில் குறுகிய இணைப்பு அல்லது OTP கேட்காது. புறக்கணித்து நீக்கவும்.",
        "<strong>புற்றுநோய் / HIV அதிசய மருந்து</strong> — குழுவில் விற்கும் பொருள் அங்கீகரிக்கப்பட்ட சிகிச்சை அல்ல. மருத்துவமனைக்குச் செல்லுங்கள்.",
      ],
      officialItems: [
        '<a class="font-bold text-blue-700 underline" href="https://www.moh.gov.my" target="_blank" rel="noopener noreferrer">moh.gov.my</a> அல்லது <a class="font-bold text-blue-700 underline" href="https://myhealth.moh.gov.my" target="_blank" rel="noopener noreferrer">MyHealth</a> இல் தகவலைச் சரிபாருங்கள்.',
        "டெங்கு: தேங்கிய நீரை அகற்றி உடனடி சிகிச்சை பெறுங்கள். பப்பாளி இலை <em>குணப்படுத்தாது</em>.",
        "அனுப்புநர் பெயர், தேதி அல்லது KKM / WHO இணைப்பு இல்லாத சுகாதாரச் செய்திகளைப் பகிர வேண்டாம்.",
      ],
    },
  };

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
    scamList: document.getElementById("scamList"),
    officialList: document.getElementById("officialList"),
  };

  function t(key) {
    var pack = STRINGS[currentLang] || STRINGS.ms;
    return pack[key] || STRINGS.ms[key] || key;
  }

  function verdictLabel(verdict) {
    var pack = STRINGS[currentLang] || STRINGS.ms;
    return (pack.verdicts && pack.verdicts[verdict]) || verdict;
  }

  function fillList(node, items) {
    node.innerHTML = "";
    (items || []).forEach(function (html) {
      var li = document.createElement("li");
      li.innerHTML = html;
      node.appendChild(li);
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

    fillList(els.scamList, pack.scamItems);
    fillList(els.officialList, pack.officialItems);

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

  async function fetchCheck(question) {
    var response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: question, language: currentLang }),
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
    els.tabCheck.classList.toggle("text-slate-400", !isCheck);
    els.tabNews.classList.toggle("text-brand-deep", !isCheck);
    els.tabNews.classList.toggle("text-slate-400", isCheck);
    els.checkHero.classList.toggle("hidden", !isCheck);
    els.newsHero.classList.toggle("hidden", isCheck);
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
