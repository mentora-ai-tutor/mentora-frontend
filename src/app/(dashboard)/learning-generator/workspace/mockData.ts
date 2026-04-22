export const MOCK_LESSON_DATA = {
  "_id": {
    "$oid": "69de3109a9df7f48d73b0f82"
  },
  "structured_material": {
    "material_id": "STU-2026-0428_java-recursion-001_1776169222531",
    "student_id": "STU-2026-0428",
    "topic": "Recursion",
    "topic_id": "java-recursion-001",
    "gap_type": "FUNDAMENTAL_GAP",
    "difficulty_level": "beginner",
    "generated_at": "2026-04-14T12:20:22.531Z",
    "generation_models": {
      "llm": "qwen2.5-coder:7b",
      "slm": "qwen2.5-coder:7b"
    },
    "lesson": {
      "page_title": "Java Recursion - MENTORA Tutorial",
      "introduction": {
        "what_is_it": "Recursion is a method of solving problems by breaking them down into smaller and smaller sub-problems until you reach a base case, which is a problem that can be solved without further recursion. It's like peeling an onion: each layer reveals the next one until you reach the core.",
        "why_learn_it": "Recursion is used in many real-world applications such as file systems, game algorithms, and computer graphics. For instance, traversing directories on a disk or implementing complex search algorithms are often easier with recursion.",
        "prerequisite_note": "Before diving into recursion, you should be familiar with methods and their return values, as well as the basics of how the stack data structure works."
      },
      "concept_explained": {
        "core_definition": "A method that calls itself one or more times during its execution.",
        "analogy": "Imagine stacking plates on top of each other. Each plate is like a function call, and when you take off the top plate (pop), it's like returning from a recursive call. If there are no more plates to take off (the stack is empty), you've reached the base case.",
        "how_java_handles_it": "In Java, recursion relies on the call stack. When a method calls itself, a new frame is pushed onto the stack. Each frame contains local variables and the return address. Once the base case is reached, the frames are popped off the stack until the original method completes.",
        "misconceptions_corrected": "MISCONCEPTION 1: Thinks the base case is optional\nTHE TRUTH: A recursive function must have a base case to prevent infinite recursion and ultimately lead to a solution.\nJAVA PROOF: public int factorial(int n) { if (n == 0) return 1; return n * factorial(n - 1); }\n\nMISCONCEPTION 2: Confuses stack frame with heap allocation\nTHE TRUTH: Stack frames are used for method calls and local variables, while the heap is used for dynamic memory allocation.\nJAVA PROOF: Stack stores int x = 5; Heap stores new StringBuilder(\"Hello\");\n\nMISCONCEPTION 3: Believes recursive calls run in parallel\nTHE TRUTH: Recursive calls are executed sequentially on the call stack. They do not run in parallel until explicitly designed to do so with multiple threads.\nJAVA PROOF: public void printNumbers(int n) { if (n > 0) { System.out.println(n); printNumbers(n - 1); } }\n"
      },
      "syntax_reference": {
        "basic_syntax": "public [return_type] method_name([parameters]) {\n\t[base_case]\n\t[recursive_step]\n}",
        "syntax_breakdown": [
          "1. public [return_type]: Access modifier and return type of the method.",
          "2. method_name: The name of the recursive method.",
          "3. ([parameters]): Parameters passed to the method, if any.",
          "4. { ... } : Body of the method where the logic resides."
        ],
        "important_rules": [
          "1. Always include a base case to prevent infinite recursion.",
          "2. The base case should return a value that does not depend on further recursive calls.",
          "3. Ensure each recursive call moves towards the base case.",
          "4. The method must eventually reach the base case to avoid a stack overflow error."
        ]
      },
      "examples": {
        "example_1": {
          "title": "Example 1 - Basic Recursion",
          "description": "Calculate the factorial of a number using recursion.",
          "code": "public class Factorial {\n\tpublic static int factorial(int n) {\n\t\tif (n == 0) return 1;\n\t\treturn n * factorial(n - 1);\n\t}\n\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(factorial(5)); // Output: 120\n\t}\n}",
          "output": "120",
          "explanation": "The factorial of a number n is the product of all positive integers less than or equal to n. The base case here is when n equals 0, returning 1 as 0! = 1. Each recursive call multiplies n by the factorial of n-1 until it reaches the base case."
        },
        "example_2": {
          "title": "Example 2 - Real-World Use Case",
          "description": "Count down from a given number using recursion.",
          "code": "public class Countdown {\n\tpublic static void countdown(int n) {\n\t\tif (n > 0) {\n\t\t\tSystem.out.println(n);\n\t\t\tcountdown(n - 1);\n\t\t}\n\t}\n\n\tpublic static void main(String[] args) {\n\t\tcountdown(4); // Output: 4, 3, 2, 1\n\t}\n}",
          "output": "4\n3\n2\n1",
          "explanation": "Counting down from a number is a straightforward use of recursion. The base case here is when n equals 0, at which point the method stops calling itself."
        },
        "example_3_misconception_fix": {
          "title": "Example 3 - Your Mistake vs The Fix",
          "description": "The mistake this student makes.",
          "wrong_code": "public class MissingBaseCase {\n\tpublic static int missingBaseCase(int n) {\n\t\treturn n * missingBaseCase(n);\n\t}\n\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(missingBaseCase(5)); // BUG\n\t}\n}",
          "wrong_output": "StackOverflowError",
          "correct_code": "public class CorrectBaseCase {\n\tpublic static int correctBaseCase(int n) {\n\t\tif (n == 0) return 1;\n\t\treturn n * correctBaseCase(n - 1);\n\t}\n\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(correctBaseCase(5)); // Output: 120\n\t}\n}",
          "correct_output": "120",
          "explanation": "The mistake was missing the base case, leading to infinite recursion. The fix included a proper base case that returns 1 when n equals 0."
        }
      },
      "step_by_step_guide": {
        "overview": "To write a recursive function, follow these steps: understand the problem, identify the base case, define the recursive step, and finally test the code.",
        "steps": [
          {
            "step_number": 1,
            "title": "Understand the problem",
            "instruction": "Identify what needs to be solved and break it down into smaller parts.",
            "java_tip": "Draw a simple diagram or pseudo-code."
          },
          {
            "step_number": 2,
            "title": "Identify the base case",
            "instruction": "Determine when the recursion should stop. This is usually when the input reaches its smallest possible value.",
            "java_tip": "Write down the base case condition in your code comments."
          },
          {
            "step_number": 3,
            "title": "Define the recursive step",
            "instruction": "Describe how the problem can be simplified and solved recursively.",
            "java_tip": "Ensure each recursive call makes progress towards the base case."
          },
          {
            "step_number": 4,
            "title": "Write and test the code",
            "instruction": "Implement the logic and test it with different inputs to ensure it works as expected.",
            "java_tip": "Use print statements or a debugger to trace the execution."
          },
          {
            "step_number": 5,
            "title": "Trace the execution manually",
            "instruction": "Manually trace the recursive calls on paper to understand how the function executes.",
            "java_tip": "Create a flowchart of the recursive call stack."
          }
        ]
      },
      "common_mistakes": [
        {
          "mistake_number": 1,
          "title": "Mistake 1",
          "description": "Forgetting to include a base case leads to infinite recursion and a StackOverflowError.",
          "bad_code": "// BUG: public int missingBaseCase(int n) { return n * missingBaseCase(n); }",
          "good_code": "public int correctBaseCase(int n) { if (n == 0) return 1; return n * correctBaseCase(n - 1); }",
          "explanation": "A recursive function must have a base case to terminate the recursion."
        },
        {
          "mistake_number": 2,
          "title": "Mistake 2",
          "description": "Confusing stack frames with heap allocation can lead to misunderstandings about memory management.",
          "bad_code": "// BUG: public void incorrectMemoryManagement(int n) { int[] array = new int[n]; incorrectMemoryManagement(n); }",
          "good_code": "public void correctMemoryManagement(int n) { if (n > 0) { int[] array = new int[n]; correctMemoryManagement(n - 1); } }",
          "explanation": "Stack frames store local variables and return addresses, while the heap is used for dynamic memory allocation."
        },
        {
          "mistake_number": 3,
          "title": "Mistake 3",
          "description": "Thinking recursive calls run in parallel can lead to errors.",
          "bad_code": "// BUG: public void parallelRecursion(int n) { if (n > 0) { new Thread(() -> parallelRecursion(n - 1)).start(); } }",
          "good_code": "public void sequentialRecursion(int n) { if (n > 0) { sequentialRecursion(n - 1); } }",
          "explanation": "Recursive calls are executed sequentially on the call stack unless explicitly designed to run in parallel."
        }
      ],
      "debugging_exercise": {
        "title": "Debug This \u2014 Find The Bug",
        "scenario": "Identify and fix the bug in a recursive function that calculates Fibonacci numbers.",
        "broken_code": "// BUG: public class Fibonacci {\n\tpublic static int fibonacci(int n) {\n\t\tif (n <= 1) return n;\n\t\treturn fibonacci(n - 1) + fibonacci(n - 2);\n\t}\n\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(fibonacci(6)); // Output: 8\n\t}\n}",
        "error_output": "StackOverflowError",
        "hint": "How many times does the function call itself for each input value?",
        "solution_code": "// FIXED: public class Fibonacci {\n\tpublic static int fibonacci(int n) {\n\t\tif (n <= 1) return n;\n\t\treturn fibonacci(n - 1) + fibonacci(n - 2);\n\t}\n\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(fibonacci(6)); // Output: 8\n\t}\n}",
        "solution_explanation": "WHAT WAS WRONG: The original code lacked a base case for n = 0, causing infinite recursion.\nWHY IT BROKE: Without a proper base case, the function kept calling itself indefinitely until it reached the maximum stack depth, leading to a StackOverflowError.\nWHY THE FIX WORKS: Adding the missing base case ensures that the function eventually reaches its termination condition.\nHOW TO AVOID THIS: Always include a base case in your recursive functions."
      },
      "quick_reference": {
        "cheat_sheet": "public [return_type] method_name([parameters]) {\n\t[base_case]\n\t[recursive_step]\n}\n\n1. Base case must be present.\n2. Each call must move towards the base case.\n3. Always include a return value in each branch.",
        "important_rules": [
          "1. Ensure the base case is correctly defined to prevent infinite recursion.",
          "2. The recursive step should simplify the problem and bring it closer to the base case.",
          "3. Return values from all branches must be consistent with the function's return type."
        ]
      },
      "connections": null
    },
    "assessment": {
      "quiz": [
        {
          "question_number": 1,
          "type": "code_output",
          "question": "What is the output of this Java code snippet?\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(factorial(3));\n    }\n    public static int factorial(int n) {\n        return n * factorial(n - 1);\n    }\n}",
          "options": [
            "A) 6",
            "B) Error",
            "C) Stack Overflow",
            "D) 0"
          ],
          "correct": "A",
          "explanation": "The function correctly calculates the factorial of 3, which is 6.",
          "misconception_targeted": "misconception 1",
          "difficulty": "beginner"
        },
        {
          "question_number": 2,
          "type": "conceptual",
          "question": "Which of the following statements about stack frames in recursion is true?",
          "options": [
            "A) Stack frames are allocated on the heap.",
            "B) Each recursive call creates a new stack frame.",
            "C) Recursive calls run in parallel.",
            "D) Stack frames are used for data storage only."
          ],
          "correct": "B",
          "explanation": "In recursion, each function call gets its own stack frame.",
          "misconception_targeted": "misconception 2",
          "difficulty": "beginner"
        },
        {
          "question_number": 3,
          "type": "complete_the_code",
          "question": "Complete the Java code snippet to ensure it calculates and returns the factorial of a number correctly.",
          "code_snippet": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(factorial(5));\n    }\n    public static int factorial(int n) {\n        if (n == 0) return 1;\n        return n * ___BLANK___.\n    }\n}",
          "options": [
            "A) factorial(n - 1)",
            "B) factorial(n + 1)",
            "C) n * (n - 1)",
            "D) 0"
          ],
          "correct": "A",
          "explanation": "The base case is when n equals 0, and the recursive call should be made with n - 1.",
          "misconception_targeted": "misconception 3",
          "difficulty": "beginner"
        }
      ],
      "concept_summary": "RECURSION\nRecursion is a method where the solution to a problem depends on solutions to smaller instances of the same problem. It involves two key parts: a base case and recursive calls.\n\nKEY RULE:\nThe function must have a base case to stop recursion, and each recursive call should move towards the base case.\n\nREMEMBER:\n• Always define a base case that returns a known value.\n• Each recursive call should reduce the problem size step by step.\n• Stack frames are created for each recursive call on the stack.",
      "practice_challenge": {
        "title": "Practice: Recursion",
        "difficulty": "beginner",
        "time_estimate": "15-20 minutes",
        "problem_statement": "Write a recursive function to calculate and return the sum of the first n natural numbers.\n\nRequirements:\n- Core functionality (sum calculation)\n- Edge case handling (when n is 0 or negative)\n- Input validation (check if n is an integer)",
        "requirements": [
          "Core functionality",
          "Edge case",
          "Input validation"
        ],
        "starter_code": "public class Main {\n    public static void main(String[] args) {\n        int n = 5;\n        System.out.println(sum(n));\n    }\n\n    public static int sum(int n) {\n        // TODO: Implement recursive sum calculation\n    }\n}",
        "example_input": "Input: 5",
        "expected_output": "Expected Output: 15",
        "bonus": "Write a tail-recursive version of the sum function (if possible in Java)."
      },
      "self_check": {
        "can_you": [
          "Can you explain Recursion?",
          "Can you write a solution from scratch?",
          "Can you trace execution manually?",
          "Can you identify the bug?",
          "Can you explain when to use Recursion?"
        ],
        "if_stuck": "Practice drawing the call stack for simple recursive functions to understand how it works."
      }
    },
    "personalisation": {
      "misconceptions_targeted": [
        "Thinks the base case is optional",
        "Confuses stack frame with heap allocation",
        "Believes recursive calls run in parallel"
      ],
      "error_patterns": {
        "missing_base_case": 8,
        "infinite_recursion": 5,
        "wrong_return_value": 3
      },
      "evidence_summary": "Student scored 18/60 on Recursion quiz. Submitted 8 solutions with missing base cases. Cannot trace call stack manually.",
      "prerequisite_topics": [
        "Methods and return values",
        "Stack data structure basics"
      ],
      "related_topics": [
        "Binary search",
        "Tree traversal",
        "Dynamic programming"
      ]
    },
    "study_plan": {
      "estimated_minutes": 60,
      "learning_objectives": [
        "Define a correct base case for any recursive function",
        "Trace a recursive call stack manually for n<=4",
        "Convert a simple loop to a recursive equivalent",
        "Identify infinite recursion before running code"
      ],
      "suggested_sequence": [
        {
          "step": 1,
          "activity": "Read introduction and concept_explained",
          "duration_min": 10,
          "focus": "Build intuition and correct misconceptions"
        },
        {
          "step": 2,
          "activity": "Follow step_by_step_guide",
          "duration_min": 15,
          "focus": "Understand the design process"
        },
        {
          "step": 3,
          "activity": "Study examples (all 3)",
          "duration_min": 10,
          "focus": "See correct and incorrect patterns"
        },
        {
          "step": 4,
          "activity": "Complete debugging_exercise",
          "duration_min": 15,
          "focus": "Apply understanding to find bugs"
        },
        {
          "step": 5,
          "activity": "Answer quiz questions",
          "duration_min": 10,
          "focus": "Verify conceptual understanding"
        },
        {
          "step": 6,
          "activity": "Attempt practice_challenge",
          "duration_min": null,
          "focus": "Independent application"
        }
      ],
      "prerequisite_review": [
        "Methods and return values",
        "Stack data structure basics"
      ]
    }
  }
};
