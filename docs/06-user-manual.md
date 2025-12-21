# User Manual - NagarSewak

This manual details how to use the application for each user role: **Citizen**, **Contractor**, and **Administrator**.

---

## 1. Citizen Role 👤

Citizens are the primary users who report issues and track city progress.

### Features
- **Report Complaint:**
    1.  Go to Dashboard -> "Report Issue".
    2.  Fill in details (Category, Description, Location).
    3.  Upload an image (optional).
    4.  Submit.
- **Vote & Comment:**
    - Browse complaints in your ward.
    - Click "Upvote" to prioritize meaningful issues.
    - Add comments to provide updates or ask questions.
- **Track Projects:**
    - View "Projects" in your area.
    - See timeline updates and photos uploaded by contractors.

---

## 2. Contractor Role 👷

Contractors bid on tenders and execute infrastructure projects.

### Workflow
1.  **View Tenders:**
    - Go to Dashboard -> "Available Tenders".
    - Filter by budget, location, or type.
2.  **Submit Bid:**
    - Open a tender details page.
    - Enter your **Bid Amount** and **Estimated Duration**.
    - Submit Proposal.
3.  **Manage Projects:**
    - Once a bid is accepted (by Admin), it appears in "My Projects".
    - **Update Progress:**
        - Click on an active project.
        - Add a "Milestone" (e.g., "Foundation Laid - 25%").
        - Upload progress photos.
        - The system automatically updates citizens watching this project.

---

## 3. Administrator Role 🛡️

Admins oversee the entire system, manage users, and approve works.

### Key Responsibilities
- **Complaint Management:**
    - Review incoming complaints.
    - Update Status: `Pending` -> `In Progress` -> `Resolved`.
    - Create a **Tender** for complaints requiring external work.
- **Tender Management:**
    - Review bids submitted by contractors.
    - Click **"Accept Tender"** on the best proposal.
    - This action automatically closes the tender, assigns the project to the contractor, and notifies relevant citizens.
- **User Management:**
    - View list of all registered users.
    - Verify contractor documents (offline verification process).

---

## Common Workflows

### The "Complaint to Resolution" Lifecycle
1.  **Citizen** posts a complaint (e.g., "Broken Road in Ward 4").
2.  **Admin** reviews it, verifies severity, and creates a **Tender**.
3.  **Contractors** (e.g., UrbanBuild, MetroWorks) see the tender and submit bids.
4.  **Admin** accepts UrbanBuild's bid.
5.  **UrbanBuild** starts work and uploads a photo: "Road leveling started" (10%).
6.  **Citizen** receives a notification and sees the progress on the map.
7.  **UrbanBuild** finishes work (100%).
8.  **Admin** verifies and marks the Complaint as **Resolved**.
