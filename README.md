# 🌾 Farmer Market – Full Stack E-Commerce Platform

A Full-Stack Web Application built for connecting farmers and buyers in a digital marketplace for fresh fruits and vegetables.  
This system allows buyers to easily browse, add products to cart, and place orders — while farmers can manage their products, confirm orders, and chat directly with buyers.  

Built with a React + TypeScript frontend and a Spring Boot + MySQL (XAMPP) backend.

---

🚀 Features

 👨‍🌾 Farmer Dashboard
- Add, edit, update, or delete products (fruits & vegetables).
- View and manage buyer orders.
- Confirm or reject orders.
- Real-time chat with buyers.

 🛒 Buyer Dashboard
- Browse available products by category (fruits, vegetables, etc.).
- Add items to cart and place orders.
- View all orders and pending orders.
- Real-time chat with admin/farmer for support.
  
 💬 Chat System
- Instant messaging between farmers and buyers for product or order inquiries.

🧾 *Other Features*
- Secure authentication (login/register for both roles).
- Role-based dashboard (Farmer / Buyer).
- Responsive UI built with  CSS.
- RESTful API integration between front-end and back-end.

---

🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React, TypeScript, Axios,  CSS |
| Backend | Java, Spring Boot, Spring Data JPA |
| Database | MySQL (via XAMPP) |
| API Communication | RESTful APIs |
| Build Tools | Maven (Backend), npm (Frontend) |

---


2. Setup Database (XAMPP)

Start Apache and MySQL from XAMPP Control Panel.

Open http://localhost/phpmyadmin
.

Create a new database named:

farmer_market


Update your Spring Boot application.properties file:

spring.datasource.url=jdbc:mysql://localhost:3306/farmer_market
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update

🔹 3. Run the Backend
cd backend
mvn spring-boot:run


Server will start on:
👉 http://localhost:8080

🔹 4. Run the Frontend
cd frontend
npm install
npm run dev


App will run on:
👉 http://localhost:5173

