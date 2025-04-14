function HomePage() {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1 className="homepage-title">Issue Tracker</h1>
        <div className="homepage-buttons">
          <button className="btn">Login</button>
          <button className="btn">Register</button>
        </div>
      </header>

      <main className="homepage-content">
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
