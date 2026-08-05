import { useCallback, useRef, useState } from 'react';
import { Breadcrumb } from '../app/Breadcrumb.jsx';
import { formatGBP } from '../dashboard/format.js';
import { Badge, Button, Card, Icon, IconButton, Input, Select, Tag, Toast } from '../ds/index.js';
import { useToast } from '../order/useToast.js';
import { formatTicketAge, PRIORITY_TONE } from '../tickets/ticketsData.js';
import { initialClient } from './clientData.js';
import { getIn, setIn } from './fieldPath.js';
import { ADDRESS_BLOCKS, ADDRESS_LINES, SECTIONS, SELECT_OPTIONS } from './schema.js';
import './clientPage.css';

const ALL_EXPANDED = Object.fromEntries(SECTIONS.map((s) => [s.key, true]));

export function ClientPage({ onBack, mode: initialMode = 'view', onOpenOrder, onOpenTicket }) {
  const [client, setClient] = useState(initialClient);
  const [mode, setMode] = useState(initialMode);
  const [expanded, setExpanded] = useState(ALL_EXPANDED);
  const savedClient = useRef(initialClient);
  const { message: toastMsg, show: showToast } = useToast();

  const toggle = useCallback(
    (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] })),
    [],
  );

  const setField = useCallback((path, value) => {
    setClient((prev) => setIn(prev, path, value));
  }, []);

  const copy = useCallback(
    (value, label) => {
      writeToClipboard(value).then((ok) =>
        showToast(ok ? `${label} copied` : `Couldn't copy ${label.toLowerCase()}`),
      );
    },
    [showToast],
  );

  const copyAddress = useCallback(
    (path, label) => {
      const a = client[path];
      copy([a.line1, a.line2, a.city, a.postcode].filter(Boolean).join(', '), label);
    },
    [client, copy],
  );

  function startEditing() {
    savedClient.current = client;
    setMode('edit');
  }

  function cancelEditing() {
    setClient(savedClient.current);
    setMode('view');
  }

  function saveChanges() {
    savedClient.current = client;
    setMode('view');
    showToast('Client saved');
  }

  const renderers = {
    addresses: () => <Addresses client={client} mode={mode} onField={setField} onCopy={copyAddress} />,
    orders: () => <Orders orders={client.orders} onOpenOrder={onOpenOrder} />,
    tickets: () => <Tickets tickets={client.tickets} onOpenTicket={onOpenTicket} />,
  };

  return (
    <div className="cp-page">
      <div className="cp-page-inner">
        <Breadcrumb
          items={[
            { label: 'Admin' },
            onBack ? { label: 'Clients', onClick: onBack } : { label: 'Clients' },
            { label: client.personal.fullName },
          ]}
        />

        <header className="cp-header">
          <div>
            <div className="cp-header-eyebrow">Client · account {client.accountNumber}</div>
            <h1 className="cp-header-name">{client.personal.fullName}</h1>
            <div className="cp-header-meta">
              <Badge tone={client.status === 'Account Holder' ? 'success' : 'neutral'}>
                {client.status}
              </Badge>
              <Tag>{client.assigned}</Tag>
            </div>
          </div>

          <div className="cp-header-actions">
            {mode === 'view' ? (
              <Button variant="primary" icon={<Icon name="edit" />} onClick={startEditing}>
                Edit
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={saveChanges}>
                  Save changes
                </Button>
              </>
            )}
          </div>
        </header>

        <nav className="cp-navbar" aria-label="Client sections">
          {SECTIONS.map((section) => (
            <a
              key={section.key}
              className="cp-navlink"
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

        {SECTIONS.map((section) => (
          <SectionCard
            key={section.key}
            section={section}
            expanded={expanded[section.key]}
            onToggle={() => toggle(section.key)}
          >
            {section.render ? (
              renderers[section.render]()
            ) : (
              <div className={section.layout === 'grid2' ? 'cp-grid2' : 'cp-grid3'}>
                {section.fields.map((field) => (
                  <Field
                    key={field.path}
                    field={field}
                    mode={mode}
                    value={getIn(client, field.path)}
                    onChange={(v) => setField(field.path, v)}
                    onCopy={copy}
                  />
                ))}
              </div>
            )}
          </SectionCard>
        ))}
      </div>

      <div className="cp-toast-anchor" role="status" aria-live="polite">
        {toastMsg && <Toast tone="success">{toastMsg}</Toast>}
      </div>
    </div>
  );
}

function SectionCard({ section, expanded, onToggle, children }) {
  return (
    <section id={section.id}>
      <Card>
        <h2 className="cp-sec-heading">
          <button
            type="button"
            className="cp-sec-head"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={`${section.id}-body`}
          >
            <span className="cp-section-title">{section.title}</span>
            <Icon
              name="expand_more"
              size={22}
              className={`cp-chevron${expanded ? ' cp-chevron--open' : ''}`}
            />
          </button>
        </h2>
        <div id={`${section.id}-body`} hidden={!expanded}>
          {expanded && children}
        </div>
      </Card>
    </section>
  );
}

function Field({ field, mode, value, onChange, onCopy }) {
  if (mode === 'view') {
    return (
      <div className="cp-view-field">
        <span className="cp-view-label">{field.label}</span>
        <div className="cp-view-row">
          <span className="cp-view-value">{value || '—'}</span>
          {field.copy && (
            <IconButton
              size="sm"
              aria-label={`Copy ${field.label.toLowerCase()}`}
              icon={<Icon name="content_copy" />}
              onClick={() => onCopy(value, field.label)}
            />
          )}
        </div>
      </div>
    );
  }

  const control =
    field.type === 'select' ? (
      <Select
        label={field.label}
        options={SELECT_OPTIONS[field.options]}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <Input
        label={field.label}
        type={field.type ?? 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );

  if (!field.copy) return control;

  return (
    <div className="cp-field-row">
      <div className="cp-field-grow">{control}</div>
      <IconButton
        size="sm"
        aria-label={`Copy ${field.label.toLowerCase()}`}
        icon={<Icon name="content_copy" />}
        onClick={() => onCopy(value, field.label)}
      />
    </div>
  );
}

function Addresses({ client, mode, onField, onCopy }) {
  return (
    <div className="cp-grid2">
      {ADDRESS_BLOCKS.map((block) => (
        <div key={block.path}>
          <div className="cp-addr-head">
            <span className="cp-addr-label">{block.label}</span>
            <IconButton
              size="sm"
              aria-label={`Copy ${block.label.toLowerCase()}`}
              icon={<Icon name="content_copy" />}
              onClick={() => onCopy(block.path, block.label)}
            />
          </div>
          {mode === 'view' ? (
            <div className="cp-addr-view">
              {formatAddressLines(client[block.path]).map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          ) : (
            <div className="cp-addr-fields">
              {ADDRESS_LINES.map((line) => (
                <Input
                  key={line.key}
                  placeholder={line.placeholder}
                  value={client[block.path][line.key]}
                  onChange={(e) => onField(`${block.path}.${line.key}`, e.target.value)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Orders({ orders, onOpenOrder }) {
  if (!orders || orders.length === 0) {
    return <p className="cp-empty">No orders on this client yet.</p>;
  }

  return (
    <div className="cp-orders-table">
      <div className="cp-orders-row cp-orders-head">
        <span>Sale type</span>
        <span>Status</span>
        <span>Box value</span>
        <span>Placed</span>
        <span />
      </div>
      {orders.map((order) => (
        <div className="cp-orders-row" key={order.id}>
          <span>{order.saleType}</span>
          <span>
            <span className={`cp-status cp-status--${order.statusTone}`}>{order.status}</span>
          </span>
          <span>{formatGBP(order.boxValue)}</span>
          <span>{order.placedDate}</span>
          <span className="cp-orders-actions">
            <button type="button" onClick={() => onOpenOrder?.(order.id)}>
              View
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}

function Tickets({ tickets, onOpenTicket }) {
  if (!tickets || tickets.length === 0) {
    return <p className="cp-empty">No tickets linked to this client yet.</p>;
  }

  return (
    <div className="cp-tickets-table">
      <div className="cp-tickets-row cp-tickets-head">
        <span>Subject</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Source</span>
        <span>Updated</span>
        <span>Age</span>
        <span />
      </div>
      {tickets.map((ticket) => (
        <div className="cp-tickets-row" key={ticket.id}>
          <span>{ticket.subject}</span>
          <span>
            <span className={`cp-ticket-status cp-ticket-status--${ticket.statusTone}`}>
              {ticket.status}
            </span>
          </span>
          <span>
            <span className={`cp-ticket-priority cp-ticket-priority--${PRIORITY_TONE[ticket.priority]}`}>
              {ticket.priority}
            </span>
          </span>
          <span>{ticket.source}</span>
          <span>{ticket.updatedAt}</span>
          <span>{formatTicketAge(ticket.createdAt)}</span>
          <span className="cp-tickets-actions">
            <button type="button" onClick={() => onOpenTicket?.(ticket.id)}>
              View
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}

function formatAddressLines(address) {
  const lines = [address.line1, address.line2, address.city, address.postcode].filter(Boolean);
  return lines.length > 0 ? lines : ['—'];
}

/** Scrolls a section clear of the sticky jump nav. */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const nav = document.querySelector('.cp-navbar');
  const navHeight = nav ? nav.getBoundingClientRect().height : 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - navHeight - 16,
    behavior: reduceMotion ? 'auto' : 'smooth',
  });
}

async function writeToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text ?? '');
    return true;
  } catch {
    return false;
  }
}
