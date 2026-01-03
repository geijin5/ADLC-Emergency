import { Outlet, Link } from 'react-router-dom';
import './PublicLayout.css';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="container">
          <h1>ADLC Emergency Services</h1>
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/map">Map</Link>
            <Link to="/personnel/login">Personnel Login</Link>
          </nav>
        </div>
      </header>
      <main className="public-main">
        <Outlet />
      </main>
      <footer className="public-footer">
        <div className="container">
          <p>&copy; 2024 Anaconda–Deer Lodge County Emergency Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

