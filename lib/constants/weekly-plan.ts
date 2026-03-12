export interface DailyPlanTask {
  week: number;
  day: number; // 1-7 (Mon-Sun)
  morning_task: string;
  evening_7pm_task: string;
  evening_9pm_task: string;
  evening_10pm_task: string;
  is_weekend: boolean;
}

// Phase labels for each week
export const WEEK_PHASES: Record<number, string> = {
  1: "DSA Foundations",
  2: "DSA Foundations",
  3: "ML Fundamentals",
  4: "ML Fundamentals",
  5: "Deep Learning",
  6: "Deep Learning",
  7: "LLM / GenAI",
  8: "LLM / GenAI",
  9: "Projects Sprint",
  10: "ML System Design",
  11: "ML System Design",
  12: "Interview Prep",
  13: "Interview Prep",
  14: "Final Review",
};

function weekday(week: number, day: number, morning: string, e7: string, e9: string, e10: string): DailyPlanTask {
  return { week, day, morning_task: morning, evening_7pm_task: e7, evening_9pm_task: e9, evening_10pm_task: e10, is_weekend: false };
}

function weekend(week: number, day: number, morning: string, e7: string, e9: string, e10: string): DailyPlanTask {
  return { week, day, morning_task: morning, evening_7pm_task: e7, evening_9pm_task: e9, evening_10pm_task: e10, is_weekend: true };
}

