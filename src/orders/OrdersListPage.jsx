import { useMemo, useState } from 'react';
import { Breadcrumb } from '../app/Breadcrumb.jsx';
import { Button, Dialog, Icon, IconButton, Toast } from '../ds/index.js';
import { useToast } from '../order/useToast.js';
import {
  ASSIGNED_USER_OPTIONS,
  CAMPAIGN_OPTIONS,
  INITIAL_ORDERS,
  SALE_TYPE_FILTER_OPTIONS,
} from './ordersListData.js';
import './orders-list.css';

const SEARCH_FIELDS = ['businessName', 'agentName', 'mobileNumber', 'saleType', 'postCode'];
const EMPTY_FILTERS = { assignedUser: '', campaign: '', saleType: '' };

export function OrdersListPage({ onOpenOrder }) {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(() => new Set());
  const [pendingDelete, setPendingDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const { message: toastMsg, show: showToast } = useToast();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (q && !SEARCH_FIELDS.some((field) => order[field].toLowerCase().includes(q))) {
        return false;
      }
      if (filters.assignedUser && order.agentName !== filters.assignedUser) return false;
      if (filters.campaign && order.campaign !== filters.campaign) return false;
      if (filters.saleType && order.saleType !== filters.saleType) return false;
      return true;
    });
  }, [orders, query, filters]);

  const allSelected = visible.length > 0 && visible.every((o) => selected.has(o.id));

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(visible.map((o) => o.id)));
  }

  function toggleOne(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleCopy(order) {
    setOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === order.id);
      const copy = { ...order, id: Date.now(), businessName: `${order.businessName} (Copy)` };
      const next = prev.slice();
      next.splice(idx + 1, 0, copy);
      return next;
    });
    showToast(`${order.businessName} copied`);
  }

  function handleDeleteConfirmed() {
    setOrders((prev) => prev.filter((o) => o.id !== pendingDelete.id));
    showToast('Order deleted');
    setPendingDelete(null);
  }

  return (
    <div className="ol-page">
      <div className="ol-page-inner">
        <div className="ol-page-header">
          <h1 className="ol-page-title">Orders</h1>
          <Breadcrumb items={[{ label: 'Admin' }, { label: 'Orders' }]} />
        </div>

        <div className="ol-toolbar">
          <div className="ol-toolbar-actions">
            <Button
              variant="primary"
              size="sm"
              icon={<Icon name="add" />}
              onClick={() => showToast('New order started')}
            >
              New Order
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Icon name="file_download" />}
              onClick={() => showToast(`Exporting ${visible.length} order(s)`)}
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
              onClick={() => showToast('Orders refreshed')}
            >
              Refresh
            </Button>
          </div>

          <div className="ol-search">
            <input
              type="search"
              className="ol-search-input"
              placeholder="Search Here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search orders"
            />
            <button type="button" className="ol-search-btn" aria-label="Search">
              <Icon name="search" size={18} />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="ol-filters" role="region" aria-label="Filter orders">
            <div className="ol-filters-grid">
              <div className="ol-filter-field">
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

              <div className="ol-filter-field">
                <label htmlFor="filter-campaign">Select Campaign</label>
                <select
                  id="filter-campaign"
                  value={filters.campaign}
                  onChange={(e) => setFilters((f) => ({ ...f, campaign: e.target.value }))}
                >
                  <option value="">Select Campaign</option>
                  {CAMPAIGN_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ol-filter-field">
                <label htmlFor="filter-sale-type">Sale Type</label>
                <select
                  id="filter-sale-type"
                  value={filters.saleType}
                  onChange={(e) => setFilters((f) => ({ ...f, saleType: e.target.value }))}
                >
                  <option value="">Sale Type</option>
                  {SALE_TYPE_FILTER_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date-range filtering isn't wired up yet — these are placeholders. */}
              <div className="ol-filter-field">
                <label htmlFor="filter-created-at">Created At</label>
                <button
                  type="button"
                  id="filter-created-at"
                  className="ol-daterange"
                  onClick={() => showToast('Date range filtering coming soon')}
                >
                  <span>
                    Start date <span aria-hidden="true">→</span> End date
                  </span>
                  <Icon name="calendar_month" size={18} />
                </button>
              </div>

              <div className="ol-filter-field">
                <label htmlFor="filter-completed-date">Completed Date</label>
                <button
                  type="button"
                  id="filter-completed-date"
                  className="ol-daterange"
                  onClick={() => showToast('Date range filtering coming soon')}
                >
                  <span>
                    Start date <span aria-hidden="true">→</span> End date
                  </span>
                  <Icon name="calendar_month" size={18} />
                </button>
              </div>
            </div>

            <div className="ol-filters-footer">
              <Button variant="primary" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                Reset Filter
              </Button>
            </div>
          </div>
        )}

        <div className="ol-table-card">
          <table className="ol-table">
            <thead>
              <tr>
                <th className="ol-col-check">
                  <input
                    type="checkbox"
                    aria-label="Select all orders"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th>Sale Type</th>
                <th>Agent Name</th>
                <th>Mobile Number</th>
                <th>Business Name</th>
                <th>Post Code</th>
                <th>Status</th>
                <th>Box Value</th>
                <th>Placed Date</th>
                <th>Eligibility Date</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id}>
                  <td className="ol-col-check">
                    <input
                      type="checkbox"
                      aria-label={`Select ${order.businessName}`}
                      checked={selected.has(order.id)}
                      onChange={() => toggleOne(order.id)}
                    />
                  </td>
                  <td>{order.saleType}</td>
                  <td>{order.agentName}</td>
                  <td>{order.mobileNumber}</td>
                  <td>
                    <button
                      type="button"
                      className="ol-business-link"
                      onClick={() => onOpenOrder?.(order.id)}
                    >
                      {order.businessName}
                    </button>
                    <div className="ol-row-actions">
                      <button type="button" onClick={() => onOpenOrder?.(order.id)}>
                        View
                      </button>
                      <button type="button" onClick={() => onOpenOrder?.(order.id)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => onOpenOrder?.(order.id, 'notes')}>
                        Add Note
                      </button>
                      <button type="button" onClick={() => setPendingDelete(order)}>
                        Delete
                      </button>
                      <button type="button" onClick={() => handleCopy(order)}>
                        Create a Copy
                      </button>
                    </div>
                  </td>
                  <td>{order.postCode}</td>
                  <td>
                    <span className={`ol-status ol-status--${order.statusTone}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.boxValue}</td>
                  <td className="ol-cell-truncate">
                    {order.placedDate} | {order.placedTime}
                  </td>
                  <td>{order.eligibilityDate || '-'}</td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={9} className="ol-empty">
                    No orders match &ldquo;{query}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ol-toast-anchor" role="status" aria-live="polite">
        {toastMsg && <Toast tone="success">{toastMsg}</Toast>}
      </div>

      {pendingDelete && (
        <Dialog
          title="Delete this order?"
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
          <p>This removes {pendingDelete.businessName} from the list. This can&rsquo;t be undone.</p>
        </Dialog>
      )}
    </div>
  );
}
