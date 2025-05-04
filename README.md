# Triviargh 🎮

A modern quiz application that lets users create custom trivia rooms, generate questions with AI, and play with friends.

![Triviargh Home Page Screenshot](public/triviargh-page-1.png)
![Triviargh Quiz Page Screenshot](public/triviargh-page-2.png)
![Triviargh Game Screenshot](public/triviargh-page-3.png)

## Features

- **Room Management**: Create private quiz rooms with unique 6-character codes
- **AI Question Generation**: Leverage Google's Gemini AI to automatically generate quiz questions
- **Custom Questions**: Manually create your own custom questions with multiple-choice answers
- **Real-time Feedback**: Animated feedback on correct and incorrect answers
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Gemini AI for question generation
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- Google Gemini API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/triviargh.git
   cd triviargh
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/triviargh"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. Set up the database
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project can be easily deployed on Vercel:

1. Push your code to GitHub
2. Import your repository on Vercel
3. Configure the environment variables
4. Deploy!

## Usage

1. Create a new quiz room or join an existing one with a 6-character code
2. Add questions manually or generate them with AI
3. Start the quiz and answer the questions
4. See your final score and play again!

## License

MIT

## Acknowledgments

- Google Gemini AI for powering the question generation
- Next.js team for the amazing framework
- Vercel for hosting