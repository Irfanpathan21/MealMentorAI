# CHAPTER 2: SURVEY OF TECHNOLOGIES

## 2.1 Frontend:

The frontend for **MealMentor AI** is developed as an intelligent Android mobile application responsible for capturing food photographs, uploading medical lab reports, rendering real-time interactive nutritional charts, and hosting the conversational AI Dietitian interface.

### 2.1.1 Comparison with Other Frameworks

**Table 2.1: Comparison of Frontend Mobile Frameworks**

| Aspect | React Native (Expo) | Flutter | Native Android (Kotlin / Java) |
| :--- | :--- | :--- | :--- |
| **Development Speed** | Faster due to JavaScript/JSX ecosystem, instant Hot Reloading, and pre-built Expo modules. | Good, but requires learning Dart and complex widget tree hierarchies. | Slower, requiring separate codebases for Android and iOS. |
| **Performance** | Near-native performance as it compiles to native views with direct JSI bridge execution. | Near-native performance compiled directly to machine code via Skia engine. | Excellent, as it is platform-native direct hardware code. |
| **User Interface (UI)** | Consistent, highly customizable UI using Flexbox, organic squircles, and glassmorphic blurs. | Consistent UI on all platforms thanks to its own rendering engine. | Excellent UI customization, but requires duplication of effort per platform. |
| **Codebase** | Single codebase for Android, iOS, and Web. | Single codebase for iOS, Android, and Desktop. | Two separate codebases (Kotlin for Android, Swift for iOS). |

---

### 2.1.2 React Native & Expo

#### 2.1.2.1 What is React Native?
React Native is an open-source mobile application framework created by Meta for building natively compiled mobile applications from a single JavaScript/TypeScript codebase.

* **Expo SDK**: Managed toolset providing streamlined camera access, image picking, and file management without complex native build configurations.
* **React Navigation**: Manages seamless stack and bottom-tab screen routing across dashboards and chat views.
* **React Native Chart Kit**: Renders responsive SVG charts (line graphs, donut macro rings, and radar charts).
* **React Context & Axios**: Handles global application state and asynchronous REST API communication.

---

### 2.1.3 Features of the Frontend Stack

* **Cross-Platform Compatibility**: Single codebase targeting Android with direct extensibility to iOS.
* **Rich UI Components**: Organic squircle cards, glassmorphic frosted overlays, and vibrant progress rings designed for health and diet tracking.
* **Hot Reload & Fast Refresh**: Instantaneous code reflection drastically speeding up development and UI fine-tuning.
* **Real-Time Visualization**: Dynamic recalculation of daily calorie budgets and macro bars upon logging meals.

---

### 2.1.4 Advantages

* **Cost-Effective & Rapid Development**: Single codebase eliminates duplicate engineering efforts.
* **High Performance**: Fluid 60 FPS animations and fast screen transitions.
* **Extensive Ecosystem**: Access to thousands of battle-tested NPM libraries for camera, charts, and storage.

---

### 2.1.5 Disadvantages

* **Bridge Overhead**: High-frequency image manipulations require asynchronous background transfers.
* **Native Modules**: Deep platform-specific hardware customizations require custom native configurations.

---

## 2.2 Backend:

The backend for MealMentor AI is developed using **Node.js** and the **Express.js** framework to create a high-throughput, non-blocking asynchronous RESTful API server.

* **Node.js**: A robust, event-driven JavaScript runtime built on Chrome's V8 engine.
* **Express.js**: A minimalist web framework providing flexible routing and middleware chains.
* **JSON Web Tokens (JWT) & Bcrypt**: Provides stateless user authentication and salted cryptographic password hashing.
* **Multer**: Handles multipart stream uploads for food photographs and medical lab reports.

---

### 2.2.1 Advantages of the Backend Stack

* **High Concurrency**: Non-blocking asynchronous I/O efficiently handles simultaneous upload and AI inference requests.
* **Unified Language**: Single language (JavaScript/TypeScript) shared across mobile client and server.
* **Lightweight Footprint**: Low memory consumption enabling reliable hosting on cost-effective student and cloud tiers.

---

### 2.2.2 Disadvantages

* **Single-Threaded Execution**: Heavy local compute operations can block the event loop (mitigated by offloading AI processing to cloud AI APIs).

---

### 2.2.3 Database: PostgreSQL & pgvector

