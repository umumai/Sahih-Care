import json
import re
import traceback

from google import genai
from google.genai import types

from app.config import get_gemini_api_key, get_gemini_model
from app.prompts.health_prompt import LANGUAGE_NAMES, prompt_setup
from app.schemas.response import HealthAnswer, HealthSource


_client = None
_client_key = None

MODEL_CANDIDATES = (
    "gemini-3.6-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
)


def _local_packs():
    return {
        "FALSE": {
            "ms": HealthAnswer(
                verdict="FALSE",
                title="PALSU: Gelang Kuantum Adalah Scam Kesihatan",
                summary="Kementerian Kesihatan Malaysia (KKM) tidak pernah meluluskan produk ini. Jangan klik pautan atau pindahkan wang.",
                details="Tiada bukti saintifik bahawa gelang kuantum, gelang nano, atau quantum ring boleh merawat kencing manis, sakit lutut, atau sebarang penyakit. Mesej yang janji sembuh dalam 3 hari dan jual pada harga rendah (contoh RM150) adalah tipu helah. Jangan berikan nombor OTP atau pindah wang.",
                sources=[
                    HealthSource(name="Kementerian Kesihatan Malaysia", url="https://www.moh.gov.my"),
                    HealthSource(name="MyHealth MOH", url="https://myhealth.moh.gov.my"),
                ],
            ),
            "en": HealthAnswer(
                verdict="FALSE",
                title="FALSE: Quantum bracelet is a health scam",
                summary="The Malaysian Ministry of Health (KKM) has never approved this product. Do not click links or transfer money.",
                details="There is no scientific evidence that quantum or nano bracelets treat diabetes, knee pain, or any disease. Messages that promise a 3-day cure for about RM150 are scams. Do not share OTPs or send money.",
                sources=[
                    HealthSource(name="Ministry of Health Malaysia", url="https://www.moh.gov.my"),
                    HealthSource(name="MyHealth MOH", url="https://myhealth.moh.gov.my"),
                ],
            ),
            "zh": HealthAnswer(
                verdict="FALSE",
                title="虚假：量子手环是健康诈骗",
                summary="马来西亚卫生部（KKM）从未批准该产品。请勿点击链接或转账。",
                details="没有科学证据表明量子或纳米手环能治疗糖尿病、膝痛或任何疾病。声称 3 天治愈、售价约 RM150 的讯息是诈骗。不要提供 OTP 或汇款。",
                sources=[
                    HealthSource(name="马来西亚卫生部", url="https://www.moh.gov.my"),
                    HealthSource(name="MyHealth MOH", url="https://myhealth.moh.gov.my"),
                ],
            ),
            "ar": HealthAnswer(
                verdict="FALSE",
                title="زائف: سوار الكوانتم عملية احتيال صحية",
                summary="وزارة الصحة الماليزية لم تعتمد هذا المنتج قط. لا تضغط الروابط ولا تحول أموالاً.",
                details="لا يوجد دليل علمي على أن أساور الكوانتم أو النانو تعالج السكري أو ألم الركبة. الرسائل التي تعد بالشفاء خلال 3 أيام مقابل نحو 150 رينغيت احتيال. لا ترسل رمز OTP أو مالاً.",
                sources=[
                    HealthSource(name="وزارة الصحة الماليزية", url="https://www.moh.gov.my"),
                    HealthSource(name="MyHealth MOH", url="https://myhealth.moh.gov.my"),
                ],
            ),
            "ta": HealthAnswer(
                verdict="FALSE",
                title="பொய்: குவாண்டம் வளையல் சுகாதார மோசடி",
                summary="மலேசிய சுகாதார அமைச்சு இந்தப் பொருளை அங்கீகரிக்கவில்லை. இணைப்பைக் கிளிக் செய்ய வேண்டாம், பணம் அனுப்ப வேண்டாம்.",
                details="குவாண்டம் அல்லது நானோ வளையல் நீரிழிவு அல்லது முழங்கால் வலியைக் குணப்படுத்தும் என்பதற்கு அறிவியல் ஆதாரம் இல்லை. 3 நாளில் குணமாகும் என RM150-க்கு விற்கும் செய்தி மோசடி.",
                sources=[
                    HealthSource(name="KKM", url="https://www.moh.gov.my"),
                    HealthSource(name="MyHealth MOH", url="https://myhealth.moh.gov.my"),
                ],
            ),
        },
        "MISLEADING": {
            "ms": HealthAnswer(
                verdict="MISLEADING",
                title="MENGELIRUKAN: Daun betik bukan penawar denggi",
                summary="Jus daun betik (papaya leaves) tidak merawat atau menyembuhkan denggi. Ia tidak gantikan rawatan di klinik atau hospital.",
                details="Sesetengah kajian kecil menunjukkan daun betik mungkin membantu bilangan platelet, tetapi bukti masih terhad. Denggi boleh menjadi berbahaya dengan cepat. Dapatkan rawatan segera jika ada demam atau bintik merah.",
                sources=[
                    HealthSource(name="MyHealth — Denggi", url="https://myhealth.moh.gov.my"),
                    HealthSource(name="World Health Organization", url="https://www.who.int/health-topics/dengue-and-severe-dengue"),
                ],
            ),
            "en": HealthAnswer(
                verdict="MISLEADING",
                title="MISLEADING: Papaya leaves are not a dengue cure",
                summary="Papaya leaf juice does not treat or cure dengue. It does not replace clinic or hospital care.",
                details="Some small studies suggest papaya leaves may affect platelet counts, but evidence is limited. Dengue can become dangerous quickly. Seek care for fever or red spots.",
                sources=[
                    HealthSource(name="MyHealth — Dengue", url="https://myhealth.moh.gov.my"),
                    HealthSource(name="World Health Organization", url="https://www.who.int/health-topics/dengue-and-severe-dengue"),
                ],
            ),
            "zh": HealthAnswer(
                verdict="MISLEADING",
                title="误导：木瓜叶不能治愈登革热",
                summary="木瓜叶汁不能治疗或治愈登革热，也不能代替诊所或医院治疗。",
                details="部分小型研究显示木瓜叶可能影响血小板，但证据有限。登革热可能迅速恶化。如有发热或红疹请尽快就医。",
                sources=[
                    HealthSource(name="MyHealth", url="https://myhealth.moh.gov.my"),
                    HealthSource(name="世界卫生组织", url="https://www.who.int/health-topics/dengue-and-severe-dengue"),
                ],
            ),
            "ar": HealthAnswer(
                verdict="MISLEADING",
                title="مضلل: أوراق البابايا ليست علاجاً لحمى الضنك",
                summary="عصير أوراق البابايا لا يعالج حمى الضنك ولا يغني عن العيادة أو المستشفى.",
                details="بعض الدراسات الصغيرة تشير إلى تأثير محتمل على الصفائح الدموية، لكن الدليل محدود. اطلب الرعاية فوراً عند الحمى أو البقع الحمراء.",
                sources=[
                    HealthSource(name="MyHealth", url="https://myhealth.moh.gov.my"),
                    HealthSource(name="منظمة الصحة العالمية", url="https://www.who.int/health-topics/dengue-and-severe-dengue"),
                ],
            ),
            "ta": HealthAnswer(
                verdict="MISLEADING",
                title="தவறாக வழிநடத்தும்: பப்பாளி இலை டெங்குக்கு மருந்து அல்ல",
                summary="பப்பாளி இலைச் சாறு டெங்கைக் குணப்படுத்தாது. மருத்துவமனை சிகிச்சைக்கு மாற்றாகாது.",
                details="சில சிறிய ஆய்வுகள் பிளேட்லெட்டை பாதிக்கலாம் எனக் கூறினாலும் சான்று குறைவு. காய்ச்சல் அல்லது சிவப்பு புள்ளிகள் இருந்தால் உடனடி சிகிச்சை பெறுங்கள்.",
                sources=[
                    HealthSource(name="MyHealth", url="https://myhealth.moh.gov.my"),
                    HealthSource(name="WHO", url="https://www.who.int/health-topics/dengue-and-severe-dengue"),
                ],
            ),
        },
        "VERIFIED": {
            "ms": HealthAnswer(
                verdict="VERIFIED",
                title="BENAR: Mencuci tangan mengurangkan jangkitan",
                summary="KKM dan WHO mengesahkan mencuci tangan dengan sabun adalah cara berkesan mencegah jangkitan.",
                details="Cuci tangan dengan sabun sekurang-kurangnya 20 saat, terutamanya sebelum makan dan selepas dari tandas.",
                sources=[
                    HealthSource(name="WHO — Hand hygiene", url="https://www.who.int/health-topics/hand-hygiene"),
                    HealthSource(name="KKM", url="https://www.moh.gov.my"),
                ],
            ),
            "en": HealthAnswer(
                verdict="VERIFIED",
                title="TRUE: Handwashing reduces infections",
                summary="KKM and WHO confirm that washing hands with soap helps prevent infections.",
                details="Wash with soap for at least 20 seconds, especially before eating and after using the toilet.",
                sources=[
                    HealthSource(name="WHO — Hand hygiene", url="https://www.who.int/health-topics/hand-hygiene"),
                    HealthSource(name="KKM", url="https://www.moh.gov.my"),
                ],
            ),
            "zh": HealthAnswer(
                verdict="VERIFIED",
                title="属实：洗手可减少感染",
                summary="卫生部和世卫组织确认用肥皂洗手能有效预防感染。",
                details="用肥皂洗手至少 20 秒，尤其在吃饭前和如厕后。",
                sources=[
                    HealthSource(name="WHO", url="https://www.who.int/health-topics/hand-hygiene"),
                    HealthSource(name="KKM", url="https://www.moh.gov.my"),
                ],
            ),
            "ar": HealthAnswer(
                verdict="VERIFIED",
                title="صحيح: غسل اليدين يقلل العدوى",
                summary="تؤكد وزارة الصحة ومنظمة الصحة العالمية أن غسل اليدين بالصابون يقي من العدوى.",
                details="اغسل يديك بالصابون لمدة 20 ثانية على الأقل، خاصة قبل الأكل وبعد استخدام المرحاض.",
                sources=[
                    HealthSource(name="WHO", url="https://www.who.int/health-topics/hand-hygiene"),
                    HealthSource(name="KKM", url="https://www.moh.gov.my"),
                ],
            ),
            "ta": HealthAnswer(
                verdict="VERIFIED",
                title="உண்மை: கைகழுவுதல் தொற்றைக் குறைக்கும்",
                summary="KKM மற்றும் WHO சோப்புடன் கைகழுவுவது தொற்றைத் தடுக்க உதவும் என உறுதிப்படுத்துகின்றனர்.",
                details="சாப்பிடும் முன் மற்றும் கழிப்பறைக்குப் பின் குறைந்தது 20 வினாடிகள் சோப்புடன் கைகளைக் கழுவுங்கள்.",
                sources=[
                    HealthSource(name="WHO", url="https://www.who.int/health-topics/hand-hygiene"),
                    HealthSource(name="KKM", url="https://www.moh.gov.my"),
                ],
            ),
        },
        "UNVERIFIED": {
            "ms": HealthAnswer(
                verdict="UNVERIFIED",
                title="TIDAK PASTI: Belum jumpa sumber rasmi",
                summary="Tuntutan ini belum dapat disahkan melalui sumber KKM atau WHO. Jangan kongsi sehingga ada pengesahan.",
                details="Jika mesej suruh anda beli produk, klik pautan, atau pindah wang, anggap ia berisiko. Tanya klinik kesihatan atau rujuk laman rasmi KKM.",
                sources=[HealthSource(name="Kementerian Kesihatan Malaysia", url="https://www.moh.gov.my")],
            ),
            "en": HealthAnswer(
                verdict="UNVERIFIED",
                title="UNVERIFIED: No official source found yet",
                summary="This claim could not be confirmed through KKM or WHO sources. Do not share it until it is verified.",
                details="If the message asks you to buy a product, click a link, or send money, treat it as risky. Ask a clinic or check the official KKM website.",
                sources=[HealthSource(name="Ministry of Health Malaysia", url="https://www.moh.gov.my")],
            ),
            "zh": HealthAnswer(
                verdict="UNVERIFIED",
                title="无法确认：尚未找到官方来源",
                summary="该说法尚未能通过卫生部或世卫组织来源证实。在核实前请勿转发。",
                details="如果讯息要求你购买产品、点击链接或转账，请视为有风险。请咨询诊所或查阅卫生部网站。",
                sources=[HealthSource(name="马来西亚卫生部", url="https://www.moh.gov.my")],
            ),
            "ar": HealthAnswer(
                verdict="UNVERIFIED",
                title="غير مؤكد: لم يُعثر على مصدر رسمي بعد",
                summary="تعذر تأكيد هذا الادعاء عبر مصادر وزارة الصحة أو منظمة الصحة العالمية. لا تشارك حتى يتم التحقق.",
                details="إذا طلبت الرسالة شراء منتج أو الضغط على رابط أو تحويل مال، فاعتبرها خطرة. راجع عيادة أو موقع الوزارة.",
                sources=[HealthSource(name="وزارة الصحة الماليزية", url="https://www.moh.gov.my")],
            ),
            "ta": HealthAnswer(
                verdict="UNVERIFIED",
                title="உறுதிப்படுத்தப்படவில்லை: அதிகாரப்பூர்வ ஆதாரம் இல்லை",
                summary="இந்தக் கூற்றை KKM அல்லது WHO ஆதாரங்கள் மூலம் உறுதிப்படுத்த முடியவில்லை. உறுதிப்படும் வரை பகிர வேண்டாம்.",
                details="பொருள் வாங்க, இணைப்பைக் கிளிக் செய்ய அல்லது பணம் அனுப்பச் சொன்னால் ஆபத்தாகக் கருதுங்கள். கிளினிக் அல்லது KKM தளத்தைப் பாருங்கள்.",
                sources=[HealthSource(name="KKM", url="https://www.moh.gov.my")],
            ),
        },
    }


