# WhaleWatch 🐋

## Overview
An interactive educational platform focused on whale facts and ocean knowledge, featuring daily content updates and comprehensive fact browsing capabilities. WhaleWatch makes learning about marine life engaging and fun through its beautiful ocean-themed interface and interactive features.

## Features
- **Daily Whale Facts** with beautiful imagery and engaging content
- **Interactive Quiz System** to test and expand your whale knowledge
- **User Authentication System** for personalized experience
- **Save/Bookmark Favorite Facts** to build your personal collection
- **User Preferences & Customization** for tailored interaction
- **Ocean-themed UI** with mesmerizing animated bubbles
- **Browse All Facts** feature for comprehensive learning
- **About the Creators** section highlighting our team

## Technologies Used
### Frontend
- React with TypeScript for robust UI development
- TailwindCSS + Shadcn/UI for beautiful, responsive design
- TanStack Query for efficient state management
- Custom animations for engaging user experience

### Backend
- Express server for reliable API endpoints
- PostgreSQL database with Drizzle ORM
- Passport.js for secure authentication
- RESTful API architecture

## Installation & Setup
1. Clone the repository:
```bash
git clone https://github.com/rivpunc/comp426_finalproject.git
cd comp426_finalproject
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with the following:
```env
DATABASE_URL=postgresql://your_database_url
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage
1. **Daily Facts**: Visit the home page to see the whale fact of the day
2. **Browse Facts**: Click "Browse More Facts" to explore our complete collection
3. **Quiz**: Test your knowledge in the Quiz section
4. **Save Facts**: Create an account to save your favorite facts
5. **Preferences**: Customize your experience in the Profile section

## About the Creators
- **Rivers Porper** - UNC Chapel Hill Student
  - Full-stack Developer
  - Marine Life Enthusiast

- **Henry Liu** - UNC Chapel Hill Student
  - UI/UX Designer
  - Web Development Specialist

## Project Presentation
Watch our project presentation on YouTube: [WhaleWatch Presentation](https://www.youtube.com/watch?v=yazGSB48pLM)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
