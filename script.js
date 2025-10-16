const topics = [
  // Addition
  {
    id: "addition-whole",
    strand: "Addition",
    title: "Whole Numbers",
    description: "Add 3-digit numbers with regrouping.",
    example: {
      problem: "356 + 487",
      steps: [
        "Line up the addends so each place value is in the same column.",
        "Add the ones: 6 + 7 = 13. Write 3, carry 1 to the tens column.",
        "Add tens with the carried 1: 5 + 8 + 1 = 14. Write 4, carry 1.",
        "Add hundreds with the carry: 3 + 4 + 1 = 8. The sum is 843."
      ],
      answer: "Final answer: 843"
    },
    instruction: "Enter the sum by filling each answer box from left to right.",
    generateQuestion: () => {
      const a = randomInt(200, 999);
      const b = randomInt(200, 999);
      const sum = a + b;
      const instruction =
        "Enter the sum by filling each answer box from left to right.";
      const width = Math.max(
        String(a).length,
        String(b).length,
        String(sum).length
      );
      const digsA = threeDigits(a);
      const digsB = threeDigits(b);
      const ones = digsA.ones + digsB.ones;
      const tens = digsA.tens + digsB.tens + Math.floor(ones / 10);
      const hints = [
        `Stack ${a} and ${b} so the ones, tens, and hundreds are aligned.`,
        `Add the ones: ${digsA.ones} + ${digsB.ones} = ${ones}. Write ${ones % 10} and carry ${Math.floor(
          ones / 10
        )}.`,
        `Add the tens with the carry: ${digsA.tens} + ${digsB.tens} + ${Math.floor(
          ones / 10
        )} = ${tens}. Write ${tens % 10} and carry ${Math.floor(tens / 10)}.`,
        `Add the hundreds with the carry to get ${sum}.`
      ];
      const layout = createVerticalLayout(
        [String(a), String(b)],
        "+",
        { caption: `${a} + ${b}`, width }
      );
      return {
        prompt: `${a} + ${b}`,
        instruction,
        answer: { type: "integer", value: sum },
        layout,
        hints
      };
    }
  },
  {
    id: "addition-decimal",
    strand: "Addition",
    title: "Decimals",
    description: "Add tenths and hundredths accurately.",
    example: {
      problem: "4.8 + 2.37",
      steps: [
        "Write 4.8 as 4.80 so both numbers have two decimal places.",
        "Add hundredths: 0 + 7 = 7.",
        "Add tenths: 8 + 3 = 11. Write 1, carry 1 to the ones place.",
        "Add ones with the carry: 4 + 2 + 1 = 7. Answer: 7.17."
      ],
      answer: "Final answer: 7.17"
    },
    instruction: "Enter the decimal sum by filling each place-value box.",
    generateQuestion: () => {
      const a = (randomInt(10, 95) / 10).toFixed(1);
      const b = (randomInt(10, 95) / 10).toFixed(1);
      const sum = (parseFloat(a) + parseFloat(b)).toFixed(2);
      const displayA = Number(a).toFixed(2);
      const displayB = Number(b).toFixed(2);
      const instruction =
        "Enter the decimal sum by filling each place-value box.";
      const hints = [
        `Write both numbers with two decimal places: ${displayA} and ${displayB}.`,
        "Align the decimal points before adding.",
        "Add hundredths, then tenths, regrouping if the sum is 10 or more.",
        `Add the whole-number part. The total is ${sum}.`
      ];
      const width = Math.max(displayA.length, displayB.length, sum.length);
      const layout = createVerticalLayout(
        [displayA, displayB],
        "+",
        { caption: `${displayA} + ${displayB}`, width }
      );
      return {
        prompt: `${displayA} + ${displayB}`,
        instruction,
        answer: { type: "decimal", value: parseFloat(sum), precision: 2 },
        layout,
        hints
      };
    }
  },
  {
    id: "addition-fraction",
    strand: "Addition",
    title: "Fractions",
    description: "Add like denominators then simplify.",
    example: {
      problem: "3/8 + 2/8",
      steps: [
        "Denominators already match (8).",
        "Add numerators: 3 + 2 = 5.",
        "Keep the denominator 8.",
        "Final fraction: 5/8."
      ],
      answer: "Final answer: 5/8"
    },
    instruction: "Enter a simplified fraction (e.g., 5/8).",
    generateQuestion: () => {
      const denominator = randomInt(4, 12);
      const firstNumerator = randomInt(1, denominator - 2);
      const secondNumerator = randomInt(1, denominator - firstNumerator - 1);
      const sum = firstNumerator + secondNumerator;
      const simplified = simplifyFraction(sum, denominator);
      const hints = [
        `The common denominator is ${denominator}.`,
        `Add the numerators: ${firstNumerator} + ${secondNumerator} = ${sum}.`,
        `Write the sum over ${denominator}: ${sum}/${denominator}.`,
        simplified.num === sum && simplified.den === denominator
          ? "The fraction is already simplified."
          : `Simplify ${sum}/${denominator} to ${fractionToString(simplified)}.`
      ];
      const prompt = `${firstNumerator}/${denominator} + ${secondNumerator}/${denominator}`;
      const layout = createFractionLayout(
        [
          { whole: null, num: firstNumerator, den: denominator },
          { whole: null, num: secondNumerator, den: denominator }
        ],
        "+",
        { caption: prompt }
      );
      return {
        prompt,
        instruction: "Type the simplified fraction result.",
        answer: { type: "fraction", value: simplified },
        layout,
        hints
      };
    }
  },
  {
    id: "addition-mixed",
    strand: "Addition",
    title: "Mixed Numbers",
    description: "Add whole parts, then fractions.",
    example: {
      problem: "2 1/4 + 1 3/4",
      steps: [
        "Add the fractions: 1/4 + 3/4 = 4/4 = 1.",
        "Add the whole numbers: 2 + 1 = 3.",
        "Combine: 3 + 1 = 4.",
        "Final answer: 4."
      ],
      answer: "Final answer: 4"
    },
    instruction: "Enter a mixed number (e.g., 4 1/2) or whole number if no fraction remains.",
    generateQuestion: () => {
      const denominator = randomInt(4, 9);
      const whole1 = randomInt(1, 5);
      const whole2 = randomInt(1, 5);
      const num1 = randomInt(1, denominator - 1);
      const num2 = randomInt(1, denominator - 1);
      const fractionSum = simplifyFraction(num1 + num2, denominator);
      const totalWhole =
        whole1 + whole2 + Math.floor(fractionSum.num / fractionSum.den);
      const remainder = fractionSum.num % fractionSum.den;
      const result =
        remainder === 0
          ? { whole: totalWhole, num: 0, den: 1 }
          : { whole: totalWhole, num: remainder, den: fractionSum.den };
      const hints = [
        `Add the fractional parts: ${num1}/${denominator} + ${num2}/${denominator}.`,
        `That sum is ${fractionToString({
          num: num1 + num2,
          den: denominator
        })}.`,
        remainder === 0
          ? "The fractional parts make a whole number."
          : `Simplify the fraction to ${result.num}/${result.den}.`,
        `Add the whole parts: ${whole1} + ${whole2} = ${whole1 + whole2}.`,
        remainder === 0
          ? `Combine to get ${totalWhole}.`
          : `Combine to get ${mixedToString(result)}.`
      ];
      const prompt = `${whole1} ${num1}/${denominator} + ${whole2} ${num2}/${denominator}`;
      const layout = createFractionLayout(
        [
          { whole: whole1, num: num1, den: denominator },
          { whole: whole2, num: num2, den: denominator }
        ],
        "+",
        { caption: prompt }
      );
      return {
        prompt,
        instruction:
          "Answer as a mixed number (e.g., 4 1/2) or whole number (e.g., 4).",
        answer: { type: "mixed", value: result },
        layout,
        hints
      };
    }
  },
  // Subtraction
  {
    id: "subtraction-whole",
    strand: "Subtraction",
    title: "Whole Numbers",
    description: "Subtract 3-digit numbers with regrouping.",
    example: {
      problem: "703 − 458",
      steps: [
        "Start with the ones: 3 − 8 cannot be done, so regroup.",
        "Borrow 1 from the tens place (0 becomes 9) and the ones become 13.",
        "13 − 8 = 5. In the tens place, 9 − 5 = 4.",
        "In the hundreds place, 6 − 4 = 2. Final answer: 245."
      ],
      answer: "Final answer: 245"
    },
    instruction: "Enter the difference by filling each answer box.",
    generateQuestion: () => {
      const minuend = randomInt(500, 999);
      const subtrahend = randomInt(200, minuend - 100);
      const difference = minuend - subtrahend;
      const instruction = "Enter the difference by filling each answer box.";
      const width = Math.max(
        String(minuend).length,
        String(subtrahend).length,
        String(difference).length
      );
      const hints = [
        `Write ${minuend} over ${subtrahend} and plan to subtract column by column.`,
        "Regroup if the top digit is smaller than the bottom digit in any column.",
        "Subtract ones, tens, then hundreds.",
        `The difference is ${difference}.`
      ];
      const layout = createVerticalLayout(
        [String(minuend), String(subtrahend)],
        "−",
        { caption: `${minuend} − ${subtrahend}`, width }
      );
      return {
        prompt: `${minuend} − ${subtrahend}`,
        instruction,
        answer: { type: "integer", value: difference },
        layout,
        hints
      };
    }
  },
  {
    id: "subtraction-decimal",
    strand: "Subtraction",
    title: "Decimals",
    description: "Subtract to hundredths by regrouping.",
    example: {
      problem: "12.5 − 3.78",
      steps: [
        "Write 12.50 − 3.78 and align decimal points.",
        "Borrow to subtract hundredths: 0 − 8 requires borrowing.",
        "After regrouping, subtract hundredths, then tenths.",
        "Subtract whole numbers. Answer: 8.72."
      ],
      answer: "Final answer: 8.72"
    },
    instruction: "Enter the decimal difference by filling each place-value box.",
    generateQuestion: () => {
      const minuend = (randomInt(120, 220) / 10).toFixed(2);
      const subtrahend = (randomInt(50, 150) / 10).toFixed(2);
      const diff = (parseFloat(minuend) - parseFloat(subtrahend)).toFixed(2);
      const instruction =
        "Enter the decimal difference by filling each place-value box.";
      const hints = [
        `Align decimal points: ${minuend} − ${subtrahend}.`,
        "Ensure both numbers have two decimal places before subtracting.",
        "Borrow as needed from tenths to hundredths.",
        `Subtract place by place to reach ${diff}.`
      ];
      const width = Math.max(minuend.length, subtrahend.length, diff.length);
      const layout = createVerticalLayout(
        [minuend, subtrahend],
        "−",
        { caption: `${minuend} − ${subtrahend}`, width }
      );
      return {
        prompt: `${minuend} − ${subtrahend}`,
        instruction,
        answer: { type: "decimal", value: parseFloat(diff), precision: 2 },
        layout,
        hints
      };
    }
  },
  {
    id: "subtraction-fraction",
    strand: "Subtraction",
    title: "Fractions",
    description: "Subtract like denominators and simplify.",
    example: {
      problem: "7/8 − 2/8",
      steps: [
        "Denominators match, so subtract numerators.",
        "7 − 2 = 5; keep the denominator 8.",
        "Simplify if necessary.",
        "Final answer: 5/8."
      ],
      answer: "Final answer: 5/8"
    },
    instruction: "Enter a simplified fraction (e.g., 5/8).",
    generateQuestion: () => {
      const denominator = randomInt(4, 10);
      const numerator1 = randomInt(2, denominator - 1);
      const numerator2 = randomInt(1, numerator1 - 1);
      const difference = numerator1 - numerator2;
      const simplified = simplifyFraction(difference, denominator);
      const hints = [
        `The common denominator is ${denominator}.`,
        `Subtract the numerators: ${numerator1} − ${numerator2} = ${difference}.`,
        `Write ${difference}/${denominator}.`,
        simplified.num === difference && simplified.den === denominator
          ? "The fraction is already in simplest form."
          : `Simplify to ${fractionToString(simplified)}.`
      ];
      const prompt = `${numerator1}/${denominator} − ${numerator2}/${denominator}`;
      const layout = createFractionLayout(
        [
          { whole: null, num: numerator1, den: denominator },
          { whole: null, num: numerator2, den: denominator }
        ],
        "−",
        { caption: prompt }
      );
      return {
        prompt,
        instruction: "Provide the simplified fraction.",
        answer: { type: "fraction", value: simplified },
        layout,
        hints
      };
    }
  },
  {
    id: "subtraction-mixed",
    strand: "Subtraction",
    title: "Mixed Numbers",
    description: "Borrow from the whole number if needed.",
    example: {
      problem: "5 1/3 − 2 2/3",
      steps: [
        "Borrow 1 from 5 to make 4 and convert it to 3/3.",
        "Now you have 4 4/3 − 2 2/3.",
        "Subtract the fractions: 4/3 − 2/3 = 2/3.",
        "Subtract whole numbers: 4 − 2 = 2. Answer: 2 2/3."
      ],
      answer: "Final answer: 2 2/3"
    },
    instruction: "Enter a mixed number (e.g., 2 2/3).",
    generateQuestion: () => {
      const denominator = randomInt(4, 9);
      const whole1 = randomInt(3, 8);
      const whole2 = randomInt(1, whole1 - 1);
      const num1 = randomInt(1, denominator - 1);
      const num2 = randomInt(1, denominator - 1);
      let topWhole = whole1;
      let topNum = num1;
      if (num1 < num2) {
        topWhole -= 1;
        topNum = num1 + denominator;
      }
      const diffWhole = topWhole - whole2;
      const diffFraction = simplifyFraction(topNum - num2, denominator);
      const result = {
        whole: diffWhole,
        num: diffFraction.num,
        den: diffFraction.den
      };
      const hints = [
        "Check if you need to borrow so the top fraction is larger.",
        num1 < num2
          ? `Borrow 1 from ${whole1}, making it ${topWhole}, and add ${denominator}/${denominator} to the fraction so it becomes ${topNum}/${denominator}.`
          : "No borrowing needed for the fraction part.",
        `Subtract fractions: ${topNum}/${denominator} − ${num2}/${denominator} = ${fractionToString(
          diffFraction
        )}.`,
        `Subtract wholes: ${topWhole} − ${whole2} = ${diffWhole}.`,
        `Combine to get ${mixedToString(result)}.`
      ];
      const prompt = `${whole1} ${num1}/${denominator} − ${whole2} ${num2}/${denominator}`;
      const layout = createFractionLayout(
        [
          { whole: whole1, num: num1, den: denominator },
          { whole: whole2, num: num2, den: denominator }
        ],
        "−",
        { caption: prompt }
      );
      return {
        prompt,
        instruction: "Write the simplified mixed number answer.",
        answer: { type: "mixed", value: result },
        layout,
        hints
      };
    }
  },
  // Multiplication
  {
    id: "multiplication-whole",
    strand: "Multiplication",
    title: "Whole Numbers",
    description: "Multiply 2-digit numbers using standard algorithm.",
    example: {
      problem: "34 × 27",
      steps: [
        "Multiply 34 by 7 (ones place): 34 × 7 = 238.",
        "Multiply 34 by 20 (tens place): 34 × 20 = 680.",
        "Add the partial products: 238 + 680 = 918.",
        "Final answer: 918."
      ],
      answer: "Final answer: 918"
    },
    instruction: "Enter the product by filling each answer box.",
    generateQuestion: () => {
      const a = randomInt(12, 89);
      const b = randomInt(12, 89);
      const product = a * b;
      const instruction = "Enter the product by filling each answer box.";
      const ones = b % 10;
      const tens = Math.floor(b / 10);
      const hints = [
        `Break ${b} into ${ones} (ones) and ${tens * 10} (tens).`,
        `Multiply ${a} × ${ones} to get ${a * ones}.`,
        `Multiply ${a} × ${tens * 10} to get ${a * tens * 10}.`,
        `Add the partial products to obtain ${product}.`
      ];
      const width = Math.max(
        String(a).length,
        String(b).length,
        String(product).length
      );
      const prompt = `${a} × ${b}`;
      const layout = createVerticalLayout(
        [String(a), String(b)],
        "×",
        { caption: prompt, partials: String(b).length, width }
      );
      return {
        prompt,
        instruction,
        answer: { type: "integer", value: product },
        layout,
        hints
      };
    }
  },
  {
    id: "multiplication-decimal",
    strand: "Multiplication",
    title: "Decimals",
    description: "Multiply decimals and place the decimal point.",
    example: {
      problem: "2.4 × 1.5",
      steps: [
        "Ignore decimals and multiply 24 × 15 = 360.",
        "Count total decimal places (2).",
        "Place the decimal so the product has two decimal places: 3.60.",
        "Final answer: 3.6."
      ],
      answer: "Final answer: 3.6"
    },
    instruction: "Enter the decimal product by filling each place-value box.",
    generateQuestion: () => {
      const a = (randomInt(12, 95) / 10).toFixed(1);
      const b = (randomInt(12, 95) / 10).toFixed(1);
      const rawProduct = (parseFloat(a) * parseFloat(b)).toFixed(2);
      const instruction =
        "Enter the decimal product by filling each place-value box.";
      const hints = [
        `Treat the numbers as ${parseFloat(a) * 10} and ${parseFloat(b) * 10} without decimals.`,
        "Multiply the whole numbers first.",
        "Count the decimal places in the factors to place the decimal in the product.",
        `After adjusting the decimal, the product is ${rawProduct}.`
      ];
      const prompt = `${a} × ${b}`;
      const partialCount = String(b).replace(".", "").length;
      const width = Math.max(a.length, b.length, rawProduct.length);
      const layout = createVerticalLayout(
        [a, b],
        "×",
        { caption: prompt, partials: Math.min(3, partialCount), width }
      );
      return {
        prompt,
        instruction,
        answer: { type: "decimal", value: parseFloat(rawProduct), precision: 2 },
        layout,
        hints
      };
    }
  },
  {
    id: "multiplication-fraction",
    strand: "Multiplication",
    title: "Fractions",
    description: "Multiply fractions and simplify.",
    example: {
      problem: "2/3 × 3/5",
      steps: [
        "Multiply numerators: 2 × 3 = 6.",
        "Multiply denominators: 3 × 5 = 15.",
        "Simplify 6/15 to 2/5.",
        "Final answer: 2/5."
      ],
      answer: "Final answer: 2/5"
    },
    instruction: "Enter a simplified fraction (e.g., 2/5).",
    generateQuestion: () => {
      const n1 = randomInt(1, 8);
      const d1 = randomInt(n1 + 1, 9);
      const n2 = randomInt(1, 8);
      const d2 = randomInt(n2 + 1, 9);
      const product = simplifyFraction(n1 * n2, d1 * d2);
      const hints = [
        `Multiply numerators: ${n1} × ${n2} = ${n1 * n2}.`,
        `Multiply denominators: ${d1} × ${d2} = ${d1 * d2}.`,
        product.num === n1 * n2 && product.den === d1 * d2
          ? "No simplification needed."
          : `Divide numerator and denominator by ${gcd(
              n1 * n2,
              d1 * d2
            )} to simplify to ${fractionToString(product)}.`,
        `Final fraction: ${fractionToString(product)}.`
      ];
      const prompt = `${n1}/${d1} × ${n2}/${d2}`;
      const layout = createFractionLayout(
        [
          { whole: null, num: n1, den: d1 },
          { whole: null, num: n2, den: d2 }
        ],
        "×",
        { caption: prompt }
      );
      return {
        prompt,
        instruction: "Provide the simplified fraction.",
        answer: { type: "fraction", value: product },
        layout,
        hints
      };
    }
  },
  {
    id: "multiplication-mixed",
    strand: "Multiplication",
    title: "Mixed Numbers",
    description: "Convert to improper fractions, multiply, then convert back.",
    example: {
      problem: "1 1/2 × 2 1/3",
      steps: [
        "Convert to improper fractions: 1 1/2 = 3/2 and 2 1/3 = 7/3.",
        "Multiply: 3/2 × 7/3 = 21/6.",
        "Simplify 21/6 to 7/2.",
        "Convert back: 3 1/2."
      ],
      answer: "Final answer: 3 1/2"
    },
    instruction: "Enter a mixed number (e.g., 3 1/2) or improper fraction if needed.",
    generateQuestion: () => {
      const den = randomInt(3, 8);
      const whole1 = randomInt(1, 4);
      const num1 = randomInt(1, den - 1);
      const den2 = randomInt(3, 8);
      const whole2 = randomInt(1, 4);
      const num2 = randomInt(1, den2 - 1);
      const improper1 = { num: whole1 * den + num1, den };
      const improper2 = { num: whole2 * den2 + num2, den: den2 };
      const productFraction = simplifyFraction(
        improper1.num * improper2.num,
        improper1.den * improper2.den
      );
      const mixed = toMixed(productFraction);
      const hints = [
        `Convert ${whole1} ${num1}/${den} to ${improper1.num}/${improper1.den}.`,
        `Convert ${whole2} ${num2}/${den2} to ${improper2.num}/${improper2.den}.`,
        `Multiply to get ${fractionToString({
          num: improper1.num * improper2.num,
          den: improper1.den * improper2.den
        })}.`,
        productFraction.num === improper1.num * improper2.num &&
        productFraction.den === improper1.den * improper2.den
          ? "The fraction is already simplified."
          : `Simplify to ${fractionToString(productFraction)}.`,
        `Convert to a mixed number: ${mixedToString(mixed)}.`
      ];
      const prompt = `${whole1} ${num1}/${den} × ${whole2} ${num2}/${den2}`;
      const layout = createFractionLayout(
        [
          { whole: whole1, num: num1, den: den },
          { whole: whole2, num: num2, den: den2 }
        ],
        "×",
        { caption: prompt }
      );
      return {
        prompt,
        instruction:
          "Enter the product as a mixed number (e.g., 3 1/2) or whole number if the fraction part is zero.",
        answer: { type: "mixed", value: mixed },
        layout,
        hints
      };
    }
  },
  // Long division
  {
    id: "division-whole",
    strand: "Long Division",
    title: "Whole Numbers",
    description: "Divide 3-digit numbers by 1- or 2-digit divisors.",
    example: {
      problem: "339 ÷ 3",
      steps: [
        "3 goes into 3 one time. Write 1 above the 3.",
        "Bring down the next digit. 3 goes into 3 one time. Write 1.",
        "Bring down 9. 3 goes into 9 three times.",
        "Answer: 113."
      ],
      answer: "Final answer: 113"
    },
    instruction: "Type the quotient as a whole number.",
    generateQuestion: () => {
      const divisor = randomInt(3, 9);
      const quotient = randomInt(11, 99);
      const dividend = divisor * quotient;
      const hints = [
        `Set up ${divisor} ⟌ ${dividend}.`,
        "Divide the highest place value first, writing the quotient above the dividend.",
        "Multiply the divisor by the digit in the quotient and subtract.",
        "Repeat for each digit. There is no remainder.",
        `The quotient is ${quotient}.`
      ];
      const layout = createDivisionLayout(
        String(dividend),
        String(divisor),
        { templateValue: quotient }
      );
      return {
        prompt: `${dividend} ÷ ${divisor}`,
        instruction: "Enter the quotient as a whole number.",
        answer: { type: "integer", value: quotient },
        layout,
        hints
      };
    }
  },
  {
    id: "division-decimal",
    strand: "Long Division",
    title: "Decimals",
    description: "Divide to hundredths using long division.",
    example: {
      problem: "45.6 ÷ 8",
      steps: [
        "Treat 45.6 as 456 tenths.",
        "8 goes into 45 five times (5 × 8 = 40). Subtract to get 5.",
        "Bring down 6 tenths: 56 ÷ 8 = 7.",
        "Place the decimal in the quotient: 5.7."
      ],
      answer: "Final answer: 5.7"
    },
    instruction: "Round to the nearest hundredth (e.g., 5.70).",
    generateQuestion: () => {
      const divisor = randomInt(3, 9);
      const quotientTenths = randomInt(30, 120); // measured in hundredths
      const quotient = quotientTenths / 10;
      const dividend = parseFloat((quotient * divisor).toFixed(2));
      const rounded = parseFloat(quotient.toFixed(2));
      const hints = [
        `Move any decimal in the divisor (none here) so ${divisor} stays whole.`,
        `Divide ${dividend} by ${divisor} using long division.`,
        "Bring down digits one at a time, placing the decimal point in the quotient when you pass the decimal in the dividend.",
        `Continue until you reach hundredths. The quotient is ${rounded}.`
      ];
      const layout = createDivisionLayout(
        dividend.toFixed(2),
        String(divisor),
        { templateValue: rounded, decimalPlaces: 2 }
      );
      return {
        prompt: `${dividend} ÷ ${divisor}`,
        instruction: "Give the quotient to the nearest hundredth.",
        answer: { type: "decimal", value: rounded, precision: 2 },
        layout,
        hints
      };
    }
  },
  {
    id: "division-fraction",
    strand: "Long Division",
    title: "Fractions",
    description: "Model division by rewriting as fraction division.",
    example: {
      problem: "3/4 ÷ 2",
      steps: [
        "Rewrite as 3/4 × 1/2.",
        "Multiply numerators: 3 × 1 = 3.",
        "Multiply denominators: 4 × 2 = 8.",
        "Simplify if needed. Answer: 3/8."
      ],
      answer: "Final answer: 3/8"
    },
    instruction: "Enter a simplified fraction (e.g., 3/8).",
    generateQuestion: () => {
      const divisor = randomInt(2, 9);
      const denominator = randomInt(3, 9);
      const numerator = randomInt(1, denominator - 1) * divisor;
      const dividendFraction = simplifyFraction(numerator, denominator);
      const result = simplifyFraction(dividendFraction.num, dividendFraction.den * divisor);
      const hints = [
        `Write the division as ${fractionToString(dividendFraction)} ÷ ${divisor}.`,
        "Rewrite as multiplication by the reciprocal.",
        `Compute ${fractionToString(dividendFraction)} × 1/${divisor}.`,
        `Simplify to ${fractionToString(result)}.`
      ];
      const prompt = `${fractionToString(dividendFraction)} ÷ ${divisor}`;
      const layout = createFractionLayout(
        [
          { whole: null, num: dividendFraction.num, den: dividendFraction.den },
          { whole: divisor, num: null, den: null }
        ],
        "÷",
        { caption: prompt }
      );
      return {
        prompt: `${fractionToString(dividendFraction)} ÷ ${divisor}`,
        instruction: "Give the quotient as a simplified fraction.",
        answer: { type: "fraction", value: result },
        layout,
        hints
      };
    }
  },
  {
    id: "division-mixed",
    strand: "Long Division",
    title: "Mixed Numbers",
    description: "Convert to improper fractions, divide, then convert back.",
    example: {
      problem: "4 1/2 ÷ 1 1/2",
      steps: [
        "Convert to improper fractions: 9/2 ÷ 3/2.",
        "Multiply by the reciprocal: 9/2 × 2/3 = 18/6.",
        "Simplify to 3.",
        "Answer: 3."
      ],
      answer: "Final answer: 3"
    },
    instruction: "Enter a simplified mixed number or whole number.",
    generateQuestion: () => {
      const den1 = randomInt(3, 8);
      const whole1 = randomInt(2, 5);
      const num1 = randomInt(1, den1 - 1);
      const den2 = randomInt(3, 8);
      const whole2 = randomInt(1, 4);
      const num2 = randomInt(1, den2 - 1);
      const improper1 = { num: whole1 * den1 + num1, den: den1 };
      const improper2 = { num: whole2 * den2 + num2, den: den2 };
      const quotientFraction = simplifyFraction(
        improper1.num * improper2.den,
        improper1.den * improper2.num
      );
      const mixed = toMixed(quotientFraction);
      const hints = [
        `Convert ${whole1} ${num1}/${den1} to ${fractionToString(improper1)}.`,
        `Convert ${whole2} ${num2}/${den2} to ${fractionToString(improper2)}.`,
        "Change division to multiplication by the reciprocal.",
        `Multiply to get ${fractionToString(quotientFraction)}.`,
        `Convert back to a mixed number: ${mixedToString(mixed)}.`
      ];
      const prompt = `${whole1} ${num1}/${den1} ÷ ${whole2} ${num2}/${den2}`;
      const layout = createFractionLayout(
        [
          { whole: whole1, num: num1, den: den1 },
          { whole: whole2, num: num2, den: den2 }
        ],
        "÷",
        { caption: prompt }
      );
      return {
        prompt,
        instruction:
          "Enter the quotient as a mixed number (e.g., 2 1/3) or whole number if no fraction remains.",
        answer: { type: "mixed", value: mixed },
        layout,
        hints
      };
    }
  }
];

