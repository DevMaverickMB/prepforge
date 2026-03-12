export interface StudyTopicSeed {
  category: string;
  topic_name: string;
  subtopics: string[];
  week_number: number;
}

export const STUDY_TOPICS_SEED: StudyTopicSeed[] = [
  // ML Fundamentals (12 topics)
  {
    category: "ml_fundamentals",
    topic_name: "Linear Regression",
    subtopics: ["OLS", "Gradient Descent", "Cost Function", "Feature Scaling", "Regularization"],
    week_number: 3,
  },
  {
    category: "ml_fundamentals",
    topic_name: "Logistic Regression",
    subtopics: ["Sigmoid Function", "Cross-Entropy Loss", "Decision Boundary", "Multi-class"],
    week_number: 3,
  },
  {
    category: "ml_fundamentals",
    topic_name: "Decision Trees",
    subtopics: ["Gini Impurity", "Entropy", "Information Gain", "Pruning"],
    week_number: 3,
  },
  {
    category: "ml_fundamentals",
    topic_name: "Random Forests",
    subtopics: ["Bagging", "Feature Importance", "Out-of-Bag Error", "Hyperparameters"],
    week_number: 3,
  },
  {
    category: "ml_fundamentals",
    topic_name: "Gradient Boosting (XGBoost/LightGBM)",
    subtopics: ["Boosting vs Bagging", "Learning Rate", "Tree Depth", "Regularization"],
    week_number: 4,
  },
  {
    category: "ml_fundamentals",
    topic_name: "SVM",
    subtopics: ["Kernel Trick", "Margin Maximization", "Soft Margin", "RBF Kernel"],
    week_number: 4,
  },
  {
    category: "ml_fundamentals",
    topic_name: "K-Means Clustering",
    subtopics: ["Elbow Method", "K-Means++", "Silhouette Score", "Convergence"],
    week_number: 4,
  },
  {
    category: "ml_fundamentals",
    topic_name: "PCA / Dimensionality Reduction",
    subtopics: ["Eigenvalues", "Eigenvectors", "Variance Explained", "t-SNE", "UMAP"],
    week_number: 4,
  },
  {
    category: "ml_fundamentals",
    topic_name: "Evaluation Metrics",
    subtopics: ["Precision", "Recall", "F1 Score", "AUC-ROC", "Confusion Matrix", "PR Curve"],
    week_number: 3,
  },
  {
    category: "ml_fundamentals",
    topic_name: "Bias-Variance Tradeoff",
    subtopics: ["Underfitting", "Overfitting", "Model Complexity", "Regularization"],
    week_number: 3,
  },
  {
    category: "ml_fundamentals",
    topic_name: "Regularization (L1/L2)",
    subtopics: ["Lasso", "Ridge", "Elastic Net", "Feature Selection"],
    week_number: 4,
  },
  {
    category: "ml_fundamentals",
    topic_name: "Cross-Validation & Experiment Design",
    subtopics: ["K-Fold", "Stratified", "Leave-One-Out", "A/B Testing", "Hyperparameter Tuning"],
    week_number: 4,
  },

  // Deep Learning (10 topics)
  {
    category: "deep_learning",
    topic_name: "Neural Network Fundamentals",
    subtopics: ["Perceptron", "Activation Functions", "Forward Pass", "Universal Approximation"],
    week_number: 5,
  },
  {
    category: "deep_learning",
    topic_name: "Backpropagation",
    subtopics: ["Chain Rule", "Gradient Flow", "Vanishing Gradients", "Gradient Clipping"],
    week_number: 5,
  },
  {
    category: "deep_learning",
    topic_name: "CNNs",
    subtopics: ["Convolutions", "Pooling", "ResNet", "Feature Maps", "Transfer Learning"],
    week_number: 5,
  },
  {
    category: "deep_learning",
    topic_name: "RNNs / LSTMs",
    subtopics: ["Hidden State", "LSTM Gates", "GRU", "Sequence Modeling", "Bidirectional"],
    week_number: 5,
  },
  {
    category: "deep_learning",
    topic_name: "Attention Mechanism",
    subtopics: ["Self-Attention", "Cross-Attention", "Scaled Dot-Product", "Multi-Head"],
    week_number: 6,
  },
  {
    category: "deep_learning",
    topic_name: "Transformer Architecture",
    subtopics: ["Encoder-Decoder", "Positional Encoding", "Feed-Forward", "Layer Norm"],
    week_number: 6,
  },
  {
    category: "deep_learning",
    topic_name: "Loss Functions",
    subtopics: ["MSE", "Cross-Entropy", "Focal Loss", "Contrastive Loss", "Triplet Loss"],
    week_number: 5,
  },
  {
    category: "deep_learning",
    topic_name: "Optimizers",
    subtopics: ["SGD", "Momentum", "Adam", "AdamW", "Learning Rate Scheduling"],
    week_number: 5,
  },
  {
    category: "deep_learning",
    topic_name: "Regularization (Dropout/BatchNorm)",
    subtopics: ["Dropout", "Batch Normalization", "Layer Normalization", "Data Augmentation"],
    week_number: 6,
  },
  {
    category: "deep_learning",
    topic_name: "Transfer Learning",
    subtopics: ["Fine-Tuning", "Feature Extraction", "Domain Adaptation", "Pre-trained Models"],
    week_number: 6,
  },

  // LLM / GenAI (12 topics)
  {
    category: "llm_genai",
    topic_name: "Tokenization (BPE/WordPiece)",
    subtopics: ["BPE", "WordPiece", "SentencePiece", "Vocabulary Size", "Subword Tokenization"],
    week_number: 7,
  },
  {
    category: "llm_genai",
    topic_name: "GPT Architecture",
    subtopics: ["Decoder-Only", "Causal Attention", "Pre-training", "Autoregressive Generation"],
    week_number: 7,
  },
  {
    category: "llm_genai",
    topic_name: "BERT Architecture",
    subtopics: ["Masked Language Model", "Next Sentence Prediction", "Encoder-Only", "Fine-Tuning"],
    week_number: 7,
  },
  {
    category: "llm_genai",
    topic_name: "Fine-Tuning (LoRA/QLoRA/PEFT)",
    subtopics: ["LoRA", "QLoRA", "PEFT", "Adapter Layers", "Parameter Efficient"],
    week_number: 8,
  },
  {
    category: "llm_genai",
    topic_name: "RLHF / DPO",
    subtopics: ["Reward Model", "PPO", "DPO", "Constitutional AI", "Human Feedback"],
    week_number: 8,
  },
  {
    category: "llm_genai",
    topic_name: "Prompt Engineering",
    subtopics: ["Few-Shot", "Chain-of-Thought", "Self-Consistency", "System Prompts"],
    week_number: 7,
  },
  {
    category: "llm_genai",
    topic_name: "RAG Systems",
    subtopics: ["Retrieval", "Chunking", "Embedding Models", "Hybrid Search", "Reranking"],
    week_number: 8,
  },
  {
    category: "llm_genai",
    topic_name: "Vector Databases",
    subtopics: ["HNSW", "IVF", "Pinecone", "Qdrant", "Weaviate", "ChromaDB"],
    week_number: 8,
  },
  {
    category: "llm_genai",
    topic_name: "AI Agents / Agentic AI",
    subtopics: ["ReAct", "Tool Use", "Planning", "LangGraph", "CrewAI", "AutoGen"],
    week_number: 9,
  },
  {
    category: "llm_genai",
    topic_name: "LLM Evaluation",
    subtopics: ["BLEU", "ROUGE", "BERTScore", "Human Eval", "RAGAS", "Benchmarks"],
    week_number: 9,
  },
  {
    category: "llm_genai",
    topic_name: "Guardrails & Safety",
    subtopics: ["Content Filtering", "Prompt Injection", "Red Teaming", "NeMo Guardrails"],
    week_number: 9,
  },
  {
    category: "llm_genai",
    topic_name: "LLM Serving & Optimization",
    subtopics: ["vLLM", "TensorRT", "Quantization", "KV Cache", "Batching", "Speculative Decoding"],
    week_number: 9,
  },

  // ML System Design (8 topics)
  {
    category: "ml_system_design",
    topic_name: "Recommendation Systems",
    subtopics: ["Collaborative Filtering", "Content-Based", "Two-Tower", "Serving Layer"],
    week_number: 10,
  },
  {
    category: "ml_system_design",
    topic_name: "Fraud Detection Systems",
    subtopics: ["Feature Engineering", "Real-Time Scoring", "Anomaly Detection", "Model Drift"],
    week_number: 10,
  },
  {
    category: "ml_system_design",
    topic_name: "Search Ranking",
    subtopics: ["Query Understanding", "Candidate Retrieval", "Learning to Rank", "Relevance"],
    week_number: 11,
  },
  {
    category: "ml_system_design",
    topic_name: "Ad Click Prediction",
    subtopics: ["CTR Prediction", "Feature Crossing", "Real-Time Bidding", "Calibration"],
    week_number: 11,
  },
  {
    category: "ml_system_design",
    topic_name: "Content Moderation",
    subtopics: ["Multi-Modal", "Active Learning", "Human-in-Loop", "Policy Enforcement"],
    week_number: 11,
  },
  {
    category: "ml_system_design",
    topic_name: "Real-Time Pricing",
    subtopics: ["Dynamic Pricing", "Demand Forecasting", "A/B Testing", "Constraint Optimization"],
    week_number: 12,
  },
  {
    category: "ml_system_design",
    topic_name: "LLM Chatbot at Scale",
    subtopics: ["Routing", "Caching", "Rate Limiting", "Guardrails", "Multi-Turn"],
    week_number: 12,
  },
  {
    category: "ml_system_design",
    topic_name: "Notification / Feed Ranking",
    subtopics: ["Engagement Prediction", "Diversity", "Freshness", "User Preferences"],
    week_number: 12,
  },
];

export const STUDY_CATEGORIES = {
  ml_fundamentals: { label: "ML Fundamentals", count: 12 },
  deep_learning: { label: "Deep Learning", count: 10 },
  llm_genai: { label: "LLM / GenAI", count: 12 },
  ml_system_design: { label: "ML System Design", count: 8 },
} as const;
