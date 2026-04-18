import React, { createContext, useState, useContext } from 'react';

const translations = {
  English: {
    home: "Home",
    aiGuide: "AI Guide",
    allSchemes: "All Schemes",
    profile: "Profile",
    navTitle: "Seva Flow",
    heroTitle: "Find Government Schemes\nMade for You",
    heroSubtitle: "Answer a few simple questions in your own language, and our AI assistant will instantly recommend the best schemes, scholarships, and loans you are eligible for.",
    findSchemesBtn: "Find Schemes Now",
    chatTitle: "Chat in Your Language",
    chatDesc: "Speak or type in Hindi, Bengali, or English. It's like talking to a friend.",
    smartTitle: "Smart Matching",
    smartDesc: "Our AI instantly filters through hundreds of schemes to find what you are eligible for.",
    saveTitle: "Save & Apply",
    saveDesc: "Bookmark schemes you like, see exactly what documents you need, and apply easily.",
    aiGreeting: "Namaste! I am your AI guide. Tell me roughly about yourself (e.g., 'I am a 19 year old student from UP' or 'I am a farmer looking for loans').",
    typeMsg: "Type your message...",
    matchesFound: "✨ Matches Found For You",
    matchesDesc: "Based on our chat, here are the best government schemes you can apply for right now.",
    searchPlaceholder: "Search by name or benefit...",
    exploreSchemes: "Explore All Schemes",
    browseDetailed: "Browse through the entire database of government schemes and resources.",
    benefit: "Benefit",
    eligibility: "Eligibility",
    checkDetails: "Check Details"
  },
  Hindi: {
    home: "होम",
    aiGuide: "एआई गाइड",
    allSchemes: "सभी योजनाएं",
    profile: "प्रोफाइल",
    navTitle: "Seva Flow",
    heroTitle: "अपने लिए सही सरकारी\nयोजनाएं खोजें",
    heroSubtitle: "अपनी भाषा में कुछ सरल प्रश्नों के उत्तर दें, और हमारा AI सहायक तुरंत आपको उन योजनाओं, छात्रवृत्ति और ऋणों की सिफारिश करेगा जिनके लिए आप पात्र हैं।",
    findSchemesBtn: "योजनाएं खोजें",
    chatTitle: "अपनी भाषा में चैट करें",
    chatDesc: "हिंदी, बंगाली या अंग्रेजी में बोलें या टाइप करें। यह एक दोस्त से बात करने जैसा है।",
    smartTitle: "स्मार्ट मिलान",
    smartDesc: "हमारा AI तुरंत सैकड़ों योजनाओं को छानता है ताकि आपके लिए सही योजना मिल सके।",
    saveTitle: "सेव करें और अप्लाई करें",
    saveDesc: "पसंद की योजनाओं को बुकमार्क करें, आवश्यक दस्तावेज़ देखें और आसानी से ऑनलाइन आवेदन करें।",
    aiGreeting: "नमस्ते! मैं आपका एआई गाइड हूं। कृपया मुझे अपने बारे में बताएं (जैसे, 'मैं यूपी से 19 साल का छात्र हूं' या 'मैं ऋण की तलाश में एक किसान हूं')।",
    typeMsg: "अपना संदेश टाइप करें...",
    matchesFound: "✨ आपके लिए योजनाएं",
    matchesDesc: "हमारी बातचीत के आधार पर, यहां सबसे अच्छी सरकारी योजनाएं हैं जिनके लिए आप अभी आवेदन कर सकते हैं।",
    searchPlaceholder: "नाम या लाभ के आधार पर खोजें...",
    exploreSchemes: "सभी योजनाएं देखें",
    browseDetailed: "सरकारी योजनाओं और संसाधनों के संपूर्ण डेटाबेस के माध्यम से ब्राउज़ करें।",
    benefit: "लाभ",
    eligibility: "पात्रता",
    checkDetails: "विवरण की जाँच करें"
  },
  Bengali: {
    home: "হোম",
    aiGuide: "এআই গাইড",
    allSchemes: "সব স্কিম",
    profile: "প্রোফাইল",
    navTitle: "Seva Flow",
    heroTitle: "আপনার জন্য সেরা সরকারি\nস্কিম খুঁজুন",
    heroSubtitle: "আপনার নিজের ভাষায় কয়েকটি সহজ প্রশ্নের উত্তর দিন, এবং আমাদের এআই সহায়ক তাত্ক্ষণিকভাবে আপনাকে এমন স্কিম, স্কলারশিপ এবং ঋণের সুপারিশ করবে যার জন্য আপনি যোগ্য।",
    findSchemesBtn: "এখনই স্কিম খুঁজুন",
    chatTitle: "আপনার ভাষায় চ্যাট করুন",
    chatDesc: "হিন্দি, বাংলা বা ইংরেজিতে কথা বলুন বা টাইপ করুন। এটি একজন বন্ধুর সাথে কথা বলার মতো।",
    smartTitle: "স্মার্ট ম্যাচিং",
    smartDesc: "আমাদের এআই তাত্ক্ষণিকভাবে শত শত স্কিমের মাধ্যমে ফিল্টার করে আপনার জন্য উপযুক্ত স্কিম খুঁজে বের করে।",
    saveTitle: "সংরক্ষণ করুন এবং আবেদন করুন",
    saveDesc: "আপনার পছন্দের স্কিমগুলো বুকমার্ক করুন, প্রয়োজনীয় কাগজপত্র দেখুন এবং সহজেই আবেদন করুন।",
    aiGreeting: "নমস্কার! আমি আপনার এআই গাইড। আপনার সম্পর্কে আমাকে কিছু বলুন (যেমন, 'আমি ইউপি থেকে একজন 19 বছর বয়সী ছাত্র' অথবা 'আমি একজন কৃষক যিনি ঋণ খুঁজছেন')।",
    typeMsg: "আপনার বার্তা টাইপ করুন...",
    matchesFound: "✨ আপনার জন্য স্কিম",
    matchesDesc: "আমাদের আলাপের উপর ভিত্তি করে, এখানে সেরা সরকারি স্কিমগুলি রয়েছে যার জন্য আপনি এখনই আবেদন করতে পারেন।",
    searchPlaceholder: "নাম বা সুবিধা দ্বারা অনুসন্ধান করুন...",
    exploreSchemes: "সব স্কিম দেখুন",
    browseDetailed: "সরকারি স্কিম এবং সম্পদের সম্পূর্ণ ডাটাবেস ব্রাউজ করুন।",
    benefit: "সুবিধা",
    eligibility: "যোগ্যতা",
    checkDetails: "বিস্তারিত দেখুন"
  },
  Tamil: {
    home: "முகப்பு",
    aiGuide: "AI வழிகாட்டி",
    allSchemes: "அனைத்து திட்டங்கள்",
    profile: "சுயவிவரம்",
    navTitle: "Seva Flow",
    heroTitle: "உங்களுக்காக உருவாக்கப்பட்ட\nஅரசு திட்டங்களை கண்டறியுங்கள்",
    heroSubtitle: "உங்கள் சொந்த மொழியில் சில எளிய கேள்விகளுக்கு பதிலளிக்கவும், நீங்கள் தகுதி பெற்றுள்ள சிறந்த திட்டங்கள் மற்றும் கடன்களை எங்கள் AI உடனுக்குடன் பரிந்துரைக்கும்.",
    findSchemesBtn: "திட்டங்களை இப்போது கண்டறிக",
    chatTitle: "உங்கள் மொழியில் அரட்டையடிக்கவும்",
    chatDesc: "தமிழ், ஹிந்தி, வங்காள அல்லது ஆங்கிலத்தில் பேசவும் அல்லது தட்டச்சு செய்யவும்.",
    smartTitle: "ஸ்மார்ட் பொருத்தம்",
    smartDesc: "எங்கள் AI ஆயிரக்கணக்கான திட்டங்களில் உங்களுக்கான சரியான திட்டங்களை உடனடியாக கண்டறியும்.",
    saveTitle: "சேமி & விண்ணப்பி",
    saveDesc: "உங்களுக்குப் பிடித்த திட்டங்களை குறிப்பேட்டில் சேர்க்கவும், தேவையான ஆவணங்களை பார்த்து எளிதாக விண்ணப்பிக்கவும்.",
    aiGreeting: "வணக்கம்! நான் உங்கள் AI வழிகாட்டி. உங்களைப் பற்றி கொஞ்சம் கூறுங்கள் (உதாரணம்: 'நான் 19 வயது மாணவன்' அல்லது 'நான் ஒரு விவசாயி, கடன் தேடுகிறேன்').",
    typeMsg: "உங்கள் செய்தியை தட்டச்சு செய்யவும்...",
    matchesFound: "✨ உங்களுக்கு ஏற்ற திட்டங்கள்",
    matchesDesc: "பரிந்துரைகளின் அடிப்படையில், நீங்கள் விண்ணப்பிக்கக்கூடிய சிறந்த அரசு திட்டங்கள் இங்கே உள்ளன.",
    searchPlaceholder: "பெயர் அல்லது நன்மை மூலம் தேடுக...",
    exploreSchemes: "அனைத்து திட்டங்களையும் காண்க",
    browseDetailed: "அரசு திட்டங்கள் மற்றும் ஆதாரங்களின் தரவுத்தளத்தை உலாவுக.",
    benefit: "நன்மை",
    eligibility: "தகுதி",
    checkDetails: "விவரங்களை சரிபார்க்கவும்"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('English');
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