const dom = {
  topicList: document.getElementById("topic-list"),
  topicIntro: document.getElementById("topic-intro"),
  topicTitle: document.getElementById("topic-title"),
  topicDescription: document.getElementById("topic-description"),
  exampleProblem: document.getElementById("example-problem"),
  exampleSteps: document.getElementById("example-steps"),
  exampleAnswer: document.getElementById("example-answer"),
  startPractice: document.getElementById("start-practice"),
  practiceArea: document.getElementById("practice-area"),
  sessionSummary: document.getElementById("session-summary"),
  questionText: document.getElementById("question-text"),
  answerField: document.getElementById("answer-field"),
  questionCount: document.getElementById("question-count"),
  hintCount: document.getElementById("hint-count"),
  answerInput: document.getElementById("answer-input"),
  answerInstruction: document.getElementById("answer-instruction"),
  checkAnswerBtn: document.getElementById("check-answer"),
  nextQuestionBtn: document.getElementById("next-question"),
  hintButton: document.getElementById("hint-button"),
  feedback: document.getElementById("feedback"),
  hintList: document.getElementById("hint-list"),
  noteInput: document.getElementById("note-input"),
  scoreValue: document.querySelector("#score .value"),
  timerValue: document.querySelector("#timer .value"),
  summaryMessage: document.getElementById("summary-message"),
  summaryTime: document.getElementById("summary-time"),
  summaryHints: document.getElementById("summary-hints"),
  summaryScore: document.getElementById("summary-score"),
  restartTopic: document.getElementById("restart-topic"),
  backToTopics: document.getElementById("back-to-topics")
};

