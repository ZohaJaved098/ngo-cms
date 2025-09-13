# NGO-CMS Website

A full-stack CMS built for NGOs to manage **events, blogs, dynamic pages, donations, teams, volunteers** ✨
(Currently using demo data — you can swap in real data later.)

---

## 🚀 Features

- Manage **Events, Blogs, Dynamic Pages, Team Members, Users, Ways To Donate**
- Track and visualize **Donations**
- Interactive **Admin Dashboard** with charts
- Authentication & User Management
- Built with a **scalable MERN stack**

---

## 📸 Data

📢 **Note**: All data used here are **Demo Data** for testing and development purposes.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas

---

## 🏁 Getting Started

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone [<repo>](https://github.com/ZohaJaved098/ngo-cms.git)
cd ngo-cms
```

---

### 2. Set Up the Backend

```bash
cd server
npm install
```

#### Create `.env` file in `/server`

```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key

```

Start the backend:

```bash
npm run dev
```

---

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd client
npm install
```

#### Create `.env` file in `/client`

```env
NEXT_PUBLIC_AUTH_API_URL=http://localhost:5000/api/auth
NEXT_PUBLIC_USER_API_URL=http://localhost:5000/api/users
NEXT_PUBLIC_PAGES_API_URL=http://localhost:5000/api/pages
NEXT_PUBLIC_IMAGES_API_URL=http://localhost:5000/api/images
NEXT_PUBLIC_BLOGS_API_URL=http://localhost:5000/api/blogs
NEXT_PUBLIC_EVENTS_API_URL=http://localhost:5000/api/events
NEXT_PUBLIC_CONTENT_API_URL=http://localhost:5000/api/content
NEXT_PUBLIC_GALLERY_API_URL=http://localhost:5000/api/gallery
NEXT_PUBLIC_DOCUMENT_API_URL=http://localhost:5000/api/document
NEXT_PUBLIC_DONATION_API_URL=http://localhost:5000/api/donation
NEXT_PUBLIC_CONTACT_API_URL=http://localhost:5000/api/contact
NEXT_PUBLIC_TEAM_API_URL=http://localhost:5000/api/team
NEXT_PUBLIC_VOLUNTEER_API_URL=http://localhost:5000/api/volunteer
```

Run the frontend:

```bash
npm run dev
```

Frontend will start at 👉 **[http://localhost:3000](http://localhost:3000)**

---

## ✅ You're All Set!

Now open your browser and explore your fully working NGO-CMS 🎉

Happy coding 🦁
