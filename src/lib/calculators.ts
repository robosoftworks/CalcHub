export type CalcMeta = {
  slug: string;
  path: string;
  title: string;
  short: string;
  description: string;
  emoji: string;
  keywords: string[];
  related: string[];
};

export const calculators: CalcMeta[] = [
  {
    slug: "calculator",
    path: "/calculator",
    title: "Basic Calculator",
    short: "Standard & scientific",
    description:
      "Free online calculator for everyday math. Add, subtract, multiply, divide and use scientific functions instantly.",
    emoji: "🧮",
    keywords: ["calculator", "online calculator", "scientific calculator"],
    related: ["percentage-calculator", "profit-loss-calculator", "currency-converter", "gpa-calculator"],
  },
  {
    slug: "gpa-calculator",
    path: "/gpa-calculator",
    title: "GPA Calculator",
    short: "Grades & credit hours",
    description:
      "Calculate your Grade Point Average instantly. Supports unlimited subjects, credit hours and 4.0 / 5.0 scales.",
    emoji: "🎓",
    keywords: ["gpa calculator", "grade calculator", "college gpa"],
    related: ["percentage-calculator", "calculator", "age-calculator", "profit-loss-calculator"],
  },
  {
    slug: "age-calculator",
    path: "/age-calculator",
    title: "Age Calculator",
    short: "Years, months & days",
    description:
      "Find your exact age in years, months, days, hours and minutes from your date of birth.",
    emoji: "🎂",
    keywords: ["age calculator", "date of birth calculator", "how old am i"],
    related: ["gpa-calculator", "percentage-calculator", "calculator", "currency-converter"],
  },
  {
    slug: "percentage-calculator",
    path: "/percentage-calculator",
    title: "Percentage Calculator",
    short: "% of, increase, discount",
    description:
      "Solve any percentage problem: X is what % of Y, percent increase/decrease, and discount price calculator.",
    emoji: "％",
    keywords: ["percentage calculator", "percent calculator", "discount calculator"],
    related: ["profit-loss-calculator", "calculator", "gpa-calculator", "currency-converter"],
  },
  {
    slug: "profit-loss-calculator",
    path: "/profit-loss-calculator",
    title: "Profit & Loss Calculator",
    short: "Margin & markup",
    description:
      "Calculate profit, loss and percentage margin from cost price and selling price for any business or trade.",
    emoji: "📈",
    keywords: ["profit calculator", "loss calculator", "margin calculator"],
    related: ["percentage-calculator", "currency-converter", "calculator", "gpa-calculator"],
  },
  {
    slug: "currency-converter",
    path: "/currency-converter",
    title: "Currency Converter",
    short: "Live exchange rates",
    description:
      "Convert between 150+ world currencies with live exchange rates. USD, EUR, GBP, INR, PKR and more.",
    emoji: "💱",
    keywords: ["currency converter", "exchange rate", "usd to eur"],
    related: ["profit-loss-calculator", "percentage-calculator", "calculator", "age-calculator"],
  },
  {
    slug: "bmi-calculator",
    path: "/bmi-calculator",
    title: "BMI Calculator",
    short: "Body Mass Index",
    description:
      "Calculate your Body Mass Index (BMI) in metric or imperial units and see your healthy weight range instantly.",
    emoji: "⚖️",
    keywords: ["bmi calculator", "body mass index", "healthy weight"],
    related: ["age-calculator", "percentage-calculator", "calculator", "tip-calculator"],
  },
  {
    slug: "loan-calculator",
    path: "/loan-calculator",
    title: "Loan / EMI Calculator",
    short: "Monthly payments & interest",
    description:
      "Calculate monthly loan payments (EMI), total interest and amortization for home, car or personal loans.",
    emoji: "🏦",
    keywords: ["loan calculator", "emi calculator", "mortgage calculator"],
    related: ["profit-loss-calculator", "percentage-calculator", "currency-converter", "discount-calculator"],
  },
  {
    slug: "tip-calculator",
    path: "/tip-calculator",
    title: "Tip Calculator",
    short: "Bills, tips & splits",
    description:
      "Split a bill, calculate tip percentage and see what each person owes — fast and accurate.",
    emoji: "🧾",
    keywords: ["tip calculator", "bill split", "gratuity calculator"],
    related: ["percentage-calculator", "discount-calculator", "calculator", "currency-converter"],
  },
  {
    slug: "discount-calculator",
    path: "/discount-calculator",
    title: "Discount Calculator",
    short: "Sale price & savings",
    description:
      "Find sale price and savings from a percentage discount, or work out the discount % from two prices.",
    emoji: "🏷️",
    keywords: ["discount calculator", "sale price calculator", "percent off"],
    related: ["percentage-calculator", "profit-loss-calculator", "tip-calculator", "loan-calculator"],
  },
];

export const blogPosts = [
  {
    slug: "how-to-calculate-gpa",
    title: "How to Calculate GPA: Step-by-Step Guide (2025)",
    excerpt:
      "Learn the exact formula colleges use to calculate GPA, with worked examples for the 4.0 and 5.0 scales.",
    related: "gpa-calculator",
    date: "2025-01-12",
  },
  {
    slug: "age-calculator-explained",
    title: "Age Calculator Explained (With Real Examples)",
    excerpt:
      "How an age calculator works, why month lengths matter, and how to compute your exact age in days.",
    related: "age-calculator",
    date: "2025-01-18",
  },
  {
    slug: "percentage-formula-made-easy",
    title: "Percentage Formula Made Easy — All 5 Cases Solved",
    excerpt:
      "The only percentage guide you need: X% of Y, increase, decrease, discount and reverse percentage.",
    related: "percentage-calculator",
    date: "2025-02-02",
  },
  {
    slug: "profit-and-loss-formula-guide",
    title: "Profit and Loss Formula Guide for Small Business Owners",
    excerpt:
      "Master profit, loss, margin and markup formulas with practical retail and e-commerce examples.",
    related: "profit-loss-calculator",
    date: "2025-02-15",
  },
  {
    slug: "currency-exchange-explained",
    title: "Currency Exchange Explained: Rates, Spreads & Fees",
    excerpt:
      "How forex pricing actually works, why bank rates differ from Google rates, and how to convert smarter.",
    related: "currency-converter",
    date: "2025-03-04",
  },
];
