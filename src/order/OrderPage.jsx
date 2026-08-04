import { useCallback, useEffect, useState } from 'react';
import { Breadcrumb } from '../app/Breadcrumb.jsx';
import { formatGBP } from '../dashboard/format.js';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Icon,
  IconButton,
  Input,
  Select,
  Tag,
  Toast,
} from '../ds/index.js';
import { HandsetTariffSection } from './HandsetTariffSection.jsx';
import { assignedTo } from './orderData.js';
import {
  ADDRESS_BLOCKS,
  ADDRESS_LINES,
  CREDIT_CHECK_OUTCOME_TONE,
  FINANCE_GROUPS,
  getWelcomeCallGroupKey,
  SECTIONS,
  SELECT_OPTIONS,
  WELCOME_CALL_GROUPS,
} from './schema.js';
import { getIn, useOrderDraft } from './useOrderDraft.js';
import { useToast } from './useToast.js';
import './order-page.css';

const ALL_EXPANDED = Object.fromEntries(SECTIONS.map((s) => [s.key, true]));

// Sections that render as their own isolated page rather than inline in the
// scroll list — clicking their nav link shows only that section.
const ISOLATED_SECTIONS = new Set(['finance', 'fulfilment', 'welcomeCalls']);

// Native date inputs store 'YYYY-MM-DD'; the header badge uses the same
// DD/MM format as the seed status date.
function toShortDate(isoDate) {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}`;
}

export function OrderPage({ onBack, orderId, focusSection, onOpenClient } = {}) {
  const { order, setField, addNote, updateNote, removeNote } = useOrderDraft(orderId);
  const { message: toastMsg, show: showToast } = useToast();
  const [expanded, setExpanded] = useState(ALL_EXPANDED);
  // 'finance' and 'fulfilment' are their own isolated pages rather than
  // sections in the scroll list; null means the normal all-sections overview.
  const [activeSection, setActiveSection] = useState(null);

  // Arriving from a list-row action (e.g. "Add Note") jumps straight to that section.
  useEffect(() => {
    if (!focusSection) return;
    if (ISOLATED_SECTIONS.has(focusSection)) {
      setActiveSection(focusSection);
      return;
    }
    setActiveSection(null);
    const raf = requestAnimationFrame(() => scrollToSection(focusSection));
    return () => cancelAnimationFrame(raf);
  }, [focusSection]);

  const toggle = useCallback(
    (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] })),
    [],
  );

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
      const a = order[path];
      copy([a.line1, a.line2, a.city, a.postcode].filter(Boolean).join(', '), label);
    },
    [order, copy],
  );

  const statusDate = order.additionalSale.portDate
    ? toShortDate(order.additionalSale.portDate)
    : order.status.date;

  const welcomeCallGroupKey = getWelcomeCallGroupKey(order.saleDetails.saleType);
  // Sale types outside the welcome-call groups don't need the tab at all.
  const orderSections = welcomeCallGroupKey
    ? SECTIONS
    : SECTIONS.filter((s) => s.key !== 'welcomeCalls');

  const renderers = {
    addresses: () => <Addresses order={order} onField={setField} onCopy={copyAddress} />,
    handsetTariff: () => <HandsetTariffSection order={order} onField={setField} />,
    specialRequirement: () => (
      <SpecialRequirement
        value={order.specialRequirement}
        onChange={(v) => setField('specialRequirement', v)}
        onCopy={() => copy(order.specialRequirement, 'Special requirement')}
      />
    ),
    notes: () => <Notes notes={order.notes} onUpdate={updateNote} onRemove={removeNote} />,
    finance: () => (
      <Finance order={order} onField={setField} onCopy={copy} groups={FINANCE_GROUPS} />
    ),
    welcomeCalls: () => (
      <WelcomeCalls
        order={order}
        onField={setField}
        group={welcomeCallGroupKey ? WELCOME_CALL_GROUPS[welcomeCallGroupKey] : null}
      />
    ),
  };

  const visibleSections = activeSection
    ? orderSections.filter((s) => s.key === activeSection)
    : orderSections.filter((s) => !ISOLATED_SECTIONS.has(s.key));

  return (
    <div className="os-page">
      <div className="os-page-inner">
        <Breadcrumb
          items={[
            { label: 'Admin' },
            onBack ? { label: 'Orders', onClick: onBack } : { label: 'Orders' },
            { label: order.account.fullName },
          ]}
        />

        <header className="os-header">
          <div>
            <div className="os-header-eyebrow">Order · account {order.account.accountNumber}</div>
            <h1 className="os-header-name">{order.account.fullName}</h1>
            <div className="os-header-meta">
              <Badge tone="warning">Pending · {statusDate}</Badge>
              <Tag>{order.saleDetails.saleType}</Tag>
              <span>
                Box value{' '}
                <strong>
                  {order.saleDetails.boxValue === '' ? '—' : formatGBP(order.saleDetails.boxValue)}
                </strong>
              </span>
              {onOpenClient && (
                <button type="button" className="os-client-link" onClick={onOpenClient}>
                  <Icon name="account_circle" size={16} />
                  View client
                </button>
              )}
              {order.account.tektonLink && (
                <a
                  href={order.account.tektonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="os-client-link"
                >
                  <Icon name="link" size={16} />
                  Tekton link
                </a>
              )}
            </div>
          </div>
        </header>

        <div className="os-actionbar">
          <Button
            variant="secondary"
            size="sm"
            icon={<Icon name="flag" />}
            onClick={() => showToast(`Status: Pending · ${statusDate}`)}
          >
            Complete
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Icon name="person" />}
            onClick={() => showToast(`Assigned to ${assignedTo}`)}
          >
            {assignedTo}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Icon name="grid_view" />}
            onClick={() => showToast('Connection grid generated')}
          >
            Generate connection grid
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Icon name="description" />}
            onClick={() => showToast('Welcome documents generated')}
          >
            Generate Welcome Documents
          </Button>
        </div>

        <nav className="os-navbar" aria-label="Order sections">
          {orderSections.map((section) => (
            <a
              key={section.key}
              className={`os-navlink${activeSection === section.key ? ' os-navlink--active' : ''}`}
              href={`#${section.id}`}
              onClick={(e) => {
                e.preventDefault();
                if (ISOLATED_SECTIONS.has(section.key)) {
                  setActiveSection(section.key);
                  window.scrollTo({ top: 0 });
                } else {
                  setActiveSection(null);
                  scrollToSection(section.id);
                }
              }}
            >
              {section.nav}
            </a>
          ))}
        </nav>

        {visibleSections.map((section) => (
          <SectionCard
            key={section.key}
            section={section}
            expanded={expanded[section.key]}
            onToggle={() => toggle(section.key)}
            actions={
              section.key === 'notes' ? (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Icon name="add" />}
                  onClick={addNote}
                >
                  Add note
                </Button>
              ) : null
            }
          >
            {section.render
              ? renderers[section.render]()
              : (section.groups ?? [{ layout: section.layout, fields: section.fields }]).map(
                  (group, i) => (
                    <div key={group.subhead ?? i}>
                      {group.subhead && <div className="os-subhead">{group.subhead}</div>}
                      <div className={group.layout === 'grid2' ? 'os-grid2' : 'os-grid3'}>
                        {group.fields.map((field) => (
                          <Field
                            key={field.path}
                            field={field}
                            value={getIn(order, field.path)}
                            onChange={(v) => setField(field.path, v)}
                            onCopy={copy}
                          />
                        ))}
                      </div>
                    </div>
                  ),
                )}
          </SectionCard>
        ))}
      </div>

      <div className="os-toast-anchor" role="status" aria-live="polite">
        {toastMsg && <Toast tone="success">{toastMsg}</Toast>}
      </div>
    </div>
  );
}

