# SpadeMeet

### Meeting Room Booking System

This project is a Meeting Room Booking System that allows users to view, book, and manage meeting rooms. It supports multiple rooms, time slots, and user bookings. The system includes authentication and role-based authorization for booking and managing rooms. The system also prevents double-booking by checking for conflicts.

#### Admin 
email : admin@test.com
pass : 1234admin


## Technologies Used

- **Next.js**
- **MongoDB || Prisma** (Database)
- **Clerk** (Authentication)
- **Tailwind CSS || MUI** (Styling)
- **tanstack react-query || Axios**

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/OHshajim/Meeting-Room-Booking-System.git
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Set up environment variables**

```bash
DATABASE_URL= "MongoDB URL"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= "CLERK PUBLISHABLE KEY"
CLERK_SECRET_KEY="CLERK SECRET KEY"
```

4. **Run the development server**

   ```bash
   npm run dev
   ```

  #### API Endpoints

  ---- Room Management (Admin only)
  - GET /api/rooms: List all rooms with optional filters
  - POST /api/rooms: Create a new room
  - DELETE /api/rooms/:id: Delete a room
  - PUT /api/rooms/:id: Update a room's details
  
  ---- User System (Admin only)
  - GET /api/user: View all user details only for Admin
  - POST /api/user/:email: for delete user account
  - PUT /api/auth/checkUserRole: For checking the user Role in this website
  - DELETE /api/auth/saveUser: For save the user in Database

  ---- Booking System
  - GET /api/bookings: View all bookings (with pagination)
  - POST /api/bookings: Create a new booking


  #### Authentication
  - Implement Clerk for user authentication.
  - Admin can access all rooms and bookings, while regular users can only modify their own bookings.
  #### Deployment
   To deploy this app:

Push the code to a GitHub repository.
Connect the repository to a platform like Vercel or Heroku.
Set up the environment variables on your deployment platform.
###### Example Deployment with Vercel:
- Go to Vercel and create a new project.
- Link your GitHub repository.
- Add the environment variables in the Vercel project settings (same as in .env).
- Deploy the application.


#### Contact Information
##### Phone: +8801741942510
##### Email: ajshajimmax@gmail.com

###### Limitation 
- I am proficient in MERN stack and next js , typescript but in this assignment i need to use prisma with mongoDB and some interesting i ever made but i try hard to complete this bit i failed to fully finish . Because the prisma with mongodb and clerk authentication was new for me . its take some time to understand those technologies . I am vary happy to giving me this assignment , i learn many thing by doing this ,Thank you very much Sir.


Make sure to update any necessary parts like URLs or placeholder values. If you're using **Prisma** with a MongoDB database, the commands for database setup are also included. Let me know if you'd like further assistance!