def _local_check(question: str, language: str) -> HealthAnswer:
    q = (question or "").lower()
    packs = _local_packs()
    lang = language if language in LANGUAGE_NAMES else "en"
    if any(token in q for token in ("gelang kuantum", "quantum ring", "gelang quantum", "quantum nano")):
        key = "FALSE"
    elif any(token in q for token in ("papaya leaves", "papaya leaf", "daun betik")):
        key = "MISLEADING"
    elif any(token in q for token in ("cuci tangan", "wash your hands", "hand wash", "handwashing")):
        key = "VERIFIED"
    else:
        key = "UNVERIFIED"
    return packs[key].get(lang, packs[key]["en"])


def _get_client():
    global _client, _client_key
    key = get_gemini_api_key()
    if not key:
        return None
    if _client is None or _client_key != key:
        _client = genai.Client(api_key=key)
        _client_key = key
    return _client


def _extract_json(text: str) -> dict:
    cleaned = (text or "").strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("No JSON object in model response")
    return json.loads(cleaned[start : end + 1])


def _normalize_verdict(value: str) -> str:
    raw = str(value or "").strip().upper().replace(" ", "_")
    aliases = {
        "TRUE": "VERIFIED",
        "BENAR": "VERIFIED",
        "PALSU": "FALSE",
        "FAKE": "FALSE",
        "SCAM": "FALSE",
        "MENGELIRUKAN": "MISLEADING",
        "TIDAK_PASTI": "UNVERIFIED",
        "UNKNOWN": "UNVERIFIED",
        "NOTHEALTH": "NOT_HEALTH",
        "NOT-HEALTH": "NOT_HEALTH",
    }
    raw = aliases.get(raw, raw)
    allowed = {"VERIFIED", "FALSE", "MISLEADING", "UNVERIFIED", "NOT_HEALTH"}
    return raw if raw in allowed else "UNVERIFIED"


