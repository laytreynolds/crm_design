import { useCallback, useEffect, useState } from 'react';
import { Breadcrumb } from '../app/Breadcrumb.jsx';
import { formatGBP } from '../dashboard/format.js';
import { Button, Card, Dialog, Icon, Input, Select, Tag, Toast } from '../ds/index.js';
import { useToast } from '../order/useToast.js';
import { INITIAL_CLIENTS } from '../clients/clientsListData.js';
import { AGENT_DISPLAY_NAMES } from '../orders/ordersListData.js';
import {
  formatTicketAge,
  formatTicketDateTime,
  getClientProfile,
  INITIAL_TICKETS,
  PRIORITY_TONE,
  resolveLinkedOrder,
  stampNow,
  STATUS_TONE,
  TICKET_PRIORITIES,
  TICKET_STAFF,
  TICKET_STATUSES,
} from './ticketsData.js';
import './ticket-page.css';

const NAV_SECTIONS = [
  { key: 'ticketDetails', id: 'ticket-details', nav: 'Ticket Details', title: 'Ticket Details' },
  { key: 'clientInfo', id: 'client-information', nav: 'Client Information', title: 'Client Information' },
  { key: 'order', id: 'order', nav: 'Order', title: 'Order' },
];

const STATUS_SELECT_OPTIONS = TICKET_STATUSES.map((s) => ({ value: s, label: s }));
const PRIORITY_SELECT_OPTIONS = TICKET_PRIORITIES.map((p) => ({ value: p, label: p }));
const STAFF_SELECT_OPTIONS = [
  { value: '', label: 'Unassigned' },
  ...TICKET_STAFF.map((s) => ({ value: s, label: s })),
];

const ACTIVITY_LABEL = { message: 'Original message', note: 'Internal note', status: 'Status change' };
const ACTIVITY_ICON = { message: 'mail', note: 'sticky_note_2', status: 'flag' };

function getTicketDetail(id) {
  return INITIAL_TICKETS.find((t) => t.id === id) ?? INITIAL_TICKETS[0];
}

const ALL_EXPANDED = Object.fromEntries(NAV_SECTIONS.map((s) => [s.key, true]));