const state = {
  currentTopic: null,
  questionIndex: 0,
  question: null,
  score: 0,
  totalHintsUsed: 0,
  hintsUsedThisQuestion: 0,
  sessionStart: null,
  questionStart: null,
  timerInterval: null,
  awaitingNext: false
};

function init() {
  renderTopics();
  attachEvents();
}

function attachEvents() {
  dom.startPractice.addEventListener("click", startPractice);
  dom.checkAnswerBtn.addEventListener("click", checkAnswer);
  dom.nextQuestionBtn.addEventListener("click", () => {
    dom.nextQuestionBtn.classList.add("hidden");
    nextQuestion();
  });
  dom.hintButton.addEventListener("click", revealHint);
  dom.restartTopic.addEventListener("click", startPractice);
  dom.backToTopics.addEventListener("click", resetToTopicList);
  dom.answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !dom.checkAnswerBtn.disabled) {
      checkAnswer();
    }
  });
}

function renderTopics() {
  dom.topicList.innerHTML = "";
  topics.forEach((topic) => {
    const card = document.createElement("button");
    card.className = "topic-card";
    card.type = "button";
    card.dataset.topic = topic.id;

    const heading = document.createElement("h3");
    heading.textContent = `${topic.strand} — ${topic.title}`;
    const desc = document.createElement("p");
    desc.textContent = topic.description;

    card.appendChild(heading);
    card.appendChild(desc);
    card.addEventListener("click", () => selectTopic(topic.id));
    dom.topicList.appendChild(card);
  });
}