def _to_answer(payload: dict, language: str) -> HealthAnswer:
    sources = []
    for item in payload.get("sources") or []:
        if not isinstance(item, dict):
            continue
        name = str(item.get("name") or "").strip()
        url = str(item.get("url") or "").strip()
        if name:
            sources.append(HealthSource(name=name, url=url))

    verdict = _normalize_verdict(payload.get("verdict"))
    title = str(payload.get("title") or "").strip()
    summary = str(payload.get("summary") or "").strip()
    details = str(payload.get("details") or "").strip()

    if not title or not summary:
        raise ValueError("Incomplete model JSON")

    return HealthAnswer(
        verdict=verdict,
        title=title,
        summary=summary,
        details=details,
        sources=sources,
    )


def _not_health_copy(language: str) -> dict:
    copies = {
        "ms": {
            "title": "Bukan soalan kesihatan",
            "summary": "Maaf, SahihCare hanya semak mesej dan soalan berkaitan kesihatan.",
        },
        "en": {
            "title": "Not a health question",
            "summary": "Sorry, SahihCare can only check health-related messages and questions.",
        },
        "zh": {
            "title": "不是健康问题",
            "summary": "抱歉，SahihCare 只能核查与健康有关的讯息和问题。",
        },
        "ar": {
            "title": "ليس سؤالاً صحياً",
            "summary": "عذراً، يتحقق SahihCare فقط من الرسائل والأسئلة المتعلقة بالصحة.",
        },
        "ta": {
            "title": "இது சுகாதாரக் கேள்வி அல்ல",
            "summary": "மன்னிக்கவும், SahihCare சுகாதாரம் தொடர்பான செய்திகளையும் கேள்விகளையும் மட்டுமே சரிபார்க்கும்.",
        },
    }
    return copies.get(language, copies["en"])