export function TicketPage({ onBack, ticketId, focusSection, onOpenOrder, onOpenClient }) {
  const [ticket, setTicket] = useState(() => getTicketDetail(ticketId));
  const [expanded, setExpanded] = useState(ALL_EXPANDED);
  const [noteDraft, setNoteDraft] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkQuery, setLinkQuery] = useState('');
  const { message: toastMsg, show: showToast } = useToast();

  useEffect(() => {
    if (!focusSection) return;
    const raf = requestAnimationFrame(() => scrollToSection(focusSection));
    return () => cancelAnimationFrame(raf);
  }, [focusSection]);

  const toggle = useCallback(
    (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] })),
    [],
  );

  function setStatus(newStatus) {
    if (newStatus === ticket.status) return;
    const at = stampNow();
    setTicket((prev) => ({
      ...prev,
      status: newStatus,
      updated_at: at,
      notes: [
        ...prev.notes,
        { id: Date.now(), kind: 'status', text: `Status changed from ${prev.status} to ${newStatus}`, author: 'You', at },
      ],
    }));
    showToast(`Status: ${newStatus}`);
  }

  function setPriority(newPriority) {
    if (newPriority === ticket.priority) return;
    const at = stampNow();
    setTicket((prev) => ({
      ...prev,
      priority: newPriority,
      updated_at: at,
      notes: [
        ...prev.notes,
        { id: Date.now(), kind: 'note', text: `Priority changed from ${prev.priority} to ${newPriority}`, author: 'You', at },
      ],
    }));
    showToast(`Priority: ${newPriority}`);
  }

  function setAssignee(name) {
    if (name === (ticket.assigned_to ?? '')) return;
    const at = stampNow();
    const label = name || 'Unassigned';
    setTicket((prev) => ({
      ...prev,
      assigned_to: name || null,
      updated_at: at,
      notes: [...prev.notes, { id: Date.now(), kind: 'note', text: `Assigned to ${label}`, author: 'You', at }],
    }));
    showToast(`Assigned to ${label}`);
  }

  function setSubject(value) {
    setTicket((prev) => ({ ...prev, subject: value }));
  }

  function addNote() {
    const text = noteDraft.trim();
    if (!text) return;
    const at = stampNow();
    setTicket((prev) => ({
      ...prev,
      updated_at: at,
      notes: [...prev.notes, { id: Date.now(), kind: 'note', text, author: 'You', at }],
    }));
    setNoteDraft('');
    setShowComposer(false);
    showToast('Note added');
  }

  function linkClient(clientId) {
    const client = getClientProfile(clientId);
    if (!client) return;
    const at = stampNow();
    setTicket((prev) => ({
      ...prev,
      client_id: clientId,
      updated_at: at,
      notes: [
        ...prev.notes,
        { id: Date.now(), kind: 'note', text: `Linked to client ${client.fullName}`, author: 'You', at },
      ],
    }));
    setLinkDialogOpen(false);
    setLinkQuery('');
    showToast(`Linked to ${client.fullName}`);
  }

  const client = getClientProfile(ticket.client_id);
  const linkedOrder = client ? resolveLinkedOrder(client.id) : null;

  const linkResults = INITIAL_CLIENTS.filter((c) => {
    const q = linkQuery.trim().toLowerCase();
    if (!q) return true;
    return [c.fullName, c.email, c.mobile].some((v) => v.toLowerCase().includes(q));
  });

  return (
    <div className="tk-page">
      <div className="tk-page-inner">
        <Breadcrumb
          items={[
            { label: 'Admin' },
            onBack ? { label: 'Tickets', onClick: onBack } : { label: 'Tickets' },
            { label: ticket.subject },
          ]}
        />

        <header className="tk-header">
          <div>
            <div className="tk-header-eyebrow">Ticket · {ticket.id}</div>
            <h1 className="tk-header-name">{ticket.subject}</h1>
            <div className="tk-header-meta">
              <span className={`tk-status tk-status--${STATUS_TONE[ticket.status]}`}>{ticket.status}</span>
              <span className={`tk-priority tk-priority--${PRIORITY_TONE[ticket.priority]}`}>
                {ticket.priority}
              </span>
              <Tag>{ticket.source}</Tag>
              <span>
                Assigned <strong>{ticket.assigned_to || 'Unassigned'}</strong>
              </span>
              <span>Created {formatTicketDateTime(ticket.created_at)}</span>
              <span>Updated {formatTicketDateTime(ticket.updated_at)}</span>
              <span>Open {formatTicketAge(ticket.created_at)}</span>
            </div>
          </div>
        </header>

        <div className="tk-actionbar">
          <div className="tk-actionbar-field">
            <Select
              label="Status"
              options={STATUS_SELECT_OPTIONS}
              value={ticket.status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <div className="tk-actionbar-field">
            <Select
              label="Priority"
              options={PRIORITY_SELECT_OPTIONS}
              value={ticket.priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>
          <div className="tk-actionbar-field">
            <Select
              label="Assigned to"
              options={STAFF_SELECT_OPTIONS}
              value={ticket.assigned_to ?? ''}
              onChange={(e) => setAssignee(e.target.value)}
            />
          </div>
        </div>

        <nav className="tk-navbar" aria-label="Ticket sections">
          {NAV_SECTIONS.map((section) => (
            <a
              key={section.key}
              className="tk-navlink"
              href={`#${section.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(section.id);
              }}
            >
              {section.nav}
            </a>
          ))}
        </nav>

        <SectionCard
          section={NAV_SECTIONS[0]}
          expanded={expanded.ticketDetails}
          onToggle={() => toggle('ticketDetails')}
          actions={
            <Button
              variant="secondary"
              size="sm"
              icon={<Icon name="add" />}
              onClick={() => setShowComposer((v) => !v)}
            >
              Add note
            </Button>
          }
        >
          <div className="tk-grid2">
            <Input label="Subject" value={ticket.subject} onChange={(e) => setSubject(e.target.value)} />
            <div className="tk-view-field">
              <span className="tk-view-label">Source</span>
              <span className="tk-view-value">{ticket.source}</span>
            </div>
          </div>

          <div className="tk-subhead">Activity</div>

          {showComposer && (
            <div className="tk-composer">
              <textarea
                className="tk-composer-ta"
                placeholder="Add an internal note…"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                autoFocus
              />
              <div className="tk-composer-actions">
                <Button variant="ghost" size="sm" onClick={() => { setShowComposer(false); setNoteDraft(''); }}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={addNote}>
                  Post note
                </Button>
              </div>
            </div>
          )}

          <Activity notes={ticket.notes} />
        </SectionCard>

        <SectionCard
          section={NAV_SECTIONS[1]}
          expanded={expanded.clientInfo}
          onToggle={() => toggle('clientInfo')}
        >
          {client ? (
            <ClientInfo client={client} onOpenClient={onOpenClient} />
          ) : (
            <div className="tk-empty-state">
              <p className="tk-empty">This ticket isn&rsquo;t linked to a client record yet.</p>
              <Button
                variant="secondary"
                size="sm"
                icon={<Icon name="person_search" />}
                onClick={() => setLinkDialogOpen(true)}
              >
                Link client
              </Button>
            </div>
          )}
        </SectionCard>

        <SectionCard section={NAV_SECTIONS[2]} expanded={expanded.order} onToggle={() => toggle('order')}>
          {!client && <p className="tk-empty">Link a client to resolve their most recent order.</p>}
          {client && !linkedOrder && <p className="tk-empty">No orders found for this client yet.</p>}
          {client && linkedOrder && (
            <OrderSummary order={linkedOrder} onOpenOrder={() => onOpenOrder?.(linkedOrder.id)} />
          )}
        </SectionCard>
      </div>

      <div className="tk-toast-anchor" role="status" aria-live="polite">
        {toastMsg && <Toast tone="success">{toastMsg}</Toast>}
      </div>

      {linkDialogOpen && (
        <Dialog title="Link a client" onClose={() => setLinkDialogOpen(false)}>
          <input
            type="search"
            className="cds-input tk-link-search"
            placeholder="Search by name, email or mobile…"
            value={linkQuery}
            onChange={(e) => setLinkQuery(e.target.value)}
            autoFocus
          />
          <div className="tk-link-results">
            {linkResults.map((c) => (
              <button key={c.id} type="button" className="tk-link-result" onClick={() => linkClient(c.id)}>
                <span className="tk-link-result-name">{c.fullName}</span>
                <span className="tk-link-result-meta">
                  {c.email} · {c.mobile}
                </span>
              </button>
            ))}
            {linkResults.length === 0 && <p className="tk-empty">No clients match &ldquo;{linkQuery}&rdquo;.</p>}
          </div>
        </Dialog>
      )}
    </div>
  );
}

function SectionCard({ section, expanded, onToggle, actions, children }) {
  const head = (
    <h2 className={`tk-sec-heading${actions ? '' : ' tk-sec-heading--spaced'}`}>
      <button
        type="button"
        className="tk-sec-head"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`${section.id}-body`}
      >
        <span className="tk-section-title">{section.title}</span>
        <Icon
          name="expand_more"
          size={22}
          className={`tk-chevron${expanded ? ' tk-chevron--open' : ''}`}
        />
      </button>
    </h2>
  );

  return (
    <section id={section.id}>
      <Card>
        {actions ? (
          <div className="tk-sec-head-row">
            {head}
            {actions}
          </div>
        ) : (
          head
        )}
        <div id={`${section.id}-body`} hidden={!expanded}>
          {expanded && children}
        </div>
      </Card>
    </section>
  );
}

function Activity({ notes }) {
  if (!notes || notes.length === 0) {
    return <p className="tk-empty">No activity recorded on this ticket yet.</p>;
  }

  return (
    <div className="tk-activity">
      {notes.map((entry) => (
        <div key={entry.id} className={`tk-activity-item tk-activity-item--${entry.kind}`}>
          <Icon name={ACTIVITY_ICON[entry.kind] ?? 'sticky_note_2'} size={16} className="tk-activity-icon" />
          <div className="tk-activity-body">
            <div className="tk-activity-meta">
              <span className="tk-activity-kind">{ACTIVITY_LABEL[entry.kind] ?? 'Note'}</span>
              <span aria-hidden="true">·</span>
              <span>{entry.author}</span>
              <span aria-hidden="true">·</span>
              <span>{formatTicketDateTime(entry.at)}</span>
            </div>
            <p className="tk-activity-text">{entry.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClientInfo({ client, onOpenClient }) {
  const address = client.billingAddress;
  return (
    <div>
      <div className="tk-client-head">
        <div>
          <div className="tk-view-value tk-view-value--lg">{client.fullName}</div>
          <span className={`cds-badge cds-badge--${client.status === 'Account Holder' ? 'success' : 'neutral'}`}>
            {client.status}
          </span>
        </div>
        {onOpenClient && (
          <Button variant="secondary" size="sm" icon={<Icon name="open_in_new" />} onClick={onOpenClient}>
            View client record
          </Button>
        )}
      </div>

      <div className="tk-grid3">
        <div className="tk-view-field">
          <span className="tk-view-label">Email</span>
          <span className="tk-view-value">{client.email}</span>
        </div>
        <div className="tk-view-field">
          <span className="tk-view-label">Mobile</span>
          <span className="tk-view-value">{client.mobile}</span>
        </div>
        <div className="tk-view-field">
          <span className="tk-view-label">Assigned agent</span>
          <span className="tk-view-value">{AGENT_DISPLAY_NAMES[client.assigned] ?? client.assigned}</span>
        </div>
      </div>

      <div className="tk-subhead">Billing address</div>
      {address ? (
        <div className="tk-addr-view">
          {[address.line1, address.line2, address.city, address.postcode].filter(Boolean).map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      ) : (
        <p className="tk-empty">No billing address on file.</p>
      )}
    </div>
  );
}

function OrderSummary({ order, onOpenOrder }) {
  return (
    <div>
      <div className="tk-grid3">
        <div className="tk-view-field">
          <span className="tk-view-label">Status</span>
          <span>
            <span className={`tk-order-status tk-order-status--${order.statusTone}`}>{order.status}</span>
          </span>
        </div>
        <div className="tk-view-field">
          <span className="tk-view-label">Sale type</span>
          <span className="tk-view-value">{order.saleType}</span>
        </div>
        <div className="tk-view-field">
          <span className="tk-view-label">Handset</span>
          <span className="tk-view-value">{order.handset || '—'}</span>
        </div>
        <div className="tk-view-field">
          <span className="tk-view-label">Order date</span>
          <span className="tk-view-value">{order.placedDate}</span>
        </div>
        <div className="tk-view-field">
          <span className="tk-view-label">Box value</span>
          <span className="tk-view-value">{formatGBP(order.boxValue)}</span>
        </div>
      </div>
      <div className="tk-order-actions">
        <Button variant="secondary" size="sm" icon={<Icon name="open_in_new" />} onClick={onOpenOrder}>
          View full order record
        </Button>
      </div>
    </div>
  );
}

/** Scrolls a section clear of the sticky jump nav. */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const nav = document.querySelector('.tk-navbar');
  const navHeight = nav ? nav.getBoundingClientRect().height : 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - navHeight - 16,
    behavior: reduceMotion ? 'auto' : 'smooth',
  });
}
