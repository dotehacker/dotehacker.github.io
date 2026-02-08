# Biography



<img src="/rockerritesh.png" alt="Sumit_Yadav"> <style>
        img{
        display: block;
        margin-left: auto;
        margin-right: auto;
        border-radius: 80%;
        text-align:center;
        width:50%
        }
</style>

## Sumit Yadav

AI Architect | NLP Researcher | Kaggle Competitor

## Affiliation

Bachelor of Computer Engineering (Graduated 2024),
Dept. Electronics and Computer Engineering,
Pulchowk Campus,
Tribhuvan University, Nepal

## Professional Summary

Advanced Artificial Intelligence Engineer and Researcher with over 5 years of expertise in System Architecture and Natural Language Processing (NLP). I specialize in designing scalable, production-grade AI systems using Hexagonal Architecture (Ports & Adapters) and Domain-Driven Design (DDD). My technical focus spans building high-performance RAG pipelines using Vector Databases (Qdrant, ChromaDB), architecting Zero-Trust Security layers for Autonomous Agents, and solving complex Low-Resource Language challenges (creator of maiBERT).

Active Kaggle Competitor and Open Source contributor, with published research on representation geometry, LLM safety, and low-resource NLP.

## Interests

- Representation Learning & Information Geometry
- AI Safety & Adversarial Robustness
- Natural Language Processing (Low-Resource Languages)
- Retrieval-Augmented Generation (RAG) Systems
- Agentic AI & Multi-Agent Systems
- Computer Vision

## Technical Skills

**System Architecture:** Hexagonal Architecture (Ports & Adapters), Microservices, Event-Driven Architecture (SSE), REST/GraphQL APIs, Domain-Driven Design (DDD)

**AI & Machine Learning:** Large Language Models (Llama 3, Claude, GPT-4), RAG Pipelines, Multi-Agent Systems, Fine-tuning (PEFT/LoRA), Reinforcement Learning (RLHF), Computer Vision (YOLOv8)

**Vector Databases:** Qdrant, ChromaDB, Pinecone, Weaviate (Hybrid Search, HNSW Indexing)

**AI Security:** Model Context Protocol (MCP), Prompt Injection Defense, Guardrails AI, Zero Trust Architecture

**Languages:** Python (Expert), C++, C, SQL, Bash, JavaScript

**Frameworks & Tools:** PyTorch, TensorFlow, LangChain, LlamaIndex, vLLM, FastAPI, Docker, Kubernetes, GitHub Actions

**Low-Resource NLP:** Tokenizer training, Multilingual Embeddings, Unicode/Font Conversion algorithms

## Professional Experience

### Astha.ai, USA (Remote) — AI Architect, Security & Agentic Systems
*May 2024 – Present*

- Designed the core MCP-Proxy using Hexagonal Architecture (Ports & Adapters), decoupling security policy logic from the SSE transport layer
- Architected a Zero-Trust framework for Autonomous Agents where every agent interaction, tool call, and memory retrieval is verified against a strict policy engine
- Engineered a policy engine supporting v1.0 (allow/deny lists) and v2.0 (conditional logic) with Role-Based Access Control (RBAC)
- Led development of MCP-Scanner: a security analysis platform integrating 78+ attack techniques mapped to MITRE ATT&CK, leveraging Claude API for intelligent fuzzing and vulnerability enumeration

### Amnil Technology Pvt. Ltd, Lalitpur — AI Engineer, RAG & Infrastructure
*May 2023 – May 2024*

- Developed a Retrieval-Augmented Generation system using Qdrant with Hybrid Search (Sparse + Dense vectors), improving retrieval accuracy by 35%
- Deployed and optimized open-source models (Llama 3, Mistral, Qwen) using vLLM, reducing latency by 40% via PagedAttention and KV-cache optimization
- Implemented recursive query decomposition for complex multi-hop questions
- Integrated NeMo Guardrails and built an automated "LLM-as-a-Judge" evaluation framework

### Ed-Acadia, Lalitpur — Chief Data Officer
*May 2022 – May 2023*

- Spearheaded research into OCR and document parsing for Nepali and Maithili languages using synthetic training data for Devanagari script recognition
- Developed a large-scale semantic search system using contrastive learning for non-English educational content
- Managed a team of 3 junior data scientists, overseeing ML projects from ideation to deployment