def _call_gemini(client, model: str, prompt: str):
    configs = (
        {
            "response_mime_type": "application/json",
            "thinking_config": {"thinking_level": "MINIMAL"},
        },
        {"response_mime_type": "application/json"},
        None,
    )
    last_error = None
    for config in configs:
        try:
            kwargs = {"model": model, "contents": prompt}
            if config:
                kwargs["config"] = config
            return client.models.generate_content(**kwargs)
        except Exception as exc:
            last_error = exc
    raise last_error or RuntimeError(f"Gemini call failed for {model}")


def ask_gemini(question: str, language: str = "ms") -> HealthAnswer:
    lang = language if language in LANGUAGE_NAMES else "ms"
    lang_name = LANGUAGE_NAMES[lang]
    client = _get_client()

    if client is None:
        print("GEMINI_API_KEY missing; using local checker")
        return _local_check(question, lang)

    prompt = f"""{prompt_setup}

UI language: {lang_name}
Write title, summary, and details in {lang_name}.

User message:
{question}
"""

    preferred = get_gemini_model()
    models = [preferred] + [m for m in MODEL_CANDIDATES if m != preferred]
    last_error = None

    for model in models:
        try:
            response = _call_gemini(client, model, prompt)
            raw = (getattr(response, "text", None) or "").strip()
            if raw == "NOT_HEALTH":
                copy = _not_health_copy(lang)
                return HealthAnswer(
                    verdict="NOT_HEALTH",
                    title=copy["title"],
                    summary=copy["summary"],
                    details="",
                    sources=[],
                )
            data = _extract_json(raw)
            return _to_answer(data, lang)
        except Exception as exc:
            last_error = exc
            print(f"Gemini model {model} failed: {exc}")
            traceback.print_exc()

    print(f"Falling back to local checker after Gemini error: {last_error}")
    return _local_check(question, lang)