function SectionCard({ section, expanded, onToggle, actions, children }) {
  const head = (
    <h2 className={`os-sec-heading${actions ? '' : ' os-sec-heading--spaced'}`}>
      <button
        type="button"
        className="os-sec-head"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`${section.id}-body`}
      >
        <span className="os-section-title">{section.title}</span>
        <Icon
          name="expand_more"
          size={22}
          className={`os-chevron${expanded ? ' os-chevron--open' : ''}`}
        />
      </button>
    </h2>
  );

  return (
    <section id={section.id}>
      <Card>
        {actions ? (
          <div className="os-sec-head-row">
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

function Field({ field, value, onChange, onCopy }) {
  const control =
    field.type === 'select' ? (
      <Select
        label={field.label}
        hint={field.hint}
        options={SELECT_OPTIONS[field.options]}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : field.type === 'checkbox' ? (
      <Checkbox
        label={field.label}
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
      />
    ) : (
      <Input
        label={field.label}
        hint={field.hint}
        placeholder={field.placeholder}
        type={field.type ?? 'text'}
        step={field.step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );

  if (!field.copy) return control;

  return (
    <div className="os-field-row">
      <div className="os-field-grow">{control}</div>
      <IconButton
        size="sm"
        aria-label={`Copy ${field.label.toLowerCase()}`}
        icon={<Icon name="content_copy" />}
        onClick={() => onCopy(value, field.label)}
      />
    </div>
  );
}

function Addresses({ order, onField, onCopy }) {
  return (
    <div className="os-grid3">
      {ADDRESS_BLOCKS.map((block) => (
        <div key={block.path}>
          <div className="os-addr-head">
            <span className="os-addr-label">{block.label}</span>
            <IconButton
              size="sm"
              aria-label={`Copy ${block.label.toLowerCase()}`}
              icon={<Icon name="content_copy" />}
              onClick={() => onCopy(block.path, block.label)}
            />
          </div>
          <div className="os-addr-fields">
            {ADDRESS_LINES.map((line) => (
              <Input
                key={line.key}
                placeholder={line.placeholder}
                value={order[block.path][line.key]}
                onChange={(e) => onField(`${block.path}.${line.key}`, e.target.value)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SpecialRequirement({ value, onChange, onCopy }) {
  return (
    <div>
      <div className="os-label-row">
        <label htmlFor="special-requirement-notes">Notes for fulfilment</label>
        <IconButton
          size="sm"
          aria-label="Copy special requirement"
          icon={<Icon name="content_copy" />}
          onClick={onCopy}
        />
      </div>
      <textarea
        id="special-requirement-notes"
        className="os-ta"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Finance({ order, groups, onField, onCopy }) {
  return (
    <div>
      {groups.map((group, i) => (
        <div key={group.subhead ?? i}>
          {group.subhead && <div className="os-subhead">{group.subhead}</div>}
          <div className={group.layout === 'grid2' ? 'os-grid2' : 'os-grid3'}>
            {group.fields.map((field) => (
              <Field
                key={field.path}
                field={field}
                value={getIn(order, field.path)}
                onChange={(v) => onField(field.path, v)}
                onCopy={onCopy}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="os-subhead">Credit check history</div>
      <CreditCheckHistory checks={order.creditChecks} />
    </div>
  );
}

function WelcomeCalls({ order, group, onField }) {
  if (!group) return null;

  return (
    <div>
      <div className="os-subhead">{group.title}</div>
      <div className="os-grid3">
        {group.fields.map((field) => (
          <Field
            key={field.path}
            field={field}
            value={getIn(order, field.path)}
            onChange={(v) => onField(field.path, v)}
          />
        ))}
      </div>
    </div>
  );
}

function CreditCheckHistory({ checks }) {
  if (!checks || checks.length === 0) {
    return <p className="os-empty">No credit checks recorded for this order.</p>;
  }

  return (
    <div className="os-table-wrap">
      <table className="os-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Bureau</th>
            <th>Check type</th>
            <th>Outcome</th>
            <th>Score</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => (
            <tr key={check.id}>
              <td>{check.date}</td>
              <td>{check.bureau}</td>
              <td>{check.checkType}</td>
              <td>
                <Badge tone={CREDIT_CHECK_OUTCOME_TONE[check.outcome] ?? 'neutral'}>
                  {check.outcome}
                </Badge>
              </td>
              <td>{check.score}</td>
              <td>{check.reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Notes({ notes, onUpdate, onRemove }) {
  if (notes.length === 0) {
    return <p className="os-empty">No notes on this order yet.</p>;
  }

  return (
    <div>
      {notes.map((note) => (
        <div className="os-note" key={note.id}>
          <div className="os-note-top">
            <div className="os-field-grow">
              <Input
                value={note.text}
                onChange={(e) => onUpdate(note.id, { text: e.target.value })}
              />
            </div>
            <Badge tone="success">{note.status}</Badge>
            <IconButton
              size="sm"
              aria-label="Delete note"
              icon={<Icon name="delete" size={16} />}
              onClick={() => onRemove(note.id)}
            />
          </div>
          <div className="os-note-meta">
            {note.date} · {note.time} · {note.author}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Scrolls a section clear of the sticky jump nav. */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const nav = document.querySelector('.os-navbar');
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
