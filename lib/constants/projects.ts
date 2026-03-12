import type { ProjectMilestone } from "@/types/supabase";

export interface ProjectSeed {
  title: string;
  description: string;
  project_type: string;
  tech_stack: string[];
  milestones: ProjectMilestone[];
  target_completion_date: string;
}

export const PROJECTS_SEED: ProjectSeed[] = [
  {
    title: "Production RAG System with Evaluation Pipeline",
    description:
      "Build a full production-grade RAG system with document ingestion, hybrid retrieval, evaluation pipeline (RAGAS), and a Streamlit UI deployed to cloud.",
    project_type: "rag_system",
    tech_stack: ["LangChain", "Qdrant", "FastAPI", "Streamlit", "RAGAS", "Python"],
    milestones: [
      { title: "Set up repo and architecture doc", done: false, date: null },
      { title: "Build document ingestion + chunking pipeline", done: false, date: null },
      { title: "Implement hybrid retrieval (BM25 + semantic)", done: false, date: null },
      { title: "Add evaluation pipeline (RAGAS)", done: false, date: null },
      { title: "Build FastAPI + Streamlit UI", done: false, date: null },
      { title: "Deploy to cloud", done: false, date: null },
      { title: "Write comprehensive README", done: false, date: null },
      { title: "Record demo video", done: false, date: null },
    ],
    target_completion_date: "2026-04-30",
  },
  {
    title: "LLM Fine-Tuning on Domain-Specific Task",
    description:
      "Fine-tune a small LLM using LoRA/QLoRA on a domain-specific dataset, evaluate with proper benchmarks, and serve via API.",
    project_type: "llm_finetuning",
    tech_stack: ["Hugging Face", "PEFT", "LoRA", "Weights & Biases", "vLLM", "Python"],
    milestones: [
      { title: "Choose domain and curate dataset", done: false, date: null },
      { title: "Set up training infrastructure", done: false, date: null },
      { title: "Implement LoRA/QLoRA fine-tuning pipeline", done: false, date: null },
      { title: "Run experiments and log to W&B", done: false, date: null },
      { title: "Evaluate with domain-specific benchmarks", done: false, date: null },
      { title: "Serve model via API (vLLM/FastAPI)", done: false, date: null },
      { title: "Write comprehensive README + blog post", done: false, date: null },
      { title: "Record demo video", done: false, date: null },
    ],
    target_completion_date: "2026-05-15",
  },
  {
    title: "Multi-Agent AI System",
    description:
      "Build a multi-agent system where specialized agents collaborate to solve complex tasks using LangGraph or CrewAI.",
    project_type: "multi_agent",
    tech_stack: ["LangGraph", "LangChain", "OpenAI", "FastAPI", "React", "Python"],
    milestones: [
      { title: "Design agent architecture and workflows", done: false, date: null },
      { title: "Implement individual specialist agents", done: false, date: null },
      { title: "Build orchestration layer", done: false, date: null },
      { title: "Add tool integrations (search, code exec, etc.)", done: false, date: null },
      { title: "Build web UI for interaction", done: false, date: null },
      { title: "Add monitoring and error handling", done: false, date: null },
      { title: "Deploy and write documentation", done: false, date: null },
      { title: "Record demo video", done: false, date: null },
    ],
    target_completion_date: "2026-05-31",
  },
];
