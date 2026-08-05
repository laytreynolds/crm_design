import { useMemo, useState } from 'react';
import { Breadcrumb } from '../app/Breadcrumb.jsx';
import { Button, Dialog, Icon, IconButton, Tag, Toast } from '../ds/index.js';
import { useToast } from '../order/useToast.js';
import { getClientProfile } from './ticketsData.js';
import {
  ASSIGNED_STAFF_OPTIONS,
  formatTicketAge,
  formatTicketDateTime,
  INITIAL_TICKETS,
  PRIORITY_TONE,
  STATUS_TONE,
  TICKET_PRIORITIES,
  TICKET_SOURCES,
  TICKET_STATUSES,
} from './ticketsData.js';
import './tickets-list.css';

const EMPTY_FILTERS = { status: '', source: '', priority: '', assignedTo: '' };

function searchableText(ticket) {
  const client = getClientProfile(ticket.client_id);
  return [
    ticket.id,
    ticket.subject,
    ticket.contact_email,
    ticket.contact_phone,
    ticket.assigned_to,
    client?.fullName,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function TicketsListPage({ onOpenTicket, initialStatus = null }) {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [query, setQuery] = useState('');
  // Arriving from the sidebar's per-status sub-item (see App.jsx's
  // TICKET_STATUS_NAV) pre-applies that status and opens the filter panel
  // so the active filter is visible and easy to change.
  const [showFilters, setShowFilters] = useState(Boolean(initialStatus));
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, status: initialStatus ?? '' });
  const [pendingDelete, setPendingDelete] = useState(null);
  const { message: toastMsg, show: showToast } = useToast();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      if (q && !searchableText(ticket).includes(q)) return false;
      if (filters.status && ticket.status !== filters.status) return false;
      if (filters.source && ticket.source !== filters.source) return false;
      if (filters.priority && ticket.priority !== filters.priority) return false;
      if (filters.assignedTo && ticket.assigned_to !== filters.assignedTo) return false;
      return true;
    });
  }, [tickets, query, filters]);

  function handleDeleteConfirmed() {
    setTickets((prev) => prev.filter((t) => t.id !== pendingDelete.id));
    showToast('Ticket deleted');
    setPendingDelete(null);
  }

  return (
    <div className="tl-page">
      <div className="tl-page-inner">
        <div className="tl-page-header">
          <h1 className="tl-page-title">Tickets</h1>
          <Breadcrumb items={[{ label: 'Admin' }, { label: 'Tickets' }]} />
        </div>

        <div className="tl-toolbar">
          <div className="tl-toolbar-actions">
            <Button
              variant="primary"
              size="sm"
              icon={<Icon name="add" />}
              onClick={() => showToast('New ticket started')}
            >
              New Ticket
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Icon name="file_download" />}
              onClick={() => showToast(`Exporting ${visible.length} ticket(s)`)}
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
              onClick={() => showToast('Tickets refreshed')}
            >
              Refresh
            </Button>
          </div>

          <div className="tl-search">
            <input
              type="search"
              className="tl-search-input"
              placeholder="Search Here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search tickets"
            />
            <button type="button" className="tl-search-btn" aria-label="Search">
              <Icon name="search" size={18} />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="tl-filters" role="region" aria-label="Filter tickets">
            <div className="tl-filters-grid">
              <div className="tl-filter-field">
                <label htmlFor="filter-status">Status</label>
                <select
                  id="filter-status"
                  value={filters.status}
                  onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                >
                  <option value="">Status</option>
                  {TICKET_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="tl-filter-field">
                <label htmlFor="filter-source">Source</label>
                <select
                  id="filter-source"
                  value={filters.source}
                  onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value }))}
                >
                  <option value="">Source</option>
                  {TICKET_SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="tl-filter-field">
                <label htmlFor="filter-priority">Priority</label>
                <select
                  id="filter-priority"
                  value={filters.priority}
                  onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
                >
                  <option value="">Priority</option>
                  {TICKET_PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="tl-filter-field">
                <label htmlFor="filter-assigned">Assigned To</label>
                <select
                  id="filter-assigned"
                  value={filters.assignedTo}
                  onChange={(e) => setFilters((f) => ({ ...f, assignedTo: e.target.value }))}
                >
                  <option value="">Assigned To</option>
                  {ASSIGNED_STAFF_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="tl-filters-footer">
              <Button variant="primary" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                Reset Filter
              </Button>
            </div>
          </div>
        )}

        <div className="tl-table-card">
          <table className="tl-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Source</th>
                <th>Client</th>
                <th>Contact</th>
                <th>Assigned</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((ticket) => {
                const client = getClientProfile(ticket.client_id);
                return (
                  <tr key={ticket.id}>
                    <td>
                      <button
                        type="button"
                        className="tl-subject-link"
                        onClick={() => onOpenTicket?.(ticket.id)}
                      >
                        {ticket.subject}
                      </button>
                      <div className="tl-row-meta">{ticket.id}</div>
                      <div className="tl-row-actions">
                        <button type="button" onClick={() => onOpenTicket?.(ticket.id)}>
                          View
                        </button>
                        <button type="button" onClick={() => onOpenTicket?.(ticket.id, 'ticket-details')}>
                          Add Note
                        </button>
                        <button type="button" onClick={() => setPendingDelete(ticket)}>
                          Delete
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`tl-status tl-status--${STATUS_TONE[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td>
                      <span className={`tl-priority tl-priority--${PRIORITY_TONE[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <Tag>{ticket.source}</Tag>
                    </td>
                    <td>
                      {client ? (
                        <span className="tl-client-name">{client.fullName}</span>
                      ) : (
                        <span className="tl-unlinked">Unlinked</span>
                      )}
                    </td>
                    <td className="tl-cell-truncate">
                      {ticket.contact_email || ticket.contact_phone || '—'}
                    </td>
                    <td>{ticket.assigned_to || <span className="tl-unlinked">Unassigned</span>}</td>
                    <td className="tl-cell-truncate">{formatTicketDateTime(ticket.created_at)}</td>
                    <td className="tl-cell-truncate">{formatTicketDateTime(ticket.updated_at)}</td>
                    <td className="tl-cell-truncate">{formatTicketAge(ticket.created_at)}</td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={10} className="tl-empty">
                    No tickets match &ldquo;{query}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tl-toast-anchor" role="status" aria-live="polite">
        {toastMsg && <Toast tone="success">{toastMsg}</Toast>}
      </div>

      {pendingDelete && (
        <Dialog
          title="Delete this ticket?"
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
          <p>This removes &ldquo;{pendingDelete.subject}&rdquo; from the list. This can&rsquo;t be undone.</p>
        </Dialog>
      )}
    </div>
  );
}