#### 2.2.3.1 What is Relational Database with pgvector?
PostgreSQL is an advanced, enterprise-grade open-source relational database providing full ACID compliance. The **pgvector** extension enhances PostgreSQL by enabling native high-dimensional vector similarity indexing directly alongside traditional relational tables.

**Table 2.2: Comparison of Database Management Systems**

| Aspect | PostgreSQL + pgvector | MongoDB (NoSQL) | MySQL (Relational) |
| :--- | :--- | :--- | :--- |
| **Data Integrity** | Strict ACID compliance with relational constraints. | Document-based schema-less consistency. | Strict ACID compliance. |
| **Vector AI Search** | Native built-in vector similarity search. | Requires paid Atlas Vector Search add-on. | Requires external vector database. |
| **Analytics & Joins** | Superior SQL joins and time-series aggregations. | Aggregation pipeline, less optimal for multi-joins. | Standard SQL joins, no vector indexing. |

#### 2.2.3.2 Features & Advantages
* **Unified Relational & Vector Storage**: Manages users, meal logs, and AI profile embeddings within a single database, eliminating the need for a separate vector database.
* **Array & JSON Support**: Native array types store dietary preferences and health tags efficiently.

---

## 2.3 Multimodal Artificial Intelligence & Cloud Services

The core intelligence of MealMentor AI is driven by modern multimodal foundation models. For academic projects, **Google Gemini Flash** (via Google AI Studio Free Tier) and **OpenAI GPT-mini** provide state-of-the-art multimodal vision with zero upfront cost and low latency.

**Table 2.3: Comparison of Multimodal AI Models**

| Aspect | Google Gemini Flash | OpenAI GPT-mini | Legacy Models (GPT-4) |
| :--- | :--- | :--- | :--- |
| **Cost for Students** | **100% Free Tier** (15 RPM / 1,500 RPD). | Ultra-low per-token cost. | High cost; costly for students. |
| **Vision & Food Scan** | Native multimodal vision for Indian dishes. | Solid vision understanding. | Good vision, high latency. |
| **Document OCR** | Extracts medical PDF lab tables accurately. | Good JSON extraction. | High cost per PDF page. |
| **Inference Speed** | Blazing Fast (<1.2s response time). | Fast (<1.8s response time). | Slower response times. |

### 2.3.1 Multimodal Capabilities
* **Food Image Recognition**: Analyzes camera captures of Indian thalis (Paneer Butter Masala, Rotis, Dal Tadka) to extract calories, portion estimates (grams/katoris), and macronutrients (Protein, Carbs, Fats).
* **Lab Report OCR Parsing**: Ingests blood test PDFs and extracts standardized biomarkers (Fasting Sugar, HbA1c, Cholesterol, Vitamin D3).
* **Context-Aware AI Dietitian**: Provides personalized conversational dietary advice dynamically aligned with user lab reports and remaining calorie budgets.
* **Semantic Vector Embeddings**: Generates dense vector embeddings for RAG matching and personalized food recommendations.

---

## 2.4 Summarization

**Table 2.4: Master Technology Summarization**

| Technology | Purpose | Features | Advantages | Disadvantages |
| :--- | :--- | :--- | :--- | :--- |
| **React Native & Expo** | Frontend Mobile UI | Cross-platform, Hot Reload, SVG charting, native camera APIs | Fast development, native performance, unified UI | Bridge overhead for heavy local computations |
| **Node.js & Express.js** | Backend RESTful API | Event-driven, async I/O, modular middleware, JWT authentication | High concurrency, shared syntax, rapid development | Single-threaded CPU execution limit |
| **PostgreSQL + pgvector** | Database & Vector Engine | ACID compliance, relational schema, vector similarity search | Unified metadata & vector storage, high reliability | Requires basic vector index configuration |
| **Google Gemini Flash** | Multimodal AI & OCR | Food vision recognition, PDF lab report parsing, dietary chat | 100% Free Tier, sub-second latency, native multimodal | Rate limits on free tier (15 RPM) |
| **Cloud App Service & Storage** | Hosting & Storage | Linux container hosting, encrypted object storage for assets | High availability, secure media persistence | Requires cloud account configuration |

### 2.4.1 Summary of System Requirements
* **Client-Side**: Android OS device, Dual-Core processor, 3 GB RAM, Camera with autofocus, Internet connectivity.
* **Server-Side**: Node.js runtime, PostgreSQL with pgvector extension, Google AI Studio API Key, Cloud Hosting & Storage.
