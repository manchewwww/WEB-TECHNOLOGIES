import '../styles/HomePage.css';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="homepage">
      <main className="homepage-content">
        <div className="description-box">
          <h2>Добре дошли в нашия Issue Tracker!</h2>
          <p>
            Това приложение ви позволява да създавате, проследявате и управлявате билети (issues)
            по проекти. Създадено с Node.js, React, Typescript и MongoDB.
          </p>
          <Link to="/tickets">
            <button>Преглед на билетите</button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
