import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { alertService } from '../services/alertService';
import { format } from 'date-fns';
import './PersonnelDashboard.css';

export default function PersonnelDashboard() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['personnelAlerts'],
    queryFn: alertService.getAlerts,
  });

  const activeAlerts = alerts?.filter((a) => a.isActive && a.isPublished) || [];
  const draftAlerts = alerts?.filter((a) => !a.isPublished) || [];

  return (
    <div className="personnel-dashboard">
      <h2>Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Active Alerts</h3>
          <div className="stat-number">{activeAlerts.length}</div>
          <Link to="/personnel/alerts" className="card-link">
            View All Alerts →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Draft Alerts</h3>
          <div className="stat-number">{draftAlerts.length}</div>
          <Link to="/personnel/alerts" className="card-link">
            Manage Alerts →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/personnel/alerts?create=true" className="btn-action">
              Create Alert
            </Link>
            <Link to="/personnel/map" className="btn-action">
              Edit Map
            </Link>
            <Link to="/personnel/chat" className="btn-action">
              Open Chat
            </Link>
          </div>
        </div>
      </div>

      <div className="recent-alerts">
        <h3>Recent Alerts</h3>
        {isLoading ? (
          <div>Loading...</div>
        ) : alerts && alerts.length > 0 ? (
          <div className="alerts-list">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="alert-item">
                <div className="alert-item-header">
                  <span className="alert-title">{alert.title}</span>
                  <span className={`alert-status ${alert.isPublished ? 'published' : 'draft'}`}>
                    {alert.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="alert-item-meta">
                  <span>{alert.category}</span>
                  <span>{format(new Date(alert.createdAt), 'MMM d, yyyy h:mm a')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No alerts yet.</div>
        )}
      </div>
    </div>
  );
}

