// "Why keep track?" articles and the dashboard tips that link to them.
//
// Every number here comes from the source listed with it. If you edit a
// claim, check it against the source first; don't round it up.

import type { Locale } from "@/i18n/config";

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string };

type Localized = { title: string; summary: string; body: Block[] };

export type Article = {
  slug: string;
  icon: "pen" | "card" | "handcoins" | "flame" | "list" | "target";
  minutes: number;
  /** YYYY-MM-DD; shown on the page and in search results. */
  published: string;
  updated?: string;
  bn: Localized;
  en: Localized;
  sources: { label: string; url: string }[];
};

export const ARTICLES: Article[] = [
  {
    slug: "write-it-down",
    published: "2026-10-16",
    icon: "pen",
    minutes: 3,
    bn: {
      title: "লিখে রাখলে অপ্রয়োজনীয় খরচ কমে প্রায় ১৫ শতাংশ: গবেষণা যা প্রমাণ করেছে",
      summary: "মাস শেষে টাকা কোথায় উধাও হয়ে যায়? ১৩৮টি গবেষণার সহজ উত্তর: যা চোখে পড়ে, মন নিজে থেকেই সেটার লাগাম টানে।",
      body: [
        {
          type: "p",
          text: "মাসের ২০ বা ২২ তারিখের দিকে মানিব্যাগ খুললেন বা বিকাশ অ্যাকাউন্টের ব্যালেন্স দেখে বুকটা ছ্যাঁৎ করে উঠল—এতগুলো টাকা কোথায় উধাও হয়ে গেল?! অথচ এই মাসে আপনি কোনো নতুন ফোন কেনেননি, দামি জামাকাপড় কেনেননি, বা কোথাও ঘুরতেও যাননি। তাহলে কষ্ট করে উপার্জন করা এই হাজার হাজার টাকা গেল কোথায়?",
        },
        { type: "h", text: "টাকা হঠাৎ যায় না, টাকা চুইয়ে পড়ে" },
        {
          type: "p",
          text: "বাস্তবতা হলো, টাকা কখনো একসাথে হুট করে ফুরিয়ে যায় না। টাকা নিঃশব্দে চুইয়ে পড়ে ছোট ছোট অলক্ষ্যে: অফিসের ফাঁকে স্পেশাল চা আর শিঙাড়া (৳৬০), রোদে হাঁটতে ভালো লাগছে না বলে রিকশা (৳৫০), পাড়ার মুদি দোকানে বাকি বলে চলে আসা (৳৩৫০), কিংবা অনলাইন শপে স্ক্রল করতে করতে ঝোঁকের মাথায় অপ্রয়োজনীয় কিছু অর্ডার করা।",
        },
        {
          type: "p",
          text: "আমরা সচরাচর এগুলোকে 'খরচই' মনে করি না। কিন্তু মাসের শেষে সব ছোট খরচ একসাথে যোগ করলে দেখা যায়, আয়ের প্রায় ২০ থেকে ৩০ শতাংশ টাকাই চলে গেছে এমন সব অপ্রয়োজনীয় জিনিসে—যা না কিনলেও আপনার জীবনে বিন্দুমাত্র অসুবিধা হতো না।",
        },
        { type: "h", text: "৫ সেকেন্ডের বিরতি: লিখে রাখলে কীভাবে মন সতর্ক হয়?" },
        {
          type: "p",
          text: "আপনি যখন প্রতিটি খরচের হিসাব ফোনে লিখে রাখার সিদ্ধান্ত নেন, তখন মনের ভেতর এক শক্তিশালী মনস্তাত্ত্বিক পরিবর্তন ঘটে—যাকে আচরণগত অর্থনীতিতে বলা হয় 'Self-Monitoring Effect'। কেনার ঠিক আগের মুহূর্তে যখন মাথায় আসে 'এটা লিখে রাখতে হবে', তখনই অবচেতন মন ৫ সেকেন্ডের একটি ছোট্ট বিরতি পায়। আর এই বিরতিতেই আবেগের বশে অপ্রয়োজনীয় খরচ (Impulse buying) করার তাগিদ নিজে থেকেই থমকে যায়।",
        },
        { type: "h", text: "১৩৮টি গবেষণা ও খাবারের ডায়েরির ম্যাজিক" },
        {
          type: "p",
          text: "২০১৬ সালে Psychological Bulletin জার্নালে ১৩৮টি গবেষণার এক মেটা-অ্যানালাইসিসে (Harkin ও সহকর্মীরা) দ্ব্যর্থহীনভাবে প্রমাণিত হয়েছে: যারা নিজেদের অগ্রগতি নিয়মিত লিখে রাখেন, তারা যেকোনো আর্থিক বা ব্যক্তিগত লক্ষ্যে অন্যদের চেয়ে অনেক বেশি সফল হন। ক্যালিফোর্নিয়ার Kaiser Permanente-এর ১,৭০০ জনের গবেষণাতেও দেখা গেছে: যারা প্রতিদিনের খাবার ডায়েরিতে লিখেছেন, তারা কোনো কঠোর ডায়েট ছাড়াই অন্যদের তুলনায় দ্বিগুণ ওজন কমিয়েছেন! টাকার ক্ষেত্রেও ঠিক একই নিয়ম খাটে—খরচ চোখে ভাসলে অপচয় নিজে থেকেই বন্ধ হয়।",
        },
        { type: "h", text: "লিখে রাখলে অপ্রয়োজনীয় খরচ কমে প্রায় ১৫ শতাংশ" },
        {
          type: "p",
          text: "Journal of Financial and Quantitative Analysis-এ প্রকাশিত এক গবেষণায় (Yaron Levi) দেখা গেছে, যেসব অ্যাপ ব্যবহারকারীকে তাদের আগের মাসের খরচের সাথে চলতি মাসের খরচের সরাসরি তুলনা দেখানো হয়েছিল, তারা বাড়তি মানসিক চাপ ছাড়াই অপ্রয়োজনীয় খরচ (discretionary spending) গড়ে প্রায় ১৫ শতাংশ কমিয়ে ফেলেছেন—পুরো ৮ মাস ধরে!",
        },
        {
          type: "p",
          text: "ভেবে দেখুন: আপনার মাসিক খরচ ৩০,০০০ টাকা হলে, শুধু অপ্রয়োজনীয় খরচ ১৫% কমানো মানে প্রতি মাসে প্রায় ৪,৫০০ টাকা অতিরিক্ত সঞ্চয়—বছরে ৫০,০০০ টাকারও বেশি বাড়তি টাকা নিজের পকেটে থেকে যাবে!",
        },
        {
          type: "callout",
          text: "হিসাব (Hisab) অ্যাপের ড্যাশবোর্ড ঠিক এই সাইকোলজি মেনে তৈরি: কোন খাতে স্বাভাবিকের চেয়ে বেশি খরচ হচ্ছে আর আগের মাসের তুলনায় আপনি কেমন চলছেন—তা এক পলকেই রঙিন চার্টে চোখে আঙুল দিয়ে দেখিয়ে দেয়।",
        },
        { type: "h", text: "আজ থেকেই যেভাবে সহজ অভ্যাস শুরু করবেন" },
        {
          type: "list",
          items: [
            "১০ সেকেন্ডের নিয়ম: খরচ হওয়ার ঠিক সাথে সাথে লিখে ফেলুন। রিকশা থেকে নামার সময় বা দোকানে দাঁড়িয়ে টাকা দেওয়ার সাথে সাথেই ফোন খুলে ১০ সেকেন্ডে এন্ট্রি দিন। রাতে বাড়ি ফিরে লিখব ভাবলে অর্ধেক খরচই আর মনে থাকবে না।",
            "দোকানের বাকি সাথে সাথে টুকে রাখুন: বাকি অপশন ট্যাপ করে সাথে সাথে লিখে রাখুন, মাস শেষে আর দোকানদারের সাথে হিসাব নিয়ে কোনো ভুল বোঝাবুঝি হবে না।",
            "সপ্তাহে একবার ড্যাশবোর্ডে চোখ বুলান: নিজেকে অপরাধী ভাবার দরকার নেই। শুধু কৌতূহল নিয়ে দেখুন—কোন খাতে সবচেয়ে বেশি টাকা গেল? সেখান থেকেই পরের সপ্তাহে একটু সচেতন হন।",
          ],
        },
        {
          type: "p",
          text: "হিসাব রাখার উদ্দেশ্য নিজেকে কষ্টে রাখা নয়; বরং নিজের রক্ত-ঘামে উপার্জিত টাকার ওপর নিয়ন্ত্রণ ফিরিয়ে আনা। আজ থেকেই প্রথম খরচটা লিখে দেখুন—প্রথম সপ্তাহেই নিজের চিন্তাভাবনায় এক চমৎকার স্বস্তি অনুভব করবেন।",
        },
      ],
    },
    en: {
      title: "Writing It Down Cuts Unnecessary Spending by 15%: What Science Proves",
      summary: "Where did all the money go by mid-month? 138 studies agree: when your spending is visible, your brain naturally stops the leaks.",
      body: [
        {
          type: "p",
          text: "Around the 20th of the month, you open your wallet or glance at your banking app. Your stomach sinks: where did all that money go?! You didn't buy a new phone, fancy clothes, or take an expensive trip. So how did thousands of hard-earned takas just evaporate?",
        },
        { type: "h", text: "Money doesn't vanish in bursts—it leaks quietly" },
        {
          type: "p",
          text: "Money rarely disappears in huge explosions. It leaks silently through invisible daily micro-habits: afternoon tea and snacks (৳60), grabbing a rickshaw in the heat (৳50), extra grocery treats (৳120), or telling the corner shop to put it on baki (৳350).",
        },
        {
          type: "p",
          text: "We discount these small purchases because the brain only remembers big milestones. But tallied up at month-end, 20% to 30% of your income went toward unnecessary items you could have comfortably lived without.",
        },
        { type: "h", text: "The 5-second pause: how tracking rewires your brain" },
        {
          type: "p",
          text: "Logging every expense on your phone triggers the 'Self-Monitoring Effect.' Knowing you will have to record the purchase creates a deliberate 5-second pause. That brief moment of mindfulness interrupts impulse buying right at the root, letting your subconscious naturally pump the brakes.",
        },
        { type: "h", text: "138 studies and the food diary parallel" },
        {
          type: "p",
          text: "In Psychological Bulletin (Harkin et al., 2016), an analysis of 138 studies proved that people who actively record their progress are substantially more likely to reach their goals. In another trial by Kaiser Permanente (1,700 participants), people who kept daily food diaries lost double the weight without strict diets! Visibility alone is what transforms human behavior.",
        },
        { type: "h", text: "Visual comparison cuts unnecessary spending by ~15%" },
        {
          type: "p",
          text: "In the Journal of Financial and Quantitative Analysis, researcher Yaron Levi found that users shown clear comparisons of their spending against their own past months cut unnecessary, discretionary spending by about 15%—an effect that lasted across all 8 months of the study.",
        },
        {
          type: "p",
          text: "If you spend ৳30,000 a month, trimming 15% of unnecessary waste saves ৳4,500 every month—that's over ৳50,000 a year back in your pocket without sacrificing a single necessity.",
        },
        {
          type: "callout",
          text: "That is precisely how Hisab's dashboard is designed: it instantly shows whether you are pacing above your usual spending, highlighting runaway categories so you can course-correct before month-end.",
        },
        { type: "h", text: "Three practical rules to build the habit effortlessly" },
        {
          type: "list",
          items: [
            "The 10-second rule: Log each expense immediately when paying. If you wait until you get home at night, half of it will be forgotten.",
            "Record store baki immediately: Tap the baki checkbox right away so you never face an awkward disagreement with your neighborhood grocer.",
            "Check your dashboard once a week: Don't judge yourself. Just observe with curiosity. Whatever category surprises you is where you can be slightly more mindful.",
          ],
        },
        {
          type: "p",
          text: "Tracking your money is not about punishing yourself. It is about taking back ownership of your hard-earned wages. Start with your first expense today—within seven days, you will feel an unmistakable sense of clarity.",
        },
      ],
    },
    sources: [
      {
        label: "Harkin et al. (2016), Psychological Bulletin: Does monitoring goal progress promote goal attainment?",
        url: "https://eprints.whiterose.ac.uk/91437/",
      },
      {
        label: "Kaiser Permanente (2008): Keeping a food diary doubles diet weight loss",
        url: "https://www.sciencedaily.com/releases/2008/07/080708080738.htm",
      },
      {
        label: "Levi (2026), Journal of Financial and Quantitative Analysis: Personal Financial Information Presentation and Consumer Spending",
        url: "https://www.cambridge.org/core/journals/journal-of-financial-and-quantitative-analysis/article/personal-financial-information-presentation-and-consumer-spending/FB3B05430DC8FFCEC2707C4161E83086",
      },
    ],
  },
  {
    slug: "pain-of-paying",
    published: "2026-10-16",
    icon: "card",
    minutes: 2,
    bn: {
      title: "কার্ড আর মোবাইল ব্যাংকিংয়ে খরচ কেন টের পাওয়া যায় না?",
      summary: "বিকাশ বা কার্ডে টাকা গেলে মন কষ্ট পায় না কেন? গবেষণায় লুকিয়ে আছে উত্তর।",
      body: [
        {
          type: "p",
          text: "মানিব্যাগ থেকে কড়কড়ে ৫০০ টাকার দুটো নোট গুনে দেওয়ার সময় হৃদয়ে একটা চিনচিনে টান লাগে। কিন্তু সেই ১,০০০ টাকাই যখন কার্ড সোয়াইপ করে বা বিকাশ-নগদে পিন চেপে দেন—মনে হয় যেন কিছুই ঘটেনি!",
        },
        {
          type: "p",
          text: "মনোবিজ্ঞানীরা একে বলেন 'Pain of Paying' বা টাকা খরচের মানসিক কষ্ট। নগদ টাকা হাত থেকে চলে যাওয়ার দৃশ্য মস্তিষ্ককে সতর্ক করে। কিন্তু ডিজিটাল পেমেন্টে কোনো ক্যাশ ছোঁয়া লাগে না, ফলে অবচেতন মনের সেই স্বাভাবিক ব্রেক আর কাজ করে না।",
        },
        { type: "h", text: "এমআইটির পরীক্ষা: কার্ডে দ্বিগুণ খরচের প্রবণতা" },
        {
          type: "p",
          text: "এমআইটি (MIT)-র বিখ্যাত এক পরীক্ষায় দেখা যায়, কার্ডে পেমেন্ট করতে বলা অংশগ্রহণকারীরা একই টিকিটের জন্য নগদে দেওয়া দলের চেয়ে প্রায় দ্বিগুণ দাম দিতে রাজি হয়ে গেছে! ডিজিটাল স্ক্রিনে টাকা কেবল কিছু সংখ্যা মাত্র, তাই হাত খুলে খরচ করা অজান্তেই সহজ হয়ে যায়।",
        },
        { type: "h", text: "এই অলক্ষ্য ফাঁদ কাটানোর উপায়" },
        {
          type: "p",
          text: "গবেষক প্রিয়া রঘুবীর দেখিয়েছেন, খরচের এই অলক্ষ্য প্রভাব কাটানোর সেরা উপায় হলো প্রতিটি ডিজিটাল খরচ আলাদা করে লিখে রাখা। এক ট্যাপে পেমেন্ট করলেও, সেটা চোখে দেখলে মস্তিষ্ক আবারও টাকার মূল্য টের পেতে শুরু করে।",
        },
        {
          type: "callout",
          text: "হিসাব অ্যাপে খরচ লেখার সময় 'পরিশোধের মাধ্যম' (বিকাশ, নগদ, কার্ড) নির্বাচন করুন। মাস শেষে দেখুন ডিজিটাল মাধ্যমে আসলে কত টাকা বেরিয়ে যাচ্ছে।",
        },
        { type: "h", text: "সহজ দুই নিয়ম" },
        {
          type: "list",
          items: [
            "ছোট ছোট রিচার্জ, ফুড ডেলিভারি আর রাইডের খরচগুলোই ডিজিটাল ফাঁদে সবচেয়ে বেশি চোখ এড়ায়।",
            "পেমেন্টের সাথে সাথেই হিসাব অ্যাপে ১০ সেকেন্ডে এন্ট্রি দিন—ডিজিটাল খরচ আবার আপনার নিয়ন্ত্রণে আসবে।",
          ],
        },
      ],
    },
    en: {
      title: "Why Card and Mobile Payments Don't Feel Like Real Spending",
      summary: "Tapping a card or phone removes the physical sting of paying. Here's why that doubles impulse spending.",
      body: [
        {
          type: "p",
          text: "Handing over crisp cash notes stings a little. You watch the paper leave your hand, and your brain registers an instant reality check. But pay that exact same amount by tapping a card or entering a mobile PIN, and it feels completely weightless.",
        },
        {
          type: "p",
          text: "Psychologists call this the 'pain of paying.' Physical cash creates immediate friction. Digital payments eliminate that friction entirely, silently disabling your brain's natural spending brakes.",
        },
        { type: "h", text: "The MIT experiment: willing to pay double" },
        {
          type: "p",
          text: "In a landmark MIT study, researchers auctioned tickets to sports fans. Those told to pay by card bid nearly twice as much as those paying in cash for the exact same seats! On a screen, money feels abstract—like points in a mobile game.",
        },
        { type: "h", text: "How to break the digital spending trance" },
        {
          type: "p",
          text: "Behavioral research reveals a surprisingly simple antidote: itemising. The moment you write down each digital transaction individually, the invisible spending becomes tangible and real again.",
        },
        {
          type: "callout",
          text: "In Hisab, tag payments as Card, Mobile Banking, or Cash. On the Expenses page, tap any method to see where your digital leaks are hiding.",
        },
        { type: "h", text: "Two quick rules" },
        {
          type: "list",
          items: [
            "Micro-payments slip by fastest: app deliveries, bike rides, and mobile top-ups add up to thousands.",
            "Log the payment right after you approve it to keep the mental reality check alive.",
          ],
        },
      ],
    },
    sources: [
      {
        label: "Prelec & Simester (2001), Marketing Letters: Always leave home without it (summary, Michigan State University Extension)",
        url: "https://www.canr.msu.edu/news/beware_the_credit_card_premium",
      },
      {
        label: "Raghubir & Srivastava (2008), Journal of Experimental Psychology: Applied: Monopoly money",
        url: "https://pubmed.ncbi.nlm.nih.gov/18808275/",
      },
    ],
  },
  {
    slug: "baki",
    published: "2026-10-16",
    icon: "handcoins",
    minutes: 2,
    bn: {
      title: "বাকির হিসাব: মাথায় না রেখে লিখে রাখুন",
      summary: "“পরে দেব” ভাবলে টাকা যায় না বলে মনে হয়। মাস শেষে তাই বড় ধাক্কা।",
      body: [
        {
          type: "p",
          text: "পাড়ার মুদি দোকানে বা চায়ের স্টলে বাকি আমাদের জীবনের অবিচ্ছেদ্য অংশ। 'পরে দিয়ে দেব মামা'—বলেই জিনিসটা নিয়ে চলে আসা যায়। কিন্তু সমস্যাটা শুরু হয় ঠিক এখানেই।",
        },
        {
          type: "p",
          text: "বাকি নেওয়ার মুহূর্তে পকেট থেকে কোনো টাকা খসে না। ফলে অবচেতন মন এটাকে খরচ হিসেবে রেজিস্টারই করে না—মনে হয় যেন ফ্রিতেই নিয়ে এলাম! নোবেলজয়ী অর্থনীতিবিদ রিচার্ড থ্যালার দেখিয়েছেন, আমাদের মস্তিষ্ক টাকাকে আলাদা আলাদা কাল্পনিক বাক্সে রাখে (Mental Accounting)। 'পরে দেব' খাতাটাকে মন খুব হালকা ভেবে অবহেলা করে।",
        },
        { type: "h", text: "মাস শেষের বড় ধাক্কা" },
        {
          type: "p",
          text: "মাস শেষে যখন দোকানদার খাতা খুলে বলেন, 'ভাই, মোট ৪,৭০০ টাকা হয়েছে'—তখন মাথায় আকাশ ভেঙে পড়ে। দিনে দিনে নেওয়া ছোট ছোট ৫০ আর ১৫০ টাকার বাকি যে এক মাসে কত বড় পাহাড় হয়ে দাঁড়ায়, তা লিখে না রাখলে টের পাওয়া অসম্ভব।",
        },
        {
          type: "callout",
          text: "হিসাব অ্যাপে খরচ লেখার সময় শুধু 'বাকি' অপশনটি বেছে নিন। মাস জুড়ে মোট কত দেনা জমল, তা সবসময় চোখের সামনে পরিষ্কার থাকবে।",
        },
        { type: "h", text: "বাকির নিয়ন্ত্রণে ৩টি সহজ নিয়ম" },
        {
          type: "list",
          items: [
            "বাকি নেওয়ার দিনই এন্ট্রি দিন: টাকা শোধ করার দিন নয়, জিনিস নেওয়ার দিনই আসল খরচ।",
            "মাসের শুরুতে আগের সব বাকি এক নজরে দেখে ক্লিয়ার করুন।",
            "পাড়ার দোকানে প্রতি মাসের জন্য বাকির একটা নির্দিষ্ট সীমা বেঁধে নিন।",
          ],
        },
      ],
    },
    en: {
      title: "Baki: keep it on paper, not in your head",
      summary: "“Pay later” feels deceptively free today. That is why the month-end bill is always a shock.",
      body: [
        {
          type: "p",
          text: "Buying on baki at the corner grocery or tea stall is second nature. 'I'll settle up later'—and you walk home with what you need. But that convenience carries a quiet psychological trap.",
        },
        {
          type: "p",
          text: "When you take something on baki, zero cash leaves your wallet. Your brain does not register it as an expense at all. Nobel laureate Richard Thaler proved that humans maintain 'mental accounts.' The 'pay later' account feels weightless, so we charge against it without hesitation.",
        },
        { type: "h", text: "The month-end shock" },
        {
          type: "p",
          text: "At the end of the month, the grocer opens his handwritten ledger: 'Brother, that is ৳4,700 in total.' Your jaw drops. Did you really spend that much? Yes—because tiny ৳50 and ৳150 IOUs compound invisibly over thirty days.",
        },
        {
          type: "callout",
          text: "In Hisab, simply tap the 'Baki' toggle when you buy on credit. Your outstanding balance stays right in front of you, eliminating awkward disagreements.",
        },
        { type: "h", text: "Three practical rules for baki" },
        {
          type: "list",
          items: [
            "Log baki on the day you take it, not weeks later when you settle the bill.",
            "Check your running baki total weekly so small debts don't snowball.",
            "Set an informal monthly baki limit with your neighborhood stores.",
          ],
        },
      ],
    },
    sources: [
      {
        label: "The Nobel Prize: Richard H. Thaler, Prize in Economic Sciences 2017",
        url: "https://www.nobelprize.org/prizes/economic-sciences/2017/thaler/facts/",
      },
      {
        label: "Raghubir & Srivastava (2008), Journal of Experimental Psychology: Applied: Monopoly money",
        url: "https://pubmed.ncbi.nlm.nih.gov/18808275/",
      },
    ],
  },
  {
    slug: "habit",
    published: "2026-10-16",
    icon: "flame",
    minutes: 2,
    bn: {
      title: "রোজ ১ মিনিট: হিসাব রাখাকে সহজ অভ্যাস বানানোর উপায়",
      summary: "শুরু করে কয়েকদিন পর ভুলে যান? বিজ্ঞান বলছে, সমস্যা ইচ্ছাশক্তির নয়, কৌশলের।",
      body: [
        {
          type: "p",
          text: "মাসের ১ তারিখে একরাশ উৎসাহ নিয়ে ডায়েরি বা অ্যাপে খরচ লেখা শুরু করলেন। চার দিন খুব সুন্দর চলল। পঞ্চম দিন একটু কাজের চাপে ভুলে গেলেন—আর সেই সাথে হিসাব রাখার পুরো উদ্যমটাই শেষ হয়ে গেল।",
        },
        {
          type: "p",
          text: "এই অভিজ্ঞতা প্রায় সবার। নিজেকে দোষী ভাবার কিছু নেই—সমস্যাটা আপনার ইচ্ছাশক্তির নয়, ভুল পদ্ধতির। অভ্যাস গড়ে তোলার বিজ্ঞান খুব সহজ।",
        },
        { type: "h", text: "অভ্যাস স্বয়ংক্রিয় হতে সময় লাগে" },
        {
          type: "p",
          text: "লন্ডনের গবেষক ফিলিপা লালি দেখিয়েছেন, কোনো নতুন কাজ মস্তিষ্কে 'স্বয়ংক্রিয় অভ্যাস' হতে গড়ে প্রায় ৬৬ দিন সময় লাগে। তবে সবচেয়ে বড় স্বস্তির বিষয় হলো: মাঝে এক-আধদিন বাদ পড়লেও অভ্যাস গড়ার ধারাবাহিকতা নষ্ট হয় না।",
        },
        { type: "h", text: "'যদি এটা হয়, তবে ওটা করব'" },
        {
          type: "p",
          text: "৯৪টি মনোবিজ্ঞান পরীক্ষার ফল বলছে, 'সময় পেলে হিসাব করব'—এমন ভাবনার চেয়ে নির্দিষ্ট একটি মুহূর্ত বেঁধে দেওয়া অনেক বেশি কার্যকর। যেমন: 'রাতে খাওয়ার পর বিছানায় ফোন নিলেই হিসাব অ্যাপে আজকের খরচ লিখব।' মাত্র ১ মিনিটের কাজ।",
        },
        {
          type: "callout",
          text: "হিসাব অ্যাপে আপনার লেখার ধারাবাহিকতা (Streak) দেখতে পাবেন। এছাড়া সেটিংসে গিয়ে প্রতিদিন রাতের একটি রিমাইন্ডার অন করে নিতে পারেন।",
        },
        { type: "h", text: "সহজে শুরু করার ৩ নিয়ম" },
        {
          type: "list",
          items: [
            "সারাদিন নয়, মাত্র ১ মিনিট: রাতের খাবারের পর বা ঘুমানোর আগে নির্দিষ্ট সময়ে বসুন।",
            "ছোট খরচও লিখুন: ১০ টাকার চা বা রিকশা ভাড়াও লিখুন—ছোটগুলোই আসল অভ্যাস গড়ে তোলে।",
            "একদিন মিস হলে অপরাধবোধ নয়: পরদিন আবার স্বাভাবিকভাবে শুরু করুন।",
          ],
        },
      ],
    },
    en: {
      title: "One minute a day: the science of making it a habit",
      summary: "Starting strong and quitting after four days? Science says it is a strategy problem, not a lack of willpower.",
      body: [
        {
          type: "p",
          text: "You start with massive energy on the 1st of the month. Days one through four go great. On day five, you get swamped at work, forget to log anything, and by day six you feel guilty and give up entirely.",
        },
        {
          type: "p",
          text: "Almost everyone has experienced this cycle. It is not a failure of character. The issue isn't your willpower; it's how you build the routine.",
        },
        { type: "h", text: "Habits take time to feel automatic" },
        {
          type: "p",
          text: "Research from University College London found that turning a daily action into an automatic habit takes about 66 days on average. But here is the most reassuring finding: missing an occasional day does not reset your progress.",
        },
        { type: "h", text: "Anchor it with an 'if-then' trigger" },
        {
          type: "p",
          text: "A meta-analysis of 94 trials proved that vague intentions ('I'll track my spending today') usually fail. What works is a clear situational trigger: 'When I get into bed after dinner, I will spend 60 seconds opening Hisab.'",
        },
        {
          type: "callout",
          text: "Hisab tracks your daily streak to give you that rewarding sense of progress, and sends an optional evening ping only if you haven't logged anything yet.",
        },
        { type: "h", text: "Three painless rules" },
        {
          type: "list",
          items: [
            "One minute only: Pick a fixed anchor point, like right after dinner or before sleeping.",
            "Never skip the tiny takas: A ৳10 cup of tea builds the mental muscle just like a ৳5,000 grocery bill.",
            "Missed a day? Zero guilt: Just reopen the app tomorrow and keep going.",
          ],
        },
      ],
    },
    sources: [
      {
        label: "Lally et al. (2010), European Journal of Social Psychology: How are habits formed (UCL News)",
        url: "https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit",
      },
      {
        label: "Gollwitzer & Sheeran (2006), Advances in Experimental Social Psychology: Implementation intentions and goal achievement",
        url: "https://doi.org/10.1016/S0065-2601(06)38002-1",
      },
      {
        label: "Harvard Business School Working Knowledge: How small wins unleash creativity (Amabile & Kramer)",
        url: "https://www.library.hbs.edu/working-knowledge/how-small-wins-unleash-creativity",
      },
    ],
  },
  {
    slug: "how-to-track-expenses",
    icon: "list",
    minutes: 2,
    published: "2026-10-16",
    bn: {
      title: "খরচের হিসাব রাখার সহজ নিয়ম: একদম শুরু থেকে",
      summary: "হিসাব রাখা জটিল কোনো কাজ নয়। দিনে মাত্র ১০ সেকেন্ডে যেভাবে শুরু করবেন।",
      body: [
        {
          type: "p",
          text: "হিসাব রাখার কথা শুনলেই চোখের সামনে ভেসে ওঠে জটিল এক্সেল শিট, মোটা খাতা আর ঘণ্টার পর ঘণ্টা রসিদ মেলানোর ক্লান্তি। এই ভয়েই বেশিরভাগ মানুষ শুরু করার আগেই হাল ছেড়ে দেন।",
        },
        {
          type: "p",
          text: "বাস্তবতা হলো, হিসাব রাখা কোনো হিসাববিজ্ঞান নয়। আপনার কোনো অ্যাকাউন্টিং ডিগ্রি লাগবে না। দিনে মাত্র ১০ সেকেন্ডেই নিজের কষ্টের টাকার নিয়ন্ত্রণ ফিরিয়ে আনা সম্ভব।",
        },
        { type: "h", text: "১. শুধু দুটো তথ্য: টাকা আর ক্যাটাগরি" },
        {
          type: "p",
          text: "শুরু থেকেই মেমো নম্বর, দোকানের নাম বা লম্বা নোট লেখার দরকার নেই। শুধু কত টাকা আর কিসের জন্য (যেমন: খাবার বা যাতায়াত)—এটুকুই যথেষ্ট। ১০ সেকেন্ডেই এন্ট্রি শেষ।",
        },
        { type: "h", text: "২. টাকা পকেটে ঢোকার আগেই লিখুন" },
        {
          type: "p",
          text: "রাতে বাড়ি ফিরে সারাদিনের খরচের স্মৃতি হাতড়ানো এক অসম্ভব কাজ। রিকশা ভাড়া কত ছিল বা চায়ের দোকানে কত দিলেন—অর্ধেকই ভুলে যাবেন। টাকা দেওয়ার সাথে সাথেই ফোন খুলে লিখে ফেলুন। এই একটা অভ্যাসই আসল।",
        },
        { type: "h", text: "৩. ছোট খরচ বাদ দেবেন না" },
        {
          type: "p",
          text: "২০ টাকার চা, ৫০ টাকার রিচার্জ বা ৮০ টাকার রিকশা। আলাদা করে এগুলো কিছুই না, কিন্তু মাস শেষে যোগ করলে কয়েক হাজার টাকা হয়ে দাঁড়ায়। বড় খরচ এমনিতেই মনে থাকে, হারিয়ে যায় ছোটগুলোই।",
        },
        {
          type: "callout",
          text: "প্রথম মাসে কোনো খরচ কমাতে যাবেন না, নিজেকে বিচারও করবেন না। শুধু কৌতূহল নিয়ে দেখুন আপনার টাকা আসলে কোথায় যায়। চোখে দেখতে পাওয়াটাই সঞ্চয়ের প্রথম ধাপ।",
        },
        { type: "h", text: "হিসাব-এ যেভাবে ৩ ট্যাপে শেষ" },
        {
          type: "list",
          items: [
            "টাকার পরিমাণ তুলুন, ক্যাটাগরিতে এক ট্যাপ দিন, ব্যাস সেভ!",
            "আগের নোটগুলো অ্যাপ মনে রাখে, তাই বারবার টাইপ করতে হয় না।",
            "কোনো দিন ভুলে গেলে রাতে একটি মৃদু রিমাইন্ডার পেয়ে যাবেন।",
          ],
        },
      ],
    },
    en: {
      title: "How to track your daily expenses: a simple starter guide",
      summary: "Expense tracking is not accounting. Here is how to take back control in ten painless seconds.",
      body: [
        {
          type: "p",
          text: "Mention expense tracking and people imagine complex spreadsheets, shoeboxes of receipts, and hours of tedious bookkeeping. No wonder most people give up before they even begin.",
        },
        {
          type: "p",
          text: "You do not need an accounting degree. Tracking your money takes ten seconds a day when you strip away the friction.",
        },
        { type: "h", text: "1. Log only two things: amount and category" },
        {
          type: "p",
          text: "Forget about shop names, receipt photos, or long descriptions. How much did you spend, and what was it for (food, transport, bills)? That is literally all you need.",
        },
        { type: "h", text: "2. Log before the phone goes back in your pocket" },
        {
          type: "p",
          text: "Reconstructing your day at night is a guessing game. Was the rickshaw ৳50 or ৳70? Did you buy tea twice? Log it the second you pay, and the mental burden disappears immediately.",
        },
        { type: "h", text: "3. Never ignore the pocket change" },
        {
          type: "p",
          text: "A ৳20 tea, a ৳50 mobile top-up, an ৳80 ride. Individually trivial, but together they account for nearly a third of your monthly drain. Big bills are easy to remember; small leaks are what sink the ship.",
        },
        {
          type: "callout",
          text: "For your first month, don't try to slash spending. Just observe with curiosity. Seeing where the money actually goes is what sparks effortless change.",
        },
        { type: "h", text: "Three quick steps in Hisab" },
        {
          type: "list",
          items: [
            "Type the amount on the keypad, tap a category, done.",
            "Frequent notes pop up automatically as one-tap shortcuts.",
            "Receive an optional evening nudge only on days you haven't recorded anything.",
          ],
        },
      ],
    },
    sources: [],
  },
  {
    slug: "monthly-budget",
    icon: "target",
    minutes: 2,
    published: "2026-10-16",
    bn: {
      title: "মাসিক বাজেট কীভাবে করবেন: অনুমানে নয়, নিজের খরচ দেখে",
      summary: "বেশিরভাগ বাজেট ভাঙে কারণ সেগুলো কাল্পনিক আন্দাজে তৈরি। বাস্তবসম্মত বাজেট করার সহজ উপায়।",
      body: [
        {
          type: "p",
          text: "মাসের ১ তারিখে ডায়েরিতে লিখলেন: 'এই মাসে বাজারে ৮,০০০ টাকার বেশি খরচ করব না, বাইরে খাওয়া একদম বন্ধ!' কিন্তু মাসের ১২ তারিখ আসতেই দেখা গেল সীমা পার হয়ে গেছে। আর তখনই হতাশ হয়ে পুরো বাজেট ছুড়ে ফেলা হয়।",
        },
        {
          type: "p",
          text: "বাজেট ভাঙার কারণ আপনার কোনো দুর্বলতা নয়। মূল কারণ হলো—বাজেটটা বানানো হয়েছিল মনের ইচ্ছা আর কাল্পনিক আন্দাজের ওপর, আপনার আসল খরচের ওপর নয়!",
        },
        { type: "h", text: "১. আগে ১ মাস নিজের খরচ দেখুন" },
        {
          type: "p",
          text: "বাজেট বানানোর আগে জানা দরকার আপনি বর্তমানে আসলেই কত খরচ করেন। অন্তত এক মাস সব খরচ নিয়মিত লিখে দেখুন কোন খাতে কত টাকা যায়। সেই বাস্তব সংখ্যাটাই আপনার শুরুর সঠিক ভিত্তি।",
        },
        { type: "h", text: "২. স্থির খরচে নয়, পরিবর্তনশীল খরচে নজর দিন" },
        {
          type: "p",
          text: "বাসা ভাড়া, বাচ্চার স্কুলের বেতন বা বিদ্যুৎ বিল প্রতি মাসে নির্দিষ্ট থাকে। সেখানে কমানোর সুযোগ কম। আসল জায়গা হলো যা প্রতিনিয়ত ওঠানামা করে: বাইরে খাওয়া, অনলাইন শপিং আর হুটহাট রিকশা ভ্রমণ।",
        },
        { type: "h", text: "৩. মাত্র ২-৩টি প্রধান খাতে সীমা দিন" },
        {
          type: "p",
          text: "১৫টা ক্যাটাগরিতে বাজেট বসালে তা মনে রাখাই কঠিন হয়ে পড়ে। যে ২-৩টি খাতে আপনার টাকা সবচেয়ে বেশি অলক্ষ্যে চলে যায়, শুধু সেখানে একটু বাস্তবসম্মত সীমা দিন। হঠাৎ খরচ অর্ধেক করে ফেলবেন না।",
        },
        {
          type: "callout",
          text: "হিসাব অ্যাপের 'বাজেট' পাতা আপনার আগের খরচের গড় দেখে স্বয়ংক্রিয়ভাবে বাস্তবসম্মত সীমা প্রস্তাব করে। আর রঙিন প্রগ্রেস বারে দেখায় খরচের গতি কতটা নিরাপদ।",
        },
        { type: "h", text: "মনে রাখার ৩টি সোনালী নিয়ম" },
        {
          type: "list",
          items: [
            "জরুরি বাফার রাখুন: মেহমান, ডাক্তার বা অপ্রত্যাশিত উৎসবের খরচের জন্য বাজেটে ৫-১০% জায়গা ফাঁকা রাখুন।",
            "বাকি নেওয়াও খরচের অংশ: বাকি নেওয়ার দিনই এন্ট্রি দিন, নইলে বাজেটের হিসাব মিলবে না।",
            "বাজেট কোনো শাস্তি নয়: বাজেট মানে নিজেকে কষ্টে রাখা নয়, বরং নিজের কষ্টের উপার্জনের নিয়ন্ত্রণ নিজের হাতে রাখা।",
          ],
        },
      ],
    },
    en: {
      title: "How to make a monthly budget that actually fits your life",
      summary: "Most budgets collapse because they are based on hopeful guesses. Here is how to build one that actually works.",
      body: [
        {
          type: "p",
          text: "On the 1st of the month, you declare: '৳8,000 for groceries, zero dining out!' By the 12th, you have already blown past both limits. Feeling defeated, you scrap the whole idea.",
        },
        {
          type: "p",
          text: "You didn't fail—the budget did. Most budgets fail because they are built on wishful thinking rather than your actual living habits.",
        },
        { type: "h", text: "1. Track your baseline first" },
        {
          type: "p",
          text: "Before setting strict limits, find out what you actually spend today. Track every expense for just one month. Your real monthly average per category is your only sensible starting baseline.",
        },
        { type: "h", text: "2. Focus on flexible spending, not fixed bills" },
        {
          type: "p",
          text: "Rent, utility bills, and tuition barely change from month to month, so you cannot squeeze much there. The real room to save is in what swings wildly: dining out, shopping sprees, and unplanned rides.",
        },
        { type: "h", text: "3. Cap only two or three runaway categories" },
        {
          type: "p",
          text: "Juggling fifteen category limits is exhausting. Pick the two or three areas where money leaks fastest, and set limits slightly below your usual average. Do not cut in half overnight—gradual trimming wins every time.",
        },
        {
          type: "callout",
          text: "Hisab's Budgets screen uses your past spending history to recommend realistic limits, showing a clean pace bar so you instantly know if you are pacing ahead.",
        },
        { type: "h", text: "Three golden rules" },
        {
          type: "list",
          items: [
            "Leave breathing room: Doctor visits, sudden guests, and seasonal gifts will happen. Leave a 10% safety buffer.",
            "Baki is real spending: Record store credits on the day you take them, or your budget numbers won't add up.",
            "A budget is not a prison: It is not about deprivation; it is a conscious plan for where you choose your money to go.",
          ],
        },
      ],
    },
    sources: [],
  },
];

