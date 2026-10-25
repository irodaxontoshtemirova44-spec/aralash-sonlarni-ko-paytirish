import { Fraction } from '../types';

/**
 * Computes the Greatest Common Divisor of two integers
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a || 1;
}

/**
 * Computes the Least Common Multiple of two integers
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Simplifies a fraction to lowest terms
 */
export function simplifyFraction(num: number, den: number): { num: number; den: number } {
  if (den === 0) return { num: 0, den: 1 };
  if (num === 0) return { num: 0, den: 1 };
  
  const isNegative = (num < 0) !== (den < 0);
  const absNum = Math.abs(num);
  const absDen = Math.abs(den);
  const common = gcd(absNum, absDen);
  
  return {
    num: (isNegative ? -1 : 1) * (absNum / common),
    den: absDen / common,
  };
}

/**
 * Converts a mixed number to an improper fraction
 */
export function mixedToImproper(whole: number, num: number, den: number): { num: number; den: number } {
  if (den === 0) den = 1;
  const improperNum = whole * den + num;
  return { num: improperNum, den };
}

/**
 * Converts an improper fraction to a mixed number with simplified fraction part
 */
export function improperToMixed(num: number, den: number): { whole: number; num: number; den: number } {
  if (den === 0) return { whole: 0, num: 0, den: 1 };
  const simplified = simplifyFraction(num, den);
  const whole = Math.floor(simplified.num / simplified.den);
  const remNum = simplified.num % simplified.den;
  return {
    whole,
    num: remNum,
    den: simplified.den,
  };
}

/**
 * Returns numeric value of a fraction
 */
export function fractionToDecimal(f: { whole?: number; num: number; den: number }): number {
  const whole = f.whole || 0;
  if (!f.den || f.den === 0) return whole;
  return whole + f.num / f.den;
}

export interface MultiplicationSteps {
  expressionText: string;
  step1: string;
  step2: string;
  step3: string;
  simplifiedImproper: { num: number; den: number };
  mixedResult: { whole: number; num: number; den: number };
  wasCrossCancelled: boolean;
}

/**
 * Multiplies two fractions: (num1/den1) * (num2/den2)
 */
export function multiplyFractions(
  f1: { num: number; den: number },
  f2: { num: number; den: number }
): MultiplicationSteps {
  const rawNum = f1.num * f2.num;
  const rawDen = f1.den * f2.den;
  const simplified = simplifyFraction(rawNum, rawDen);
  const mixed = improperToMixed(rawNum, rawDen);
  
  const gcd1 = gcd(f1.num, f2.den);
  const gcd2 = gcd(f2.num, f1.den);
  const wasCrossCancelled = gcd1 > 1 || gcd2 > 1;

  return {
    expressionText: `${f1.num}/${f1.den} × ${f2.num}/${f2.den}`,
    step1: `(${f1.num} × ${f2.num}) / (${f1.den} × ${f2.den})`,
    step2: `${rawNum}/${rawDen}`,
    step3: simplified.den === 1 ? `${simplified.num}` : `${simplified.num}/${simplified.den}`,
    simplifiedImproper: simplified,
    mixedResult: mixed,
    wasCrossCancelled,
  };
}

export interface MixedByNaturalSteps {
  whole: number;
  num: number;
  den: number;
  natural: number;
  // Method A (convert to improper)
  methodA: {
    improperNum: number;
    improperStep: string;
    multiplyStep: string;
    rawImproper: { num: number; den: number };
    simplifiedImproper: { num: number; den: number };
    finalMixed: { whole: number; num: number; den: number };
  };
  // Method B (distributive)
  methodB: {
    wholeProd: number;
    fracNum: number;
    fracStep: string;
    convertedFracMixed: { whole: number; num: number; den: number };
    finalMixed: { whole: number; num: number; den: number };
  };
}

/**
 * Multiplies a mixed number by a natural number with both methods
 */