def _image_fallback(language: str) -> HealthAnswer:
    """Used when Gemini is unavailable for an image request.

    Unlike the text path, there is no local OCR here, so the honest fallback
    is to say the image could not be analysed rather than guess a verdict.
    """
    copies = {
        "ms": (
            "Tidak dapat menganalisis imej sekarang",
            "Perkhidmatan AI sedang tidak tersedia. Sila cuba lagi sebentar, atau taipkan mesej/tuntutan tersebut sebagai teks.",
        ),
        "en": (
            "Could not analyse the image right now",
            "The AI service is temporarily unavailable. Please try again shortly, or paste the claim as text instead.",
        ),
        "zh": (
            "暂时无法分析该图片",
            "AI 服务暂时无法使用。请稍后重试，或直接将该说法以文字形式粘贴。",
        ),
        "ar": (
            "تعذّر تحليل الصورة حالياً",
            "خدمة الذكاء الاصطناعي غير متاحة مؤقتاً. يرجى المحاولة لاحقاً، أو لصق الادعاء كنص بدلاً من ذلك.",
        ),
        "ta": (
            "படத்தை இப்போது பகுப்பாய்வு செய்ய முடியவில்லை",
            "AI சேவை தற்காலிகமாகக் கிடைக்கவில்லை. சிறிது நேரம் கழித்து முயற்சிக்கவும், அல்லது கூற்றை உரையாகப் பேஸ்ட் செய்யவும்.",
        ),
    }
    title, summary = copies.get(language, copies["en"])
    return HealthAnswer(verdict="UNVERIFIED", title=title, summary=summary, details="", sources=[])


