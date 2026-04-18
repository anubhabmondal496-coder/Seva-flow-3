const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');

// Language-aware text helpers
const txt = {
  greeting: {
    English: "Namaste! I am your AI guide 🙏\n\nI can help you find government schemes. Please tell me:\n• Are you a Student, Farmer, Business owner, or something else?\n• Your approximate age and state (optional)\n\nExample: \"I am a 22 year old student from Bihar\" or \"I am a farmer looking for loans\"",
    Hindi: "नमस्ते! मैं आपका AI गाइड हूं 🙏\n\nमैं आपके लिए सही सरकारी योजनाएं खोज सकता हूं। कृपया बताएं:\n• क्या आप छात्र हैं, किसान हैं, व्यापारी हैं या कुछ और?\n• आपकी उम्र और राज्य का नाम (वैकल्पिक)\n\nउदाहरण: \"मैं बिहार से 22 साल का छात्र हूं\" या \"मैं किसान हूं और कर्ज के लिए सहायता चाहता हूं\"",
    Bengali: "নমস্কার! আমি আপনার AI গাইড 🙏\n\nআমি আপনার জন্য সরকারি স্কিম খুঁজে পেতে সাহায্য করতে পারি। দয়া করে বলুন:\n• আপনি কি ছাত্র, কৃষক, ব্যবসায়ী বা অন্য কিছু?\n• আপনার বয়স এবং রাজ্যের নাম (ঐচ্ছিক)\n\nউদাহরণ: \"আমি বিহার থেকে ২২ বছরের ছাত্র\" বা \"আমি একজন কৃষক এবং ঋণের সাহায্য চাই\"",
    Tamil: "வணக்கம்! நான் உங்கள் AI வழிகாட்டி 🙏\n\nஉங்களுக்கு ஏற்ற அரசு திட்டங்களை கண்டறிய நான் உதவுவேன். தயவுசெய்து கூறுங்கள்:\n• நீங்கள் மாணவரா, விவசாயியா, தொழிலதிபரா அல்லது வேறு யாரோ?\n• உங்கள் வயது மற்றும் மாநிலம் (விரும்பினால்)\n\nஎடுத்துக்காட்டு: \"நான் 22 வயது மாணவன், பீகாரில் இருக்கிறேன்\" அல்லது \"நான் விவசாயி, கடன் உதவி தேடுகிறேன்\""
  },

  student: {
    English: "Great! As a student, here are the best government schemes for you 🎓\n\nHow to Apply — Step by Step:\n1️⃣ Pick a scheme card on the right\n2️⃣ Click \"View Details\" to see eligibility\n3️⃣ Visit the official portal and register\n4️⃣ Upload Aadhar Card + Mark Sheet + Income Certificate",
    Hindi: "बहुत अच्छा! एक छात्र के रूप में, यहाँ आपके लिए सबसे अच्छी योजनाएं हैं 🎓\n\nआवेदन कैसे करें — चरण दर चरण:\n1️⃣ दाईं ओर दिखाई गई कोई भी योजना चुनें\n2️⃣ \"View Details\" पर क्लिक करें और पात्रता देखें\n3️⃣ आधिकारिक पोर्टल पर जाएं और रजिस्टर करें\n4️⃣ आधार कार्ड + मार्कशीट + आय प्रमाण पत्र अपलोड करें",
    Bengali: "দুর্দান্ত! একজন ছাত্র হিসেবে, এখানে আপনার জন্য সেরা সরকারি স্কিম রয়েছে 🎓\n\nআবেদন কীভাবে করবেন — ধাপে ধাপে:\n1️⃣ ডানদিকে দেখানো যেকোনো স্কিম বেছে নিন\n2️⃣ \"View Details\" ক্লিক করুন এবং যোগ্যতা দেখুন\n3️⃣ অফিসিয়াল পোর্টালে যান এবং নিবন্ধন করুন\n4️⃣ আধার কার্ড + মার্কশিট + আয় সার্টিফিকেট আপলোড করুন",
    Tamil: "சிறப்பு! ஒரு மாணவராக, உங்களுக்கான சிறந்த அரசு திட்டங்கள் இங்கே உள்ளன 🎓\n\nவிண்ணப்பிக்கும் முறை — படி படியாக:\n1️⃣ வலது பக்கம் காட்டப்படும் திட்டங்களில் ஒன்றை தேர்ந்தெடுங்கள்\n2️⃣ \"View Details\" கிளிக் செய்து தகுதி பார்க்கவும்\n3️⃣ அதிகாரப்பூர்வ போர்டலில் பதிவு செய்யவும்\n4️⃣ ஆதார் அட்டை + மதிப்பெண் சீட்டு + வருமான சான்றிதழ் பதிவேற்றவும்"
  },

  farmer: {
    English: "Sure! Here are the best government schemes for farmers 🌾\n\nHow to Apply:\n1️⃣ Choose a scheme from the right panel\n2️⃣ Visit the official portal\n3️⃣ Register using Aadhar + Land Records (Khatoni)\n4️⃣ Enter your bank account for DBT (Direct Benefit Transfer)",
    Hindi: "बिल्कुल! यहाँ किसानों के लिए सबसे अच्छी सरकारी योजनाएं हैं 🌾\n\nआवेदन कैसे करें:\n1️⃣ दाईं ओर से कोई योजना चुनें\n2️⃣ आधिकारिक पोर्टल पर जाएं\n3️⃣ आधार + भूमि रिकॉर्ड (खतौनी) से रजिस्टर करें\n4️⃣ DBT के लिए बैंक खाता नंबर दर्ज करें",
    Bengali: "অবশ্যই! এখানে কৃষকদের জন্য সেরা সরকারি স্কিম রয়েছে 🌾\n\nআবেদন কীভাবে করবেন:\n1️⃣ ডানদিকের প্যানেল থেকে একটি স্কিম বেছে নিন\n2️⃣ অফিসিয়াল পোর্টালে যান\n3️⃣ আধার + জমির দলিল (খতিয়ান) দিয়ে নিবন্ধন করুন\n4️⃣ DBT-র জন্য ব্যাংক অ্যাকাউন্ট নম্বর দিন",
    Tamil: "நிச்சயமாக! விவசாயிகளுக்கான சிறந்த அரசு திட்டங்கள் இங்கே 🌾\n\nவிண்ணப்பிக்கும் முறை:\n1️⃣ வலது பக்கத்திலிருந்து திட்டம் தேர்ந்தெடுங்கள்\n2️⃣ அதிகாரப்பூர்வ போர்டலுக்கு செல்லவும்\n3️⃣ ஆதார் + நில ஆவணங்கள் (பட்டா) மூலம் பதிவு செய்யவும்\n4️⃣ DBT-க்காக வங்கி கணக்கு எண் உள்ளிடவும்"
  },

  business: {
    English: "Great! Here are loan and support schemes for business owners 💼\n\nHow to Apply:\n1️⃣ Select the right loan scheme (Shishu/Kishore/Tarun)\n2️⃣ Visit the portal or head to your nearest bank branch\n3️⃣ Carry: PAN Card + Bank Statement (6 months) + Business plan\n4️⃣ Apply and get approval within 7–15 days",
    Hindi: "बढ़िया! यहाँ व्यापारियों के लिए ऋण और सहायता योजनाएं हैं 💼\n\nआवेदन कैसे करें:\n1️⃣ सही ऋण योजना चुनें (शिशु/किशोर/तरुण)\n2️⃣ पोर्टल पर जाएं या निकटतम बैंक शाखा में जाएं\n3️⃣ साथ लाएं: पैन कार्ड + बैंक स्टेटमेंट (6 महीने) + बिज़नेस योजना\n4️⃣ आवेदन करें और 7–15 दिनों में अनुमोदन पाएं",
    Bengali: "দুর্দান্ত! ব্যবসায়ীদের জন্য ঋণ এবং সহায়তা স্কিম এখানে রয়েছে 💼\n\nআবেদন কীভাবে করবেন:\n1️⃣ সঠিক ঋণ স্কিম বেছে নিন (শিশু/কিশোর/তরুণ)\n2️⃣ পোর্টালে যান বা নিকটস্থ ব্যাঙ্ক শাখায় যান\n3️⃣ নিয়ে আসুন: PAN কার্ড + ব্যাঙ্ক স্টেটমেন্ট (6 মাস) + ব্যবসার পরিকল্পনা\n4️⃣ আবেদন করুন এবং 7–15 দিনের মধ্যে অনুমোদন পান",
    Tamil: "சிறப்பு! தொழிலதிபர்களுக்கான கடன் மற்றும் ஆதரவு திட்டங்கள் இங்கே 💼\n\nவிண்ணப்பிக்கும் முறை:\n1️⃣ சரியான கடன் திட்டத்தை தேர்ந்தெடுங்கள் (சிசு/கிஷோர்/தருண்)\n2️⃣ போர்டலுக்கு செல்லவும் அல்லது அருகிலுள்ள வங்கிக்கு செல்லவும்\n3️⃣ கொண்டுவாருங்கள்: PAN அட்டை + வங்கி அறிக்கை (6 மாதம்) + வணிக திட்டம்\n4️⃣ விண்ணப்பிக்கவும், 7–15 நாட்களில் அனுமதி கிடைக்கும்"
  },

  girl: {
    English: "Here are special government schemes for the girl child 👧\n\nHow to Apply:\n1️⃣ Visit the scheme portal (from the right panel)\n2️⃣ Carry: Girl's Birth Certificate + Parents' Aadhar + Bank Passbook\n3️⃣ Visit nearest Post Office or Bank to open the account\n4️⃣ Deposit minimum ₹250 to activate the account",
    Hindi: "बालिकाओं के लिए विशेष सरकारी योजनाएं यहाँ हैं 👧\n\nआवेदन कैसे करें:\n1️⃣ योजना पोर्टल पर जाएं (दाईं ओर से)\n2️⃣ साथ लाएं: बेटी का जन्म प्रमाण पत्र + माता-पिता का आधार + बैंक पासबुक\n3️⃣ निकटतम पोस्ट ऑफिस या बैंक में खाता खोलें\n4️⃣ खाता सक्रिय करने के लिए न्यूनतम ₹250 जमा करें",
    Bengali: "বালিকাদের জন্য বিশেষ সরকারি স্কিম এখানে রয়েছে 👧\n\nআবেদন কীভাবে করবেন:\n1️⃣ স্কিম পোর্টালে যান (ডানদিকের প্যানেল থেকে)\n2️⃣ নিয়ে আসুন: মেয়ের জন্ম সনদ + বাবা-মায়ের আধার + ব্যাঙ্ক পাসবুক\n3️⃣ নিকটতম পোস্ট অফিস বা ব্যাঙ্কে অ্যাকাউন্ট খুলুন\n4️⃣ অ্যাকাউন্ট সক্রিয় করতে ন্যূনতম ₹250 জমা দিন",
    Tamil: "பெண் குழந்தைகளுக்கான சிறப்பு அரசு திட்டங்கள் இங்கே 👧\n\nவிண்ணப்பிக்கும் முறை:\n1️⃣ திட்ட போர்டலுக்கு செல்லவும் (வலது பக்கத்திலிருந்து)\n2️⃣ கொண்டுவாருங்கள்: பிறப்பு சான்றிதழ் + பெற்றோர் ஆதார் + வங்கி பாஸ்புக்\n3️⃣ அருகிலுள்ள தபால் அலுவலகம் அல்லது வங்கியில் கணக்கு திறக்கவும்\n4️⃣ கணக்கை செயல்படுத்த குறைந்தது ₹250 டெபாசிட் செய்யவும்"
  },

  health: {
    English: "Here are healthcare and insurance schemes for you 🏥\n\nHow to Apply:\n1️⃣ Check your eligibility on the portal\n2️⃣ Carry: Ration Card / Aadhar Card / Income Certificate\n3️⃣ Register at the nearest government hospital or CSC centre\n4️⃣ Receive your Ayushman card for cashless treatment",
    Hindi: "यहाँ आपके लिए स्वास्थ्य और बीमा योजनाएं हैं 🏥\n\nआवेदन कैसे करें:\n1️⃣ पोर्टल पर अपनी पात्रता जांचें\n2️⃣ साथ लाएं: राशन कार्ड / आधार कार्ड / आय प्रमाण पत्र\n3️⃣ निकटतम सरकारी अस्पताल या CSC केंद्र में पंजीकरण करें\n4️⃣ नगद-रहित उपचार के लिए आयुष्मान कार्ड प्राप्त करें",
    Bengali: "এখানে আপনার জন্য স্বাস্থ্য ও বীমা স্কিম রয়েছে 🏥\n\nআবেদন কীভাবে করবেন:\n1️⃣ পোর্টালে আপনার যোগ্যতা পরীক্ষা করুন\n2️⃣ নিয়ে আসুন: রেশন কার্ড / আধার / আয় সার্টিফিকেট\n3️⃣ নিকটতম সরকারি হাসপাতাল বা CSC কেন্দ্রে নিবন্ধন করুন\n4️⃣ ক্যাশলেস চিকিৎসার জন্য আয়ুষ্মান কার্ড পান",
    Tamil: "உங்களுக்கான சுகாதார மற்றும் காப்பீட்டு திட்டங்கள் இங்கே 🏥\n\nவிண்ணப்பிக்கும் முறை:\n1️⃣ போர்டலில் உங்கள் தகுதியை சரிபார்க்கவும்\n2️⃣ கொண்டுவாருங்கள்: ரேஷன் கார்டு / ஆதார் / வருமான சான்றிதழ்\n3️⃣ அருகிலுள்ள அரசு மருத்துவமனை அல்லது CSC மையத்தில் பதிவு செய்யவும்\n4️⃣ பணமில்லா சிகிச்சைக்காக ஆயுஷ்மான் கார்டு பெறவும்"
  },

  disability: {
    English: "Here are government schemes specially for Persons with Disabilities (PWD) ♿\n\nHow to Apply:\n1️⃣ First get your UDID card at swavlambancard.gov.in (free)\n2️⃣ Carry: Disability Certificate + Aadhar + UDID Card + Passport Photo\n3️⃣ Visit the official scheme portal from the cards on the right\n4️⃣ Most schemes require minimum 40% disability — as certified by a government medical board\n\n🔵 Special allowances for blind students: Reader Allowance + Escort Allowance available",
    Hindi: "विकलांग व्यक्तियों (PWD) के लिए सरकारी योजनाएं ♿\n\nआवेदन कैसे करें:\n1️⃣ पहले swavlambancard.gov.in पर अपना UDID कार्ड बनाएं (निःशुल्क)\n2️⃣ साथ लाएं: विकलांगता प्रमाण पत्र + आधार + UDID कार्ड + पासपोर्ट फोटो\n3️⃣ दाईं ओर दिखाई गई योजना के पोर्टल पर जाएं\n4️⃣ अधिकतर योजनाओं के लिए न्यूनतम 40% विकलांगता आवश्यक है\n\n🔵 नेत्रहीन छात्रों के लिए: पाठक भत्ता + अनुरक्षण भत्ता उपलब्ध",
    Bengali: "প্রতিবন্ধী ব্যক্তিদের (PWD) জন্য সরকারি স্কিম ♿\n\nআবেদন কীভাবে করবেন:\n1️⃣ প্রথমে swavlambancard.gov.in-এ বিনামূল্যে UDID কার্ড করুন\n2️⃣ নিয়ে আসুন: প্রতিবন্ধী সার্টিফিকেট + আধার + UDID কার্ড + পাসপোর্ট ফটো\n3️⃣ ডানদিকের কার্ড থেকে পোর্টালে যান\n4️⃣ বেশিরভাগ স্কিমে ন্যূনতম 40% প্রতিবন্ধিতা প্রয়োজন\n\n🔵 দৃষ্টিহীন ছাত্রদের জন্য: পাঠক ভাতা + সহচর ভাতা পাওয়া যায়",
    Tamil: "மாற்றுத்திறனாளிகளுக்கான (PWD) அரசு திட்டங்கள் ♿\n\nவிண்ணப்பிக்கும் முறை:\n1️⃣ முதலில் swavlambancard.gov.in-ல் இலவச UDID அட்டை பெறவும்\n2️⃣ கொண்டுவாருங்கள்: மாற்றுத்திறன் சான்றிதழ் + ஆதார் + UDID அட்டை + புகைப்படம்\n3️⃣ வலது பக்கத்திலுள்ள திட்ட போர்டலுக்கு செல்லவும்\n4️⃣ பெரும்பாலான திட்டங்களுக்கு குறைந்தது 40% மாற்றுத்திறன் தேவை\n\n🔵 பார்வையற்ற மாணவர்களுக்கு: வாசிப்பாளர் மற்றும் உதவியாளர் படிகள் உண்டு"
  },

  general: {
    English: "I found some schemes that might match your situation 📋\n\nFor better results, please tell me:\n→ Are you a Student / Farmer / Business Owner / PWD?\n→ Your approximate age and state\n\nYou can also Browse All Schemes from the top menu.",
    Hindi: "मुझे आपके लिए कुछ योजनाएं मिली हैं 📋\n\nबेहतर परिणामों के लिए, कृपया बताएं:\n→ क्या आप छात्र / किसान / व्यापारी / विकलांग हैं?\n→ आपकी उम्र और राज्य\n\nआप शीर्ष मेनू से सभी योजनाएं भी देख सकते हैं।",
    Bengali: "আমি আপনার জন্য কিছু স্কিম খুঁজে পেয়েছি 📋\n\nআরও ভালো ফলাফলের জন্য, দয়া করে বলুন:\n→ আপনি কি ছাত্র / কৃষক / ব্যবসায়ী / প্রতিবন্ধী?\n→ আপনার বয়স এবং রাজ্যের নাম\n\nআপনি উপরের মেনু থেকে সমস্ত স্কিমও দেখতে পারেন।",
    Tamil: "உங்களுக்கான சில திட்டங்களை கண்டேன் 📋\n\nசிறந்த முடிவுகளுக்கு, தயவுசெய்து கூறுங்கள்:\n→ நீங்கள் மாணவரா / விவசாயியா / தொழிலதிபரா / மாற்றுத்திறனாளியா?\n→ உங்கள் வயது மற்றும் மாநிலம்\n\nமேல் மெனுவிலிருந்து அனைத்து திட்டங்களையும் பார்க்கலாம்."
  }
};

