import { useMemo, useState } from 'react';
import { Breadcrumb } from '../app/Breadcrumb.jsx';
import { Button, Dialog, Icon, Input, Toast } from '../ds/index.js';
import { useToast } from '../order/useToast.js';
import { SETTINGS_CONFIG } from './settingsData.js';
import './settings-list.css';

const CURRENT_USER = 'Layton Reynolds';
const PAGE_SIZE_OPTIONS = [10, 25, 50];
const EMPTY_DRAFT = { name: '', color: '#3fd6a8' };

export function SettingsListPage({ settingId, onBack }) {
  const config = SETTINGS_CONFIG[settingId];
  const [items, setItems] = useState(config?.items ?? []);
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [pendingDelete, setPendingDelete] = useState(null);
  const { message: toastMsg, show: showToast } = useToast();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((item) => item.name.toLowerCase().includes(q)) : items;
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = visible.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(currentPage * pageSize, visible.length);
  const pageItems = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (!config) {
    return (
      <div className="st-page">
        <div className="st-page-inner">
          <Breadcrumb items={[{ label: 'Admin' }, { label: 'Settings' }]} />
          <p>Unknown setting.</p>
        </div>
      </div>
    );
  }

  function openCreate() {
    setDraft(EMPTY_DRAFT);
    setCreating(true);
  }

  function openEdit(item) {
    setDraft({ name: item.name, color: item.color });
    setEditing(item);
  }

  function saveCreate() {
    const name = draft.name.trim();
    if (!name) return;
    setItems((prev) => [
      {
        id: Date.now(),
        name,
        color: draft.color,
        addedBy: CURRENT_USER,
        updatedBy: CURRENT_USER,
        createdAt: 'Just now',
        updatedAt: 'Just now',
      },
      ...prev,
    ]);
    setCreating(false);
    showToast(`${name} created`);
  }

  function saveEdit() {
    const name = draft.name.trim();
    if (!name) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editing.id
          ? { ...item, name, color: draft.color, updatedBy: CURRENT_USER, updatedAt: 'Just now' }
          : item,
      ),
    );
    setEditing(null);
    showToast(`${name} saved`);
  }

  function confirmDelete() {
    setItems((prev) => prev.filter((item) => item.id !== pendingDelete.id));
    showToast(`${pendingDelete.name} deleted`);
    setPendingDelete(null);
  }

  return (
    <div className="st-page">
      <div className="st-page-inner">
        <div className="st-page-header">
          <h1 className="st-page-title">{config.title}</h1>
          <Breadcrumb
            items={[
              { label: 'Admin' },
              onBack ? { label: 'Settings', onClick: onBack } : { label: 'Settings' },
              { label: config.title },
            ]}
          />
        </div>

        <div className="st-toolbar">
          <Button variant="primary" size="sm" icon={<Icon name="add" />} onClick={openCreate}>
            Create {config.title}
          </Button>

          <div className="st-search">
            <Icon name="search" size={18} />
            <input
              type="search"
              placeholder="Search Here..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              aria-label={`Search ${config.title.toLowerCase()}`}
            />
          </div>
        </div>

        <div className="st-table-card">
          <table className="st-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Color</th>
                <th>Added By</th>
                <th>Updated By</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item) => (
                <tr key={item.id}>
                  <td className="st-name">{item.name}</td>
                  <td>
                    <span
                      className="st-color-pill"
                      style={{
                        color: item.color,
                        borderColor: item.color,
                        background: `${item.color}1a`,
                      }}
                    >
                      {item.color}
                    </span>
                  </td>
                  <td>
                    <span className="st-user-pill">{item.addedBy}</span>
                  </td>
                  <td>
                    <span className="st-user-pill">{item.updatedBy}</span>
                  </td>
                  <td className="st-muted">{item.createdAt}</td>
                  <td className="st-muted">{item.updatedAt}</td>
                  <td>
                    <div className="st-actions">
                      <button
                        type="button"
                        className="st-action-btn st-action-btn--view"
                        aria-label={`View ${item.name}`}
                        onClick={() => setViewing(item)}
                      >
                        <Icon name="visibility" size={16} />
                      </button>
                      <button
                        type="button"
                        className="st-action-btn st-action-btn--edit"
                        aria-label={`Edit ${item.name}`}
                        onClick={() => openEdit(item)}
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        type="button"
                        className="st-action-btn st-action-btn--delete"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => setPendingDelete(item)}
                      >
                        <Icon name="delete" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="st-empty">
                    No {config.title.toLowerCase()} match &ldquo;{query}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="st-pagination">
            <div className="st-pagesize">
              <label htmlFor="st-page-size">Rows per page:</label>
              <select
                id="st-page-size"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="st-pagestatus">
              {pageStart}-{pageEnd} of {visible.length}
            </div>
            <div className="st-pagebtns">
              <button type="button" disabled={currentPage === 1} onClick={() => setPage(1)}>
                <Icon name="first_page" size={18} />
              </button>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <Icon name="chevron_left" size={18} />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <Icon name="chevron_right" size={18} />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage(totalPages)}
              >
                <Icon name="last_page" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="st-toast-anchor" role="status" aria-live="polite">
        {toastMsg && <Toast tone="success">{toastMsg}</Toast>}
      </div>

      {viewing && (
        <Dialog
          title={viewing.name}
          onClose={() => setViewing(null)}
          actions={
            <Button variant="primary" onClick={() => setViewing(null)}>
              Close
            </Button>
          }
        >
          <div className="st-view-grid">
            <div>
              <span className="st-view-label">Color</span>
              <span
                className="st-color-pill"
                style={{
                  color: viewing.color,
                  borderColor: viewing.color,
                  background: `${viewing.color}1a`,
                }}
              >
                {viewing.color}
              </span>
            </div>
            <div>
              <span className="st-view-label">Added by</span>
              <span>{viewing.addedBy}</span>
            </div>
            <div>
              <span className="st-view-label">Updated by</span>
              <span>{viewing.updatedBy}</span>
            </div>
            <div>
              <span className="st-view-label">Created at</span>
              <span>{viewing.createdAt}</span>
            </div>
            <div>
              <span className="st-view-label">Updated at</span>
              <span>{viewing.updatedAt}</span>
            </div>
          </div>
        </Dialog>
      )}

      {(creating || editing) && (
        <Dialog
          title={creating ? `Create ${config.title}` : `Edit ${editing.name}`}
          onClose={() => (creating ? setCreating(false) : setEditing(null))}
          actions={
            <>
              <Button
                variant="ghost"
                onClick={() => (creating ? setCreating(false) : setEditing(null))}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={creating ? saveCreate : saveEdit}>
                Save
              </Button>
            </>
          }
        >
          <div className="st-form">
            <Input
              label="Name"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
            <div className="st-color-field">
              <label htmlFor="st-color-input">Color</label>
              <div className="st-color-row">
                <input
                  id="st-color-input"
                  type="color"
                  value={draft.color}
                  onChange={(e) => setDraft((d) => ({ ...d, color: e.target.value }))}
                />
                <Input
                  value={draft.color}
                  onChange={(e) => setDraft((d) => ({ ...d, color: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {pendingDelete && (
        <Dialog
          title={`Delete this ${config.title.toLowerCase()}?`}
          onClose={() => setPendingDelete(null)}
          actions={
            <>
              <Button variant="ghost" onClick={() => setPendingDelete(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmDelete}>
                Delete
              </Button>
            </>
          }
        >
          <p>This removes {pendingDelete.name} from {config.title}. This can&rsquo;t be undone.</p>
        </Dialog>
      )}
    </div>
  );
}