export const WEEKLY_PLAN: DailyPlanTask[] = [
  // Week 1: DSA Foundations — Arrays, Strings, Hashing
  weekday(1, 1, "Solve 2 LC: Arrays basics", "Study: Arrays & Hashing patterns", "Solve 2 LC: Two Sum variants", "Review: Time complexity fundamentals"),
  weekday(1, 2, "Solve 2 LC: String problems", "Study: Two pointer technique", "Solve 2 LC: Two pointers", "Review: Space complexity analysis"),
  weekday(1, 3, "Solve 2 LC: Hash map problems", "Study: Sliding window technique", "Solve 2 LC: Sliding window", "Review today's problem approaches"),
  weekday(1, 4, "Solve 2 LC: Prefix sum", "Study: Binary search patterns", "Solve 2 LC: Binary search", "Review: Common edge cases"),
  weekday(1, 5, "Solve 2 LC: Matrix problems", "Study: Sorting algorithms", "Solve 2 LC: Sorting problems", "Weekly pattern review"),
  weekend(1, 6, "Solve 3 LC: Mixed arrays", "Project planning: RAG System architecture", "Solve 2 LC: Review weak problems", "Read: Competitive programming tips"),
  weekend(1, 7, "Weekly review & planning", "Solve 2 LC: Contest problems", "Revision session: Week 1 problems", "Plan Week 2 focus areas"),

  // Week 2: DSA — Stacks, Linked Lists, Recursion
  weekday(2, 1, "Solve 2 LC: Stack basics", "Study: Stack patterns & monotonic stack", "Solve 2 LC: Monotonic stack", "Review: Recursion fundamentals"),
  weekday(2, 2, "Solve 2 LC: Linked list basics", "Study: Linked list patterns", "Solve 2 LC: Fast/slow pointer", "Review: Linked list edge cases"),
  weekday(2, 3, "Solve 2 LC: Recursion problems", "Study: Backtracking patterns", "Solve 2 LC: Backtracking", "Review backtracking templates"),
  weekday(2, 4, "Solve 2 LC: Queue & Deque", "Study: Heap / Priority Queue", "Solve 2 LC: Heap problems", "Review: Heap implementations"),
  weekday(2, 5, "Solve 2 LC: Mixed practice", "Study: Greedy algorithms", "Solve 2 LC: Greedy problems", "Weekly pattern review"),
  weekend(2, 6, "Solve 3 LC: Hard stack/list", "Mock interview practice (coding)", "Solve 2 LC: Review weak areas", "Read engineering blog posts"),
  weekend(2, 7, "Weekly review & planning", "Solve 2 LC: Contest problems", "Revision session: Week 2 problems", "Plan Week 3 focus areas"),

  // Week 3: Trees, Graphs + ML Fundamentals start
  weekday(3, 1, "Solve 2 LC: Binary tree basics", "Study: ML — Linear Regression", "Solve 2 LC: Tree traversal", "Study: Bias-Variance Tradeoff"),
  weekday(3, 2, "Solve 2 LC: BST problems", "Study: ML — Logistic Regression", "Solve 2 LC: BST operations", "Study: Evaluation metrics"),
  weekday(3, 3, "Solve 2 LC: Graph BFS", "Study: ML — Decision Trees", "Solve 2 LC: Graph DFS", "Study: Random Forests"),
  weekday(3, 4, "Solve 2 LC: Graph problems", "Study: ML — Cross-validation", "Solve 2 LC: Topological sort", "Review ML concepts studied so far"),
  weekday(3, 5, "Solve 2 LC: Tree/Graph mixed", "Study: ML — Regularization", "Solve 2 LC: Advanced tree problems", "Weekly pattern review"),
  weekend(3, 6, "Solve 3 LC: Hard trees/graphs", "Deep dive: Implement ML algorithms from scratch", "Solve 2 LC: Review weak areas", "Read ML interview questions"),
  weekend(3, 7, "Weekly review & planning", "Solve 2 LC: Contest problems", "ML revision session", "Plan Week 4 focus areas"),

  // Week 4: DP + ML Fundamentals continued
  weekday(4, 1, "Solve 2 LC: 1D DP basics", "Study: ML — Gradient Boosting", "Solve 2 LC: 1D DP", "Study: ML — SVM"),
  weekday(4, 2, "Solve 2 LC: 2D DP", "Study: ML — K-Means Clustering", "Solve 2 LC: Knapsack variants", "Study: ML — PCA"),
  weekday(4, 3, "Solve 2 LC: String DP", "Study: ML — Regularization L1/L2", "Solve 2 LC: Interval DP", "Study: ML — Experiment Design"),
  weekday(4, 4, "Solve 2 LC: Tree DP", "Study: ML — Feature Engineering", "Solve 2 LC: State machine DP", "Review all ML fundamentals"),
  weekday(4, 5, "Solve 2 LC: DP optimization", "Study: ML — Model Selection", "Solve 2 LC: Advanced DP", "Weekly pattern review"),
  weekend(4, 6, "Solve 3 LC: Hard DP", "Mock interview: ML fundamentals", "Solve 2 LC: Review DP problems", "Read ML system design articles"),
  weekend(4, 7, "Weekly review & planning", "Solve 2 LC: Contest problems", "ML comprehensive revision", "Plan Week 5 focus areas"),

  // Week 5: Trie, Union Find + Deep Learning
  weekday(5, 1, "Solve 2 LC: Trie problems", "Study: DL — Neural Network Fundamentals", "Solve 2 LC: Advanced strings", "Study: DL — Backpropagation"),
  weekday(5, 2, "Solve 2 LC: Union Find", "Study: DL — CNNs", "Solve 2 LC: Graph coloring", "Study: DL — RNNs/LSTMs"),
  weekday(5, 3, "Solve 2 LC: Segment tree", "Study: DL — Loss Functions", "Solve 2 LC: Range queries", "Study: DL — Optimizers"),
  weekday(5, 4, "Solve 2 LC: Advanced graph", "Study: DL — Implement neural net from scratch", "Solve 2 LC: Shortest path", "Review DL concepts"),
  weekday(5, 5, "Solve 2 LC: Mixed advanced", "Study: DL — Training best practices", "Solve 2 LC: Review weak patterns", "Weekly pattern review"),
  weekend(5, 6, "Solve 3 LC: Hard mixed", "Project work: RAG System — ingestion pipeline", "Solve 2 LC: Review", "Read deep learning papers"),
  weekend(5, 7, "Weekly review & planning", "Solve 2 LC: Contest problems", "DL revision session", "Plan Week 6 focus areas"),

  // Week 6: DSA Review + Deep Learning continued
  weekday(6, 1, "Solve 2 LC: Company-tagged (Google)", "Study: DL — Attention Mechanism deep dive", "Solve 2 LC: Company-tagged (Google)", "Study: DL — Transformer Architecture"),
  weekday(6, 2, "Solve 2 LC: Company-tagged (Amazon)", "Study: DL — Regularization techniques", "Solve 2 LC: Company-tagged (Amazon)", "Study: DL — Transfer Learning"),
  weekday(6, 3, "Solve 2 LC: Company-tagged (Microsoft)", "Study: DL — Implement attention from scratch", "Solve 2 LC: Company-tagged (Microsoft)", "Review: Transformer paper"),
  weekday(6, 4, "Solve 2 LC: Company-tagged (Uber)", "Study: DL — Advanced architectures", "Solve 2 LC: Company-tagged (Flipkart)", "Comprehensive DL review"),
  weekday(6, 5, "Solve 2 LC: Mixed company-tagged", "Study: DL — PyTorch best practices", "Solve 2 LC: Hard problems", "Weekly pattern review"),
  weekend(6, 6, "Solve 3 LC: Hard company-tagged", "Mock interview: DL + coding", "Solve 2 LC: Review", "Project work: RAG System"),
  weekend(6, 7, "Weekly review & planning", "Solve 2 LC: Contest problems", "DL comprehensive revision", "Plan Week 7 focus areas"),

  // Week 7: LLM / GenAI Part 1
  weekday(7, 1, "Solve 2 LC: DP review", "Study: LLM — Tokenization (BPE/WordPiece)", "Solve 2 LC: Advanced DP", "Study: LLM — GPT Architecture"),
  weekday(7, 2, "Solve 2 LC: Graph review", "Study: LLM — BERT Architecture", "Solve 2 LC: Advanced graphs", "Study: LLM — Prompt Engineering"),
  weekday(7, 3, "Solve 2 LC: String review", "Study: LLM — RAG Systems introduction", "Solve 2 LC: Advanced strings", "Study: LLM — Chunking strategies"),
  weekday(7, 4, "Solve 2 LC: Tree review", "Study: LLM — Vector Databases", "Solve 2 LC: Hard trees", "Study: LLM — Embedding models"),
  weekday(7, 5, "Solve 2 LC: Mixed hard", "Study: LLM — Build simple RAG prototype", "Solve 2 LC: Hard problems", "LLM concepts review"),
  weekend(7, 6, "Solve 3 LC: Hard mixed", "Project work: RAG System — retrieval implementation", "Solve 2 LC: Review", "Read LLM research papers"),
  weekend(7, 7, "Weekly review & planning", "Solve 2 LC: Contest", "LLM revision session", "Plan Week 8 focus areas"),

  // Week 8: LLM / GenAI Part 2
  weekday(8, 1, "Solve 2 LC: Company-tagged", "Study: LLM — Fine-Tuning (LoRA/QLoRA)", "Solve 2 LC: Hard problems", "Study: LLM — PEFT methods"),
  weekday(8, 2, "Solve 2 LC: Company-tagged", "Study: LLM — RLHF / DPO", "Solve 2 LC: Hard problems", "Study: LLM — Safety & Guardrails"),
  weekday(8, 3, "Solve 2 LC: Mixed patterns", "Study: LLM — AI Agents / Agentic AI", "Solve 2 LC: Hard problems", "Study: LLM — LangGraph deep dive"),
  weekday(8, 4, "Solve 2 LC: Review weak areas", "Study: LLM — LLM Evaluation (RAGAS)", "Solve 2 LC: Hard problems", "Study: LLM — Serving & Optimization"),
  weekday(8, 5, "Solve 2 LC: Hard company-tagged", "Study: LLM — Build agent prototype", "Solve 2 LC: Review", "LLM comprehensive review"),
  weekend(8, 6, "Solve 3 LC: Hard review", "Project work: Start LLM fine-tuning project", "Solve 2 LC: Review", "Read: LLM engineering blogs"),
  weekend(8, 7, "Weekly review & planning", "Solve 2 LC: Contest", "LLM comprehensive revision", "Plan Week 9 focus areas"),

  // Week 9: Projects Sprint
  weekday(9, 1, "Solve 2 LC: Hard review", "Project: RAG System — evaluation pipeline", "Solve 2 LC: Company-tagged", "Study: LLM — Agent frameworks"),
  weekday(9, 2, "Solve 2 LC: Hard review", "Project: RAG System — FastAPI + UI", "Solve 2 LC: Company-tagged", "Study: LLM — Production patterns"),
  weekday(9, 3, "Solve 2 LC: Hard review", "Project: RAG System — Deploy + README", "Solve 2 LC: Company-tagged", "Study: MLOps best practices"),
  weekday(9, 4, "Solve 2 LC: Hard review", "Project: Fine-tuning — Dataset + training", "Solve 2 LC: Company-tagged", "Study: Model deployment"),
  weekday(9, 5, "Solve 2 LC: Hard review", "Project: Fine-tuning — Eval + serve", "Solve 2 LC: Company-tagged", "Project review & polish"),
  weekend(9, 6, "Solve 3 LC: Hard mixed", "Project: Multi-agent system — start", "Project polish: READMEs & demos", "Record demo videos"),
  weekend(9, 7, "Weekly review & planning", "Solve 2 LC: Contest", "Project comprehensive review", "Plan Week 10 focus areas"),

  // Week 10: ML System Design Part 1 + Applications
  weekday(10, 1, "Solve 2 LC: Hard revision", "Study: ML SD — Recommendation Systems", "Solve 2 LC: Company-tagged", "Apply to 2 companies"),
  weekday(10, 2, "Solve 2 LC: Hard revision", "Study: ML SD — Fraud Detection", "Solve 2 LC: Company-tagged", "Apply to 2 companies"),
  weekday(10, 3, "Solve 2 LC: Hard revision", "Study: ML SD — Search Ranking", "Solve 2 LC: Company-tagged", "Networking: Reach out for referrals"),
  weekday(10, 4, "Solve 2 LC: Hard revision", "Study: ML SD — Design practice session", "Solve 2 LC: Company-tagged", "Apply to 2 companies"),
  weekday(10, 5, "Solve 2 LC: Hard revision", "Study: ML SD — Mock design interview", "Solve 2 LC: Company-tagged", "Weekly application review"),
  weekend(10, 6, "Solve 3 LC: Hard mixed", "Mock interview: Full loop (coding + ML)", "Research target companies", "Prepare behavioral stories"),
  weekend(10, 7, "Weekly review & planning", "Solve 2 LC: Contest", "ML System Design revision", "Plan Week 11 focus areas"),

  // Week 11: ML System Design Part 2 + More Applications
  weekday(11, 1, "Solve 2 LC: Hard revision", "Study: ML SD — Ad Click Prediction", "Solve 2 LC: Company-tagged", "Apply to 2 companies"),
  weekday(11, 2, "Solve 2 LC: Hard revision", "Study: ML SD — Content Moderation", "Solve 2 LC: Company-tagged", "Practice behavioral stories"),
  weekday(11, 3, "Solve 2 LC: Hard revision", "Study: ML SD — Real-Time Pricing", "Solve 2 LC: Company-tagged", "Apply to 2 companies"),
  weekday(11, 4, "Solve 2 LC: Hard revision", "Study: ML SD — LLM Chatbot at Scale", "Solve 2 LC: Company-tagged", "Networking follow-ups"),
  weekday(11, 5, "Solve 2 LC: Hard revision", "Study: ML SD — Feed Ranking", "Solve 2 LC: Company-tagged", "Weekly application review"),
  weekend(11, 6, "Solve 3 LC: Hard mixed", "Mock interview: ML System Design", "Full revision: LLM topics", "Prepare for upcoming interviews"),
  weekend(11, 7, "Weekly review & planning", "Solve 2 LC: Contest", "Comprehensive revision", "Plan Week 12 focus areas"),

  // Week 12: Interview Prep Intensive
  weekday(12, 1, "Solve 2 LC: Company-specific prep", "Mock interview: Coding (timed)", "Solve 2 LC: Weak patterns", "Behavioral story practice"),
  weekday(12, 2, "Solve 2 LC: Company-specific prep", "Mock interview: ML theory", "Solve 2 LC: Weak patterns", "Apply to remaining companies"),
  weekday(12, 3, "Solve 2 LC: Company-specific prep", "Mock interview: System design", "Solve 2 LC: Weak patterns", "Review project talking points"),
  weekday(12, 4, "Solve 2 LC: Company-specific prep", "Full mock: Coding + ML + Behavioral", "Solve 2 LC: Weak patterns", "Company-specific research"),
  weekday(12, 5, "Solve 2 LC: Company-specific prep", "Mock debrief & improvement plan", "Solve 2 LC: Revision", "Weekly interview prep review"),
  weekend(12, 6, "Solve 3 LC: Hard timed practice", "Full loop mock interview", "Comprehensive LC revision", "Rest & mental preparation"),
  weekend(12, 7, "Weekly review & planning", "Solve 2 LC: Contest", "All topics quick revision", "Plan Week 13 focus areas"),

  // Week 13: Final Interview Prep
  weekday(13, 1, "Solve 2 LC: Timed hard problems", "Company-specific deep prep", "Solve 2 LC: Revision", "Behavioral story run-through"),
  weekday(13, 2, "Solve 2 LC: Timed hard problems", "ML system design practice", "Solve 2 LC: Revision", "Review all project demos"),
  weekday(13, 3, "Solve 2 LC: Timed hard problems", "Full mock interview", "Solve 2 LC: Revision", "Company research updates"),
  weekday(13, 4, "Solve 2 LC: Timed hard problems", "LLM topics deep revision", "Solve 2 LC: Revision", "Interview logistics prep"),
  weekday(13, 5, "Solve 2 LC: Timed hard problems", "Weak areas targeted study", "Solve 2 LC: Final review", "Mental preparation & rest"),
  weekend(13, 6, "Solve 3 LC: Final hard practice", "Comprehensive revision: All ML/DL/LLM", "Mock interview: Final round", "Rest & recovery"),
  weekend(13, 7, "Weekly review & planning", "Light revision: Key concepts only", "Prepare interview day kit", "Early rest — preserve energy"),

  // Week 14: Interview Week
  weekday(14, 1, "Solve 2 LC: Light warm-up", "Quick revision: Top patterns", "Review: Company-specific notes", "Early rest"),
  weekday(14, 2, "Solve 2 LC: Light warm-up", "Quick revision: ML fundamentals", "Review: Behavioral stories", "Early rest"),
  weekday(14, 3, "Solve 1 LC: Confidence builder", "Quick revision: LLM concepts", "Light review only", "Early rest"),
  weekday(14, 4, "Solve 1 LC: Confidence builder", "Quick revision: System design", "Review interview checklists", "Early rest"),
  weekday(14, 5, "Light LC warm-up only", "Final review: Key formulas & concepts", "Prepare for next week's interviews", "Rest & confidence"),
  weekend(14, 6, "Rest day — light review only", "Organize all notes & cheat sheets", "Pack interview materials", "Rest & mental preparation"),
  weekend(14, 7, "Final weekly review", "Celebrate the journey! 🎉", "Last light revision if needed", "Rest well — you're ready! 🔥"),
];
