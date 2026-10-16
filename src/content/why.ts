// Copy for the "Why use Hisab?" page.
//
// Only claim what the app really does today. No made-up user counts,
// testimonials or promises the business hasn't decided on.

type Text = { bn: string; en: string };

export const WHY = {
  meta: {
    title: {
      bn: "কেন হিসাব ব্যবহার করবেন? খরচের হিসাব রাখার সহজ অ্যাপ",
      en: "Why use Hisab? The easy way to keep track of your spending",
    },
    description: {
      bn: "মাস শেষে টাকা কোথায় গেল, আর ভাবতে হবে না। ১০ সেকেন্ডে খরচ লিখুন, বাকির হিসাব রাখুন, নিজের খরচ দেখে বাজেট করুন। ফ্রি, পুরো বাংলায়, ফোনে অ্যাপের মতো চলে।",
      en: "Stop wondering where the money went. Log spending in ten seconds, keep track of baki, and budget from your real numbers. Free, fully in Bangla or English, and works like an app on your phone.",
    },
  },
  hero: {
    title: { bn: "কেন হিসাব ব্যবহার করবেন?", en: "Why use Hisab?" },
    body: {
      bn: "মাসের ২০ তারিখে পকেট খালি, অথচ মনে করতে পারছেন না টাকাগুলো গেল কোথায়? হিসাব ঠিক এই প্রশ্নের উত্তর দেয়, দিনে এক মিনিট সময় নিয়ে।",
      en: "It's the 20th, the wallet's nearly empty, and you can't quite say where it all went. Hisab answers that question, for about a minute a day.",
    },
  },
  problems: {
    title: { bn: "চেনা লাগছে?", en: "Sound familiar?" },
    items: [
      {
        bn: "বেতন পাওয়ার কয়েক সপ্তাহ পরেই টানাটানি, কিন্তু কোনো বড় খরচ মনে পড়ছে না।",
        en: "Money is tight a few weeks after payday, but you can't think of anything big you bought.",
      },
      {
        bn: "মুদি দোকানের বাকি কত হলো, তার হিসাব শুধু দোকানদারের খাতায়।",
        en: "The only record of your corner-shop baki is in the shopkeeper's notebook.",
      },
      {
        bn: "খাতায় বা এক্সেলে হিসাব রাখা শুরু করেছিলেন, এক সপ্তাহ পর আর হয়নি।",
        en: "You started tracking in a notebook or a spreadsheet, and it lasted about a week.",
      },
    ] as Text[],
  },
  research: {
    title: { bn: "লিখে রাখলে সত্যিই বদলায়", en: "Writing it down really does change things" },
    body: {
      bn: "এটা শুধু আমাদের কথা নয়। গবেষণা কী বলে, সংক্ষেপে:",
      en: "Don't just take our word for it. Here's what the research says, in short:",
    },
  },
  benefits: {
    title: { bn: "হিসাব আপনার জন্য যা করে", en: "What Hisab does for you" },
    items: [
      {
        icon: "zap",
        title: { bn: "১০ সেকেন্ডে খরচ লেখা", en: "Log a cost in ten seconds" },
        body: {
          bn: "টাকার অঙ্ক, ক্যাটাগরি, সংরক্ষণ। আগে লেখা নোটগুলো এক ট্যাপেই আবার বসানো যায়, তাই রোজকার খরচ লিখতে টাইপও করতে হয় না।",
          en: "Amount, category, save. Notes you've used before come back with one tap, so everyday costs barely need typing.",
        },
      },
      {
        icon: "chart",
        title: { bn: "টাকা কোথায় যায়, এক নজরে", en: "See where it goes, at a glance" },
        body: {
          bn: "এই মাস বনাম গত মাস, কোন ক্যাটাগরিতে বেশি, কোন দিন সবচেয়ে বেশি খরচ। স্বাভাবিকের চেয়ে বেশি খরচ হলে ড্যাশবোর্ডেই চোখে পড়বে।",
          en: "This month against last month, the biggest categories, your most expensive days. If something runs above your usual, the dashboard shows it.",
        },
      },
      {
        icon: "target",
        title: { bn: "নিজের খরচ দেখে বাজেট", en: "A budget from your real numbers" },
        body: {
          bn: "আন্দাজে নয়। গত তিন মাসের গড় দেখে প্রতিটা ক্যাটাগরির জন্য বাজেটের পরামর্শ দেয়, আর মাসের কতটা গেল তার সাথে মিলিয়ে দেখায়।",
          en: "No guesswork. It suggests a limit for each category from your last three months, and shows how spending is tracking against the month.",
        },
      },
      {
        icon: "handcoins",
        title: { bn: "বাকির আলাদা হিসাব", en: "Baki, tracked separately" },
        body: {
          bn: "বাকিতে নেওয়া খরচ আলাদা করে চিহ্নিত থাকে। এক ট্যাপে দেখবেন এখনো মোট কত দেওয়া বাকি।",
          en: "Things bought on baki are marked as such. One tap shows how much you still owe in total.",
        },
      },
      {
        icon: "bell",
        title: { bn: "ভুলে গেলে মনে করিয়ে দেয়", en: "A nudge when you forget" },
        body: {
          bn: "আপনার বেছে নেওয়া সময়ে, সেদিন কিছু না লিখে থাকলে একটা নোটিফিকেশন। টানা কত দিন লিখছেন, সেটাও দেখায়।",
          en: "One notification at the time you choose, only on days you haven't logged anything. It also shows how many days in a row you've kept it up.",
        },
      },
      {
        icon: "phone",
        title: { bn: "পুরো বাংলায়, ফোনে অ্যাপের মতো", en: "In Bangla or English, like an app" },
        body: {
          bn: "বাংলা সংখ্যাসহ পুরো অ্যাপ বাংলায়, চাইলে ইংরেজিতে। প্লে স্টোর ছাড়াই ফোন, পিসি বা ম্যাকের হোম স্ক্রিনে যোগ করে নিন।",
          en: "The whole app in Bangla, digits included, or in English. Add it to the home screen of your phone, PC or Mac, no app store needed.",
        },
      },
    ],
  },
  compare: {
    title: { bn: "খাতা বা এক্সেলের সাথে তুলনা", en: "Compared with a notebook or a spreadsheet" },
    columns: {
      notebook: { bn: "খাতা-কলম", en: "Notebook" },
      sheet: { bn: "এক্সেল", en: "Spreadsheet" },
      hisab: { bn: "হিসাব", en: "Hisab" },
    },
    // yes / partly / no for notebook, spreadsheet, Hisab
    rows: [
      { label: { bn: "ফোনে কয়েক সেকেন্ডে লেখা", en: "Log in seconds on your phone" }, values: ["no", "partly", "yes"] },
      { label: { bn: "মোট আর চার্ট নিজে থেকেই", en: "Totals and charts done for you" }, values: ["no", "partly", "yes"] },
      { label: { bn: "নিজের খরচ দেখে বাজেটের পরামর্শ", en: "Budget suggestions from your spending" }, values: ["no", "no", "yes"] },
      { label: { bn: "বাকির আলাদা হিসাব", en: "Baki kept apart" }, values: ["partly", "partly", "yes"] },
      { label: { bn: "ভুলে গেলে রিমাইন্ডার", en: "A reminder when you forget" }, values: ["no", "no", "yes"] },
      { label: { bn: "খরচ", en: "Cost" }, values: ["free", "free", "free"] },
    ] as { label: Text; values: ("yes" | "partly" | "no" | "free")[] }[],
    legend: {
      yes: { bn: "হ্যাঁ", en: "Yes" },
      partly: { bn: "নিজে করতে হয়", en: "By hand" },
      no: { bn: "না", en: "No" },
      free: { bn: "ফ্রি", en: "Free" },
    },
  },
  control: {
    title: { bn: "আপনার তথ্য, আপনার নিয়ন্ত্রণে", en: "Your data stays in your hands" },
    items: [
      {
        bn: "ব্যাংক, কার্ড বা বিকাশ অ্যাকাউন্ট যুক্ত করতে হয় না। আপনি যা লেখেন, শুধু সেটুকুই থাকে।",
        en: "No bank, card or mobile wallet to connect. Only what you write down is stored.",
      },
      {
        bn: "পাসওয়ার্ড সরাসরি সংরক্ষণ করা হয় না, শুধু তার একটা নিরাপদ হ্যাশ।",
        en: "Your password is never stored as is, only a secure hash of it.",
      },
      {
        bn: "যখন খুশি সব খরচ CSV ফাইলে ডাউনলোড করুন, Excel বা Google Sheets-এ খোলে।",
        en: "Download every expense as a CSV file any time; it opens in Excel or Google Sheets.",
      },
      {
        bn: "অ্যাকাউন্ট মুছলে সব খরচ, বাজেট আর ক্যাটাগরি একসাথে মুছে যায়।",
        en: "Delete your account and every expense, budget and category goes with it.",
      },
    ] as Text[],
  },
  faq: {
    title: { bn: "প্রায়ই যা জানতে চান", en: "Common questions" },
    items: [
      {
        q: { bn: "হিসাব কি ফ্রি?", en: "Is Hisab free?" },
        a: {
          bn: "হ্যাঁ। অ্যাকাউন্ট খুলতে কোনো কার্ড বা টাকা লাগে না।",
          en: "Yes. Signing up doesn't need a card or any payment.",
        },
      },
      {
        q: { bn: "প্লে স্টোর বা অ্যাপ স্টোর থেকে নামাতে হবে?", en: "Do I need to download it from an app store?" },
        a: {
          bn: "না। ব্রাউজারেই চলে। চাইলে Android, পিসি বা ম্যাকে “অ্যাপ ইনস্টল করুন” চেপে, আর iPhone-এ Share থেকে “Add to Home Screen” দিয়ে হোম স্ক্রিনে যোগ করতে পারেন।",
          en: "No. It runs in your browser. If you like, tap “Install app” on Android, PC or Mac, or use Share → “Add to Home Screen” on iPhone, to put it on your home screen.",
        },
      },
      {
        q: { bn: "ইন্টারনেট ছাড়া চলবে?", en: "Does it work without internet?" },
        a: {
          bn: "না, খরচ লিখতে আর দেখতে ইন্টারনেট সংযোগ লাগে। খুব সামান্য ডেটাই খরচ হয়।",
          en: "No, you need a connection to add and view expenses. It uses very little data.",
        },
      },
      {
        q: { bn: "নিজের মতো ক্যাটাগরি বানানো যায়?", en: "Can I make my own categories?" },
        a: {
          bn: "হ্যাঁ। খাবার, বাজার, যাতায়াতের মতো সাধারণ ক্যাটাগরি দেওয়াই থাকে। সেটিংস থেকে নিজের নাম, আইকন আর রং দিয়ে নতুন ক্যাটাগরি যোগ করতে পারবেন।",
          en: "Yes. Common ones like food, groceries and transport are already there, and in Settings you can add your own with a name, icon and colour.",
        },
      },
      {
        q: { bn: "টাকা ছাড়া অন্য মুদ্রায় হিসাব রাখা যায়?", en: "Can I use a currency other than taka?" },
        a: {
          bn: "হ্যাঁ। টাকা (৳) ছাড়াও ডলার, ইউরো, পাউন্ড আর রুপিতে হিসাব রাখা যায়।",
          en: "Yes. Besides taka (৳) you can use US dollars, euros, pounds or rupees.",
        },
      },
      {
        q: { bn: "পরে হিসাব রাখা বন্ধ করলে তথ্যের কী হবে?", en: "What happens to my data if I stop?" },
        a: {
          bn: "যা লিখেছেন সব আপনার অ্যাকাউন্টেই থাকবে। চাইলে CSV ফাইলে ডাউনলোড করে নিতে বা পুরো অ্যাকাউন্ট মুছে ফেলতে পারবেন।",
          en: "Everything stays in your account. You can download it as a CSV file or delete the whole account whenever you want.",
        },
      },
    ] as { q: Text; a: Text }[],
  },
  cta: {
    title: { bn: "আজকের খরচ দিয়েই শুরু করুন", en: "Start with today's spending" },
    body: {
      bn: "অ্যাকাউন্ট খুলতে এক মিনিটও লাগে না। প্রথম খরচটা লিখে দেখুন, কেমন লাগে।",
      en: "Signing up takes under a minute. Log your first expense and see how it feels.",
    },
    button: { bn: "ফ্রিতে অ্যাকাউন্ট খুলুন", en: "Create a free account" },
    open: { bn: "অ্যাপ খুলুন", en: "Open the app" },
    articles: { bn: "আরও পড়ুন: টিপস ও লেখা", en: "Read more: tips and articles" },
  },
};

export function pick(text: Text, locale: string): string {
  return locale === "en" ? text.en : text.bn;
}