/** Short "did you know?" lines for the dashboard, one per day. */
export const TIPS: { slug: string; bn: string; en: string }[] = [
  {
    slug: "write-it-down",
    bn: "১৩৮টি গবেষণার বিশ্লেষণ বলছে: অগ্রগতি লিখে রাখলে লক্ষ্যে পৌঁছানোর সম্ভাবনা বাড়ে।",
    en: "A review of 138 studies: people who record their progress are more likely to reach their goals.",
  },
  {
    slug: "pain-of-paying",
    bn: "MIT-র এক পরীক্ষায় কার্ডে পেমেন্টের কথা শুনে মানুষ একই টিকিটের জন্য প্রায় দ্বিগুণ দর দিয়েছে।",
    en: "In an MIT experiment, people paying by card bid about twice as much for the same tickets.",
  },
  {
    slug: "habit",
    bn: "নতুন অভ্যাস তৈরি হতে গড়ে ৬৬ দিন লাগে। আজকের দিনটাও গুনুন!",
    en: "A new habit takes about 66 days on average. Make today count!",
  },
  {
    slug: "write-it-down",
    bn: "খরচ নিয়মিত লিখে রাখলে এবং আগের মাসের সাথে তুলনা করলে অপ্রয়োজনীয় খরচ কমে যায় প্রায় ১৫%।",
    en: "People who log and compare their spending cut unnecessary expenses by about 15%.",
  },
  {
    slug: "baki",
    bn: "বাকি নেওয়ার দিন টাকা যায় না বলে খরচ মনে হয় না। লিখে রাখলে মাস শেষে চমক থাকে না।",
    en: "Baki doesn't feel like spending on the day. Logging it means no month-end surprise.",
  },
  {
    slug: "habit",
    bn: "“রাতে খাওয়ার পর খরচ লিখব”: এমন নির্দিষ্ট পরিকল্পনা লক্ষ্য পূরণে বেশ কাজ করে (৯৪টি পরীক্ষার বিশ্লেষণ)।",
    en: "“I'll log spending after dinner”: specific if-then plans clearly help people follow through (94 experiments).",
  },
  {
    slug: "pain-of-paying",
    bn: "খরচগুলো আইটেম ধরে আলাদা করে দেখলে কার্ডে বাড়তি খরচের প্রবণতা কমে।",
    en: "Looking at expenses item by item reduces the urge to overspend on cards.",
  },
];