function selectTopic(topicId) {
  const topic = topics.find((item) => item.id === topicId);
  if (!topic) return;

  state.currentTopic = topic;
  clearActiveTopic();
  const card = document.querySelector(`[data-topic="${topicId}"]`);
  if (card) {
    card.classList.add("active");
  }

  resetSessionState();
  populateTopicIntro(topic);

  dom.topicIntro.classList.remove("hidden");
  dom.practiceArea.classList.add("hidden");
  dom.sessionSummary.classList.add("hidden");
}

function clearActiveTopic() {
  document
    .querySelectorAll(".topic-card.active")
    .forEach((card) => card.classList.remove("active"));
}

function populateTopicIntro(topic) {
  dom.topicTitle.textContent = `${topic.strand}: ${topic.title}`;
  dom.topicDescription.textContent = topic.description;
  dom.exampleProblem.textContent = topic.example.problem;
  dom.exampleAnswer.textContent = topic.example.answer;
  dom.exampleSteps.innerHTML = "";
  topic.example.steps.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    dom.exampleSteps.appendChild(li);
  });
}

function startPractice() {
  if (!state.currentTopic) return;

  state.questionIndex = 0;
  state.score = 0;
  state.totalHintsUsed = 0;
  updateScoreDisplay();
  dom.hintCount.textContent = "0";
  dom.questionCount.textContent = "1 / 5";
  dom.feedback.textContent = "";
  dom.feedback.className = "feedback";
  dom.practiceArea.classList.remove("hidden");
  dom.topicIntro.classList.add("hidden");
  dom.sessionSummary.classList.add("hidden");
  dom.answerInput.value = "";
  dom.answerInput.focus();

  startTimer();
  nextQuestion();
}