export function multiplyMixedByNatural(
  whole: number,
  num: number,
  den: number,
  natural: number
): MixedByNaturalSteps {
  // Method A
  const imp = mixedToImproper(whole, num, den);
  const rawNumA = imp.num * natural;
  const simpA = simplifyFraction(rawNumA, den);
  const finalMixed = improperToMixed(simpA.num, simpA.den);

  // Method B
  const wholeProd = whole * natural;
  const fracNum = num * natural;
  const fracMixed = improperToMixed(fracNum, den);
  const combinedWhole = wholeProd + fracMixed.whole;

  return {
    whole,
    num,
    den,
    natural,
    methodA: {
      improperNum: imp.num,
      improperStep: `${whole} × ${den} + ${num} = ${imp.num}/${den}`,
      multiplyStep: `${imp.num}/${den} × ${natural} = (${imp.num} × ${natural})/${den} = ${rawNumA}/${den}`,
      rawImproper: { num: rawNumA, den },
      simplifiedImproper: simpA,
      finalMixed,
    },
    methodB: {
      wholeProd,
      fracNum,
      fracStep: `(${whole} × ${natural}) + (${num}/${den} × ${natural}) = ${wholeProd} + ${fracNum}/${den}`,
      convertedFracMixed: fracMixed,
      finalMixed: {
        whole: combinedWhole,
        num: fracMixed.num,
        den: fracMixed.den,
      },
    },
  };
}

export type FeedbackType = 
  | 'CORRECT' 
  | 'CORRECT_NEEDS_SIMPLIFY' 
  | 'CORRECT_NEEDS_MIXED'
  | 'WRONG_MULTIPLIED_WHOLE_ONLY' 
  | 'WRONG_ADDED_DENOMINATORS' 
  | 'WRONG_MULTIPLIED_DENOMINATOR' 
  | 'WRONG_INVERTED'
  | 'WRONG_GENERAL';

export interface AnswerCheckResult {
  isCorrect: boolean;
  type: FeedbackType;
  messageKey: string;
  expected: { whole?: number; num: number; den: number };
  studentFraction: { whole?: number; num: number; den: number };
}

/**
 * Checks student's answer and diagnoses common mistakes
 */
export function checkFractionAnswer(
  student: { whole?: number; num: number; den: number },
  correct: { whole?: number; num: number; den: number },
  problemContext?: {
    type: 'mixedByNatural' | 'fractionMultiplication';
    origWhole?: number;
    origNum1?: number;
    origDen1?: number;
    origNum2?: number;
    origDen2?: number;
    origNatural?: number;
  }
): AnswerCheckResult {
  const sWhole = student.whole || 0;
  const sNum = student.num || 0;
  const sDen = student.den || 1;

  const cWhole = correct.whole || 0;
  const cNum = correct.num || 0;
  const cDen = correct.den || 1;

  // Student decimal
  const studentVal = sWhole + (sDen !== 0 ? sNum / sDen : 0);
  const correctVal = cWhole + (cDen !== 0 ? cNum / cDen : 0);

  // Exact match to expected simplified form
  const isExactMatch = 
    sWhole === cWhole && 
    sNum === cNum && 
    (cNum === 0 || sDen === cDen);

  if (isExactMatch) {
    return {
      isCorrect: true,
      type: 'CORRECT',
      messageKey: 'correct_perfect',
      expected: correct,
      studentFraction: { whole: sWhole, num: sNum, den: sDen },
    };
  }

  // Check if numerically equal (within floating tolerance)
  const isNumericallyEqual = Math.abs(studentVal - correctVal) < 0.0001;

  if (isNumericallyEqual) {
    // If student gave improper fraction when mixed was preferred, or didn't simplify
    const sSimp = simplifyFraction(sNum, sDen);
    if (sSimp.num !== sNum || sSimp.den !== sDen) {
      return {
        isCorrect: true, // partial credit
        type: 'CORRECT_NEEDS_SIMPLIFY',
        messageKey: 'correct_needs_simplify',
        expected: correct,
        studentFraction: { whole: sWhole, num: sNum, den: sDen },
      };
    }

    if (cWhole > 0 && sWhole === 0 && sNum >= sDen) {
      return {
        isCorrect: true, // partial credit
        type: 'CORRECT_NEEDS_MIXED',
        messageKey: 'correct_needs_mixed',
        expected: correct,
        studentFraction: { whole: sWhole, num: sNum, den: sDen },
      };
    }

    return {
      isCorrect: true,
      type: 'CORRECT',
      messageKey: 'correct_good',
      expected: correct,
      studentFraction: { whole: sWhole, num: sNum, den: sDen },
    };
  }

  // Misconception diagnostics
  if (problemContext?.type === 'mixedByNatural') {
    const origW = problemContext.origWhole || 0;
    const origN = problemContext.origNum1 || 0;
    const origD = problemContext.origDen1 || 1;
    const natural = problemContext.origNatural || 1;

    // Mistake 1: Multiplied only the whole number, e.g. 2 1/3 * 4 = 8 1/3
    if (sWhole === origW * natural && sNum === origN && sDen === origD) {
      return {
        isCorrect: false,
        type: 'WRONG_MULTIPLIED_WHOLE_ONLY',
        messageKey: 'mistake_multiplied_whole_only',
        expected: correct,
        studentFraction: { whole: sWhole, num: sNum, den: sDen },
      };
    }

    // Mistake 2: Multiplied denominator by natural number, e.g. 2 1/3 * 4 -> den = 12
    if (sDen === origD * natural) {
      return {
        isCorrect: false,
        type: 'WRONG_MULTIPLIED_DENOMINATOR',
        messageKey: 'mistake_multiplied_denominator',
        expected: correct,
        studentFraction: { whole: sWhole, num: sNum, den: sDen },
      };
    }
  }

  if (problemContext?.type === 'fractionMultiplication') {
    const n1 = problemContext.origNum1 || 1;
    const d1 = problemContext.origDen1 || 1;
    const n2 = problemContext.origNum2 || 1;
    const d2 = problemContext.origDen2 || 1;

    // Mistake 3: Added denominators instead of multiplying (e.g., d1 + d2)
    if (sDen === d1 + d2) {
      return {
        isCorrect: false,
        type: 'WRONG_ADDED_DENOMINATORS',
        messageKey: 'mistake_added_denominators',
        expected: correct,
        studentFraction: { whole: sWhole, num: sNum, den: sDen },
      };
    }

    // Inverted fraction result
    if (correct.den > 0 && Math.abs(studentVal - (correct.den / (correct.num || 1))) < 0.001) {
      return {
        isCorrect: false,
        type: 'WRONG_INVERTED',
        messageKey: 'mistake_inverted',
        expected: correct,
        studentFraction: { whole: sWhole, num: sNum, den: sDen },
      };
    }
  }

  return {
    isCorrect: false,
    type: 'WRONG_GENERAL',
    messageKey: 'mistake_general',
    expected: correct,
    studentFraction: { whole: sWhole, num: sNum, den: sDen },
  };
}

