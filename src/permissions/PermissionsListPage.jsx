import { useMemo, useState } from 'react';
import { Breadcrumb } from '../app/Breadcrumb.jsx';
import { Button, Dialog, Icon, Input, Toast } from '../ds/index.js';
import { useToast } from '../order/useToast.js';
import { INITIAL_PERMISSIONS } from './permissionsData.js';
import './permissions-list.css';

export function PermissionsListPage() {
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ name: '', description: '' });
  const { message: toastMsg, show: showToast } = useToast();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return permissions;
    return permissions.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [permissions, query]);

  function openEdit(permission) {
    setDraft({ name: permission.name, description: permission.description });
    setEditing(permission);
  }

  function saveEdit() {
    const name = draft.name.trim();
    if (!name) return;
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === editing.id ? { ...p, name, description: draft.description.trim() } : p,
      ),
    );
    setEditing(null);
    showToast(`${name} saved`);
  }

  return (
    <div className="pm-page">
      <div className="pm-page-inner">
        <div className="pm-page-header">
          <h1 className="pm-page-title">Permissions</h1>
          <Breadcrumb items={[{ label: 'Admin' }, { label: 'Permissions' }]} />
        </div>

        <div className="pm-toolbar">
          <div className="pm-search">
            <Icon name="search" size={18} />
            <input
              type="search"
              placeholder="Search Here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search permissions"
            />
          </div>
        </div>

        <div className="pm-table-card">
          <table className="pm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((permission) => (
                <tr key={permission.id}>
                  <td className="pm-name">{permission.name}</td>
                  <td className="pm-description">{permission.description}</td>
                  <td>
                    <span className="pm-category-pill">{permission.category}</span>
                  </td>
                  <td>
                    <div className="pm-actions">
                      <button
                        type="button"
                        className="pm-action-btn pm-action-btn--edit"
                        aria-label={`Edit ${permission.name}`}
                        onClick={() => openEdit(permission)}
                      >
                        <Icon name="edit" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={4} className="pm-empty">
                    No permissions match &ldquo;{query}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pm-toast-anchor" role="status" aria-live="polite">
        {toastMsg && <Toast tone="success">{toastMsg}</Toast>}
      </div>

      {editing && (
        <Dialog
          title={`Edit ${editing.name}`}
          onClose={() => setEditing(null)}
          actions={
            <>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={saveEdit}>
                Save
              </Button>
            </>
          }
        >
          <div className="pm-form">
            <Input
              label="Name"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
            <Input
              label="Description"
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
          </div>
        </Dialog>
      )}
    </div>
  );
}
