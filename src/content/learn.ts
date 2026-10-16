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
      title: "লিখে রাখলেই খরচ কমে: গবেষণা যা বলে",
      summary: "১৩৮টি গবেষণার একই উত্তর: যা মাপা হয়, সেটাই বদলায়।",
      body: [
        {
          type: "p",
          text: "মাস শেষে অনেকেই ভাবেন, “টাকাগুলো গেল কোথায়?” উত্তরটা খুব সহজ: যেটা আমরা মাপি না, সেটা নিয়ন্ত্রণও করতে পারি না। খরচ লিখে রাখা মানে নিজের টাকার দিকে আলো ফেলা।",
        },
        { type: "h", text: "১৩৮টি গবেষণা, একই উত্তর" },
        {
          type: "p",
          text: "২০১৬ সালে Psychological Bulletin জার্নালে প্রকাশিত একটি বড় বিশ্লেষণে (Harkin ও সহকর্মীরা) প্রায় ২০,০০০ মানুষের ওপর করা ১৩৮টি পরীক্ষা একসাথে দেখা হয়। ফল পরিষ্কার: যারা নিজের অগ্রগতি নিয়মিত মাপেন, তারা লক্ষ্যে বেশি পৌঁছান। আর প্রভাবটা সবচেয়ে বেশি যখন সেটা সত্যি সত্যি লিখে রাখা হয়, শুধু মনে মনে হিসাব করা নয়।",
        },
        { type: "h", text: "খাবারের ডায়েরি: ওজন কমেছে দ্বিগুণ" },
        {
          type: "p",
          text: "Kaiser Permanente-এর একটি গবেষণায় (২০০৮, প্রায় ১,৭০০ জন) দেখা গেছে, যারা প্রতিদিন কী খেয়েছেন তা লিখে রেখেছেন, তারা না-লেখাদের চেয়ে প্রায় দ্বিগুণ ওজন কমিয়েছেন। খরচের বেলাতেও যুক্তিটা একই: লিখলে চোখে পড়ে, আর চোখে পড়লেই অভ্যাস বদলায়।",
        },
        { type: "h", text: "নিজের সাথে তুলনা করলে শখের খরচ কমে প্রায় ১৫%" },
        {
          type: "p",
          text: "Journal of Financial and Quantitative Analysis-এ ২০২৬ সালে প্রকাশিত একটি গবেষণায় (Yaron Levi) একটি আর্থিক অ্যাপের ব্যবহারকারীদের তাদের খরচ আগের মাসগুলোর সাথে তুলনা করে দেখানো হয়। যারা এই তুলনাটা দেখেছেন, তারা অন্যদের চেয়ে প্রায় ১৫% কম শখের (অপ্রয়োজনীয়) খরচ করেছেন, এবং যতদিন অ্যাপে দেখানো হয়েছে, সেই ৮ মাস ধরে প্রভাবটা ছিল।",
        },
        {
          type: "callout",
          text: "হিসাব-এর ড্যাশবোর্ড ঠিক এই কাজটা করে: এই মাস বনাম গত মাস, আর কোন ক্যাটাগরিতে স্বাভাবিকের চেয়ে বেশি যাচ্ছে।",
        },
        { type: "h", text: "আজ থেকে যা করবেন" },
        {
          type: "list",
          items: [
            "খরচ হওয়ার সাথে সাথে লিখুন। ১০ সেকেন্ডের কাজ, পরে মনে থাকে না।",
            "সপ্তাহে একবার ড্যাশবোর্ডে চোখ বুলান।",
            "যে সংখ্যাটা দেখে অবাক হবেন, সেখান থেকেই কমানো শুরু করুন।",
          ],
        },
      ],
    },
    en: {
      title: "Writing it down cuts spending: what the research says",
      summary: "138 studies point the same way: what gets measured gets changed.",
      body: [
        {
          type: "p",
          text: "At the end of the month, a lot of us wonder where the money went. The honest answer: what we don't measure, we can't manage. Writing your expenses down is how you turn the lights on.",
        },
        { type: "h", text: "138 studies, one answer" },
        {
          type: "p",
          text: "A large review in Psychological Bulletin (Harkin and colleagues, 2016) combined 138 experiments with about 20,000 people. People who regularly monitored their progress were more likely to reach their goals, and the effect was strongest when progress was actually recorded, not just kept in mind.",
        },
        { type: "h", text: "Food diaries doubled weight loss" },
        {
          type: "p",
          text: "In a Kaiser Permanente study (2008, about 1,700 people), those who kept daily food records lost about twice as much weight as those who kept none. Money works the same way: once you see it, you start to change it.",
        },
        { type: "h", text: "Comparing with yourself cut discretionary spending by about 15%" },
        {
          type: "p",
          text: "A 2026 study in the Journal of Financial and Quantitative Analysis (Yaron Levi) showed users of a finance app how their spending compared with their own past months. Those who saw this comparison spent about 15% less on discretionary items than the other groups, for the full 8 months it was shown.",
        },
        {
          type: "callout",
          text: "That's exactly what Hisab's dashboard does: this month vs last month, and which categories are running above your usual.",
        },
        { type: "h", text: "Start today" },
        {
          type: "list",
          items: [
            "Add an expense the moment it happens. It takes ten seconds; later, you'll forget.",
            "Glance at the dashboard once a week.",
            "Whatever number surprises you is the best place to start cutting.",
          ],
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
    minutes: 3,
    bn: {
      title: "কার্ড আর মোবাইল ব্যাংকিংয়ে খরচ কেন টের পাওয়া যায় না",
      summary: "MIT-র গবেষণা: কার্ডে দিলে মানুষ প্রায় দ্বিগুণ দাম দিতে রাজি।",
      body: [
        {
          type: "p",
          text: "নগদ টাকা গুনে দিলে মনে একটা ছোট্ট খোঁচা লাগে। মনোবিজ্ঞানীরা এর নাম দিয়েছেন “pain of paying”, মানে টাকা দেওয়ার কষ্ট। কার্ড বা মোবাইল ব্যাংকিংয়ে এক চাপে পেমেন্ট হয়ে যায়, কষ্টটা প্রায় থাকেই না। তাই খরচও বাড়ে।",
        },
        { type: "h", text: "কার্ডে প্রায় দ্বিগুণ দাম" },
        {
          type: "p",
          text: "MIT-র দুই অধ্যাপক Drazen Prelec ও Duncan Simester (২০০১) বাস্কেটবল খেলার টিকিটের একটি নিলাম করেন। অর্ধেক অংশগ্রহণকারীকে বলা হয় জিতলে নগদে দিতে হবে, বাকিদের বলা হয় কার্ডে। কার্ডে দেওয়ার কথা যাদের, তাদের গড় দর ছিল নগদের প্রায় দ্বিগুণ।",
        },
        { type: "h", text: "আলাদা করে দেখলে প্রভাব কমে" },
        {
          type: "p",
          text: "Priya Raghubir ও Joydeep Srivastava-র গবেষণাতেও (২০০৮) একই ছবি: কার্ড বা গিফট কার্ডে মানুষ নগদের চেয়ে বেশি খরচ করে। কিন্তু একটা জিনিস এই বাড়তি খরচ কমিয়েছে: খরচগুলো একসাথে আন্দাজ না করে আইটেম ধরে ধরে আলাদা করে দেখা।",
        },
        {
          type: "callout",
          text: "অর্থাৎ ডিজিটাল পেমেন্টের “ব্যথাহীনতা”র সহজ ওষুধ হলো প্রতিটি পেমেন্ট আলাদা করে লিখে রাখা।",
        },
        { type: "h", text: "হিসাব-এ যেভাবে কাজে লাগাবেন" },
        {
          type: "list",
          items: [
            "খরচ লেখার সময় “পরিশোধের মাধ্যম” বেছে নিন।",
            "খরচসমূহ পাতায় “কার্ড” বা “মোবাইল ব্যাংকিং” চাপলেই দেখবেন মাসে কত গেল।",
            "মোবাইল রিচার্জ, ডেলিভারি, রাইড: ছোট পেমেন্টগুলোই সবচেয়ে বেশি চোখ এড়ায়। এগুলো আগে লিখুন।",
          ],
        },
      ],
    },
    en: {
      title: "Why card and mobile payments don't feel like spending",
      summary: "An MIT experiment: paying by card, people bid about twice as much.",
      body: [
        {
          type: "p",
          text: "Counting out cash stings a little. Psychologists call it the “pain of paying”. With a card or a mobile wallet it's one tap and the sting is mostly gone, so it's easier to spend more.",
        },
        { type: "h", text: "About twice as much on a card" },
        {
          type: "p",
          text: "MIT professors Drazen Prelec and Duncan Simester (2001) auctioned tickets to a basketball game. Half the bidders were told they'd pay in cash if they won, the other half by credit card. The card group's average bid was about twice the cash group's.",
        },
        { type: "h", text: "Itemising takes the edge off" },
        {
          type: "p",
          text: "Research by Priya Raghubir and Joydeep Srivastava (2008) found the same pattern: people spend more with cards and gift cards than with cash. One thing reduced the card effect: looking at expenses item by item instead of estimating them as a lump.",
        },
        {
          type: "callout",
          text: "So the simple fix for “painless” digital payments is to write each one down separately.",
        },
        { type: "h", text: "How to use this in Hisab" },
        {
          type: "list",
          items: [
            "Pick “Paid with” when you add an expense.",
            "On the Expenses page, tap “Card” or “Mobile banking” to see the month's total.",
            "Top-ups, deliveries and rides are the small payments that slip by most. Log those first.",
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
      summary: "“পরে দেব” টাকাকে মন হালকা করে দেখে। মাস শেষে তাই চমক।",
      body: [
        {
          type: "p",
          text: "পাড়ার দোকানে বাকি আমাদের জীবনের অংশ। সমস্যা হলো, বাকি নেওয়ার দিন পকেট থেকে টাকা যায় না, তাই মনেই হয় না খরচ হয়েছে। মাস শেষে সব একসাথে মেটাতে গিয়ে তখন চমকে উঠি।",
        },
        { type: "h", text: "মন টাকাকে আলাদা খাতায় রাখে" },
        {
          type: "p",
          text: "নোবেলজয়ী অর্থনীতিবিদ Richard Thaler দেখিয়েছেন, আমরা মনে মনে টাকাকে আলাদা আলাদা খাতায় ভাগ করি (“mental accounting”) এবং প্রতিটিকে আলাদাভাবে বিচার করি, যদিও টাকা তো একই। এই কাজের জন্য তিনি ২০১৭ সালে অর্থনীতিতে নোবেল পান। “পরে দেব” খাতাটা মাথায় হালকা লাগে, তাই সেখানে খরচ করা সহজ মনে হয়।",
        },
        {
          type: "p",
          text: "কার্ডের গবেষণাতেও একই ইঙ্গিত (পেমেন্টের কষ্ট নিয়ে আমাদের লেখাটা দেখুন): টাকা দেওয়ার কষ্ট যত দূরে, খরচ তত সহজ। বাকিও তো দেরিতে দেওয়া।",
        },
        {
          type: "callout",
          text: "হিসাব-এ খরচ লেখার সময় “বাকি” বেছে নিন। খরচসমূহ পাতায় “বাকি” চাপলেই দেখবেন এখনো মোট কত দেওয়া বাকি।",
        },
        { type: "h", text: "ছোট তিনটা নিয়ম" },
        {
          type: "list",
          items: [
            "বাকি নেওয়ার দিনই লিখুন, দেওয়ার দিন নয়।",
            "মাসের শুরুতে বাকির মোটটা একবার দেখে নিন।",
            "সম্ভব হলে বাকির জন্য একটা মাসিক সীমা ঠিক করুন।",
          ],
        },
      ],
    },
    en: {
      title: "Baki: keep it on paper, not in your head",
      summary: "“Pay later” money feels lighter, so the month-end bill surprises us.",
      body: [
        {
          type: "p",
          text: "Buying on baki at the corner shop is part of life. The catch: on the day you take it, no money leaves your pocket, so it doesn't feel like spending. Then the month-end settle-up comes as a shock.",
        },
        { type: "h", text: "Our minds keep separate accounts" },
        {
          type: "p",
          text: "Nobel laureate Richard Thaler showed that we sort money into mental “accounts” and treat each one differently, even though money is money. This “mental accounting” was part of his 2017 Nobel Prize in economics. The “pay later” account feels light, so spending from it feels easy.",
        },
        {
          type: "p",
          text: "The card studies point the same way (see our article on the pain of paying): the further away the payment, the easier the spending. Baki is just a payment pushed later.",
        },
        {
          type: "callout",
          text: "In Hisab, choose “Baki” when you add an expense. On the Expenses page, tap “Baki” to see exactly how much you still owe.",
        },
        { type: "h", text: "Three small rules" },
        {
          type: "list",
          items: [
            "Log baki on the day you take it, not the day you pay.",
            "Check your baki total at the start of each month.",
            "If you can, set yourself a monthly baki limit.",
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
    minutes: 3,
    bn: {
      title: "রোজ ১ মিনিট: হিসাব রাখাকে অভ্যাস বানানোর বিজ্ঞান",
      summary: "অভ্যাস তৈরি হতে গড়ে ৬৬ দিন লাগে। শুরুটা সহজ করার উপায়।",
      body: [
        {
          type: "p",
          text: "প্রথম সপ্তাহে উৎসাহ থাকে, তারপর একদিন ভুলে যাই, আর সেখানেই শেষ। এটা আপনার দোষ নয়। অভ্যাস তৈরি হতে সময় লাগে, আর কিছু কৌশল কাজটা অনেক সহজ করে।",
        },
        { type: "h", text: "গড়ে ৬৬ দিন" },
        {
          type: "p",
          text: "University College London-এর Phillippa Lally ও সহকর্মীরা (২০১০) ৯৬ জনকে প্রতিদিন একটি নতুন কাজ করতে বলেন। কাজটা “আপনাআপনি” হয়ে যেতে গড়ে লেগেছে ৬৬ দিন, তবে মানুষভেদে ১৮ দিন থেকে অনেক বেশি। আর ভালো খবর: মাঝে এক-আধদিন বাদ পড়লে অভ্যাস গড়ায় তেমন ক্ষতি হয়নি।",
        },
        { type: "h", text: "“কখন” আগে থেকে ঠিক করুন" },
        {
          type: "p",
          text: "Peter Gollwitzer ও Paschal Sheeran (২০০৬) ৯৪টি পরীক্ষার ফল বিশ্লেষণ করে দেখান, “যদি এটা হয়, তাহলে ওটা করব” ধরনের ছোট পরিকল্পনা লক্ষ্য পূরণে মাঝারি থেকে বড় প্রভাব ফেলে। যেমন: “রাতে খাওয়ার পর ফোন হাতে নিলেই আজকের খরচ লিখব।”",
        },
        { type: "h", text: "ছোট জয়গুলো দেখুন" },
        {
          type: "p",
          text: "Harvard Business School-এর অধ্যাপক Teresa Amabile ও Steven Kramer অফিসকর্মীদের প্রায় ১২,০০০ দৈনিক ডায়েরি বিশ্লেষণ করে পেয়েছেন, মানুষের উৎসাহ সবচেয়ে বেশি বাড়ে অর্থবহ কাজে ছোট ছোট অগ্রগতি চোখে পড়লে। তাঁরা এর নাম দিয়েছেন “progress principle”।",
        },
        {
          type: "callout",
          text: "এই কারণেই হিসাব-এ টানা কত দিন লিখছেন তা দেখায়, আর রাতে একটা রিমাইন্ডার পাঠাতে পারে। সেটিংসে গিয়ে রিমাইন্ডার চালু করুন।",
        },
        { type: "h", text: "শুরু করার নিয়ম" },
        {
          type: "list",
          items: [
            "দিনের একটা নির্দিষ্ট সময় বেছে নিন, যেমন রাতের খাবারের পর।",
            "ছোট খরচও লিখুন, ১০ টাকার চা-ও। ছোটগুলোই মাস শেষে বড় হয়।",
            "একদিন বাদ গেলে পরের দিন আবার শুরু করুন। অপরাধবোধের দরকার নেই।",
          ],
        },
      ],
    },
    en: {
      title: "One minute a day: the science of making it a habit",
      summary: "Habits take about 66 days on average. Here's how to make the start easy.",
      body: [
        {
          type: "p",
          text: "The first week goes great, then one day you forget, and that's the end of it. That's not a character flaw. Habits take time, and a few simple tricks make it much easier.",
        },
        { type: "h", text: "66 days on average" },
        {
          type: "p",
          text: "Phillippa Lally and colleagues at University College London (2010) asked 96 people to repeat a new behaviour every day. It took 66 days on average to feel automatic, ranging from 18 days to much longer. And the good news: missing the odd day didn't seriously set people back.",
        },
        { type: "h", text: "Decide “when” in advance" },
        {
          type: "p",
          text: "Peter Gollwitzer and Paschal Sheeran (2006) analysed 94 experiments and found that small “if this, then that” plans have a medium-to-large effect on reaching goals. For example: “When I pick up my phone after dinner, I'll log today's spending.”",
        },
        { type: "h", text: "Notice the small wins" },
        {
          type: "p",
          text: "Harvard Business School professor Teresa Amabile and Steven Kramer analysed nearly 12,000 daily diary entries from office workers. Motivation rose most on days people saw small progress in meaningful work, which they named the “progress principle”.",
        },
        {
          type: "callout",
          text: "That's why Hisab shows how many days in a row you've logged, and can send you a gentle evening reminder. Turn it on in Settings.",
        },
        { type: "h", text: "Ground rules" },
        {
          type: "list",
          items: [
            "Pick a fixed moment in the day, like right after dinner.",
            "Log the small stuff too, even a ৳10 cup of tea. Small things add up by month-end.",
            "Missed a day? Just pick it up again tomorrow. No guilt needed.",
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
    minutes: 4,
    published: "2026-10-16",
    bn: {
      title: "খরচের হিসাব রাখার সহজ নিয়ম: একদম শুরু থেকে",
      summary: "অনেকেই হিসাব রাখা শুরু করে এক সপ্তাহে ছেড়ে দেন। যেভাবে শুরু করলে টিকে থাকে।",
      body: [
        {
          type: "p",
          text: "খাতা-কলম নিয়ে বা এক্সেল খুলে হিসাব রাখা শুরু করেছেন, কয়েকদিন পর আর মনে নেই? এটা প্রায় সবার সাথেই হয়। সমস্যাটা ইচ্ছাশক্তির না, পদ্ধতির। শুরুতে খুব বেশি কিছু করতে গেলে কাজটা ভারী লাগে, আর ভারী কাজ মানুষ এড়িয়ে চলে।",
        },
        { type: "h", text: "১. শুধু দুটো জিনিস লিখুন: টাকা আর ক্যাটাগরি" },
        {
          type: "p",
          text: "প্রথম দিন থেকেই নোট, তারিখ, দোকানের নাম সব লিখতে হবে না। কত টাকা আর কিসের জন্য, এটুকু হলেই চলবে। ১০ সেকেন্ডের কাজ। বাকিটা চাইলে পরে যোগ করবেন।",
        },
        { type: "h", text: "২. খরচের সাথে সাথেই লিখুন" },
        {
          type: "p",
          text: "রাতে বসে সারাদিনের হিসাব মেলানো কঠিন। রিকশা ভাড়া কত ছিল, চায়ের দোকানে কত দিলেন, মনে থাকে না। টাকা দেওয়ার পর ফোন পকেটে রাখার আগেই লিখে ফেলুন। এই অভ্যাসটাই আসল।",
        },
        { type: "h", text: "৩. ছোট খরচ বাদ দেবেন না" },
        {
          type: "p",
          text: "২০ টাকার চা, ৫০ টাকার রিচার্জ, ৮০ টাকার রিকশা। আলাদা করে কিছুই না, কিন্তু মাস শেষে যোগ করলে অনেকেই অবাক হন। বড় খরচ এমনিতেই মনে থাকে, হারিয়ে যায় ছোটগুলো।",
        },
        { type: "h", text: "৪. ক্যাটাগরি কম রাখুন" },
        {
          type: "p",
          text: "বিশটা ক্যাটাগরি বানালে প্রতিবার ভাবতে হয় কোনটায় ফেলবেন। খাবার, বাজার, যাতায়াত, বাসা ভাড়া, বিল, কেনাকাটা, এরকম দশ-বারোটা হলেই যথেষ্ট। দরকার হলে পরে নিজের ক্যাটাগরি যোগ করবেন।",
        },
        { type: "h", text: "৫. সপ্তাহে একবার ৫ মিনিট দেখুন" },
        {
          type: "p",
          text: "লেখার উদ্দেশ্য তো দেখা। সপ্তাহে একদিন, ধরুন শুক্রবার সকালে, একবার চোখ বুলান: কোথায় বেশি যাচ্ছে, কোন খরচটা না করলেও চলত।",
        },
        {
          type: "callout",
          text: "প্রথম মাসে শুধু লিখুন, নিজেকে বিচার করবেন না। নিজের আসল খরচের ছবিটা আগে দেখা দরকার। কমানোর কাজ দ্বিতীয় মাস থেকে।",
        },
        { type: "h", text: "হিসাব-এ কাজটা যেভাবে সহজ" },
        {
          type: "list",
          items: [
            "পরিমাণ লিখুন, ক্যাটাগরিতে ট্যাপ করুন, সংরক্ষণ। তিন ধাপেই শেষ।",
            "আগে যে নোট লিখেছেন, সেগুলো এক ট্যাপে আবার বসানো যায়।",
            "চাইলে রাতে একটা রিমাইন্ডার পাবেন, যদি সেদিন কিছু না লিখে থাকেন।",
          ],
        },
      ],
    },
    en: {
      title: "How to track your daily expenses: a simple starter guide",
      summary: "Most people start tracking and quit within a week. Here's how to start so it sticks.",
      body: [
        {
          type: "p",
          text: "You start a notebook or a spreadsheet, keep it up for a few days, and then it quietly stops. That happens to almost everyone. It's not a willpower problem, it's a method problem: if the routine feels heavy, you'll avoid it.",
        },
        { type: "h", text: "1. Write down just two things: amount and category" },
        {
          type: "p",
          text: "You don't need notes, shop names and receipts from day one. How much, and what for. That's ten seconds. You can add detail later if you want it.",
        },
        { type: "h", text: "2. Log it the moment you pay" },
        {
          type: "p",
          text: "Reconstructing the whole day at night is hard. Was the rickshaw 60 or 80? What did the tea cost? Log it before the phone goes back in your pocket. That one habit is most of the work.",
        },
        { type: "h", text: "3. Don't skip the small stuff" },
        {
          type: "p",
          text: "A ৳20 tea, a ৳50 top-up, an ৳80 ride. Nothing on its own, but added up at month-end it surprises most people. The big expenses you'll remember anyway; it's the small ones that disappear.",
        },
        { type: "h", text: "4. Keep categories few" },
        {
          type: "p",
          text: "With twenty categories you stop and think every time. Food, groceries, transport, rent, bills, shopping: ten or twelve is plenty. Add your own later if you really need one.",
        },
        { type: "h", text: "5. Take five minutes once a week" },
        {
          type: "p",
          text: "The point of writing it down is looking at it. Pick a day, say Friday morning, and glance through: where is most of it going, and what could you have skipped?",
        },
        {
          type: "callout",
          text: "For the first month, just log. Don't judge yourself. You need an honest picture of your spending before you start cutting.",
        },
        { type: "h", text: "How Hisab keeps it quick" },
        {
          type: "list",
          items: [
            "Type the amount, tap a category, save. Three steps.",
            "Notes you've used before come back as one-tap suggestions.",
            "An optional evening reminder, only on days you haven't logged anything.",
          ],
        },
      ],
    },
    sources: [],
  },
  {
    slug: "monthly-budget",
    icon: "target",
    minutes: 4,
    published: "2026-10-16",
    bn: {
      title: "মাসিক বাজেট কীভাবে করবেন: অনুমানে নয়, নিজের খরচ দেখে",
      summary: "বেশিরভাগ বাজেট ভাঙে কারণ সেগুলো আন্দাজে বানানো। বাস্তবসম্মত বাজেটের সহজ পদ্ধতি।",
      body: [
        {
          type: "p",
          text: "মাসের শুরুতে কাগজে লিখলেন: বাজারে ৮,০০০, বাইরে খাওয়ায় ২,০০০। মাসের মাঝামাঝি গিয়ে দেখলেন অনেক আগেই পার হয়ে গেছে। বাজেট ভাঙার সবচেয়ে বড় কারণ হলো সংখ্যাগুলো আন্দাজে বসানো, নিজের আসল খরচ দেখে নয়।",
        },
        { type: "h", text: "আগে এক-দুই মাস শুধু লিখুন" },
        {
          type: "p",
          text: "বাজেট বানানোর আগে জানা দরকার এখন আসলে কত খরচ হয়। এক-দুই মাস প্রতিটা খরচ লিখে রাখুন। তারপর প্রতিটা ক্যাটাগরির মাসিক গড়টা দেখুন। এটাই আপনার শুরুর বিন্দু।",
        },
        { type: "h", text: "স্থির আর পরিবর্তনশীল খরচ আলাদা করুন" },
        {
          type: "p",
          text: "বাসা ভাড়া, বিদ্যুৎ-গ্যাসের বিল, বাচ্চার স্কুলের বেতন প্রায় প্রতি মাসে একই থাকে। এগুলো নিয়ে বেশি ভাবার কিছু নেই। আসল জায়গা হলো যেগুলো ওঠানামা করে: বাইরে খাওয়া, কেনাকাটা, অনলাইন অর্ডার, যাতায়াত।",
        },
        { type: "h", text: "সব ক্যাটাগরিতে নয়, দুই-তিনটায় সীমা দিন" },
        {
          type: "p",
          text: "পনেরোটা ক্যাটাগরিতে সীমা বসালে ট্র্যাক রাখাই কঠিন। যে দুই-তিনটা ক্যাটাগরিতে খরচ সবচেয়ে বেশি ওঠানামা করে, শুধু সেগুলোতে সীমা দিন। গড়ের চেয়ে একটু কম ধরুন, অনেক কম নয়। হঠাৎ অর্ধেক করে ফেললে কয়েকদিনেই হাল ছেড়ে দিতে ইচ্ছা করবে।",
        },
        { type: "h", text: "অপ্রত্যাশিতের জন্য জায়গা রাখুন" },
        {
          type: "p",
          text: "ডাক্তার, হঠাৎ মেহমান, কারও বিয়ের উপহার, ঈদের কেনাকাটা। এগুলো প্রতি মাসে আসে না, কিন্তু আসবেই। মোট বাজেটে একটু ফাঁকা জায়গা রাখুন, যাতে এমন মাসে পুরো পরিকল্পনা ভেঙে না যায়।",
        },
        { type: "h", text: "মাসের মাঝে একবার মিলিয়ে দেখুন" },
        {
          type: "p",
          text: "মাসের ১৫ তারিখে দেখুন: অর্ধেক মাসে বাজেটের অর্ধেকের বেশি খরচ হয়ে গেছে কি? হলে বাকি দিনগুলোয় একটু সামলে চলুন। মাস শেষে ধরা পড়লে আর কিছু করার থাকে না।",
        },
        {
          type: "callout",
          text: "হিসাব-এর বাজেট পাতা আপনার গত তিন মাসের গড় দেখে প্রতিটা ক্যাটাগরির জন্য একটা পরামর্শ দেয়। প্রতিটা বারের চিকন দাগটা দেখায় মাসের কতটা পার হয়েছে, তাই এক নজরেই বুঝবেন খরচ এগিয়ে আছে কি না।",
        },
        { type: "h", text: "মনে রাখবেন" },
        {
          type: "list",
          items: [
            "বাকিও খরচ। বাকি নেওয়ার দিনই লিখুন, নইলে বাজেটের হিসাব মিলবে না।",
            "প্রথম মাসে বাজেট না মিললে হতাশ হবেন না। সংখ্যাগুলো পরের মাসে ঠিক করে নিন।",
            "বাজেট শাস্তি নয়। এটা আপনার টাকা কোথায় যাবে, তার একটা পরিকল্পনা।",
          ],
        },
      ],
    },
    en: {
      title: "How to make a monthly budget that actually fits your life",
      summary: "Most budgets break because they're guesses. A simple way to build one from your real spending.",
      body: [
        {
          type: "p",
          text: "At the start of the month you write it down: ৳8,000 for groceries, ৳2,000 for eating out. By the middle of the month you've blown past both. The most common reason budgets fail is that the numbers were guesses, not based on what you actually spend.",
        },
        { type: "h", text: "Track for a month or two first" },
        {
          type: "p",
          text: "Before setting limits, find out what you really spend. Log every expense for a month or two, then look at the monthly average for each category. That's your starting point.",
        },
        { type: "h", text: "Split fixed from flexible" },
        {
          type: "p",
          text: "Rent, utility bills and school fees barely change month to month, so there's little to decide there. The real room is in what moves around: eating out, shopping, online orders, rides.",
        },
        { type: "h", text: "Set limits on two or three categories, not all of them" },
        {
          type: "p",
          text: "Fifteen limits are hard to keep track of. Pick the two or three categories that swing the most and set limits only there. Aim a little below your average, not far below. Cut something in half overnight and you'll want to give up within a week.",
        },
        { type: "h", text: "Leave room for the unexpected" },
        {
          type: "p",
          text: "A doctor's visit, guests turning up, a wedding gift, Eid shopping. They don't come every month, but they do come. Leave some slack in the total so one month like that doesn't wreck the whole plan.",
        },
        { type: "h", text: "Check in mid-month" },
        {
          type: "p",
          text: "Around the 15th, ask: is more than half the budget gone with half the month left? If so, ease off for the rest of the month. Finding out on the 30th is too late to do anything.",
        },
        {
          type: "callout",
          text: "Hisab's Budgets page suggests a limit for each category from your last three months. The thin line on each bar shows how far through the month you are, so you can see at a glance whether spending is running ahead.",
        },
        { type: "h", text: "Keep in mind" },
        {
          type: "list",
          items: [
            "Baki is spending too. Log it the day you take it, or the budget won't add up.",
            "If the first month doesn't fit, don't worry. Adjust the numbers for next month.",
            "A budget isn't a punishment. It's a plan for where your money goes.",
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
    bn: "নিজের আগের মাসের সাথে খরচ তুলনা করে দেখা অ্যাপ ব্যবহারকারীরা প্রায় ১৫% কম শখের খরচ করেছেন।",
    en: "App users shown their spending against their own past months spent about 15% less on extras.",
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
    bn: "কম শখের খরচ, যখন অ্যাপ ব্যবহারকারীরা নিজের আগের মাসের সাথে তুলনা দেখেছেন।",
    en: "less spent on extras when app users saw their spending against their own past months.",
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