/**
 * Helper to pick a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface GeneratedPracticeProblem {
  id: string;
  topic: 'mixedByNatural' | 'fractionMultiplication';
  difficulty: 'easy' | 'medium' | 'hard';
  whole1?: number;
  num1: number;
  den1: number;
  num2?: number;
  den2?: number;
  natural?: number;
  expectedAnswer: { whole: number; num: number; den: number };
  rawResult: { num: number; den: number };
  hint: {
    uz: string;
    ru: string;
    en: string;
  };
  steps: {
    title: { uz: string; ru: string; en: string };
    content: string;
  }[];
}

/**
 * Generates mathematically sound, 5th-grade friendly random practice problems
 */
export function generatePracticeProblem(
  topic: 'mixedByNatural' | 'fractionMultiplication',
  difficulty: 'easy' | 'medium' | 'hard'
): GeneratedPracticeProblem {
  const id = `prob_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (topic === 'mixedByNatural') {
    let whole = 1;
    let den = 3;
    let num = 1;
    let natural = 2;

    if (difficulty === 'easy') {
      // 1 1/2 * 2, 2 1/3 * 3, 1 2/5 * 2
      whole = randomInt(1, 2);
      den = [2, 3, 4, 5][randomInt(0, 3)];
      num = randomInt(1, den - 1);
      natural = randomInt(2, 4);
    } else if (difficulty === 'medium') {
      // 2 2/3 * 4, 3 1/4 * 3, 1 5/6 * 3
      whole = randomInt(2, 4);
      den = [3, 4, 5, 6, 8][randomInt(0, 4)];
      num = randomInt(1, den - 1);
      natural = randomInt(2, 6);
    } else {
      // 3 3/7 * 5, 4 3/8 * 6, 2 7/10 * 4
      whole = randomInt(2, 5);
      den = [6, 7, 8, 9, 10, 12][randomInt(0, 5)];
      num = randomInt(1, den - 1);
      while (gcd(num, den) > 1) {
        num = randomInt(1, den - 1);
      }
      natural = randomInt(3, 9);
    }

    const { methodA, methodB } = multiplyMixedByNatural(whole, num, den, natural);
    const expected = methodA.finalMixed;

    return {
      id,
      topic,
      difficulty,
      whole1: whole,
      num1: num,
      den1: den,
      natural,
      expectedAnswer: expected,
      rawResult: methodA.rawImproper,
      hint: {
        uz: `Maslahat: Aralash sonni noto'g'ri kasrga aylantiring (${whole}×${den}+${num} = ${whole * den + num}/${den}), keyin suratni ${natural} ga ko'paytiring!`,
        ru: `Подсказка: Превратите смешанное число в неправильную дробь (${whole}×${den}+${num} = ${whole * den + num}/${den}), затем умножьте числитель на ${natural}!`,
        en: `Hint: Convert the mixed number to an improper fraction (${whole}×${den}+${num} = ${whole * den + num}/${den}), then multiply numerator by ${natural}!`,
      },
      steps: [
        {
          title: {
            uz: "1-qadam: Noto'g'ri kasrga aylantirish",
            ru: "Шаг 1: Перевод в неправильную дробь",
            en: "Step 1: Convert to improper fraction",
          },
          content: `${whole} ${num}/${den} = (${whole} × ${den} + ${num})/${den} = ${whole * den + num}/${den}`,
        },
        {
          title: {
            uz: "2-qadam: Natural songa ko'paytirish",
            ru: "Шаг 2: Умножение на натуральное число",
            en: "Step 2: Multiply by natural number",
          },
          content: `${whole * den + num}/${den} × ${natural} = (${whole * den + num} × ${natural})/${den} = ${(whole * den + num) * natural}/${den}`,
        },
        {
          title: {
            uz: "3-qadam: Qisqartirish va aralash songa ajratish",
            ru: "Шаг 3: Сокращение и выделение целой части",
            en: "Step 3: Simplify and extract whole part",
          },
          content: expected.whole > 0 && expected.num > 0
            ? `${(whole * den + num) * natural}/${den} = ${expected.whole} ${expected.num}/${expected.den}`
            : expected.whole > 0 
            ? `${expected.whole}`
            : `${expected.num}/${expected.den}`,
        },
      ],
    };
  } else {
    // Fraction multiplication
    let num1 = 1;
    let den1 = 2;
    let num2 = 1;
    let den2 = 3;

    if (difficulty === 'easy') {
      den1 = [2, 3, 4, 5][randomInt(0, 3)];
      num1 = randomInt(1, den1);
      den2 = [2, 3, 4, 6][randomInt(0, 3)];
      num2 = randomInt(1, den2);
    } else if (difficulty === 'medium') {
      den1 = [3, 4, 5, 6, 8, 9][randomInt(0, 5)];
      num1 = randomInt(1, den1 + 2); // can be proper or improper
      den2 = [3, 4, 5, 6, 8, 10][randomInt(0, 5)];
      num2 = randomInt(1, den2 + 2);
    } else {
      den1 = [6, 7, 8, 9, 10, 12][randomInt(0, 5)];
      num1 = randomInt(2, den1 + 4);
      den2 = [4, 6, 8, 9, 10, 12][randomInt(0, 5)];
      num2 = randomInt(2, den2 + 4);
    }

    const calc = multiplyFractions({ num: num1, den: den1 }, { num: num2, den: den2 });
    const expected = calc.mixedResult;

    return {
      id,
      topic,
      difficulty,
      num1,
      den1,
      num2,
      den2,
      expectedAnswer: expected,
      rawResult: { num: num1 * num2, den: den1 * den2 },
      hint: {
        uz: `Maslahat: Suratni suratga (${num1} × ${num2}), maxrajni maxrajga (${den1} × ${den2}) ko'paytiring. Iloji bo'lsa, oldin qisqartiring!`,
        ru: `Подсказка: Числитель умножьте на числитель (${num1} × ${num2}), знаменатель на знаменатель (${den1} × ${den2}). По возможности сократите!`,
        en: `Hint: Multiply numerator by numerator (${num1} × ${num2}), denominator by denominator (${den1} × ${den2}). Simplify beforehand if possible!`,
      },
      steps: [
        {
          title: {
            uz: "1-qadam: Ko'paytirish qoidasi",
            ru: "Шаг 1: Правило умножения",
            en: "Step 1: Multiplication rule",
          },
          content: `(${num1} × ${num2}) / (${den1} × ${den2})`,
        },
        {
          title: {
            uz: "2-qadam: Ko'paytirish natijasi",
            ru: "Шаг 2: Результат перемножения",
            en: "Step 2: Raw product",
          },
          content: `${num1 * num2} / ${den1 * den2}`,
        },
        {
          title: {
            uz: "3-qadam: Yakuniy soddalashtirilgan natija",
            ru: "Шаг 3: Окончательный сокращенный результат",
            en: "Step 3: Final simplified answer",
          },
          content: expected.whole > 0 && expected.num > 0
            ? `${expected.whole} ${expected.num}/${expected.den}`
            : expected.whole > 0 
            ? `${expected.whole}`
            : `${expected.num}/${expected.den}`,
        },
      ],
    };
  }
}
