<div align="center">
# 🎓 Parul University Complaint Management System
### Administrative Grievance Redressal System
A centralized digital platform for students to raise complaints and for university staff to manage, track, resolve, and analyze grievances efficiently.
<br>
![Status](https://img.shields.io/badge/Status-Active-success)
![TypeScript](https://img.shields.io/badge/TypeScript-99%25-blue)
![License](https://img.shields.io/badge/License-Educational-lightgrey)
</div>
---
## 📌 About The Project
The **Parul University Complaint Management System** is a web-based grievance redressal platform designed to simplify the process of reporting and resolving student complaints.
Instead of relying on manual communication or scattered complaint channels, the system provides a structured workflow where students can submit grievances and university staff can review, assign, investigate, resolve, and track them from a centralized dashboard.
The system is designed around **transparency, traceability, and faster grievance handling**.
---
## 🚀 Key Features
### 👨‍🎓 Student Portal
- Submit new complaints
- Select complaint category
- Add detailed problem description
- Provide location/venue information
- Set complaint priority
- Track complaint status
- View complaint history
- View resolution details
- Access student profile
### 🧑‍💼 Staff / Administration Portal
- Administrative dashboard
- View all registered complaints
- Search complaints by:
  - Complaint ID
  - Student name
  - UG number
  - Subject
- Filter complaints by status
- Assign complaints to staff
- Track pending and active complaints
- Update complaint status
- Add resolution steps
- Upload resolution proof
- View completion reports
### 📊 Analytics Dashboard
The administrative analytics section provides an overview of:
- Total complaints
- Pending complaints
- In-progress complaints
- Resolved complaints
- Escalated complaints
- Complaints by category
- Complaints by status
- Priority distribution
- Resolution rate
### 📑 Student Registry
The system includes a centralized student account registry with:
- Student name
- Enrollment / UG number
- Official email
- Department
- Mobile number
- Hostel and room
- Verification status
- Account type
The registry can also be synchronized with an Excel spreadsheet.
---
## 🔄 Complaint Workflow
```text
Student
   │
   ▼
Submit Complaint
   │
   ▼
New / Submitted
   │
   ▼
Staff Review
   │
   ▼
Assigned
   │
   ▼
Investigation
   │
   ▼
In Progress
   │
   ▼
Resolution Steps + Proof
   │
   ▼
Resolved

If an issue requires additional administrative attention, it can be moved to the Escalated state.

⸻

🖥️ Main Modules

Module	Purpose
🏠 Dashboard	Overview of current grievances
📥 New Complaints	Review newly submitted complaints
👤 Assigned To Me	View assigned grievances
⚙️ In Progress	Manage active investigations
✅ Resolved	View completed complaints
🚨 Escalated	Handle issues requiring escalation
📤 Upload Resolution	Record resolution steps and proof
📊 Analytics	Analyze grievance statistics
📑 Students Excel Sheet	Manage student registry
👤 Profile	Staff profile and credentials

⸻

🛠️ Technology Stack

Frontend

* TypeScript
* React
* Vite
* HTML5
* CSS3

Backend

* Node.js
* Express / TypeScript server
* REST API

Data & Storage

* Local application data
* Excel-based student registry
* Browser local storage where applicable

Development

* Git
* GitHub
* Google AI Studio
* VS Code

⸻

📁 Project Structure

parul-university-complaint-app/
│
├── data/
│   └── registered_students_accounts.xlsx
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
└── README.md

⸻

⚙️ Run Locally

1. Clone the repository

git clone https://github.com/ManishxNishad/parul-university-complaint-app.git

2. Open the project

cd parul-university-complaint-app

3. Install dependencies

npm install

4. Configure environment variables

Create a .env.local file:

GEMINI_API_KEY=your_gemini_api_key

5. Start the development server

npm run dev

⸻

🔐 Environment Variables

Never commit API keys or other secrets to GitHub.

Use:

.env.local

and keep it excluded through .gitignore.

⸻

🎯 Problem We Are Solving

Students can face issues related to:

* 🏠 Hostel & accommodation
* 📚 Academics
* 💻 IT & network
* 🏫 Campus facilities
* 💰 Administrative services
* ⚡ Maintenance
* 📋 Other university services

The goal of this project is to provide a single structured system through which these grievances can be reported and managed.

⸻

💡 Why This System?

Traditional complaint handling can make it difficult to:

* Track the current status of a complaint
* Know who is responsible for an issue
* Maintain resolution records
* Analyze recurring problems
* Keep evidence of completed work
* Provide students with transparent updates

This platform converts the process into a structured digital workflow.

⸻

📸 Application Screens

Staff Dashboard

The administrative dashboard provides a centralized view of all complaints, their priorities, and their current status.

Analytics

The analytics dashboard provides grievance statistics and category/status breakdowns for administrative monitoring.

Student Registry

The student registry provides staff with structured student account and verification information.

Resolution Management

Staff can document the actual steps taken to investigate and resolve a complaint, including materials used, time spent, and supporting proof.

⸻

👥 Team

This project was developed as a collaborative student project by:

* Manish Nishad
* Deeki Chuden
* Prince Katariya
* Harsh Vardhan

⸻

🏫 Project Context

Institution: Parul University
Project: Administrative Grievance Redressal System
Domain: Education Technology / Campus Administration

⸻

🔮 Future Improvements

Possible future enhancements include:

* 🔔 Real-time student notifications
* 📧 Email notifications
* 📱 Mobile application
* 🔐 Role-based authentication
* 🗄️ Production database integration
* 📎 Complaint attachment support
* 🧑‍💼 Advanced staff assignment
* 📈 Historical analytics
* 🤖 AI-assisted complaint categorization
* 🔍 Duplicate complaint detection
* ⏱️ SLA and resolution-time tracking
* 📋 Automated escalation
* 🧾 PDF resolution reports

⸻

⚠️ Disclaimer

This project is developed as an academic/student project for demonstration and educational purposes.

It is not an official production system of Parul University unless formally adopted and authorized by the university.

⸻

📄 License

This project is intended for educational and demonstration purposes.

⸻

<div align="center">

Built with ❤️ by the team

Parul University Complaint Management System

</div>
```
