# 📧 Email Marketing System  

![Made with](https://img.shields.io/badge/Made%20with-React%2C%20Vite-blue)
![API](https://img.shields.io/badge/Backend-Node.js%2C%20Express%2C%20MongoDB-green)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20Role--Based-red)
![Responsive](https://img.shields.io/badge/Responsive-Yes-brightgreen)

A full‑stack **Email Marketing Template System** with **Admin + Marketer roles**.  
Admins manage **email templates and users**, while marketers select templates, fill dynamic fields, and send emails via **SendGrid**. All sent emails are logged in **MongoDB**.

---

## 📸 Preview  

<img width="1917" height="1020" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/3a657be1-6e68-4c2d-b218-7b184afa166d" />

<br/>

<img width="1918" height="973" alt="Marketer Dashboard" src="https://github.com/user-attachments/assets/7a2f3abf-c09f-4ce1-ae98-fdb0485bb218" />


---

## 🛠 Tech Stack  

- **Frontend:** React.js (Vite), CSS  
- **Backend:** Node.js, Express.js, MongoDB Atlas (Mongoose)  
- **Auth:** JWT with role‑based access (`admin`, `marketer`)  
- **Email Provider:** SendGrid (Transactional Email API)  
- **Database:** MongoDB Atlas  

---

## ✨ Core Features  

### 👑 Admin  

- 🔐 Login as **Admin** (JWT based).  
- 🧩 **Template Management (CRUD)**  
  - Create email templates with **dynamic variables** like `{{name}}`, `{{date}}`, `{{offer}}`.  
  - Edit existing templates.  
  - Delete templates.  
  - Templates stored in MongoDB with `name`, `subject`, `body`, `createdBy`, `createdAt`.  
- 👥 **User Management**  
  - List all users.  
  - Change user role between `admin` and `marketer`.  
  - Delete users.  
- 📜 **Email Logs**  
  - View all emails sent by all marketers.  
  - See status (**Success / Failed**), recipient, template used, variables, and timestamp.

### 📩 Marketer  

- 🔐 Login as **Marketer** (JWT based).  
- 📂 View all templates created by admin.  
- 🧾 **Dynamic Variable Form**  
  - System auto‑detects variables like `{{name}}`, `{{date}}`, etc. from template body.  
  - Generates input fields for each variable.  
- 📧 **Send Email via SendGrid**  
  - Fill recipient email + variable values and send.  
  - Backend hits SendGrid API with compiled subject & HTML body.  
- 🕒 **My Email Logs**  
  - View only emails sent by the logged‑in marketer.  

---

## 📬 Contact  

Made with ❤️ by **Rohit Jadhav**  
📧 Email: **rohitbjadhav03@gmail.com**
