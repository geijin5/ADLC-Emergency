import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import './PersonnelLayout.css';

export default function PersonnelLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/personnel/login');
  };

  return (
    <div className="personnel-layout">
      <header className="personnel-header">
        <div className="header-content">
          <h1>ADLC Personnel Portal</h1>
          <div className="header-right">
            <span className="user-info">
              {user?.firstName} {user?.lastName} ({user?.role})
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
        <nav className="personnel-nav">
          <Link to="/personnel">Dashboard</Link>
          <Link to="/personnel/map">Map</Link>
          <Link to="/personnel/alerts">Alerts</Link>
          <Link to="/personnel/chat">Chat</Link>
          <Link to="/personnel/sar">SAR Operations</Link>
        </nav>
      </header>
      <main className="personnel-main">
        <Outlet />
      </main>
    </div>
  );
}

