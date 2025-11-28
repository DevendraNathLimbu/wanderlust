# 🏨 StayFinder – Hotel & Place Booking App

A full-stack booking platform built using **EJS, Node.js, Express, MongoDB, and Cloudinary**.  
Authenticated users can create and manage listings with image uploads, while visitors can browse and book places or hotels.

---

## 🚀 Features

### 🔐 Authentication
- User registration and login  
- Secure password hashing  
- Only authenticated users can:
  - Add new listings  
  - Edit or delete their own listings  
  - Write and delete their own reviews  

---

### 🏨 Listings Management
- Create listings with:
  - Title  
  - Description  
  - Price  
  - Location  
  - Image upload (stored on Cloudinary)
- Edit and delete listings  
- View detailed listing pages with images, reviews, and booking options  

---

### 💬 Reviews System
- Authenticated users can post reviews  
- Users can delete their own reviews  
- Ratings displayed on listing pages  

---

### 📅 Booking System
- Visitors can browse all listings  
- Users can book hotels/places  
- Booking data saved in MongoDB  

---

### ☁️ Image Upload
- Images uploaded using **multer** and stored in **Cloudinary**  
- Cloud-based optimized image delivery  

---

## 🛠️ Tech Stack

**Frontend:**  
- EJS Templates  
- CSS / Bootstrap

**Backend:**  
- Node.js  
- Express.js  
- Mongoose  
- Passport.js (for authentication)

**Database:**  
- MongoDB (Atlas or local)

**Storage:**  
- Cloudinary (Image hosting)

---

## ⚙️ Environment Variables

Create a `.env` file and include:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

MONGO_URL=your_mongodb_connection_string
SESSION_SECRET=your_secret

---

## ▶️ Run Locally

1. Clone the repo:

```bash
git clone https://github.com/DevendraNathLimbu/wanderlust.git
```

2. Install dependencies:

npm install

3. Add `.env` file with your credentials.

4. Start the server:

node app.js
# or
npm start

## ⭐ Future Improvements
- Online payment integration  
- Google Maps location  
- Email alerts for bookings  
- User profiles  
- More advanced booking system  

---

## 🤝 Contributing
Contributions are welcome!  
Feel free to fork, open issues, or submit pull requests.
