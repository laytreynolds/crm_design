import { useMemo, useState } from 'react';
import { Breadcrumb } from '../app/Breadcrumb.jsx';
import { Button, Dialog, Icon, Input, Select, Toast } from '../ds/index.js';
import { useToast } from '../order/useToast.js';
import {
  CAMPAIGN_OPTIONS,
  INITIAL_USERS,
  ROLE_OPTIONS,
  STATUS_OPTIONS,
  STATUS_TONE,
} from './usersListData.js';
import './users-list.css';

const STATUS_SELECT_OPTIONS = STATUS_OPTIONS.map((s) => ({ value: s, label: s }));

export function UsersListPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [query, setQuery] = useState('');
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [campaignChoice, setCampaignChoice] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const { message: toastMsg, show: showToast } = useToast();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q),
    );
  }, [users, query]);

  function openAssign(user) {
    setCampaignChoice(user.campaign === 'Unassigned' ? '' : user.campaign);
    setAssigning(user);
  }

  function saveAssign() {
    const campaign = campaignChoice || 'Unassigned';
    setUsers((prev) =>
      prev.map((user) => (user.id === assigning.id ? { ...user, campaign } : user)),
    );
    showToast(`${assigning.fullName} assigned to ${campaign}`);
    setAssigning(null);
  }

  function saveEdit(next) {
    setUsers((prev) => prev.map((user) => (user.id === editing.id ? { ...user, ...next } : user)));
    showToast(`${next.fullName} saved`);
    setEditing(null);
  }

  function confirmDelete() {
    setUsers((prev) => prev.filter((user) => user.id !== pendingDelete.id));
    showToast(`${pendingDelete.fullName} deleted`);
    setPendingDelete(null);
  }

  return (
    <div className="us-page">
      <div className="us-page-inner">
        <div className="us-page-header">
          <h1 className="us-page-title">Users</h1>
          <Breadcrumb items={[{ label: 'Admin' }, { label: 'Users' }]} />
        </div>

        <div className="us-toolbar">
          <div className="us-search">
            <Icon name="search" size={18} />
            <input
              type="search"
              placeholder="Search Here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search users"
            />
          </div>
        </div>

        <div className="us-table-card">
          <table className="us-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Campaign</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((user) => (
                <tr key={user.id}>
                  <td className="us-name">{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span
                      className={`us-campaign-pill${user.campaign === 'Unassigned' ? ' us-campaign-pill--empty' : ''}`}
                    >
                      {user.campaign}
                    </span>
                  </td>
                  <td>
                    <span className={`us-status us-status--${STATUS_TONE[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="us-actions">
                      <button
                        type="button"
                        className="us-action-btn us-action-btn--view"
                        aria-label={`View ${user.fullName}`}
                        onClick={() => setViewing(user)}
                      >
                        <Icon name="visibility" size={16} />
                      </button>
                      <button
                        type="button"
                        className="us-action-btn us-action-btn--edit"
                        aria-label={`Edit ${user.fullName}`}
                        onClick={() => setEditing(user)}
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        type="button"
                        className="us-action-btn us-action-btn--campaign"
                        aria-label={`Assign campaign to ${user.fullName}`}
                        onClick={() => openAssign(user)}
                      >
                        <Icon name="campaign" size={16} />
                      </button>
                      <button
                        type="button"
                        className="us-action-btn us-action-btn--delete"
                        aria-label={`Delete ${user.fullName}`}
                        onClick={() => setPendingDelete(user)}
                      >
                        <Icon name="delete" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="us-empty">
                    No users match &ldquo;{query}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="us-toast-anchor" role="status" aria-live="polite">
        {toastMsg && <Toast tone="success">{toastMsg}</Toast>}
      </div>

      {viewing && (
        <Dialog
          title={viewing.fullName}
          onClose={() => setViewing(null)}
          actions={
            <Button variant="primary" onClick={() => setViewing(null)}>
              Close
            </Button>
          }
        >
          <div className="us-view-grid">
            <div>
              <span className="us-view-label">Email</span>
              <span>{viewing.email}</span>
            </div>
            <div>
              <span className="us-view-label">Role</span>
              <span>{viewing.role}</span>
            </div>
            <div>
              <span className="us-view-label">Campaign</span>
              <span>{viewing.campaign}</span>
            </div>
            <div>
              <span className="us-view-label">Status</span>
              <span>{viewing.status}</span>
            </div>
          </div>
        </Dialog>
      )}

      {editing && (
        <UserEditDialog user={editing} onClose={() => setEditing(null)} onSave={saveEdit} />
      )}

      {assigning && (
        <Dialog
          title={`Assign Campaign — ${assigning.fullName}`}
          onClose={() => setAssigning(null)}
          actions={
            <>
              <Button variant="ghost" onClick={() => setAssigning(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={saveAssign}>
                Assign
              </Button>
            </>
          }
        >
          <div className="us-form">
            <Select
              label="Campaign"
              value={campaignChoice}
              onChange={(e) => setCampaignChoice(e.target.value)}
              options={[
                { value: '', label: 'Unassigned' },
                ...CAMPAIGN_OPTIONS.map((c) => ({ value: c, label: c })),
              ]}
            />
          </div>
        </Dialog>
      )}

      {pendingDelete && (
        <Dialog
          title="Delete this user?"
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
          <p>This removes {pendingDelete.fullName} from the list. This can&rsquo;t be undone.</p>
        </Dialog>
      )}
    </div>
  );
}

function UserEditDialog({ user, onClose, onSave }) {
  const [draft, setDraft] = useState({
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
  });

  return (
    <Dialog
      title={`Edit ${user.fullName}`}
      onClose={onClose}
      actions={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSave(draft)}>
            Save
          </Button>
        </>
      }
    >
      <div className="us-form">
        <Input
          label="Full Name"
          value={draft.fullName}
          onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))}
        />
        <Input
          label="Email"
          value={draft.email}
          onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
        />
        <Select
          label="Role"
          value={draft.role}
          onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
          options={ROLE_OPTIONS.map((r) => ({ value: r, label: r }))}
        />
        <Select
          label="Status"
          value={draft.status}
          onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
          options={STATUS_SELECT_OPTIONS}
        />
      </div>
    </Dialog>
  );
}