def ask_gemini_image(image_bytes: bytes, mime_type: str, language: str = "ms") -> HealthAnswer:
    """Screenshot/photo counterpart to ask_gemini().

    Returns the same HealthAnswer schema so callers (FastAPI routes, the
    Telegram bot) don't need separate result-handling logic for text vs image,
    per the documented API contract.
    """
    lang = language if language in LANGUAGE_NAMES else "ms"
    lang_name = LANGUAGE_NAMES[lang]
    client = _get_client()

    if client is None:
        print("GEMINI_API_KEY missing; cannot analyse image locally")
        return _image_fallback(lang)

    prompt = f"""{prompt_setup}

The user has sent a SCREENSHOT or photo instead of typed text (e.g. a forwarded
WhatsApp message, social media post, or news clipping). First read any visible
text in the image and identify the health claim being made, then evaluate it
using the same rules above. If the image contains no readable health-related
claim, return NOT_HEALTH.

UI language: {lang_name}
Write title, summary, and details in {lang_name}.
"""

    image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
    preferred = get_gemini_model()
    models = [preferred] + [m for m in MODEL_CANDIDATES if m != preferred]
    last_error = None

    for model in models:
        try:
            response = _call_gemini(client, model, [prompt, image_part])
            raw = (getattr(response, "text", None) or "").strip()
            if raw == "NOT_HEALTH":
                copy = _not_health_copy(lang)
                return HealthAnswer(
                    verdict="NOT_HEALTH",
                    title=copy["title"],
                    summary=copy["summary"],
                    details="",
                    sources=[],
                )
            data = _extract_json(raw)
            return _to_answer(data, lang)
        except Exception as exc:
            last_error = exc
            print(f"Gemini image model {model} failed: {exc}")
            traceback.print_exc()

    print(f"Falling back after Gemini image error: {last_error}")
    return _image_fallback(lang)
