import { useMemo, useState } from 'react';
import { Breadcrumb } from '../app/Breadcrumb.jsx';
import { Button, Dialog, Icon, IconButton, Toast } from '../ds/index.js';
import { useToast } from '../order/useToast.js';
import {
  ASSIGNED_USER_OPTIONS,
  INITIAL_CLIENTS,
  STATUS_OPTIONS,
  STATUS_TONE,
} from './clientsListData.js';
import './clients-list.css';

const SEARCH_FIELDS = ['fullName', 'email', 'mobile', 'assigned'];
const EMPTY_FILTERS = { assignedUser: '', status: '' };

export function ClientsListPage({ onOpenClient }) {
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(() => new Set());
  const [pendingDelete, setPendingDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const { message: toastMsg, show: showToast } = useToast();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((client) => {
      if (q && !SEARCH_FIELDS.some((field) => String(client[field]).toLowerCase().includes(q))) {
        return false;
      }
      if (filters.assignedUser && client.assigned !== filters.assignedUser) return false;
      if (filters.status && client.status !== filters.status) return false;
      return true;
    });
  }, [clients, query, filters]);

  const allSelected = visible.length > 0 && visible.every((c) => selected.has(c.id));

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(visible.map((c) => c.id)));
  }

  function toggleOne(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleDeleteConfirmed() {
    setClients((prev) => prev.filter((c) => c.id !== pendingDelete.id));
    showToast('Client deleted');
    setPendingDelete(null);
  }

  return (
    <div className="cl-page">
      <div className="cl-page-inner">
        <div className="cl-page-header">
          <h1 className="cl-page-title">Clients</h1>
          <Breadcrumb items={[{ label: 'Admin' }, { label: 'Clients' }]} />
        </div>

        <div className="cl-toolbar">
          <div className="cl-toolbar-actions">
            <Button
              variant="primary"
              size="sm"
              icon={<Icon name="add" />}
              onClick={() => showToast('New client started')}
            >
              New Client
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Icon name="file_download" />}
              onClick={() => showToast(`Exporting ${visible.length} client(s)`)}
            >
              Export
            </Button>
            <IconButton
              size="sm"
              aria-label={showFilters ? 'Hide filters' : 'Show filters'}
              icon={<Icon name="filter_list" />}
              onClick={() => setShowFilters((v) => !v)}
            />
            <Button
              variant="primary"
              size="sm"
              icon={<Icon name="refresh" />}
              onClick={() => showToast('Clients refreshed')}
            >
              Refresh
            </Button>
          </div>

          <div className="cl-search">
            <input
              type="search"
              className="cl-search-input"
              placeholder="Search Here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search clients"
            />
            <button type="button" className="cl-search-btn" aria-label="Search">
              <Icon name="search" size={18} />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="cl-filters" role="region" aria-label="Filter clients">
            <div className="cl-filters-grid">
              <div className="cl-filter-field">
                <label htmlFor="filter-assigned-user">Assign User</label>
                <select
                  id="filter-assigned-user"
                  value={filters.assignedUser}
                  onChange={(e) => setFilters((f) => ({ ...f, assignedUser: e.target.value }))}
                >
                  <option value="">Assign User</option>
                  {ASSIGNED_USER_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cl-filter-field">
                <label htmlFor="filter-status">Status</label>
                <select
                  id="filter-status"
                  value={filters.status}
                  onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                >
                  <option value="">Status</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="cl-filters-footer">
              <Button variant="primary" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                Reset Filter
              </Button>
            </div>
          </div>
        )}

        <div className="cl-table-card">
          <table className="cl-table">
            <thead>
              <tr>
                <th className="cl-col-check">
                  <input
                    type="checkbox"
                    aria-label="Select all clients"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Orders</th>
                <th>Assigned</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((client) => (
                <tr key={client.id}>
                  <td className="cl-col-check">
                    <input
                      type="checkbox"
                      aria-label={`Select ${client.fullName}`}
                      checked={selected.has(client.id)}
                      onChange={() => toggleOne(client.id)}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="cl-name-link"
                      onClick={() => onOpenClient?.(client.id, 'view')}
                    >
                      {client.fullName}
                    </button>
                    <div className="cl-row-actions">
                      <button type="button" onClick={() => onOpenClient?.(client.id, 'view')}>
                        View
                      </button>
                      <button type="button" onClick={() => onOpenClient?.(client.id, 'edit')}>
                        Edit
                      </button>
                      <button type="button" onClick={() => setPendingDelete(client)}>
                        Delete
                      </button>
                    </div>
                  </td>
                  <td>{client.email}</td>
                  <td>{client.mobile}</td>
                  <td>{client.orders}</td>
                  <td>{client.assigned}</td>
                  <td>
                    <span className={`cl-status cl-status--${STATUS_TONE[client.status]}`}>
                      {client.status}
                    </span>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="cl-empty">
                    No clients match &ldquo;{query}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="cl-toast-anchor" role="status" aria-live="polite">
        {toastMsg && <Toast tone="success">{toastMsg}</Toast>}
      </div>

      {pendingDelete && (
        <Dialog
          title="Delete this client?"
          onClose={() => setPendingDelete(null)}
          actions={
            <>
              <Button variant="ghost" onClick={() => setPendingDelete(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleDeleteConfirmed}>
                Delete
              </Button>
            </>
          }
        >
          <p>This removes {pendingDelete.fullName} from the list. This can&rsquo;t be undone.</p>
        </Dialog>
      )}
    </div>
  );
}
