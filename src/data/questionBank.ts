import { TestQuestion } from '../types';

export const questionBank: TestQuestion[] = [
  // ==========================================
  // TOPIC 1: MIXED NUMBER BY NATURAL (20 QUESTIONS)
  // ==========================================
  {
    id: 'mn_1',
    topic: 'mixedByNatural',
    type: 'multipleChoice',
    prompt: {
      uz: "2 ⅓ × 3 ifodaning qiymatini toping:",
      ru: "Вычислите значение выражения 2 ⅓ × 3:",
      en: "Calculate the value of 2 ⅓ × 3:",
    },
    options: {
      uz: ["7", "6 ⅓", "6", "8 ⅓"],
      ru: ["7", "6 ⅓", "6", "8 ⅓"],
      en: ["7", "6 ⅓", "6", "8 ⅓"],
    },
    correctAnswer: { whole: 7, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "2 ⅓ = 7/3. Keyin 7/3 × 3 = 7. Yoki (2 × 3) + (⅓ × 3) = 6 + 1 = 7.",
      ru: "2 ⅓ = 7/3. Затем 7/3 × 3 = 7. Либо (2 × 3) + (⅓ × 3) = 6 + 1 = 7.",
      en: "2 ⅓ = 7/3. Then 7/3 × 3 = 7. Or (2 × 3) + (⅓ × 3) = 6 + 1 = 7.",
    },
  },
  {
    id: 'mn_2',
    topic: 'mixedByNatural',
    type: 'multipleChoice',
    prompt: {
      uz: "1 ¼ × 4 ko'paytmasi nechaga teng?",
      ru: "Чему равно произведение 1 ¼ × 4?",
      en: "What is the product of 1 ¼ × 4?",
    },
    options: {
      uz: ["5", "4 ¼", "4", "5 ¼"],
      ru: ["5", "4 ¼", "4", "5 ¼"],
      en: ["5", "4 ¼", "4", "5 ¼"],
    },
    correctAnswer: { whole: 5, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "1 ¼ = 5/4. 5/4 × 4 = 5.",
      ru: "1 ¼ = 5/4. 5/4 × 4 = 5.",
      en: "1 ¼ = 5/4. 5/4 × 4 = 5.",
    },
  },
  {
    id: 'mn_3',
    topic: 'mixedByNatural',
    type: 'fractionInput',
    prompt: {
      uz: "2 ⅖ × 2 ko'paytmasini aralash son ko'rinishida yozing:",
      ru: "Запишите произведение 2 ⅖ × 2 в виде смешанного числа:",
      en: "Write the product of 2 ⅖ × 2 as a mixed number:",
    },
    correctAnswer: { whole: 4, num: 4, den: 5 },
    explanation: {
      uz: "2 ⅖ = 12/5. 12/5 × 2 = 24/5 = 4 ⅘.",
      ru: "2 ⅖ = 12/5. 12/5 × 2 = 24/5 = 4 ⅘.",
      en: "2 ⅖ = 12/5. 12/5 × 2 = 24/5 = 4 ⅘.",
    },
  },
  {
    id: 'mn_4',
    topic: 'mixedByNatural',
    type: 'trueFalse',
    prompt: {
      uz: "Mulohaza to'g'rimi: 3 ½ × 2 = 7?",
      ru: "Верно ли утверждение: 3 ½ × 2 = 7?",
      en: "Is the statement true: 3 ½ × 2 = 7?",
    },
    options: {
      uz: ["To'g'ri", "Noto'g'ri"],
      ru: ["Верно", "Неверно"],
      en: ["True", "False"],
    },
    correctAnswer: { boolValue: true, optionIndex: 0, num: 1, den: 1 },
    explanation: {
      uz: "To'g'ri! 3 ½ = 7/2. 7/2 × 2 = 7.",
      ru: "Верно! 3 ½ = 7/2. 7/2 × 2 = 7.",
      en: "True! 3 ½ = 7/2. 7/2 × 2 = 7.",
    },
  },
  {
    id: 'mn_5',
    topic: 'mixedByNatural',
    type: 'multipleChoice',
    prompt: {
      uz: "1 ⅔ × 5 ifodani hisoblang:",
      ru: "Вычислите 1 ⅔ × 5:",
      en: "Calculate 1 ⅔ × 5:",
    },
    options: {
      uz: ["8 ⅓", "5 ⅔", "7 ⅔", "6 ⅓"],
      ru: ["8 ⅓", "5 ⅔", "7 ⅔", "6 ⅓"],
      en: ["8 ⅓", "5 ⅔", "7 ⅔", "6 ⅓"],
    },
    correctAnswer: { whole: 8, num: 1, den: 3, optionIndex: 0 },
    explanation: {
      uz: "1 ⅔ = 5/3. 5/3 × 5 = 25/3 = 8 ⅓.",
      ru: "1 ⅔ = 5/3. 5/3 × 5 = 25/3 = 8 ⅓.",
      en: "1 ⅔ = 5/3. 5/3 × 5 = 25/3 = 8 ⅓.",
    },
  },
  {
    id: 'mn_6',
    topic: 'mixedByNatural',
    type: 'fractionInput',
    prompt: {
      uz: "3 ⅛ × 4 ifodani aralash son ko'rinishida yozing:",
      ru: "Запишите 3 ⅛ × 4 в виде смешанного числа:",
      en: "Write 3 ⅛ × 4 as a mixed number:",
    },
    correctAnswer: { whole: 12, num: 1, den: 2 },
    explanation: {
      uz: "3 ⅛ = 25/8. 25/8 × 4 = 25/2 = 12 ½.",
      ru: "3 ⅛ = 25/8. 25/8 × 4 = 25/2 = 12 ½.",
      en: "3 ⅛ = 25/8. 25/8 × 4 = 25/2 = 12 ½.",
    },
  },
  {
    id: 'mn_7',
    topic: 'mixedByNatural',
    type: 'multipleChoice',
    prompt: {
      uz: "2 ⅝ × 8 ko'paytma nimaga teng?",
      ru: "Чему равно произведение 2 ⅝ × 8?",
      en: "What does 2 ⅝ × 8 equal?",
    },
    options: {
      uz: ["21", "16 ⅝", "20", "24"],
      ru: ["21", "16 ⅝", "20", "24"],
      en: ["21", "16 ⅝", "20", "24"],
    },
    correctAnswer: { whole: 21, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "2 ⅝ = 21/8. 21/8 × 8 = 21.",
      ru: "2 ⅝ = 21/8. 21/8 × 8 = 21.",
      en: "2 ⅝ = 21/8. 21/8 × 8 = 21.",
    },
  },
  {
    id: 'mn_8',
    topic: 'mixedByNatural',
    type: 'trueFalse',
    prompt: {
      uz: "Aralash sonni natural songa ko'paytirganda faqat butun qism ko'paytiriladi. Bu qoida to'g'rimi?",
      ru: "При умножении смешанного числа на натуральное умножается только целая часть. Это верно?",
      en: "When multiplying a mixed number by a whole number, only the whole part is multiplied. Is this true?",
    },
    options: {
      uz: ["To'g'ri", "Noto'g'ri (kasr qism ham ko'paytiriladi)"],
      ru: ["Верно", "Неверно (дробная часть тоже умножается)"],
      en: ["True", "False (fraction part must also be multiplied)"],
    },
    correctAnswer: { boolValue: false, optionIndex: 1, num: 0, den: 1 },
    explanation: {
      uz: "Noto'g'ri! Kasr qismi ham albatta natural songa ko'paytirilishi shart.",
      ru: "Неверно! Дробная часть тоже обязательно умножается.",
      en: "False! The fractional part must also be multiplied by the natural number.",
    },
  },
  {
    id: 'mn_9',
    topic: 'mixedByNatural',
    type: 'multipleChoice',
    prompt: {
      uz: "4 ⅓ × 6 ning qiymatini toping:",
      ru: "Найдите значение 4 ⅓ × 6:",
      en: "Find the value of 4 ⅓ × 6:",
    },
    options: {
      uz: ["26", "24 ⅓", "25", "28"],
      ru: ["26", "24 ⅓", "25", "28"],
      en: ["26", "24 ⅓", "25", "28"],
    },
    correctAnswer: { whole: 26, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "(4 × 6) + (⅓ × 6) = 24 + 2 = 26.",
      ru: "(4 × 6) + (⅓ × 6) = 24 + 2 = 26.",
      en: "(4 × 6) + (⅓ × 6) = 24 + 2 = 26.",
    },
  },
  {
    id: 'mn_10',
    topic: 'mixedByNatural',
    type: 'fractionInput',
    prompt: {
      uz: "1 ⅗ × 3 ko'paytmasini aralash son shaklida kiriting:",
      ru: "Введи 1 ⅗ × 3 в виде смешанного числа:",
      en: "Enter 1 ⅗ × 3 as a mixed number:",
    },
    correctAnswer: { whole: 4, num: 4, den: 5 },
    explanation: {
      uz: "1 ⅗ = 8/5. 8/5 × 3 = 24/5 = 4 ⅘.",
      ru: "1 ⅗ = 8/5. 8/5 × 3 = 24/5 = 4 ⅘.",
      en: "1 ⅗ = 8/5. 8/5 × 3 = 24/5 = 4 ⅘.",
    },
  },
  {
    id: 'mn_11',
    topic: 'mixedByNatural',
    type: 'multipleChoice',
    prompt: {
      uz: "3 ¾ × 4 ko'paytmasini hisoblang:",
      ru: "Вычислите 3 ¾ × 4:",
      en: "Calculate 3 ¾ × 4:",
    },
    options: {
      uz: ["15", "12 ¾", "14", "16"],
      ru: ["15", "12 ¾", "14", "16"],
      en: ["15", "12 ¾", "14", "16"],
    },
    correctAnswer: { whole: 15, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "3 ¾ = 15/4. 15/4 × 4 = 15.",
      ru: "3 ¾ = 15/4. 15/4 × 4 = 15.",
      en: "3 ¾ = 15/4. 15/4 × 4 = 15.",
    },
  },
  {
    id: 'mn_12',
    topic: 'mixedByNatural',
    type: 'fractionInput',
    prompt: {
      uz: "2 ⅙ × 5 ko'paytmasini aralash son ko'rinishida yozing:",
      ru: "Запишите 2 ⅙ × 5 в виде смешанного числа:",
      en: "Write 2 ⅙ × 5 as a mixed number:",
    },
    correctAnswer: { whole: 10, num: 5, den: 6 },
    explanation: {
      uz: "2 ⅙ = 13/6. 13/6 × 5 = 65/6 = 10 ⅚.",
      ru: "2 ⅙ = 13/6. 13/6 × 5 = 65/6 = 10 ⅚.",
      en: "2 ⅙ = 13/6. 13/6 × 5 = 65/6 = 10 ⅚.",
    },
  },
  {
    id: 'mn_13',
    topic: 'mixedByNatural',
    type: 'multipleChoice',
    prompt: {
      uz: "5 ½ × 4 ning javobi:",
      ru: "Ответ для 5 ½ × 4:",
      en: "Answer for 5 ½ × 4:",
    },
    options: {
      uz: ["22", "20 ½", "21", "24"],
      ru: ["22", "20 ½", "21", "24"],
      en: ["22", "20 ½", "21", "24"],
    },
    correctAnswer: { whole: 22, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "5 ½ = 11/2. 11/2 × 4 = 22.",
      ru: "5 ½ = 11/2. 11/2 × 4 = 22.",
      en: "5 ½ = 11/2. 11/2 × 4 = 22.",
    },
  },
  {
    id: 'mn_14',
    topic: 'mixedByNatural',
    type: 'trueFalse',
    prompt: {
      uz: "Taqsimot qonuni: 2 ⅓ × 6 = (2 × 6) + (⅓ × 6) = 12 + 2 = 14. To'g'rimi?",
      ru: "Распределительное свойство: 2 ⅓ × 6 = (2 × 6) + (⅓ × 6) = 14. Верно?",
      en: "Distributive property: 2 ⅓ × 6 = (2 × 6) + (⅓ × 6) = 14. Is this correct?",
    },
    options: {
      uz: ["Ha, to'g'ri", "Yo'q, noto'g'ri"],
      ru: ["Да, верно", "Нет, неверно"],
      en: ["Yes, correct", "No, incorrect"],
    },
    correctAnswer: { boolValue: true, optionIndex: 0, num: 1, den: 1 },
    explanation: {
      uz: "Aynan to'g'ri! Bu taqsimot qonunining namunali qo'llanishi.",
      ru: "Абсолютно верно! Образцовое применение распределительного свойства.",
      en: "Exactly right! A perfect use of the distributive property.",
    },
  },
  {
    id: 'mn_15',
    topic: 'mixedByNatural',
    type: 'multipleChoice',
    prompt: {
      uz: "1 ⅞ × 8 ko'paytmasi:",
      ru: "Произведение 1 ⅞ × 8:",
      en: "Product of 1 ⅞ × 8:",
    },
    options: {
      uz: ["15", "8 ⅞", "16", "14"],
      ru: ["15", "8 ⅞", "16", "14"],
      en: ["15", "8 ⅞", "16", "14"],
    },
    correctAnswer: { whole: 15, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "1 ⅞ = 15/8. 15/8 × 8 = 15.",
      ru: "1 ⅞ = 15/8. 15/8 × 8 = 15.",
      en: "1 ⅞ = 15/8. 15/8 × 8 = 15.",
    },
  },
  {
    id: 'mn_16',
    topic: 'mixedByNatural',
    type: 'fractionInput',
    prompt: {
      uz: "2 ⅔ × 2 ko'paytmasini aralash son ko'rinishida yozing:",
      ru: "Запишите 2 ⅔ × 2 в виде смешанного числа:",
      en: "Write 2 ⅔ × 2 as a mixed number:",
    },
    correctAnswer: { whole: 5, num: 1, den: 3 },
    explanation: {
      uz: "2 ⅔ = 8/3. 8/3 × 2 = 16/3 = 5 ⅓.",
      ru: "2 ⅔ = 8/3. 8/3 × 2 = 16/3 = 5 ⅓.",
      en: "2 ⅔ = 8/3. 8/3 × 2 = 16/3 = 5 ⅓.",
    },
  },
  {
    id: 'mn_17',
    topic: 'mixedByNatural',
    type: 'multipleChoice',
    prompt: {
      uz: "3 ⅖ × 5 ko'paytmasining qiymati:",
      ru: "Значение выражения 3 ⅖ × 5:",
      en: "Value of expression 3 ⅖ × 5:",
    },
    options: {
      uz: ["17", "15 ⅖", "18", "16"],
      ru: ["17", "15 ⅖", "18", "16"],
      en: ["17", "15 ⅖", "18", "16"],
    },
    correctAnswer: { whole: 17, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "3 ⅖ = 17/5. 17/5 × 5 = 17.",
      ru: "3 ⅖ = 17/5. 17/5 × 5 = 17.",
      en: "3 ⅖ = 17/5. 17/5 × 5 = 17.",
    },
  },
  {
    id: 'mn_18',
    topic: 'mixedByNatural',
    type: 'fractionInput',
    prompt: {
      uz: "1 ⅗ × 2 ning javobini aralash son shaklida yozing:",
      ru: "Запишите 1 ⅗ × 2 в виде смешанного числа:",
      en: "Write 1 ⅗ × 2 as a mixed number:",
    },
    correctAnswer: { whole: 3, num: 1, den: 5 },
    explanation: {
      uz: "1 ⅗ = 8/5. 8/5 × 2 = 16/5 = 3 ⅕.",
      ru: "1 ⅗ = 8/5. 8/5 × 2 = 16/5 = 3 ⅕.",
      en: "1 ⅗ = 8/5. 8/5 × 2 = 16/5 = 3 ⅕.",
    },
  },
  {
    id: 'mn_19',
    topic: 'mixedByNatural',
    type: 'multipleChoice',
    prompt: {
      uz: "6 ⅓ × 3 ko'paytmasi nechaga teng?",
      ru: "Чему равно 6 ⅓ × 3?",
      en: "What does 6 ⅓ × 3 equal?",
    },
    options: {
      uz: ["19", "18 ⅓", "18", "21"],
      ru: ["19", "18 ⅓", "18", "21"],
      en: ["19", "18 ⅓", "18", "21"],
    },
    correctAnswer: { whole: 19, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "(6 × 3) + (⅓ × 3) = 18 + 1 = 19.",
      ru: "(6 × 3) + (⅓ × 3) = 18 + 1 = 19.",
      en: "(6 × 3) + (⅓ × 3) = 18 + 1 = 19.",
    },
  },
  {
    id: 'mn_20',
    topic: 'mixedByNatural',
    type: 'trueFalse',
    prompt: {
      uz: "1 ⅔ × 3 = 5 tenglik to'g'rimi?",
      ru: "Верно ли равенство 1 ⅔ × 3 = 5?",
      en: "Is the equation 1 ⅔ × 3 = 5 true?",
    },
    options: {
      uz: ["To'g'ri", "Noto'g'ri"],
      ru: ["Верно", "Неверно"],
      en: ["True", "False"],
    },
    correctAnswer: { boolValue: true, optionIndex: 0, num: 1, den: 1 },
    explanation: {
      uz: "To'g'ri: 1 ⅔ = 5/3, 5/3 × 3 = 5.",
      ru: "Верно: 1 ⅔ = 5/3, 5/3 × 3 = 5.",
      en: "True: 1 ⅔ = 5/3, 5/3 × 3 = 5.",
    },
  },

  // ==========================================
  // TOPIC 2: FRACTION MULTIPLICATION (20 QUESTIONS)
  // ==========================================
  {
    id: 'fm_1',
    topic: 'fractionMultiplication',
    type: 'multipleChoice',
    prompt: {
      uz: "½ × ⅔ ko'paytmasini hisoblang va qisqartiring:",
      ru: "Вычислите ½ × ⅔ и сократите дробь:",
      en: "Calculate ½ × ⅔ and simplify:",
    },
    options: {
      uz: ["⅓", "2/6", "2/5", "1/6"],
      ru: ["⅓", "2/6", "2/5", "1/6"],
      en: ["⅓", "2/6", "2/5", "1/6"],
    },
    correctAnswer: { whole: 0, num: 1, den: 3, optionIndex: 0 },
    explanation: {
      uz: "(1 × 2)/(2 × 3) = 2/6 = ⅓. 2 lar o'zaro qisqaradi.",
      ru: "(1 × 2)/(2 × 3) = 2/6 = ⅓. Двойки сокращаются.",
      en: "(1 × 2)/(2 × 3) = 2/6 = ⅓. 2s cross-cancel.",
    },
  },
  {
    id: 'fm_2',
    topic: 'fractionMultiplication',
    type: 'fractionInput',
    prompt: {
      uz: "¾ × ⅘ ko'paytmasini eng sodda (qisqartirilgan) kasr shaklida kiriting:",
      ru: "Введи ¾ × ⅘ в виде несократимой дроби:",
      en: "Enter ¾ × ⅘ as a simplified fraction:",
    },
    correctAnswer: { whole: 0, num: 3, den: 5 },
    explanation: {
      uz: "(3 × 4)/(4 × 5). 4 lar o'zaro qisqarib ketadi, natija: ⅗.",
      ru: "(3 × 4)/(4 × 5). Четвёрки сокращаются, результат: ⅗.",
      en: "(3 × 4)/(4 × 5). 4s cancel diagonally, leaving ⅗.",
    },
  },
  {
    id: 'fm_3',
    topic: 'fractionMultiplication',
    type: 'multipleChoice',
    prompt: {
      uz: "3/7 × 7/9 ko'paytmasining qisqargan shakli:",
      ru: "Сокращённый результат произведения 3/7 × 7/9:",
      en: "Simplified product of 3/7 × 7/9:",
    },
    options: {
      uz: ["⅓", "3/9", "7/21", "21/63"],
      ru: ["⅓", "3/9", "7/21", "21/63"],
      en: ["⅓", "3/9", "7/21", "21/63"],
    },
    correctAnswer: { whole: 0, num: 1, den: 3, optionIndex: 0 },
    explanation: {
      uz: "7 lar qisqaradi, 3 va 9 qisqarib 1/3 qoladi.",
      ru: "7 сокращаются, 3 и 9 сокращаются на 3, остаётся ⅓.",
      en: "7s cancel out, 3 and 9 simplify to ⅓.",
    },
  },
  {
    id: 'fm_4',
    topic: 'fractionMultiplication',
    type: 'trueFalse',
    prompt: {
      uz: "Kasrlarni ko'paytirganda maxrajlar qo'shiladi. Bu to'g'rimi?",
      ru: "При умножении дробей знаменатели складываются. Это верно?",
      en: "When multiplying fractions, denominators are added. Is this true?",
    },
    options: {
      uz: ["Noto'g'ri (maxrajlar ham ko'paytiriladi)", "To'g'ri"],
      ru: ["Неверно (знаменатели перемножаются)", "Верно"],
      en: ["False (denominators are multiplied)", "True"],
    },
    correctAnswer: { boolValue: false, optionIndex: 0, num: 0, den: 1 },
    explanation: {
      uz: "Noto'g'ri! Kasrlarni ko'paytirishda maxrajlar o'zaro ko'paytiriladi: (a/b) × (c/d) = (a·c)/(b·d).",
      ru: "Неверно! Знаменатели перемножаются: (a/b) × (c/d) = (a·c)/(b·d).",
      en: "False! Denominators are multiplied: (a/b) × (c/d) = (a·c)/(b·d).",
    },
  },
  {
    id: 'fm_5',
    topic: 'fractionMultiplication',
    type: 'multipleChoice',
    prompt: {
      uz: "5/6 × 2/5 ko'paytmasi:",
      ru: "Произведение 5/6 × 2/5:",
      en: "Product of 5/6 × 2/5:",
    },
    options: {
      uz: ["⅓", "10/30", "1/6", "2/6"],
      ru: ["⅓", "10/30", "1/6", "2/6"],
      en: ["⅓", "10/30", "1/6", "2/6"],
    },
    correctAnswer: { whole: 0, num: 1, den: 3, optionIndex: 0 },
    explanation: {
      uz: "5 lar qisqaradi, 2/6 = ⅓.",
      ru: "5 сокращаются, 2/6 = ⅓.",
      en: "5s cancel, 2/6 = ⅓.",
    },
  },
  {
    id: 'fm_6',
    topic: 'fractionMultiplication',
    type: 'fractionInput',
    prompt: {
      uz: "2/3 × 3/8 ko'paytmasini eng sodda kasr shaklida yozing:",
      ru: "Запишите 2/3 × 3/8 в виде несократимой дроби:",
      en: "Write 2/3 × 3/8 as a simplified fraction:",
    },
    correctAnswer: { whole: 0, num: 1, den: 4 },
    explanation: {
      uz: "3 lar qisqaradi, 2 va 8 qisqarib 1/4 bo'ladi.",
      ru: "3 сокращаются, 2 и 8 сокращаются до 1/4.",
      en: "3s cancel, 2 and 8 reduce to 1/4.",
    },
  },
  {
    id: 'fm_7',
    topic: 'fractionMultiplication',
    type: 'multipleChoice',
    prompt: {
      uz: "7/5 × 10/3 noto'g'ri kasrlarni ko'paytiring va aralash songa aylantiring:",
      ru: "Перемножьте 7/5 × 10/3 и переведите в смешанное число:",
      en: "Multiply 7/5 × 10/3 and convert to mixed number:",
    },
    options: {
      uz: ["4 ⅔", "14/3", "4 ⅓", "5 ⅔"],
      ru: ["4 ⅔", "14/3", "4 ⅓", "5 ⅔"],
      en: ["4 ⅔", "14/3", "4 ⅓", "5 ⅔"],
    },
    correctAnswer: { whole: 4, num: 2, den: 3, optionIndex: 0 },
    explanation: {
      uz: "5 va 10 qisqarib 2 bo'ladi: (7 × 2)/3 = 14/3 = 4 ⅔.",
      ru: "5 и 10 сокращаются на 5 (остаётся 2): (7 × 2)/3 = 14/3 = 4 ⅔.",
      en: "5 and 10 reduce to 2: (7 × 2)/3 = 14/3 = 4 ⅔.",
    },
  },
  {
    id: 'fm_8',
    topic: 'fractionMultiplication',
    type: 'multipleChoice',
    prompt: {
      uz: "4/9 × 3/8 ko'paytmasi qisqartirilgach:",
      ru: "4/9 × 3/8 после сокращения:",
      en: "4/9 × 3/8 after simplification:",
    },
    options: {
      uz: ["⅙", "12/72", "1/8", "2/9"],
      ru: ["⅙", "12/72", "1/8", "2/9"],
      en: ["⅙", "12/72", "1/8", "2/9"],
    },
    correctAnswer: { whole: 0, num: 1, den: 6, optionIndex: 0 },
    explanation: {
      uz: "4 va 8 qisqarib 1 va 2, 3 va 9 qisqarib 1 va 3: (1 × 1)/(3 × 2) = ⅙.",
      ru: "4 и 8 сокращаются (1 и 2), 3 и 9 (1 и 3): (1 × 1)/(3 × 2) = ⅙.",
      en: "4 and 8 cancel to 1 and 2, 3 and 9 cancel to 1 and 3: 1/6.",
    },
  },
  {
    id: 'fm_9',
    topic: 'fractionMultiplication',
    type: 'fractionInput',
    prompt: {
      uz: "5/12 × 4/15 ko'paytmasini qisqartirilgan kasr shaklida kiriting:",
      ru: "Введи 5/12 × 4/15 в виде несократимой дроби:",
      en: "Enter 5/12 × 4/15 in simplest fractional form:",
    },
    correctAnswer: { whole: 0, num: 1, den: 9 },
    explanation: {
      uz: "5 va 15 qisqaradi (1 va 3), 4 va 12 qisqaradi (1 va 3): (1 × 1)/(3 × 3) = 1/9.",
      ru: "5 и 15 сокращаются на 5, 4 и 12 на 4: (1 × 1)/(3 × 3) = 1/9.",
      en: "5 and 15 reduce by 5, 4 and 12 reduce by 4: (1 × 1)/(3 × 3) = 1/9.",
    },
  },
  {
    id: 'fm_10',
    topic: 'fractionMultiplication',
    type: 'trueFalse',
    prompt: {
      uz: "Ko'paytirishdan oldin o'zaro qisqartirish natijani o'zgartirmaydi, lekin hisoblashni osonlashtiradi. To'g'rimi?",
      ru: "Перекрёстное сокращение ДО умножения не меняет результат, а лишь облегчает вычисления. Верно?",
      en: "Cross-cancellation BEFORE multiplication does not change the result, but makes calculation easier. True?",
    },
    options: {
      uz: ["To'g'ri", "Noto'g'ri"],
      ru: ["Верно", "Неверно"],
      en: ["True", "False"],
    },
    correctAnswer: { boolValue: true, optionIndex: 0, num: 1, den: 1 },
    explanation: {
      uz: "To'g'ri! Oldindan qisqartirish katta sonlar bilan ishlashning oldini oladi.",
      ru: "Верно! Сокращение заранее бережёт от громоздких вычислений.",
      en: "True! Cross-cancelling prevents dealing with unnecessarily large numbers.",
    },
  },
  {
    id: 'fm_11',
    topic: 'fractionMultiplication',
    type: 'multipleChoice',
    prompt: {
      uz: "1/4 × 2/3 ko'paytmasi:",
      ru: "Произведение 1/4 × 2/3:",
      en: "Product of 1/4 × 2/3:",
    },
    options: {
      uz: ["⅙", "2/12", "1/12", "3/7"],
      ru: ["⅙", "2/12", "1/12", "3/7"],
      en: ["⅙", "2/12", "1/12", "3/7"],
    },
    correctAnswer: { whole: 0, num: 1, den: 6, optionIndex: 0 },
    explanation: {
      uz: "(1 × 2)/(4 × 3) = 2/12 = ⅙.",
      ru: "(1 × 2)/(4 × 3) = 2/12 = ⅙.",
      en: "(1 × 2)/(4 × 3) = 2/12 = ⅙.",
    },
  },
  {
    id: 'fm_12',
    topic: 'fractionMultiplication',
    type: 'fractionInput',
    prompt: {
      uz: "3/10 × 5/6 ko'paytmasini eng sodda shaklda yozing:",
      ru: "Запишите 3/10 × 5/6 в несократимом виде:",
      en: "Write 3/10 × 5/6 in simplest form:",
    },
    correctAnswer: { whole: 0, num: 1, den: 4 },
    explanation: {
      uz: "3 va 6 qisqarib 1 va 2, 5 va 10 qisqarib 1 va 2: (1 × 1)/(2 × 2) = 1/4.",
      ru: "3 и 6 на 3, 5 и 10 на 5: 1/4.",
      en: "3 and 6 by 3, 5 and 10 by 5: 1/4.",
    },
  },
  {
    id: 'fm_13',
    topic: 'fractionMultiplication',
    type: 'multipleChoice',
    prompt: {
      uz: "8/15 × 5/16 ko'paytmasi:",
      ru: "8/15 × 5/16 равно:",
      en: "8/15 × 5/16 equals:",
    },
    options: {
      uz: ["⅙", "1/8", "40/240", "1/12"],
      ru: ["⅙", "1/8", "40/240", "1/12"],
      en: ["⅙", "1/8", "40/240", "1/12"],
    },
    correctAnswer: { whole: 0, num: 1, den: 6, optionIndex: 0 },
    explanation: {
      uz: "8 va 16 qisqaradi (1 va 2), 5 va 15 qisqaradi (1 va 3): 1/6.",
      ru: "8 и 16 сокращаются (1 и 2), 5 и 15 (1 и 3): 1/6.",
      en: "8 and 16 cancel to 1 and 2, 5 and 15 cancel to 1 and 3: 1/6.",
    },
  },
  {
    id: 'fm_14',
    topic: 'fractionMultiplication',
    type: 'trueFalse',
    prompt: {
      uz: "Har qanday kasrni 1 ga ko'paytirganda kasrning o'zi hosil bo'ladi. To'g'rimi?",
      ru: "При умножении любой дроби на 1 получается эта же дробь. Верно?",
      en: "Multiplying any fraction by 1 yields the same fraction. True?",
    },
    options: {
      uz: ["To'g'ri", "Noto'g'ri"],
      ru: ["Верно", "Неверно"],
      en: ["True", "False"],
    },
    correctAnswer: { boolValue: true, optionIndex: 0, num: 1, den: 1 },
    explanation: {
      uz: "To'g'ri! 1 soni ko'paytirishda neytral element hisoblanadi.",
      ru: "Верно! Единица — нейтральный элемент умножения.",
      en: "True! 1 is the multiplicative identity element.",
    },
  },
  {
    id: 'fm_15',
    topic: 'fractionMultiplication',
    type: 'multipleChoice',
    prompt: {
      uz: "2/7 × 7/2 ko'paytmasi nechaga teng?",
      ru: "Чему равно 2/7 × 7/2?",
      en: "What does 2/7 × 7/2 equal?",
    },
    options: {
      uz: ["1", "4/49", "14/14 emas, 0", "2"],
      ru: ["1", "4/49", "0", "2"],
      en: ["1", "4/49", "0", "2"],
    },
    correctAnswer: { whole: 1, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "O'zaro teskari sonlar ko'paytmasi har doim 1 ga teng: (2 × 7)/(7 × 2) = 1.",
      ru: "Произведение взаимно обратных чисел всегда равно 1: (2 × 7)/(7 × 2) = 1.",
      en: "The product of reciprocal numbers is always 1.",
    },
  },
  {
    id: 'fm_16',
    topic: 'fractionMultiplication',
    type: 'fractionInput',
    prompt: {
      uz: "7/8 × 4/7 ko'paytmasini eng sodda kasr shaklida yozing:",
      ru: "Запишите 7/8 × 4/7 в несократимом виде:",
      en: "Write 7/8 × 4/7 in simplest form:",
    },
    correctAnswer: { whole: 0, num: 1, den: 2 },
    explanation: {
      uz: "7 lar qisqaradi, 4 va 8 qisqarib 1/2 bo'ladi.",
      ru: "7 сокращаются, 4 и 8 дают 1/2.",
      en: "7s cancel, 4 and 8 reduce to 1/2.",
    },
  },
  {
    id: 'fm_17',
    topic: 'fractionMultiplication',
    type: 'multipleChoice',
    prompt: {
      uz: "3/5 × 0 ko'paytmasi nechaga teng?",
      ru: "Чему равно 3/5 × 0?",
      en: "What does 3/5 × 0 equal?",
    },
    options: {
      uz: ["0", "3/5", "1", "0/5 emas, mavjud emas"],
      ru: ["0", "3/5", "1", "Не существует"],
      en: ["0", "3/5", "1", "Undefined"],
    },
    correctAnswer: { whole: 0, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "Har qanday sonni 0 ga ko'paytirganda 0 hosil bo'ladi.",
      ru: "При умножении любого числа на 0 получается 0.",
      en: "Multiplying any number by 0 gives 0.",
    },
  },
  {
    id: 'fm_18',
    topic: 'fractionMultiplication',
    type: 'fractionInput',
    prompt: {
      uz: "9/10 × 5/18 ko'paytmasini qisqartirilgan kasr shaklida yozing:",
      ru: "Запишите 9/10 × 5/18 в виде несократимой дроби:",
      en: "Write 9/10 × 5/18 in simplest fractional form:",
    },
    correctAnswer: { whole: 0, num: 1, den: 4 },
    explanation: {
      uz: "9 va 18 qisqaradi (1 va 2), 5 va 10 qisqaradi (1 va 2): 1/4.",
      ru: "9 и 18 на 9, 5 и 10 на 5: 1/4.",
      en: "9 and 18 cancel to 1 and 2, 5 and 10 to 1 and 2: 1/4.",
    },
  },
  {
    id: 'fm_19',
    topic: 'fractionMultiplication',
    type: 'multipleChoice',
    prompt: {
      uz: "4/5 × 15/16 ko'paytmasi:",
      ru: "Произведение 4/5 × 15/16:",
      en: "Product of 4/5 × 15/16:",
    },
    options: {
      uz: ["¾", "60/80", "4/5", "5/4"],
      ru: ["¾", "60/80", "4/5", "5/4"],
      en: ["¾", "60/80", "4/5", "5/4"],
    },
    correctAnswer: { whole: 0, num: 3, den: 4, optionIndex: 0 },
    explanation: {
      uz: "4 va 16 qisqarib 1 va 4, 15 va 5 qisqarib 3 va 1: ¾.",
      ru: "4 и 16 на 4, 15 и 5 на 5: ¾.",
      en: "4 and 16 simplify to 1 and 4, 15 and 5 to 3 and 1: ¾.",
    },
  },
  {
    id: 'fm_20',
    topic: 'fractionMultiplication',
    type: 'trueFalse',
    prompt: {
      uz: "Ikki to'g'ri kasrning ko'paytmasi har doim to'g'ri kasr bo'ladi. To'g'rimi?",
      ru: "Произведение двух правильных дробей всегда является правильной дробью. Верно?",
      en: "The product of two proper fractions is always a proper fraction. True?",
    },
    options: {
      uz: ["To'g'ri", "Noto'g'ri"],
      ru: ["Верно", "Неверно"],
      en: ["True", "False"],
    },
    correctAnswer: { boolValue: true, optionIndex: 0, num: 1, den: 1 },
    explanation: {
      uz: "To'g'ri! Chunki ikkala son ham 1 dan kichik bo'lsa, ularning ko'paytmasi ham albatta 1 dan kichik bo'ladi.",
      ru: "Верно! Произведение двух положительных чисел меньше 1 всегда меньше 1.",
      en: "True! Since both are less than 1, their product is strictly less than 1.",
    },
  },

  // ==========================================
  // TOPIC 3: WORD PROBLEMS & FRACTION OF NUMBER (20 QUESTIONS)
  // ==========================================
  {
    id: 'wp_1',
    topic: 'wordProblems',
    type: 'multipleChoice',
    prompt: {
      uz: "24 ning ⅜ qismini toping:",
      ru: "Найдите ⅜ от числа 24:",
      en: "Find ⅜ of the number 24:",
    },
    options: {
      uz: ["9", "8", "12", "6"],
      ru: ["9", "8", "12", "6"],
      en: ["9", "8", "12", "6"],
    },
    correctAnswer: { whole: 9, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "24 × ⅜ = (24 × 3)/8 = 3 × 3 = 9.",
      ru: "24 × ⅜ = (24 × 3)/8 = 3 × 3 = 9.",
      en: "24 × ⅜ = (24 × 3)/8 = 3 × 3 = 9.",
    },
  },
  {
    id: 'wp_2',
    topic: 'wordProblems',
    type: 'fractionInput',
    prompt: {
      uz: "Kitob 120 sahifadan iborat. Jasur kitobning ⅗ qismini o'qib bo'ldi. U necha sahifa o'qigan?",
      ru: "В книге 120 страниц. Жасур прочитал ⅗ книги. Сколько страниц он прочитал?",
      en: "A book has 120 pages. Jasur has read ⅗ of it. How many pages has he read?",
    },
    correctAnswer: { whole: 72, num: 0, den: 1 },
    explanation: {
      uz: "120 × ⅗ = (120 × 3)/5 = 24 × 3 = 72 sahifa.",
      ru: "120 × ⅗ = (120 × 3)/5 = 72 страницы.",
      en: "120 × ⅗ = (120 × 3)/5 = 72 pages.",
    },
  },
  {
    id: 'wp_3',
    topic: 'wordProblems',
    type: 'multipleChoice',
    prompt: {
      uz: "Bitta kostyum tikish uchun 2 ½ metr mato ketadi. 6 ta shunday kostyum uchun necha metr mato kerak?",
      ru: "На один костюм уходит 2 ½ метра ткани. Сколько метров ткани нужно на 6 таких костюмов?",
      en: "One suit requires 2 ½ meters of fabric. How many meters are needed for 6 suits?",
    },
    options: {
      uz: ["15 metr", "12 metr", "14 metr", "18 metr"],
      ru: ["15 метров", "12 метров", "14 метров", "18 метров"],
      en: ["15 meters", "12 meters", "14 meters", "18 meters"],
    },
    correctAnswer: { whole: 15, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "2 ½ × 6 = 5/2 × 6 = (5 × 6)/2 = 30/2 = 15 metr mato.",
      ru: "2 ½ × 6 = 5/2 × 6 = 15 метров ткани.",
      en: "2 ½ × 6 = 5/2 × 6 = 15 meters of fabric.",
    },
  },
  {
    id: 'wp_4',
    topic: 'wordProblems',
    type: 'multipleChoice',
    prompt: {
      uz: "Po'lat simning uzunligi 40 metr. Uning ¾ qismi kesib olindi. Necha metr sim kesib olingan?",
      ru: "Длина проволоки 40 метров. Отрезали ¾ её длины. Сколько метров отрезали?",
      en: "A wire is 40 meters long. ¾ of it was cut off. How many meters were cut?",
    },
    options: {
      uz: ["30 metr", "10 metr", "25 metr", "20 metr"],
      ru: ["30 метров", "10 метров", "25 метров", "20 метров"],
      en: ["30 meters", "10 meters", "25 meters", "20 meters"],
    },
    correctAnswer: { whole: 30, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "40 × ¾ = (40 × 3)/4 = 10 × 3 = 30 metr.",
      ru: "40 × ¾ = (40 × 3)/4 = 30 метров.",
      en: "40 × ¾ = (40 × 3)/4 = 30 meters.",
    },
  },
  {
    id: 'wp_5',
    topic: 'wordProblems',
    type: 'fractionInput',
    prompt: {
      uz: "Velosipedchi 1 soatda 12 ½ km yo'l yuradi. U 4 soatda necha km masofani bosib o'tadi?",
      ru: "Велосипедист за 1 час проезжает 12 ½ км. Какое расстояние он проедет за 4 часа?",
      en: "A cyclist travels 12 ½ km per hour. What distance will they cover in 4 hours?",
    },
    correctAnswer: { whole: 50, num: 0, den: 1 },
    explanation: {
      uz: "12 ½ × 4 = 25/2 × 4 = 50 km.",
      ru: "12 ½ × 4 = 25/2 × 4 = 50 км.",
      en: "12 ½ × 4 = 25/2 × 4 = 50 km.",
    },
  },
  {
    id: 'wp_6',
    topic: 'wordProblems',
    type: 'multipleChoice',
    prompt: {
      uz: "Do'konda 48 kg shakar bor edi. Birinchi kuni shakarning ⅜ qismi sotildi. Necha kg shakar sotilgan?",
      ru: "В магазине было 48 кг сахара. В первый день продали ⅜ всего сахара. Сколько кг продано?",
      en: "A store had 48 kg of sugar. On the first day, ⅜ of the sugar was sold. How many kg were sold?",
    },
    options: {
      uz: ["18 kg", "16 kg", "24 kg", "12 kg"],
      ru: ["18 кг", "16 кг", "24 кг", "12 кг"],
      en: ["18 kg", "16 kg", "24 kg", "12 kg"],
    },
    correctAnswer: { whole: 18, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "48 × ⅜ = (48 × 3)/8 = 6 × 3 = 18 kg.",
      ru: "48 × ⅜ = (48 × 3)/8 = 18 кг.",
      en: "48 × ⅜ = (48 × 3)/8 = 18 kg.",
    },
  },
  {
    id: 'wp_7',
    topic: 'wordProblems',
    type: 'multipleChoice',
    prompt: {
      uz: "To'g'ri to'rtburchakning bo'yi 4 ½ sm, eni esa 2 sm. Uning yuzini toping:",
      ru: "Длина прямоугольника 4 ½ см, ширина 2 см. Найдите его площадь:",
      en: "The length of a rectangle is 4 ½ cm and width is 2 cm. Find its area:",
    },
    options: {
      uz: ["9 sm²", "8 sm²", "10 sm²", "6 ½ sm²"],
      ru: ["9 см²", "8 см²", "10 см²", "6 ½ см²"],
      en: ["9 cm²", "8 cm²", "10 cm²", "6 ½ cm²"],
    },
    correctAnswer: { whole: 9, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "S = a × b = 4 ½ × 2 = 9/2 × 2 = 9 sm².",
      ru: "S = a × b = 4 ½ × 2 = 9 см².",
      en: "S = a × b = 4 ½ × 2 = 9 cm².",
    },
  },
  {
    id: 'wp_8',
    topic: 'wordProblems',
    type: 'trueFalse',
    prompt: {
      uz: "60 sonining ⅔ qismi 40 ga teng. Bu to'g'rimi?",
      ru: "⅔ от 60 равны 40. Это верно?",
      en: "⅔ of 60 equals 40. Is this true?",
    },
    options: {
      uz: ["To'g'ri", "Noto'g'ri"],
      ru: ["Верно", "Неверно"],
      en: ["True", "False"],
    },
    correctAnswer: { boolValue: true, optionIndex: 0, num: 1, den: 1 },
    explanation: {
      uz: "To'g'ri! 60 × ⅔ = (60 × 2)/3 = 40.",
      ru: "Верно! 60 × ⅔ = (60 × 2)/3 = 40.",
      en: "True! 60 × ⅔ = (60 × 2)/3 = 40.",
    },
  },
  {
    id: 'wp_9',
    topic: 'wordProblems',
    type: 'multipleChoice',
    prompt: {
      uz: "Sinfdagi 28 o'quvchining 4/7 qismi qizlar. Sinfda nechta qiz bola o'qiydi?",
      ru: "В классе из 28 учеников 4/7 составляют девочки. Сколько девочек в классе?",
      en: "In a class of 28 students, 4/7 are girls. How many girls are there?",
    },
    options: {
      uz: ["16 nafar", "12 nafar", "14 nafar", "18 nafar"],
      ru: ["16 девочек", "12 девочек", "14 девочек", "18 девочек"],
      en: ["16 girls", "12 girls", "14 girls", "18 girls"],
    },
    correctAnswer: { whole: 16, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "28 × 4/7 = (28 × 4)/7 = 4 × 4 = 16 nafar qiz.",
      ru: "28 × 4/7 = 16 девочек.",
      en: "28 × 4/7 = 16 girls.",
    },
  },
  {
    id: 'wp_10',
    topic: 'wordProblems',
    type: 'fractionInput',
    prompt: {
      uz: "Bir qutida 1 ¼ kg konfet bor. 8 ta shunday qutida necha kg konfet bo'ladi?",
      ru: "В одной коробке 1 ¼ кг конфет. Сколько кг конфет в 8 таких коробках?",
      en: "One box holds 1 ¼ kg of candy. How many kg are in 8 such boxes?",
    },
    correctAnswer: { whole: 10, num: 0, den: 1 },
    explanation: {
      uz: "1 ¼ × 8 = 5/4 × 8 = 10 kg konfet.",
      ru: "1 ¼ × 8 = 5/4 × 8 = 10 кг.",
      en: "1 ¼ × 8 = 5/4 × 8 = 10 kg.",
    },
  },
  {
    id: 'wp_11',
    topic: 'wordProblems',
    type: 'multipleChoice',
    prompt: {
      uz: "Avtomobil bakida 50 litr benzin bor edi. Yo'lda uning ⅖ qismi sarflandi. Necha litr benzin sarflangan?",
      ru: "В баке автомобиля было 50 л бензина. Израсходовали ⅖ бака. Сколько литров потрачено?",
      en: "A car fuel tank had 50 liters. ⅖ was consumed on the trip. How many liters were used?",
    },
    options: {
      uz: ["20 litr", "25 litr", "30 litr", "15 litr"],
      ru: ["20 литров", "25 литров", "30 литров", "15 литров"],
      en: ["20 liters", "25 liters", "30 liters", "15 liters"],
    },
    correctAnswer: { whole: 20, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "50 × ⅖ = (50 × 2)/5 = 10 × 2 = 20 litr.",
      ru: "50 × ⅖ = 20 литров.",
      en: "50 × ⅖ = 20 liters.",
    },
  },
  {
    id: 'wp_12',
    topic: 'wordProblems',
    type: 'multipleChoice',
    prompt: {
      uz: "Oila oylik daromadining 3/10 qismini oziq-ovqatga ajratadi. Agar oylik daromad 4 000 000 so'm bo'lsa, oziq-ovqatga qancha so'm ajratiladi?",
      ru: "Семья тратит 3/10 дохода на продукты. При доходе 4 000 000 сумов сколько уходит на продукты?",
      en: "A family allocates 3/10 of their income to food. If income is 4,000,000 UZS, how much goes to food?",
    },
    options: {
      uz: ["1 200 000 so'm", "1 000 000 so'm", "800 000 so'm", "1 500 000 so'm"],
      ru: ["1 200 000 сумов", "1 000 000 сумов", "800 000 сумов", "1 500 000 сумов"],
      en: ["1,200,000 UZS", "1,000,000 UZS", "800,000 UZS", "1,500,000 UZS"],
    },
    correctAnswer: { whole: 1200000, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "4 000 000 × 3/10 = 400 000 × 3 = 1 200 000 so'm.",
      ru: "4 000 000 × 3/10 = 1 200 000 сумов.",
      en: "4,000,000 × 3/10 = 1,200,000 UZS.",
    },
  },
  {
    id: 'wp_13',
    topic: 'wordProblems',
    type: 'fractionInput',
    prompt: {
      uz: "Bog'bon har kuni 2 ⅓ soat daraxtlarni sug'oradi. U 6 kunda jami necha soat sug'oradi?",
      ru: "Садовод поливает сад 2 ⅓ часа в день. Сколько часов он поливает сад за 6 дней?",
      en: "A gardener waters trees for 2 ⅓ hours daily. How many hours total does he water in 6 days?",
    },
    correctAnswer: { whole: 14, num: 0, den: 1 },
    explanation: {
      uz: "2 ⅓ × 6 = 7/3 × 6 = 14 soat.",
      ru: "2 ⅓ × 6 = 7/3 × 6 = 14 часов.",
      en: "2 ⅓ × 6 = 7/3 × 6 = 14 hours.",
    },
  },
  {
    id: 'wp_14',
    topic: 'wordProblems',
    type: 'trueFalse',
    prompt: {
      uz: "Sonning kasr qismini topish uchun berilgan sonni shu kasrga ko'paytirish kerak. Bu qoida to'g'rimi?",
      ru: "Чтобы найти дробь от числа, нужно число умножить на эту дробь. Верно?",
      en: "To find a fraction of a number, multiply the number by the fraction. Is this rule correct?",
    },
    options: {
      uz: ["To'g'ri", "Noto'g'ri"],
      ru: ["Верно", "Неверно"],
      en: ["True", "False"],
    },
    correctAnswer: { boolValue: true, optionIndex: 0, num: 1, den: 1 },
    explanation: {
      uz: "To'g'ri! Bu 5-sinf matematikasining oltin qoidalaridan biridir.",
      ru: "Верно! Это золотое правило курса математики 5 класса.",
      en: "True! One of the fundamental rules of 5th-grade mathematics.",
    },
  },
  {
    id: 'wp_15',
    topic: 'wordProblems',
    type: 'multipleChoice',
    prompt: {
      uz: "Kvadratning tomoni 1 ⅕ sm ga teng. Uning perimetrini toping:",
      ru: "Сторона квадрата равна 1 ⅕ см. Найдите его периметр:",
      en: "The side of a square is 1 ⅕ cm. Find its perimeter:",
    },
    options: {
      uz: ["4 ⅘ sm", "4 sm", "5 ⅕ sm", "3 ⅘ sm"],
      ru: ["4 ⅘ см", "4 см", "5 ⅕ см", "3 ⅘ см"],
      en: ["4 ⅘ cm", "4 cm", "5 ⅕ cm", "3 ⅘ cm"],
    },
    correctAnswer: { whole: 4, num: 4, den: 5, optionIndex: 0 },
    explanation: {
      uz: "P = 4 × a = 4 × 1 ⅕ = 4 × 6/5 = 24/5 = 4 ⅘ sm.",
      ru: "P = 4 × a = 4 × 6/5 = 24/5 = 4 ⅘ см.",
      en: "P = 4 × a = 4 × 6/5 = 24/5 = 4 ⅘ cm.",
    },
  },
  {
    id: 'wp_16',
    topic: 'wordProblems',
    type: 'fractionInput',
    prompt: {
      uz: "Daftar narxi 4 000 so'm. Qalamning narxi daftar narxining ¾ qismiga teng. Qalam necha so'm turadi?",
      ru: "Тетрадь стоит 4000 сумов. Карандаш стоит ¾ цены тетради. Сколько сумов стоит карандаш?",
      en: "A notebook costs 4,000 UZS. A pencil costs ¾ of the notebook's price. How much is the pencil?",
    },
    correctAnswer: { whole: 3000, num: 0, den: 1 },
    explanation: {
      uz: "4 000 × ¾ = (4 000 × 3)/4 = 3 000 so'm.",
      ru: "4 000 × ¾ = 3 000 сумов.",
      en: "4,000 × ¾ = 3,000 UZS.",
    },
  },
  {
    id: 'wp_17',
    topic: 'wordProblems',
    type: 'multipleChoice',
    prompt: {
      uz: "Bir sutkaning ⅜ qismi necha soat bo'ladi? (1 sutka = 24 soat)",
      ru: "Сколько часов составляют ⅜ суток? (1 сутки = 24 часа)",
      en: "How many hours are in ⅜ of a day? (1 day = 24 hours)",
    },
    options: {
      uz: ["9 soat", "8 soat", "12 soat", "6 soat"],
      ru: ["9 часов", "8 часов", "12 часов", "6 часов"],
      en: ["9 hours", "8 hours", "12 hours", "6 hours"],
    },
    correctAnswer: { whole: 9, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "24 × ⅜ = (24 × 3)/8 = 3 × 3 = 9 soat.",
      ru: "24 × ⅜ = 9 часов.",
      en: "24 × ⅜ = 9 hours.",
    },
  },
  {
    id: 'wp_18',
    topic: 'wordProblems',
    type: 'fractionInput',
    prompt: {
      uz: "1 soatning 5/12 qismi necha minutga teng? (1 soat = 60 minut)",
      ru: "Сколько минут составляют 5/12 часа? (1 час = 60 минут)",
      en: "How many minutes are in 5/12 of an hour? (1 hour = 60 minutes)",
    },
    correctAnswer: { whole: 25, num: 0, den: 1 },
    explanation: {
      uz: "60 × 5/12 = (60 × 5)/12 = 5 × 5 = 25 minut.",
      ru: "60 × 5/12 = 25 минут.",
      en: "60 × 5/12 = 25 minutes.",
    },
  },
  {
    id: 'wp_19',
    topic: 'wordProblems',
    type: 'multipleChoice',
    prompt: {
      uz: "Omborda 80 tonna bug'doy bor edi. Undan tegirmonga ⅝ qismi jo'natildi. Tegirmonga necha tonna bug'doy yuborilgan?",
      ru: "На складе было 80 тонн пшеницы. На мельницу отправили ⅝ этого зерна. Сколько тонн отправлено?",
      en: "A warehouse had 80 tons of wheat. ⅝ was sent to the mill. How many tons were sent?",
    },
    options: {
      uz: ["50 tonna", "40 tonna", "48 tonna", "60 tonna"],
      ru: ["50 тонн", "40 тонн", "48 тонн", "60 тонн"],
      en: ["50 tons", "40 tons", "48 tons", "60 tons"],
    },
    correctAnswer: { whole: 50, num: 0, den: 1, optionIndex: 0 },
    explanation: {
      uz: "80 × ⅝ = (80 × 5)/8 = 10 × 5 = 50 tonna.",
      ru: "80 × ⅝ = 50 тонн.",
      en: "80 × ⅝ = 50 tons.",
    },
  },
  {
    id: 'wp_20',
    topic: 'wordProblems',
    type: 'trueFalse',
    prompt: {
      uz: "Bir kilometrning ¾ qismi 750 metrga teng. Bu to'g'rimi? (1 km = 1000 m)",
      ru: "¾ километра равны 750 метрам. Это верно? (1 км = 1000 м)",
      en: "¾ of a kilometer equals 750 meters. Is this true? (1 km = 1000 m)",
    },
    options: {
      uz: ["To'g'ri", "Noto'g'ri"],
      ru: ["Верно", "Неверно"],
      en: ["True", "False"],
    },
    correctAnswer: { boolValue: true, optionIndex: 0, num: 1, den: 1 },
    explanation: {
      uz: "To'g'ri! 1000 × ¾ = (1000 × 3)/4 = 250 × 3 = 750 metr.",
      ru: "Верно! 1000 × ¾ = 750 метров.",
      en: "True! 1000 × ¾ = 750 meters.",
    },
  },
];
