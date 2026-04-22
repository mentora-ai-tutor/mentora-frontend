"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle2, Circle, Lock, Play, RotateCcw, Sparkles, 
  Lightbulb, ChevronRight, Check, Target, Brain, Award, 
  XCircle, ChevronLeft, Code2, Terminal, ShieldAlert 
} from "lucide-react";
import { MOCK_LESSON_DATA } from "./mockData";

const STEPS = [
  { id: "intro", title: "Introduction", type: "read" },
  { id: "concepts", title: "Concepts & Syntax", type: "read" },
  { id: "guide", title: "Step-by-Step Guide", type: "read" },
  { id: "example", title: "Code Examples", type: "code" },
  { id: "mistakes", title: "Common Mistakes", type: "read" },
  { id: "practice", title: "Practice Challenge", type: "code" },
  { id: "debug", title: "Debugging", type: "code" },
  { id: "quiz", title: "Mastery Quiz", type: "quiz" },
];

export default function LearningWorkspace() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([0]);
  
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Quiz State
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});

  const material = MOCK_LESSON_DATA.structured_material;
  const lesson = material.lesson;
  const assessment = material.assessment;

  // Load correct code when step changes
  useEffect(() => {
    if (activeStep === 3) {
      setCode(lesson.examples.example_1.code);
    } else if (activeStep === 5) {
      setCode(assessment.practice_challenge.starter_code);
    } else if (activeStep === 6) {
      setCode(lesson.debugging_exercise.broken_code);
    } else {
      setCode("");
    }
    setAiFeedback(null);
    setOutput("");
  }, [activeStep, lesson.examples.example_1.code, assessment.practice_challenge.starter_code, lesson.debugging_exercise.broken_code]);

  const handleRunCode = () => {
    setIsExecuting(true);
    setOutput("");
    setAiFeedback(null);
    
    setTimeout(() => {
      setIsExecuting(false);
      
      if (activeStep === 6) {
        setOutput(lesson.debugging_exercise.error_output);
        simulateAiTyping(`I noticed something! ${lesson.debugging_exercise.hint} ${lesson.debugging_exercise.solution_explanation.split("\n")[0]}`);
      } else if (activeStep === 5) {
        if (code.includes("if (n <= 0) return 0;") || code.includes("return n + sum(n - 1)")) {
          setOutput(assessment.practice_challenge.expected_output);
          simulateAiTyping("Great job! You successfully implemented the recursive step and handled edge cases.");
          if (!completedSteps.includes(5)) setCompletedSteps([...completedSteps, 5]);
        } else {
           setOutput("Output: StackOverflowError");
           simulateAiTyping("Not quite. Remember that a recursive function needs a 'base case' to stop calling itself. What happens if n = 0?");
        }
      } else if (activeStep === 3) {
        setOutput(lesson.examples.example_1.output);
        simulateAiTyping("The example code executed successfully! Try modifying it.");
      }
    }, 1000);
  };

  const simulateAiTyping = (text: string) => {
    setIsAiTyping(true);
    setAiFeedback("");
    let i = 0;
    const interval = setInterval(() => {
      setAiFeedback(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setIsAiTyping(false);
      }
    }, 10);
  };

  const handleNextStep = () => {
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps([...completedSteps, activeStep]);
    }
    if (activeStep < STEPS.length - 1) setActiveStep(prev => prev + 1);
  };

  const handleQuizSubmit = () => {
     let correct = 0;
     assessment.quiz.forEach(q => {
        if (answers[q.question_number] === q.correct) correct++;
     });
     setQuizScore(Math.round((correct / assessment.quiz.length) * 100));
  };

  return (
    <div className="flex h-[calc(100vh-80px)] -mt-4 -mb-8 -mx-6 bg-[#0F172A] text-white overflow-hidden font-sans">
      
      {/* ── SIDEBAR: LEARNING PATH ── */}
      <div className="w-72 flex-shrink-0 bg-[#0F172A] border-r border-white/5 flex flex-col z-10 hidden xl:flex">
        <div className="p-6 pb-2">
          <Link href="/learning-generator" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-bold mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Plan
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-wider mb-3">
             {material.difficulty_level} Module
          </div>
          <h2 className="text-xl font-black mb-1 text-white">{material.topic}</h2>
          <p className="text-white/40 text-xs mb-6">Interactive Workspace</p>

          <div className="w-full h-1.5 bg-[#334155]/50 rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedSteps.length / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1 custom-scrollbar">
          {STEPS.map((step, idx) => {
            const isCompleted = completedSteps.includes(idx);
            const isActive = activeStep === idx;
            const isLocked = idx > Math.max(...completedSteps, 0) + 1;

            return (
              <button
                key={step.id}
                disabled={isLocked}
                onClick={() => setActiveStep(idx)}
                className={`w-full flex items-center gap-3 p-3 text-left rounded-xl transition-all ${
                  isActive 
                    ? "bg-[#334155]/40 border border-teal-500/30 shadow-[0_0_15px_rgba(13,148,136,0.1)]" 
                    : isLocked 
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className={`shrink-0 flex items-center justify-center ${isActive ? 'text-teal-400' : isCompleted ? 'text-teal-500' : 'text-white/20'}`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : <Circle className="w-5 h-5" />}
                </div>
                <div>
                  <p className={`text-sm font-bold ${isActive ? 'text-teal-300' : isLocked ? 'text-white/40' : 'text-white/80'}`}>
                    {idx + 1}. {step.title}
                  </p>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">{step.type}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0F172A] relative">
        
        {/* QUIZ + MASTERY PAGE */}
        {activeStep === 7 ? (
          <div className="flex-1 overflow-y-auto p-8 lg:p-16 animate-fade-in flex items-center justify-center">
             {quizScore === null ? (
               <div className="max-w-3xl w-full">
                  <div className="text-center mb-10">
                    <div className="inline-flex w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 items-center justify-center mb-4">
                      <Target className="w-8 h-8 text-teal-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white">Knowledge Check</h2>
                    <p className="text-white/50 mt-2">Pass this quick assessment to achieve mastery in {material.topic}.</p>
                  </div>
                  
                  <div className="space-y-6">
                    {assessment.quiz.map((q, qIndex) => (
                      <div key={qIndex} className="p-6 bg-[#334155]/20 border border-white/10 rounded-2xl">
                         <p className="text-sm font-bold text-teal-400 mb-2">Question {q.question_number} ({q.type.replace('_', ' ')})</p>
                         <h3 className="text-lg font-medium text-white mb-4 whitespace-pre-wrap">{q.question}</h3>
                         {q.code_snippet && (
                           <pre className="p-3 bg-[#0F172A] rounded-xl text-teal-200 text-sm font-mono mb-4 border border-white/5">
                             {q.code_snippet}
                           </pre>
                         )}
                         <div className="space-y-3">
                           {q.options.map((opt, i) => {
                             const letter = opt.substring(0, 1);
                             const isSelected = answers[q.question_number] === letter;
                             return (
                               <div 
                                 key={i} 
                                 onClick={() => setAnswers({...answers, [q.question_number]: letter})}
                                 className={`p-4 border rounded-xl cursor-pointer transition-colors flex items-center gap-3 ${
                                   isSelected ? 'border-teal-500 bg-teal-500/10' : 'border-white/5 bg-[#0F172A] hover:border-teal-500/50 hover:bg-teal-500/5'
                                 }`}
                               >
                                 <div className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${isSelected ? 'border-teal-400 bg-teal-400' : 'border-white/20'}`}>
                                    {isSelected && <div className="w-1.5 h-1.5 bg-[#0F172A] rounded-full" />}
                                 </div>
                                 <span className="text-sm text-white/80">{opt}</span>
                               </div>
                             );
                           })}
                         </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(answers).length < assessment.quiz.length}
                      className="px-6 py-3 bg-teal-600 disabled:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(13,148,136,0.3)] hover:bg-teal-500 transition-all"
                    >
                      Submit Answers
                    </button>
                  </div>
               </div>
             ) : (
               <div className="max-w-md w-full text-center space-y-6 animate-slide-up">
                 <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#B45309]/20 rounded-full blur-[40px] animate-pulse" />
                    <div className="absolute inset-2 border-2 border-[#B45309]/50 rounded-full animate-spin-slow" />
                    <Award className="w-16 h-16 text-[#B45309] relative z-10" />
                 </div>
                 <div>
                   <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-[#B45309]">{quizScore >= 80 ? "Mastery Achieved!" : "Good Try!"}</h2>
                   <p className="text-white/60 mt-3">You scored <span className="text-white font-bold">{quizScore}%</span> on the {material.topic} module.</p>
                 </div>
                 
                 <div className="p-4 bg-gradient-to-br from-[#B45309]/10 to-transparent border border-[#B45309]/20 rounded-xl inline-block mx-auto text-left">
                    <p className="text-xs text-[#B45309] font-bold uppercase tracking-wider mb-1">Rewards Gained</p>
                    <p className="text-sm text-white flex items-center gap-2"><Check className="w-4 h-4 text-green-400"/> +{quizScore} Mastery Points</p>
                    {quizScore >= 100 && <p className="text-sm text-white flex items-center gap-2"><Check className="w-4 h-4 text-green-400"/> Gold Badge: {material.topic} Initiate</p>}
                 </div>

                 <div className="pt-4">
                   <Link href="/learning-generator" className="px-8 py-3 bg-white text-[#0F172A] font-black rounded-xl hover:bg-teal-50 transition-colors w-full flex items-center justify-center gap-2">
                     Return to Hub
                   </Link>
                 </div>
               </div>
             )}
          </div>
        ) : (
          /* INTERACTIVE LEARNING (SPLIT SCREEN) */
          <div className="flex-1 flex flex-col lg:flex-row h-full">
            
            {/* LEFT PANE: Content & Explanation */}
            <div className="flex-1 p-6 lg:p-10 overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/5 custom-scrollbar">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                    {activeStep === 6 ? <ShieldAlert className="w-5 h-5 text-red-400" /> : <Brain className="w-5 h-5 text-teal-400" />}
                  </div>
                  <h1 className="text-2xl font-black text-white">{STEPS[activeStep].title}</h1>
                </div>

                <div className="prose prose-invert prose-teal max-w-none">
                  {activeStep === 0 && (
                    <>
                      <p className="text-white/80 text-lg leading-relaxed mb-6 font-medium">
                        {lesson.introduction.what_is_it}
                      </p>
                      <h3 className="text-teal-400 font-bold mt-8 mb-2">Why learn this?</h3>
                      <p className="text-white/70 leading-relaxed text-sm">
                        {lesson.introduction.why_learn_it}
                      </p>
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl my-6">
                        <p className="text-amber-200/80 font-medium text-sm m-0">
                          <strong>Prerequisites:</strong> {lesson.introduction.prerequisite_note}
                        </p>
                      </div>
                    </>
                  )}

                  {activeStep === 1 && (
                    <>
                      <p className="text-white/80 text-lg leading-relaxed mb-6">
                        <strong>Core Definition:</strong> {lesson.concept_explained.core_definition}
                      </p>
                      <div className="p-4 bg-[#334155]/30 border border-white/10 rounded-xl my-6 text-sm text-white/70">
                        <strong>Analogy:</strong> {lesson.concept_explained.analogy}
                      </div>
                      <h3 className="text-teal-400 font-bold mt-8 mb-4">Syntax Reference</h3>
                      <pre className="p-4 bg-[#0F172A] border border-white/5 rounded-xl text-teal-200 font-mono text-sm">
                        {lesson.syntax_reference.basic_syntax}
                      </pre>
                      <ul className="space-y-3 mt-4 text-white/70 text-sm list-decimal pl-5">
                        {lesson.syntax_reference.syntax_breakdown.map((rule, i) => (
                           <li key={i}>{rule.replace(/^\d+\.\s*/, '')}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {activeStep === 2 && (
                    <>
                      <p className="text-white/80 text-lg leading-relaxed mb-6 font-medium">
                        {lesson.step_by_step_guide.overview}
                      </p>
                      <div className="space-y-4 mt-6">
                        {lesson.step_by_step_guide.steps.map((step, idx) => (
                           <div key={idx} className="p-5 bg-[#334155]/20 border border-white/5 rounded-2xl hover:border-teal-500/30 transition-colors">
                              <h4 className="text-teal-400 font-bold mb-2">Step {step.step_number}: {step.title}</h4>
                              <p className="text-white/70 text-sm mb-4 leading-relaxed">{step.instruction}</p>
                              <div className="px-3 py-2 bg-amber-500/10 text-amber-200/70 border border-amber-500/20 text-xs font-mono rounded inline-block">
                                💡 Tip: {step.java_tip}
                              </div>
                           </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeStep === 3 && (
                     <>
                       <p className="text-white/70 text-lg leading-relaxed mb-6">
                         {lesson.examples.example_1.description}
                       </p>
                       <p className="text-white/60 text-sm leading-relaxed border-l-2 border-teal-500 pl-4 py-1">
                         {lesson.examples.example_1.explanation}
                       </p>
                     </>
                  )}

                  {activeStep === 4 && (
                    <>
                      <h3 className="text-xl font-bold text-white mb-6">Common Pitfalls</h3>
                      <div className="space-y-6">
                        {lesson.common_mistakes.map((mistake, idx) => (
                           <div key={idx} className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl">
                              <h4 className="text-red-400 font-bold mb-2">{mistake.title}</h4>
                              <p className="text-white/70 text-sm mb-5 leading-relaxed">{mistake.description}</p>
                              
                              <div className="grid lg:grid-cols-2 gap-4 mb-3">
                                <div className="p-4 bg-red-950/40 rounded-xl border border-red-500/20 font-mono text-xs overflow-x-auto">
                                   <span className="text-[10px] uppercase text-red-500 font-black tracking-widest mb-2 block">Bad Pattern</span>
                                   <code className="text-white/60 whitespace-pre text-red-100">{mistake.bad_code}</code>
                                </div>
                                <div className="p-4 bg-teal-900/40 rounded-xl border border-teal-500/20 font-mono text-xs overflow-x-auto">
                                   <span className="text-[10px] uppercase text-teal-400 font-black tracking-widest mb-2 block">Correct Pattern</span>
                                   <code className="text-white/80 whitespace-pre text-teal-50">{mistake.good_code}</code>
                                </div>
                              </div>
                              <p className="text-white/50 text-xs mt-3 italic">{mistake.explanation}</p>
                           </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeStep === 5 && (
                     <>
                       <p className="text-white/80 text-lg leading-relaxed mb-6">
                         {assessment.practice_challenge.problem_statement.split("\n")[0]}
                       </p>
                       <h3 className="text-teal-400 font-bold mt-6 mb-2">Requirements</h3>
                       <ul className="space-y-2 text-white/70 text-sm list-disc pl-5 mb-6">
                         {assessment.practice_challenge.requirements.map((req, i) => <li key={i}>{req}</li>)}
                       </ul>
                       <div className="p-3 bg-[#0F172A] rounded-xl text-white/50 text-xs font-mono border border-white/5">
                         {assessment.practice_challenge.example_input} <br/>
                         {assessment.practice_challenge.expected_output}
                       </div>
                     </>
                  )}

                  {activeStep === 6 && (
                    <>
                      <p className="text-white/80 text-lg leading-relaxed">
                        {lesson.debugging_exercise.scenario}
                      </p>
                      <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-xl my-6">
                        <p className="text-red-200 font-medium m-0 text-sm">
                          <strong>Runtime Error:</strong> {lesson.debugging_exercise.error_output}
                        </p>
                      </div>
                      <p className="text-white/70 text-sm">
                        Use the interactive environment to step through the logic. Can you spot the bug? 
                      </p>
                    </>
                  )}
                </div>

                {/* AI Actions */}
                <div className="mt-10 flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-gradient-to-r from-teal-600/20 to-teal-800/20 border border-teal-500/30 hover:bg-teal-500/20 text-teal-300 text-sm font-bold rounded-xl flex items-center gap-2 transition-all">
                    <Sparkles className="w-4 h-4" /> Explain Simpler
                  </button>
                  <button className="px-4 py-2 bg-[#334155]/30 border border-white/10 hover:bg-[#334155]/50 text-white/70 text-sm font-bold rounded-xl flex items-center gap-2 transition-all">
                    <Lightbulb className="w-4 h-4" /> Give a Real-life Analogy
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT PANE: Code Editor & AI Feedback */}
            <div className="flex-[1.2] flex flex-col bg-[#0b1021]">
              
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#0F172A] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-mono text-white/60">main.java</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                        if (activeStep === 3) setCode(lesson.examples.example_1.code);
                        if (activeStep === 5) setCode(assessment.practice_challenge.starter_code);
                        if (activeStep === 6) setCode(lesson.debugging_exercise.broken_code);
                  }} className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Reset">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleRunCode}
                    disabled={activeStep !== 3 && activeStep !== 5 && activeStep !== 6 || isExecuting}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:cursor-wait text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-teal-900/20"
                  >
                    <Play className="w-3 h-3 fill-current" /> {isExecuting ? "Running..." : "Run Code"}
                  </button>
                </div>
              </div>

              {/* Editor Workspace */}
              <div className="flex-1 relative">
                {(activeStep !== 3 && activeStep !== 5 && activeStep !== 6) ? (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20 flex-col gap-3 pointer-events-none">
                     <Terminal className="w-12 h-12 opacity-50" />
                     <p className="text-sm">Interactive editor unlocked via coding steps.</p>
                  </div>
                ) : (
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck="false"
                    className="absolute inset-0 w-full h-full p-6 bg-transparent text-white/90 font-mono text-sm leading-relaxed resize-none outline-none focus:ring-0 custom-scrollbar whitespace-pre"
                    style={{ tabSize: 4 }}
                  />
                )}
              </div>

              {/* Terminal & AI Feedback Panel */}
              <div className="h-64 flex flex-col bg-[#0F172A] border-t border-white/5 relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <div className="flex border-b border-white/5">
                  <div className="px-4 py-2 border-b-2 border-teal-500 text-teal-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Mentora AI Output
                  </div>
                  <div className="px-4 py-2 text-white/30 text-xs font-bold uppercase tracking-wider">
                    Console
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                  {output && (
                    <div className="font-mono text-xs text-white/50 bg-black/30 p-3 rounded-lg border border-white/5">
                      <pre>{output}</pre>
                    </div>
                  )}

                  {isExecuting && !output && (
                     <div className="flex gap-1.5 px-2 py-1">
                       <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" />
                       <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100" />
                       <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200" />
                     </div>
                  )}

                  {aiFeedback && (
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0 mt-0.5">
                         <Brain className="w-3.5 h-3.5 text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-teal-50 leading-relaxed font-medium">
                          {aiFeedback}
                          {isAiTyping && <span className="inline-block w-1.5 h-3.5 ml-1 bg-teal-400 animate-pulse align-middle" />}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {!output && !aiFeedback && !isExecuting && (activeStep === 3 || activeStep === 5 || activeStep === 6) && (
                    <p className="text-sm text-white/30 italic px-2">Ready. Hit Run Code to execute your logic and get AI feedback.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── BOTTOM NAVIGATION PROGRESS ── */}
        <div className="h-20 bg-[#0F172A] border-t border-white/5 flex items-center justify-between px-6 lg:px-10 shrink-0 z-20">
          <button 
             onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
             disabled={activeStep === 0}
             className="px-5 py-2.5 text-white/50 font-semibold hover:text-white disabled:opacity-30 transition-colors"
          >
             Previous
          </button>
          
          {activeStep < 7 && (
            <button
               onClick={handleNextStep}
               className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(13,148,136,0.2)] flex items-center gap-2 group"
            >
               Next Concept <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
