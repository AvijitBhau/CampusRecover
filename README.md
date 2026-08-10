# CampusRecover

> A secure and centralized Lost & Found platform designed for college campuses.

CampusRecover helps students report, discover, and recover lost belongings through a simple and organized digital platform. It replaces the traditional approach of relying on WhatsApp groups, notice boards, or word of mouth with a dedicated Lost & Found system.

The project was built during the **GDG Prayagraj Vibe-Coding Hackathon**, where our team secured **4th Place and a Top 10 position**.

---

## 🚀 Problem

Students frequently lose items such as:

- ID cards
- Wallets
- Keys
- Earphones
- Calculators
- Books
- Documents
- Water bottles
- Other personal belongings

Finding these items can be difficult because information is often scattered across WhatsApp groups, college departments, or personal contacts.

There is also another important problem: **false ownership claims**.

Someone may see a listed item and falsely claim that it belongs to them.

CampusRecover was designed to address both problems.

---

## 💡 Our Solution

CampusRecover provides a centralized platform where college students can:

- Report items they have lost
- Report items they have found
- Search through lost and found items
- Filter items by category
- View item details
- Claim an item
- Verify ownership before receiving contact information
- Mark recovered items as returned

The main focus of the project is to make the recovery process **simple, organized, and more secure**.

---

## 🔐 Ownership Verification

One of the key features of CampusRecover is its verification system.

When a student reports a found item, they can provide a **unique identifier** that is not publicly displayed.

For example:

- A specific sticker
- A scratch or mark
- A keychain
- Initials
- A unique design
- Any other private identifying detail

When another student tries to claim the item, they must answer the verification question.

### Verification Flow

```text
Found Item
    ↓
Unique Identifier Stored Privately
    ↓
Student Clicks "Claim"
    ↓
Verification Question
    ↓
     ┌───────────────┐
     │ Correct Answer│
     └───────┬───────┘
             ↓
     Contact Information
          Revealed
```

If the answer is incorrect, the finder's contact information remains hidden.

This helps reduce fraudulent claims and protects the privacy of the person who found the item.

---

## ✨ Features

### 📌 Lost Item Reporting

Students can report a lost item by providing:

- Item name
- Category
- Description
- Last seen location
- Lost date
- Optional image

### 📷 Found Item Reporting

Students reporting a found item provide:

- Item name
- Category
- Found location
- Found date
- Required image
- Optional description
- Private unique identifier

### 🔎 Search & Filtering

Students can quickly find relevant reports using:

- Search
- Categories
- Item status
- Recent reports

### 🛡️ Secure Claim Process

Contact information is not immediately exposed.

The claimant must successfully complete the ownership verification before contacting the finder.

### 📊 Dashboard

The dashboard provides an overview of:

- Active lost items
- Found items
- Returned items
- Total reports
- Recent reports

### 📋 My Reports

Students can manage their own reports and track their status.

### 🔄 Item Status

Items can have different statuses:

- `Lost`
- `Found`
- `Returned`

---

## 🖥️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Application structure |
| CSS3 | Styling and responsive UI |
| JavaScript | Application logic and interactions |
| Firebase | Backend services and data management |
| Firebase Firestore | Database |
| Firebase Storage | Image storage |

AI-assisted development tools were used during the hackathon to improve development speed and workflow.

---

## 🎨 Design

CampusRecover uses a modern dark-themed interface with:

- Responsive design
- Modern cards
- Smooth interactions
- Search and filter components
- Status badges
- Dashboard statistics
- Toast notifications
- Mobile-friendly layouts

The goal was to keep the interface simple enough for students to use without any learning curve.

---

## 🏆 Hackathon Achievement

### GDG Prayagraj Vibe-Coding Hackathon

**Achievement:** 🏆 4th Place — Top 10

**Date:** 31 July 2026  
**Venue:** Institute of Professional Studies, University of Allahabad  
**Organizer:** Google Developer Group Prayagraj

Our two-member team:

- **Avijit Agarwal** — Team Leader
- **Hitanshu Yadav** — Team Member

The project was developed and presented under a **2-hour development challenge**.

---

## 📸 Project Preview

### Dashboard



---

## 🌐 Live Demo

**Live Website:**  
https://campus-recover1.netlify.app/

---

## 📂 Project Structure

```text
CampusRecover/
│
├── index.html
├── dashboard.html
├── lost-items.html
├── found-items.html
├── reports.html
├── profile.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── auth.js
│   └── firebase.js
│
├── assets/
│   ├── images/
│   └── icons/
│
├── screenshots/
│   └── dashboard.png
│
└── README.md
```

---

## 🔮 Future Improvements

Some features that can be added in future versions:

- College email authentication
- Admin dashboard
- Email and push notifications
- QR-code based item tracking
- Multiple college support
- Real-time messaging between users
- Mobile application
- Advanced image-based item matching

---

## 👥 Team

### Avijit Agarwal
**Team Leader & Developer**

Frontend Developer | BCA Student at University of Allahabad

### Hitanshu Yadav
**Team Member & Developer**

---

## 🙌 Acknowledgements

Special thanks to **Google Developer Group Prayagraj** for organizing the hackathon and providing an opportunity to build and present our solution.

Thanks to the organizers, mentors, faculty members, and everyone who supported us throughout the event.

---

## 📄 License

This project is created for educational and hackathon purposes.

Feel free to explore, learn from, and improve the project.