### PDSC (Plan Design Solve Create), Lalitpur — Software Coordinator
*May 2022 – May 2023*

- Managed technical delivery of data science consulting projects
- Conducted weekly code reviews and technical workshops for interns in Python and Machine Learning

### DeepLearning.AI (Remote) — GAN Mentor
*Aug 2021 – Present*

- Technical mentor for the Generative Adversarial Networks (GANs) Specialization, assisting hundreds of students globally with debugging, loss functions (Minimax, Wasserstein), and architectures (DCGAN, CycleGAN)

## Publications

- **[On the Relationship Between Representation Geometry and Generalization in Deep Neural Networks](https://arxiv.org/abs/2602.00130)** (2026, Pre-Print)
  Demonstrates that effective dimension — an unsupervised geometric metric requiring no labels — strongly predicts neural network generalization across vision and language domains. Analyzed 52 pretrained ImageNet classifiers across 13 architecture families, showing output effective dimension achieves partial r=0.75 with accuracy. Establishes bidirectional causality and cross-domain generalization to NLP encoder models and decoder-only LLMs.

- **[Can maiBERT Speak for Maithili?](https://arxiv.org/abs/2410.13940)** (2026, Accepted at LoResLM 2026)
  First monolingual BERT model pre-trained specifically on a custom-curated Maithili corpus. Achieved 87.02% accuracy on news classification, outperforming multilingual baselines like NepBERTa and Muril. [Hugging Face Model](https://huggingface.co/rockerritesh/maiBERT)

- **[SafeConstellations: Steering LLM Safety](https://arxiv.org/abs/2501.15792)** (2024, Pre-Print)
  Discovered distinct geometric patterns in embedding spaces for harmful vs. benign-but-sensitive queries. Developed a steering vector method reducing over-refusals by 73% across Claude, GPT-4o, and LLaMA without compromising safety.

- **[Revolutionizing Currency Security with YOLOv8](https://doi.org/10.1109/ICITIIT61487.2024.10580248)** (2024, J Bus Econo Stud)
  Applied YOLOv8 to counterfeit Nepali banknote detection, achieving a True Positive Recall of 0.986 on custom dataset under various lighting conditions.

- **[Support Vectors are a Better Way of Text Classification for Imbalanced Data](https://www.researchgate.net/publication/371514138_SUPPORT_VECTORS_ARE_A_BETTER_WAY_OF_TEXT_CLASSIFICATION_FOR_IMBALANCED_DATA)** (2023)
  Demonstrated that optimized SVMs with TF-IDF often outperform Deep Learning for highly imbalanced datasets with 100+ classes.

- **[Machine Learning Analysis of Tirhuta Lipi](https://www.researchgate.net/publication/373370042_Machine_Learning_Analysis_of_Tirhuta_Lipi)** (2023)

## Key Engineering Projects

- **[SAFE-MCP Security Framework](https://github.com/AsthaAI/safe-mcp):** Core contributor to Security Analysis Framework for MCP. Authored detection rules for Server Enumeration (SAFE-T1601), Tool-Chaining Pivots (SAFE-T1703), and Multimodal Prompt Injection (SAFE-T1110).
- **Agents.ai & Semantic Router:** Built an intelligent routing system using ChromaDB for semantic matching of user queries to expert agents.
- **Nepali Chat with Doc:** Full-stack RAG chatbot optimized for Nepali with real-time Preeti-to-Unicode font conversion for legacy government documents.
- **[IRB Robotic Arm](https://github.com/jarp0l/IRB-Robo-Arm):** Image Recognition Based robotics arm for medical assistance (UN SDG3) using TensorFlow and Arduino.
- **[maiBERT TF](https://github.com/rockerritesh/maiBERT):** Open-sourced the first TensorFlow-based BERT model pre-trained for Maithili language.
- **[Maithili Lipi](https://github.com/rockerritesh/maithili_lipi_AI_proj):** Classification of Tirhuta script, foundational OCR for low-resource languages.
- **[Unsupervised Models](https://github.com/rockerritesh/Unsupervised):** VAE, GAN, C-GAN, AC-GAN, DC-GAN implementations for latent space research.
- **[NEPSE Simple](https://github.com/rockerritesh/nepsesimple):** Nepal stock market data platform with web scraping, automation, and [Telegram Bot](https://t.me/nepsebot).
- Nepali Language Tools: [Devanagari Classifier](https://github.com/rockerritesh/Nepali_devanagari_Classifier), [Nepali Sentiment Classifier](https://github.com/rockerritesh/NepaliSentiment), [Nepali OCR](https://github.com/rockerritesh/easyOCR_Nepali), [Nepali Poem Generator](https://github.com/rockerritesh/nepali_poem_datasets)

## Competitive ML & Community

- Active Kaggle Competitor in NLP and Computer Vision challenges
- Founder of **NPL Coders**, organizing national-level data science hackathons
- [Google Scholar Profile](https://scholar.google.com/citations?user=rockerritesh)

## Education

**Pulchowk Engineering College, IOE (Tribhuvan University)** — Kathmandu, Nepal
Bachelor of Computer Engineering, 2019 – 2024

Major Project: "Evaluating Auto-Encoder Transformer Language Model for Maithili Text Classification" (Foundation for the maiBERT paper)

Relevant Coursework: Artificial Intelligence, Big Data Technologies, Distributed Systems, Network Security, Compiler Design

## Honors and Awards

- **Winner**, GritFeat AI Hackathon 2023 — ['SWIFT'](https://www.linkedin.com/feed/update/urn:li:activity:7025771930481803264): Wearable device with AI for elderly fall detection (Accuracy: 0.79)
- **2x 1st Runner Up**, Locus Dataverse 2023 & 2022 — [NLP model for scientific abstract classification](https://github.com/rockerritesh/Datarush-2023-DataVerse-)
- **Winner**, Best AI Project, DELTA 3.0 — [Nepali Harvest](https://github.com/adhikariraju38/Nepali_Harvest): Crop disease prediction for local farmers
- **Winner**, [IT-Meet Image Challenge 2022](https://www.linkedin.com/feed/update/urn:li:activity:6967119637503238144) — Computer Vision model for ballot paper counting
- **Second Place**, [Docsumo DataRush 2022](https://www.facebook.com/locus.data.rush/photos/pcb.117726577459745/117726310793105/)
- **Winner**, [LogPoint Capture The Flag 2022](https://www.facebook.com/locus.ioe/photos/a.202948823208958/1667487916755034/) — Binary exploitation and forensics
- AI and Robotics [Member](/rockerriteshrancard.jpg) — RAN
- Joint Secretary — NTBNS

## Courses

- GAN Specialization (Coursera / DeepLearning.AI)
- Deep Learning Specialization (Coursera / DeepLearning.AI)
- Deep Learning with TensorFlow (EDX)
- Machine Learning (Coursera)

## Lab Files
- [Introduction to UNIX Commands and Shell Programming](/LAB/Introduction%20to%20UNIX%20Commands%20and%20Shell%20Programming.pdf)
- [Lab Report on A Genetics Algorithm](/LAB/Lab%20Report%20on%20A%20Gentics%20Algorithm.pdf)
- [Lab Report on An Artificial Neural Network](/LAB/Lab%20Report%20on%20An%20Artificial%20Neural%20Network.pdf)
- [Lab Report on Constraint Programming](/LAB/Lab%20Report%20on%20Constraint%20Programming.pdf)
- [Lab Report on Propositional Logic](/LAB/Lab%20Report%20on%20Propositional%20Logic.pdf)
- [Familiarization with basic CT/DT functions](/LAB/Familiarization%20with%20basic%20CT⁄DT%20functions.pdf)

see [Publications](/posts).

## Contact

rockerritesh4@gmail.com | +977-9819856148 | [LinkedIn](https://linkedin.com/in/rockerritesh) | [GitHub](https://github.com/rockerritesh) | [Google Scholar](https://scholar.google.com/citations?user=rockerritesh)

## Find my CV > [HERE](/resume.pdf).
> Excuse me, but this, this is just a piece of paper, If I'm going to be worthy of this institution, I will show you in action. -->Tom and Jerry(Kayla)
