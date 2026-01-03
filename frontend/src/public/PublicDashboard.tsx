import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { alertService, Alert } from '../services/alertService';
import { format } from 'date-fns';
import './PublicDashboard.css';

export default function PublicDashboard() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['publicAlerts'],
    queryFn: alertService.getPublicAlerts,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: '#6b7280',
      medium: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626',
    };
    return colors[priority] || '#6b7280';
  };

  return (
    <div className="public-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h2>Emergency Alerts & Advisories</h2>
          <p>Stay informed about current emergencies, road closures, and public safety information.</p>
        </div>

        {isLoading ? (
          <div className="loading">Loading alerts...</div>
        ) : alerts && alerts.length > 0 ? (
          <div className="alerts-grid">
            {alerts.map((alert) => (
              <div key={alert.id} className="alert-card" style={{ borderLeftColor: getPriorityColor(alert.priority) }}>
                <div className="alert-header">
                  <h3>{alert.title}</h3>
                  <span className="alert-priority" style={{ backgroundColor: getPriorityColor(alert.priority) }}>
                    {alert.priority}
                  </span>
                </div>
                <p className="alert-message">{alert.message}</p>
                <div className="alert-meta">
                  <span className="alert-category">{alert.category.replace('_', ' ')}</span>
                  <span className="alert-time">
                    {format(new Date(alert.createdAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-alerts">
            <p>No active alerts at this time.</p>
          </div>
        )}

        <div className="dashboard-actions">
          <Link to="/map" className="btn-primary">
            View Interactive Map
          </Link>
        </div>
      </div>
    </div>
  );
}

