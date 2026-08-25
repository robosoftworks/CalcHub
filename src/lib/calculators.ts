export type CalcCategory = "Everyday" | "Financial" | "Health" | "Math" | "Time & Date";

export type CalcMeta = {
  slug: string;
  path: string;
  title: string;
  short: string;
  description: string;
  emoji: string;
  category: CalcCategory;
  keywords: string[];
  related: string[];
};

export const CATEGORIES: { name: CalcCategory; emoji: string; blurb: string }[] = [
  { name: "Everyday", emoji: "🛒", blurb: "Bills, discounts, units and quick utilities" },
  { name: "Financial", emoji: "💰", blurb: "Loans, mortgages, interest and money math" },
  { name: "Health", emoji: "❤️", blurb: "BMI, calories and body composition" },
  { name: "Math", emoji: "🧮", blurb: "Arithmetic, percentages and grades" },
  { name: "Time & Date", emoji: "📅", blurb: "Ages, countdowns and date differences" },
];

export const calculators: CalcMeta[] = [
  {
    slug: "calculator",
    path: "/calculator",
    title: "Basic Calculator",
    short: "Standard & scientific",
    description:
      "Free online calculator for everyday math. Add, subtract, multiply, divide and use scientific functions instantly.",
    emoji: "🧮",
    category: "Math",
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
    category: "Math",
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
    category: "Time & Date",
    keywords: ["age calculator", "date of birth calculator", "how old am i"],
    related: ["date-calculator", "gpa-calculator", "percentage-calculator", "calculator"],
  },
  {
    slug: "percentage-calculator",
    path: "/percentage-calculator",
    title: "Percentage Calculator",
    short: "% of, increase, discount",
    description:
      "Solve any percentage problem: X is what % of Y, percent increase/decrease, and discount price calculator.",
    emoji: "％",
    category: "Math",
    keywords: ["percentage calculator", "percent calculator", "discount calculator"],
    related: ["profit-loss-calculator", "sales-tax-calculator", "calculator", "gpa-calculator"],
  },
  {
    slug: "profit-loss-calculator",
    path: "/profit-loss-calculator",
    title: "Profit & Loss Calculator",
    short: "Margin & markup",
    description:
      "Calculate profit, loss and percentage margin from cost price and selling price for any business or trade.",
    emoji: "📈",
    category: "Financial",
    keywords: ["profit calculator", "loss calculator", "margin calculator"],
    related: ["percentage-calculator", "currency-converter", "compound-interest-calculator", "calculator"],
  },
  {
    slug: "currency-converter",
    path: "/currency-converter",
    title: "Currency Converter",
    short: "Live exchange rates",
    description:
      "Convert between 150+ world currencies with live exchange rates. USD, EUR, GBP, INR, PKR and more.",
    emoji: "💱",
    category: "Financial",
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
    category: "Health",
    keywords: ["bmi calculator", "body mass index", "healthy weight"],
    related: ["calorie-calculator", "body-fat-calculator", "age-calculator", "percentage-calculator"],
  },
  {
    slug: "loan-calculator",
    path: "/loan-calculator",
    title: "Loan / EMI Calculator",
    short: "Monthly payments & interest",
    description:
      "Calculate monthly loan payments (EMI), total interest and amortization for home, car or personal loans.",
    emoji: "🏦",
    category: "Financial",
    keywords: ["loan calculator", "emi calculator", "amortization calculator"],
    related: ["mortgage-calculator", "compound-interest-calculator", "profit-loss-calculator", "discount-calculator"],
  },
  {
    slug: "tip-calculator",
    path: "/tip-calculator",
    title: "Tip Calculator",
    short: "Bills, tips & splits",
    description:
      "Split a bill, calculate tip percentage and see what each person owes — fast and accurate.",
    emoji: "🧾",
    category: "Everyday",
    keywords: ["tip calculator", "bill split", "gratuity calculator"],
    related: ["percentage-calculator", "discount-calculator", "sales-tax-calculator", "calculator"],
  },
  {
    slug: "discount-calculator",
    path: "/discount-calculator",
    title: "Discount Calculator",
    short: "Sale price & savings",
    description:
      "Find sale price and savings from a percentage discount, or work out the discount % from two prices.",
    emoji: "🏷️",
    category: "Everyday",
    keywords: ["discount calculator", "sale price calculator", "percent off"],
    related: ["percentage-calculator", "sales-tax-calculator", "tip-calculator", "profit-loss-calculator"],
  },
  {
    slug: "unit-converter",
    path: "/unit-converter",
    title: "Unit Converter",
    short: "Length, weight, volume & temperature",
    description:
      "Convert between metric and imperial units instantly — length, weight, volume and temperature in one tool.",
    emoji: "📏",
    category: "Everyday",
    keywords: ["unit converter", "metric to imperial", "cm to inches", "kg to lbs"],
    related: ["fuel-cost-calculator", "bmi-calculator", "calculator", "sales-tax-calculator"],
  },
  {
    slug: "date-calculator",
    path: "/date-calculator",
    title: "Date Calculator",
    short: "Difference & countdown",
    description:
      "Find the number of days, weeks and months between two dates, or count down to any future date or event.",
    emoji: "🗓️",
    category: "Time & Date",
    keywords: ["date calculator", "days between dates", "countdown calculator"],
    related: ["age-calculator", "gpa-calculator", "calculator", "percentage-calculator"],
  },
  {
    slug: "mortgage-calculator",
    path: "/mortgage-calculator",
    title: "Mortgage Calculator",
    short: "Home loan payments",
    description:
      "Estimate your monthly mortgage payment including principal, interest, property tax, insurance and PMI.",
    emoji: "🏠",
    category: "Financial",
    keywords: ["mortgage calculator", "home loan calculator", "monthly mortgage payment"],
    related: ["loan-calculator", "compound-interest-calculator", "salary-calculator", "sales-tax-calculator"],
  },
  {
    slug: "compound-interest-calculator",
    path: "/compound-interest-calculator",
    title: "Compound Interest Calculator",
    short: "Growth over time",
    description:
      "See how your savings or investment grows with compound interest, including regular monthly contributions.",
    emoji: "📊",
    category: "Financial",
    keywords: ["compound interest calculator", "investment growth calculator", "savings calculator"],
    related: ["loan-calculator", "mortgage-calculator", "profit-loss-calculator", "salary-calculator"],
  },
  {
    slug: "sales-tax-calculator",
    path: "/sales-tax-calculator",
    title: "Sales Tax Calculator",
    short: "Tax amount & total price",
    description:
      "Calculate sales tax on a purchase, or work backward from a tax-included total to find the pre-tax price.",
    emoji: "🧮",
    category: "Everyday",
    keywords: ["sales tax calculator", "tax calculator", "reverse sales tax"],
    related: ["discount-calculator", "tip-calculator", "percentage-calculator", "unit-converter"],
  },
  {
    slug: "calorie-calculator",
    path: "/calorie-calculator",
    title: "Calorie Calculator",
    short: "BMR & daily calories (TDEE)",
    description:
      "Calculate your Basal Metabolic Rate (BMR) and daily calorie needs (TDEE) using the Mifflin-St Jeor formula.",
    emoji: "🔥",
    category: "Health",
    keywords: ["calorie calculator", "bmr calculator", "tdee calculator", "daily calorie needs"],
    related: ["bmi-calculator", "body-fat-calculator", "age-calculator", "unit-converter"],
  },
  {
    slug: "password-generator",
    path: "/password-generator",
    title: "Password Generator",
    short: "Strong, random passwords",
    description:
      "Generate cryptographically random, strong passwords with custom length and character sets.",
    emoji: "🔐",
    category: "Everyday",
    keywords: ["password generator", "random password", "strong password generator"],
    related: ["random-number-generator", "word-counter", "unit-converter", "calculator"],
  },
  {
    slug: "word-counter",
    path: "/word-counter",
    title: "Word & Character Counter",
    short: "Words, characters & reading time",
    description:
      "Count words, characters, sentences and paragraphs in any text, plus estimated reading time.",
    emoji: "📝",
    category: "Everyday",
    keywords: ["word counter", "character counter", "reading time calculator"],
    related: ["password-generator", "random-number-generator", "gpa-calculator", "calculator"],
  },
  {
    slug: "salary-calculator",
    path: "/salary-calculator",
    title: "Salary / Take-Home Pay Calculator",
    short: "Estimate net pay",
    description:
      "Estimate your take-home pay after federal tax, FICA and a custom state/local tax rate — with a full breakdown.",
    emoji: "💵",
    category: "Financial",
    keywords: ["salary calculator", "take home pay calculator", "net pay calculator", "paycheck calculator"],
    related: ["mortgage-calculator", "compound-interest-calculator", "sales-tax-calculator", "loan-calculator"],
  },
  {
    slug: "body-fat-calculator",
    path: "/body-fat-calculator",
    title: "Body Fat % Calculator",
    short: "US Navy method",
    description:
      "Estimate your body fat percentage using the U.S. Navy circumference method — no special equipment needed.",
    emoji: "💪",
    category: "Health",
    keywords: ["body fat calculator", "body fat percentage", "navy method body fat"],
    related: ["bmi-calculator", "calorie-calculator", "unit-converter", "age-calculator"],
  },
  {
    slug: "fuel-cost-calculator",
    path: "/fuel-cost-calculator",
    title: "Fuel Cost Calculator",
    short: "Trip & fill-up cost",
    description:
      "Calculate the fuel cost of any trip from distance, fuel efficiency and price per gallon or litre.",
    emoji: "⛽",
    category: "Everyday",
    keywords: ["fuel cost calculator", "gas cost calculator", "mpg calculator", "trip cost calculator"],
    related: ["unit-converter", "sales-tax-calculator", "discount-calculator", "calculator"],
  },
  {
    slug: "random-number-generator",
    path: "/random-number-generator",
    title: "Random Number Generator",
    short: "True random integers",
    description:
      "Generate one or many random numbers in any range, with or without duplicates — cryptographically random.",
    emoji: "🎲",
    category: "Everyday",
    keywords: ["random number generator", "rng", "random number picker"],
    related: ["password-generator", "word-counter", "unit-converter", "calculator"],
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
