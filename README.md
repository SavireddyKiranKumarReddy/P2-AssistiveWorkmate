# Assistive Workmate

**AI-Powered Automation Software for Seamless Productivity**

Assistive Workmate is an AI-driven assistant designed to **automate OS-level tasks**, **troubleshoot system issues**, and **optimize performance** with minimal manual effort. Built to assist both technical and non-technical users, it transforms natural language inputs into real system actions—**not just suggestions.**

---

## 🚀 Features

- **AI-Powered Task Understanding** – Uses Google Gemini API to interpret user instructions.
- **System-Level Automation** – Executes tasks using Python, subprocess, and PyAutoGUI.
- **User Approval & Safety** – Every task runs only after user consent.
- **Secure Sandboxing** – Tasks run in isolated environments to protect your system.
- **Cascading Fallback Mechanism** – If one method fails, alternatives are automatically tried.
- **Role-Based Access Control (RBAC)** – Limit actions based on user roles.
- **Cross-Platform Design** – Windows (initial), Linux/macOS support planned.

---

## 🧠 How It Works

1. **User Input:** The user types a system-level request in natural language.
2. **AI Processing:** The prompt is sent to the Gemini API.
3. **Command Generation:** Python parses the output and determines the best method to execute it.
4. **User Approval:** Action preview is shown, and user confirms before execution.
5. **Automation Execution:** Commands are executed via subprocess/PyAutoGUI in a safe sandbox.
6. **Logging & Monitoring:** All actions are logged and monitored in real time.

---

## 🛠️ Tech Stack

### Frontend
- React + Vite + TailwindCSS  
- Live feedback console  
- Approval modals and UI prompts

### Backend
- Node.js + WebSockets + Zod  
- Task execution server  
- Real-time monitoring

### Automation Engine
- Python: `subprocess`, `os`, `re`, `PyAutoGUI`  
- NLP: NLTK + Regex  
- Fallback Mechanism for alternate flows

### AI Integration
- **Google Gemini API** for task understanding

### Database
- **Supabase (PostgreSQL)** – User sessions, task logs, and roles

---

## ⚙️ Installation

> **Requirements:** Node.js, Python 3.10+, Supabase account

```bash
# Clone the repo
git clone https://github.com/yourusername/assistive-workmate.git
cd assistive-workmate

# Install Frontend
cd frontend
npm install
npm run dev

# Install Backend
cd ../backend
npm install
node server.js

# Run Python Automation Agent
cd ../automation
pip install -r requirements.txt
python executor.py