const getLang = (language) => ['Hindi','Bengali','Tamil'].includes(language) ? language : 'English';

router.post('/', async (req, res) => {
  try {
    const { message, language } = req.body;
    const lang = getLang(language);
    const lm = (message || '').toLowerCase();

    let aiMessage = txt.greeting[lang];
    let recommendedSchemes = [];

    const isStudent = lm.includes('student') || lm.includes('study') || lm.includes('education') || lm.includes('scholarship') || lm.includes('छात्र') || lm.includes('पढ़') || lm.includes('ছাত্র') || lm.includes('পড়') || lm.includes('மாணவ') || lm.includes('பள்ளி') || lm.includes('படிப்பு');
    const isFarmer = lm.includes('farm') || lm.includes('kisan') || lm.includes('agriculture') || lm.includes('crop') || lm.includes('किसान') || lm.includes('खेत') || lm.includes('কৃষক') || lm.includes('চাষ') || lm.includes('விவசாய') || lm.includes('நில');
    const isBusiness = lm.includes('business') || lm.includes('startup') || lm.includes('loan') || lm.includes('mudra') || lm.includes('msme') || lm.includes('व्यवसाय') || lm.includes('ऋण') || lm.includes('ব্যবসা') || lm.includes('ঋণ') || lm.includes('தொழில்') || lm.includes('கடன்');
    const isGirl  = lm.includes('girl') || lm.includes('daughter') || lm.includes('beti') || lm.includes('sukanya') || lm.includes('बेटी') || lm.includes('कन्या') || lm.includes('কন্যা') || lm.includes('মেয়ে') || lm.includes('பெண்') || lm.includes('குழந்தை');
    const isHealth = lm.includes('health') || lm.includes('hospital') || lm.includes('insurance') || lm.includes('bima') || lm.includes('ayushman') || lm.includes('स्वास्थ्य') || lm.includes('बीमा') || lm.includes('স্বাস্থ্য') || lm.includes('বীমা') || lm.includes('மருத்துவ') || lm.includes('காப்பீடு');
    const isDisability = lm.includes('disabled') || lm.includes('disability') || lm.includes('pwd') || lm.includes('handicap') || lm.includes('blind') || lm.includes('deaf') || lm.includes('dumb') || lm.includes('wheelchair') || lm.includes('udid') || lm.includes('divyang') || lm.includes('विकलांग') || lm.includes('दिव्यांग') || lm.includes('প্রতিবন্ধী') || lm.includes('மாற்றுத்திறன்');

    if (isStudent) {
      aiMessage = txt.student[lang];
      recommendedSchemes = await Scheme.find({ category: { $regex: /Education/i } }).limit(5);
    } else if (isFarmer) {
      aiMessage = txt.farmer[lang];
      recommendedSchemes = await Scheme.find({ category: { $regex: /Agriculture/i } }).limit(5);
    } else if (isBusiness) {
      aiMessage = txt.business[lang];
      recommendedSchemes = await Scheme.find({ category: { $regex: /Business/i } }).limit(5);
    } else if (isGirl) {
      aiMessage = txt.girl[lang];
      recommendedSchemes = await Scheme.find({ name: { $regex: /Sukanya|Beti/i } }).limit(5);
    } else if (isHealth) {
      aiMessage = txt.health[lang];
      recommendedSchemes = await Scheme.find({ category: { $regex: /Health/i } }).limit(5);
    } else if (isDisability) {
      aiMessage = txt.disability[lang];
      recommendedSchemes = await Scheme.find({ category: { $regex: /Disability/i } }).limit(6);
    } else if (lm.length > 3) {
      aiMessage = txt.general[lang];
      recommendedSchemes = await Scheme.find().limit(3);
    }

    res.json({ reply: aiMessage, schemes: recommendedSchemes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
