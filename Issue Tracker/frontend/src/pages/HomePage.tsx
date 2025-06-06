import '../styles/HomePage.css';
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="homepage">
      <main className="homepage-content">
        {user && <h1 className="main-title">Hello, {user.username}</h1>}
        <div className="description-box">
          <h2>Добре дошли в нашия Issue Tracker!</h2>
          <p>
            Това приложение ви позволява да създавате, проследявате и управлявате билети (issues)
            по проекти. Създадено с Node.js, React, Typescript и MongoDB.
          </p>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
