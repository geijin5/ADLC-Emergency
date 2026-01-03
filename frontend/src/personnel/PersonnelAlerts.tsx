import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService, Alert } from '../services/alertService';
import { format } from 'date-fns';
import './PersonnelAlerts.css';

export default function PersonnelAlerts() {
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['personnelAlerts'],
    queryFn: alertService.getAlerts,
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => alertService.publishAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnelAlerts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => alertService.deleteAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnelAlerts'] });
    },
  });

  return (
    <div className="personnel-alerts">
      <div className="alerts-header">
        <h2>Alert Management</h2>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          Create Alert
        </button>
      </div>

      {showCreate && (
        <CreateAlertForm
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            queryClient.invalidateQueries({ queryKey: ['personnelAlerts'] });
          }}
        />
      )}

      {isLoading ? (
        <div>Loading alerts...</div>
      ) : alerts && alerts.length > 0 ? (
        <div className="alerts-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Target</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.title}</td>
                  <td>{alert.category.replace('_', ' ')}</td>
                  <td>
                    <span className={`priority-badge ${alert.priority}`}>
                      {alert.priority}
                    </span>
                  </td>
                  <td>{alert.target}</td>
                  <td>
                    <span className={alert.isPublished ? 'status-published' : 'status-draft'}>
                      {alert.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{format(new Date(alert.createdAt), 'MMM d, yyyy')}</td>
                  <td>
                    <div className="action-buttons">
                      {!alert.isPublished && (
                        <button
                          onClick={() => publishMutation.mutate(alert.id)}
                          className="btn-sm btn-publish"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(alert.id)}
                        className="btn-sm btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No alerts found.</div>
      )}
    </div>
  );
}

function CreateAlertForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: 'advisory',
    priority: 'medium',
    target: 'public',
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Alert>) => alertService.createAlert(data),
    onSuccess: onSuccess,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Create Alert</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={5}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="emergency_alert">Emergency Alert</option>
                <option value="road_closure">Road Closure</option>
                <option value="detour">Detour</option>
                <option value="parade_route">Parade Route</option>
                <option value="area_closure">Area Closure</option>
                <option value="search_rescue">Search & Rescue</option>
                <option value="advisory">Advisory</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="form-group">
              <label>Target</label>
              <select
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              >
                <option value="public">Public</option>
                <option value="personnel">Personnel</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