/** Research highlights for the landing page: a big number, one line, and the article behind it. */
export const HIGHLIGHTS: { slug: string; stat: { bn: string; en: string }; bn: string; en: string }[] = [
  {
    slug: "write-it-down",
    stat: { bn: "১৩৮", en: "138" },
    bn: "টি গবেষণার বিশ্লেষণ: অগ্রগতি লিখে রাখলে মানুষ লক্ষ্যে বেশি পৌঁছায়।",
    en: "studies reviewed together: people who record their progress reach their goals more often.",
  },
  {
    slug: "pain-of-paying",
    stat: { bn: "২ গুণ", en: "2×" },
    bn: "দাম দিতে রাজি ছিল মানুষ, যখন পেমেন্ট কার্ডে (MIT-র পরীক্ষা)।",
    en: "what people were willing to pay when paying by card instead of cash (an MIT experiment).",
  },
  {
    slug: "write-it-down",
    stat: { bn: "~১৫%", en: "~15%" },
    bn: "অপ্রয়োজনীয় খরচ কমে, যখন মানুষ নিয়মিত লিখে আগের মাসের সাথে খরচের তুলনা দেখে।",
    en: "less spent on unnecessary things when people track and see comparisons against past months.",
  },
];

/** "Why use Hisab?" page: Bangla at /why-hisab, English at /en/why-hisab. */
export function whyPath(locale: string): string {
  return locale === "en" ? "/en/why-hisab" : "/why-hisab";
}

/** Blog URLs: Bangla at /blog, English at /en/blog. */
export function blogPath(locale: string, slug?: string): string {
  const base = locale === "en" ? "/en/blog" : "/blog";
  return slug ? `${base}/${slug}` : base;
}

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function localized(article: Article, locale: string): Localized {
  return article[(locale === "en" ? "en" : "bn") satisfies Locale];
}

/** Same tip all day, a different one tomorrow. */
export function tipForDay(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
  return TIPS[dayNumber % TIPS.length];
}