function startTimer() {
  stopTimer();
  state.sessionStart = Date.now();
  state.timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function updateTimer() {
  if (!state.sessionStart) return;
  const elapsedSeconds = Math.floor((Date.now() - state.sessionStart) / 1000);
  dom.timerValue.textContent = formatTime(elapsedSeconds);
}

function nextQuestion() {
  if (state.questionIndex >= 5) {
    finishSession();
    return;
  }

  state.question = state.currentTopic.generateQuestion();
  state.questionStart = Date.now();
  state.hintsUsedThisQuestion = 0;
  state.awaitingNext = false;
  dom.answerInput.value = "";
  dom.answerInput.disabled = false;
  dom.answerInput.classList.remove("hidden");
  dom.checkAnswerBtn.disabled = false;
  dom.feedback.textContent = "";
  dom.feedback.className = "feedback";
  dom.hintList.innerHTML = "";
  dom.hintButton.disabled = false;
  dom.questionText.innerHTML = renderQuestionLayout(
    state.question.layout,
    state.question.prompt
  );
  dom.answerInstruction.textContent = state.question.instruction;
  dom.questionCount.textContent = `${state.questionIndex + 1} / 5`;
  if (dom.noteInput) {
    dom.noteInput.value = "";
  }
  setupPlaceValueInputs();
}

function setupPlaceValueInputs() {
  const digitInputs = dom.questionText.querySelectorAll(".digit-input");
  const hasPlaceValueInputs = digitInputs.length > 0;

  dom.answerInput.classList.toggle("hidden", hasPlaceValueInputs);
  dom.answerInput.disabled = hasPlaceValueInputs;
  dom.answerField.classList.toggle("digit-mode", hasPlaceValueInputs);

  if (!hasPlaceValueInputs) {
    dom.answerInput.focus();
    return;
  }

  const inputArray = Array.from(digitInputs);

  inputArray.forEach((input, index) => {
    input.value = "";
    input.addEventListener("input", (event) =>
      handlePlaceValueInput(event, index, inputArray)
    );
    input.addEventListener("keydown", (event) =>
      handlePlaceValueKeydown(event, index, inputArray)
    );
  });

  inputArray[inputArray.length - 1].focus();
}

function checkAnswer() {
  if (!state.question || state.awaitingNext) return;
  const placeValueResult = getPlaceValueAnswer();
  const usingPlaceValue = placeValueResult !== null;
  const rawInput = usingPlaceValue
    ? placeValueResult
    : dom.answerInput.value.trim();
  if (!rawInput) {
    dom.feedback.textContent = usingPlaceValue
      ? "Fill each answer box before checking."
      : "Enter your answer before checking.";
    dom.feedback.className = "feedback error";
    return;
  }
  const userInput = rawInput;

  const correct = compareAnswers(state.question.answer, userInput);
  if (correct) {
    const timeTaken = (Date.now() - state.questionStart) / 1000;
    const earned = computeScore(timeTaken, state.hintsUsedThisQuestion);
    state.score += earned;
    updateScoreDisplay();
    const answerText = formatAnswer(state.question.answer);
    dom.feedback.textContent = `Nice work!${
      answerText ? ` Answer: ${answerText}.` : ""
    } You earned ${earned} pts.`;
    dom.feedback.className = "feedback success";
    state.questionIndex += 1;
    state.awaitingNext = true;
    dom.checkAnswerBtn.disabled = true;
    dom.nextQuestionBtn.classList.remove("hidden");
    dom.answerInput.disabled = true;
    dom.hintButton.disabled = true;
  } else {
    dom.feedback.textContent = "Not quite yet. Revisit your work and try another hint if needed.";
    dom.feedback.className = "feedback error";
  }
}

function handlePlaceValueInput(event, index, inputs) {
  const input = event.target;
  const cleaned = input.value.replace(/[^0-9]/g, "");
  input.value = cleaned.slice(-1);
  if (input.value && index > 0) {
    inputs[index - 1].focus();
  }
}

function handlePlaceValueKeydown(event, index, inputs) {
  switch (event.key) {
    case "ArrowLeft":
      if (index < inputs.length - 1) {
        event.preventDefault();
        inputs[index + 1].focus();
      }
      break;
    case "ArrowRight":
      if (index > 0) {
        event.preventDefault();
        inputs[index - 1].focus();
      }
      break;
    case "Backspace":
      if (!event.target.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
      break;
    case "Enter":
      event.preventDefault();
      checkAnswer();
      break;
    default:
      break;
  }
}

function getPlaceValueAnswer() {
  const problem = dom.questionText.querySelector(".vertical-problem");
  if (!problem) return null;
  const templateKey = problem.dataset.template;
  if (!templateKey) return null;
  const digitInputs = problem.querySelectorAll(".digit-input");
  if (digitInputs.length === 0) return null;

  let inputIndex = 0;
  const pieces = [];
  for (const token of templateKey) {
    if (token === ".") {
      pieces.push(".");
      continue;
    }
    const input = digitInputs[inputIndex];
    if (!input) return "";
    const value = (input.value || "").trim();
    if (!value) {
      return "";
    }
    pieces.push(value);
    inputIndex += 1;
  }
  return pieces.join("");
}

function revealHint() {
  if (!state.question) return;
  const nextHint = state.question.hints[state.hintsUsedThisQuestion];
  if (!nextHint) {
    dom.feedback.textContent = "All hints revealed for this question.";
    dom.feedback.className = "feedback error";
    return;
  }
  const li = document.createElement("li");
  li.textContent = nextHint;
  dom.hintList.appendChild(li);
  state.hintsUsedThisQuestion += 1;
  state.totalHintsUsed += 1;
  dom.hintCount.textContent = `${state.totalHintsUsed}`;
}

function finishSession() {
  stopTimer();
  const elapsedSeconds = Math.floor((Date.now() - state.sessionStart) / 1000);
  dom.practiceArea.classList.add("hidden");
  dom.sessionSummary.classList.remove("hidden");
  dom.summaryMessage.textContent = `You completed all five ${state.currentTopic.strand.toLowerCase()} questions on ${state.currentTopic.title.toLowerCase()}.`;
  dom.summaryTime.textContent = formatTime(elapsedSeconds);
  dom.summaryHints.textContent = `${state.totalHintsUsed}`;
  dom.summaryScore.textContent = `${state.score}`;
}

function resetToTopicList() {
  resetSessionState();
  dom.sessionSummary.classList.add("hidden");
  dom.topicIntro.classList.add("hidden");
  dom.practiceArea.classList.add("hidden");
  clearActiveTopic();
}

function resetSessionState() {
  stopTimer();
  state.questionIndex = 0;
  state.question = null;
  state.score = 0;
  state.totalHintsUsed = 0;
  state.hintsUsedThisQuestion = 0;
  state.sessionStart = null;
  state.questionStart = null;
  state.awaitingNext = false;
  dom.scoreValue.textContent = "0";
  dom.timerValue.textContent = "00:00";
  dom.hintCount.textContent = "0";
  dom.feedback.textContent = "";
  dom.feedback.className = "feedback";
  dom.hintList.innerHTML = "";
  dom.questionText.innerHTML = "";
  dom.answerInstruction.textContent = "";
  dom.answerInput.classList.remove("hidden");
  dom.answerInput.disabled = false;
  dom.answerInput.value = "";
  dom.answerField.classList.remove("digit-mode");
  if (dom.noteInput) {
    dom.noteInput.value = "";
  }
}

function updateScoreDisplay() {
  dom.scoreValue.textContent = `${Math.max(0, Math.round(state.score))}`;
}

function compareAnswers(expected, input) {
  switch (expected.type) {
    case "integer": {
      const value = parseInt(input, 10);
      return Number.isInteger(value) && value === expected.value;
    }
    case "decimal": {
      const value = parseFloat(input);
      if (Number.isNaN(value)) return false;
      const precision = expected.precision ?? 2;
      const tolerance = 1 / Math.pow(10, precision + 1);
      return Math.abs(value - expected.value) <= tolerance;
    }
    case "fraction": {
      const parsed = parseFraction(input);
      if (!parsed) return false;
      return (
        parsed.num === expected.value.num && parsed.den === expected.value.den
      );
    }
    case "mixed": {
      const parsedMixed = parseMixed(input);
      if (!parsedMixed) return false;
      return (
        parsedMixed.whole === expected.value.whole &&
        parsedMixed.num === expected.value.num &&
        parsedMixed.den === expected.value.den
      );
    }
    default:
      return false;
  }
}

function renderQuestionLayout(layout, fallbackText) {
  if (!layout) {
    return renderTextLayout(fallbackText);
  }
  const caption = layout.caption ?? fallbackText ?? "";
  switch (layout.type) {
    case "vertical":
      return renderVerticalLayout(layout, caption);
    case "fraction":
      return renderFractionLayout(layout, caption);
    case "division":
      return renderDivisionLayout(layout, caption);
    case "text":
      return renderTextLayout(layout.value ?? caption);
    default:
      return renderTextLayout(fallbackText);
  }
}

function renderVerticalLayout(layout, caption) {
  const rawOperands = layout.operands.map(String);
  const width =
    layout.width ??
    rawOperands.reduce((max, operand) => Math.max(max, operand.length), 0);
  const paddedOperands = rawOperands.map((operand) =>
    operand.padStart(width, " ")
  );
  const template =
    layout.template ?? buildTemplateFromOperands(paddedOperands, width);
  const templateKey = template
    .map((token) => (token === "decimal" ? "." : "d"))
    .join("");
  const rows = paddedOperands
    .map((operand, index) => {
      const digits = Array.from(operand)
        .map((char) => renderDigitCell(char))
        .join("");
      const operator =
        index === paddedOperands.length - 1
          ? `<span class="operator">${layout.operator}</span>`
          : `<span class="operator">&nbsp;</span>`;
      return `<div class="vertical-row">${operator}${digits}</div>`;
    })
    .join("");
  let html = `<div class="problem-card"><div class="vertical-problem" data-template="${templateKey}">${rows}<div class="vertical-rule"></div>`;
  if (layout.partials && layout.partials > 0) {
    const placeholderRow = `<div class="vertical-row partial">${createPlaceholderRow(
      width
    )}</div>`;
    html += placeholderRow.repeat(layout.partials);
    html += `<div class="vertical-rule secondary"></div>`;
  }
  if (layout.answerPlaceholder !== false) {
    html += renderAnswerRow(template);
  }
  html += `</div></div>`;
  if (caption) {
    html += `<p class="question-caption">${caption}</p>`;
  }
  return html;
}

function renderAnswerRow(template) {
  const cells = template
    .map((token, index) => {
      if (token === "decimal") {
        return `<span class="digit-cell decimal-marker">.</span>`;
      }
      return `<span class="digit-cell answer-cell"><input type="text" maxlength="1" inputmode="numeric" aria-label="Answer digit ${index +
        1}" class="digit-input" data-index="${index}" autocomplete="off" autocorrect="off" spellcheck="false" /></span>`;
    })
    .join("");
  return `<div class="vertical-row answer" data-columns="${template.length}">${cells}</div>`;
}

function renderFractionLayout(layout, caption) {
  const joiner = `<span class="fraction-operator">${layout.operator}</span>`;
  const expression = layout.operands
    .map((operand) => renderFractionOperand(operand))
    .join(joiner);
  let html = `<div class="problem-card"><div class="fraction-problem">${expression}</div></div>`;
  if (caption) {
    html += `<p class="question-caption">${caption}</p>`;
  }
  return html;
}

function renderDivisionLayout(layout, caption) {
  const quotient =
    layout.quotientTemplate && layout.quotientTemplate.length > 0
      ? `<div class="quotient">${renderQuotientTemplate(
          layout.quotientTemplate
        )}</div>`
      : "";
  const htmlParts = [
    `<div class="problem-card"><div class="division-problem">`,
    quotient,
    `<div class="division-symbol">`,
    `<div class="divisor">${layout.divisor}</div>`,
    `<div class="dividend">${layout.dividend}</div>`,
    `</div></div></div>`
  ];
  if (caption) {
    htmlParts.push(`<p class="question-caption">${caption}</p>`);
  }
  return htmlParts.join("");
}

function renderTextLayout(text) {
  if (!text) return "";
  return `<div class="problem-card"><p class="question-caption">${text}</p></div>`;
}

function renderDigitCell(char) {
  if (char === " ") return `<span class="digit-cell">&nbsp;</span>`;
  if (char === ".") return `<span class="digit-cell decimal-marker">.</span>`;
  return `<span class="digit-cell">${char}</span>`;
}

function buildTemplateFromOperands(operands, width) {
  const template = [];
  for (let col = 0; col < width; col += 1) {
    const hasDecimal = operands.some((operand) => operand[col] === ".");
    template.push(hasDecimal ? "decimal" : "digit");
  }
  return template;
}

function renderFractionOperand(operand) {
  const hasFraction =
    operand.num !== null &&
    operand.num !== undefined &&
    operand.den !== null &&
    operand.den !== undefined &&
    operand.den !== 0 &&
    operand.num !== 0;
  const hasWhole =
    operand.whole !== null &&
    operand.whole !== undefined &&
    operand.whole !== 0;

  if (hasWhole && hasFraction) {
    return `<span class="mixed-number"><span class="whole">${operand.whole}</span>${renderSimpleFraction(
      Math.abs(operand.num),
      operand.den
    )}</span>`;
  }

  if (hasFraction) {
    return renderSimpleFraction(operand.num, operand.den);
  }

  if (
    operand.whole !== null &&
    operand.whole !== undefined &&
    operand.whole !== 0
  ) {
    return `<span class="whole">${operand.whole}</span>`;
  }

  if (operand.label) {
    return `<span class="whole">${operand.label}</span>`;
  }

  if (hasFraction === false && operand.whole === 0) {
    return `<span class="whole">0</span>`;
  }

  return `<span class="whole">&nbsp;</span>`;
}

function renderSimpleFraction(num, den) {
  return `<span class="fraction"><span>${num}</span><span class="bar"></span><span>${den}</span></span>`;
}

function renderQuotientTemplate(template) {
  return template
    .map((token) =>
      token === "decimal"
        ? `<span class="decimal-point">.</span>`
        : `<span class="digit-cell placeholder-cell small">&nbsp;</span>`
    )
    .join("");
}

function createPlaceholderRow(width, variant = "work") {
  const extraClass = variant === "answer" ? " answer-cell" : "";
  return Array.from({ length: width })
    .map(
      () =>
        `<span class="digit-cell placeholder-cell${extraClass}">&nbsp;</span>`
    )
    .join("");
}

function createVerticalLayout(operands, operator, options = {}) {
  return {
    type: "vertical",
    operands: operands.map((operand) => String(operand)),
    operator,
    partials: options.partials ?? 0,
    caption: options.caption ?? null,
    width: options.width ?? null,
    answerPlaceholder: options.answerPlaceholder ?? true
  };
}

function createFractionLayout(operands, operator, options = {}) {
  return {
    type: "fraction",
    operands: operands.map((operand) => ({
      whole:
        operand.whole === undefined || operand.whole === null
          ? null
          : operand.whole,
      num:
        operand.num === undefined || operand.num === null ? null : operand.num,
      den:
        operand.den === undefined || operand.den === null ? null : operand.den,
      label: operand.label ?? null
    })),
    operator,
    caption: options.caption ?? null
  };
}

function createDivisionLayout(dividend, divisor, options = {}) {
  return {
    type: "division",
    dividend: String(dividend),
    divisor: String(divisor),
    quotientTemplate: buildQuotientTemplate(
      options.templateValue,
      options.decimalPlaces
    ),
    caption: options.caption ?? null
  };
}

function buildQuotientTemplate(value, decimalPlaces) {
  if (value === undefined || value === null) return [];
  let templateString;
  if (typeof decimalPlaces === "number") {
    templateString = Number(value).toFixed(decimalPlaces);
  } else {
    templateString = String(value);
  }
  return Array.from(templateString)
    .filter((char) => /[\d.]/.test(char))
    .map((char) => (char === "." ? "decimal" : "digit"));
}

function computeScore(seconds, hintsUsed) {
  const base = 20;
  const timePenalty = Math.floor(seconds / 8);
  const hintPenalty = hintsUsed * 4;
  return Math.max(1, base - timePenalty - hintPenalty);
}

function parseFraction(input) {
  const trimmed = input.replace(/\s+/g, "");
  const match = trimmed.match(/^(-?\d+)\/(\d+)$/);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  const den = parseInt(match[2], 10);
  if (den === 0) return null;
  const simplified = simplifyFraction(num, den);
  return simplified;
}

function parseMixed(input) {
  const normalized = input.trim().replace(/\s+/g, " ");
  if (/^-?\d+$/.test(normalized)) {
    const whole = parseInt(normalized, 10);
    return { whole, num: 0, den: 1 };
  }
  const match = normalized.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (!match) return null;
  const whole = parseInt(match[1], 10);
  const num = parseInt(match[2], 10);
  const den = parseInt(match[3], 10);
  if (den === 0 || num >= den) return null;
  return { whole, num, den };
}

function simplifyFraction(num, den) {
  const divisor = gcd(Math.abs(num), Math.abs(den));
  const simplified = { num: num / divisor, den: den / divisor };
  if (simplified.den < 0) {
    simplified.den *= -1;
    simplified.num *= -1;
  }
  return simplified;
}

function toMixed(fr) {
  const whole = Math.trunc(fr.num / fr.den);
  const remainder = Math.abs(fr.num % fr.den);
  if (remainder === 0) {
    return { whole, num: 0, den: 1 };
  }
  return { whole, num: remainder, den: fr.den };
}

function fractionToString(fr) {
  return `${fr.num}/${fr.den}`;
}

function mixedToString(mixed) {
  if (mixed.num === 0) return `${mixed.whole}`;
  return `${mixed.whole} ${mixed.num}/${mixed.den}`;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function threeDigits(num) {
  return {
    ones: num % 10,
    tens: Math.floor(num / 10) % 10,
    hundreds: Math.floor(num / 100) % 10
  };
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatAnswer(answer) {
  switch (answer.type) {
    case "integer":
      return `${answer.value}`;
    case "decimal":
      return answer.value.toFixed(answer.precision ?? 2);
    case "fraction":
      return fractionToString(answer.value);
    case "mixed":
      return mixedToString(answer.value);
    default:
      return "";
  }
}

document.addEventListener("DOMContentLoaded", init);
