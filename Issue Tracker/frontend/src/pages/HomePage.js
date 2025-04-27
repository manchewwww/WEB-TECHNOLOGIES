"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import '../styles/HomePage.css';
const react_router_dom_1 = require("react-router-dom");
function HomePage() {
    return (<div className="homepage">
      <main className="homepage-content">
        <div className="description-box">
          <h2>Добре дошли в нашия Issue Tracker!</h2>
          <p>
            Това приложение ви позволява да създавате, проследявате и управлявате билети (issues)
            по проекти. Създадено с Node.js, React, Typescript и MongoDB.
          </p>
          <react_router_dom_1.Link to="/tickets">
            <button>Преглед на билетите</button>
          </react_router_dom_1.Link>
        </div>
      </main>
    </div>);
}
exports.default = HomePage;
