import { useCallback } from 'react';
import { Breadcrumb } from '../app/Breadcrumb.jsx';
import { Button, Card, Icon, IconButton, Input, Select, Toast } from '../ds/index.js';
import { HandsetTariffSection } from './HandsetTariffSection.jsx';
import {
  ADDRESS_BLOCKS,
  ADDRESS_LINES,
  SECTIONS,
  SELECT_OPTIONS,
  isLessThanThreeYears,
} from './schema.js';
import { getIn } from './useOrderDraft.js';
import { useNewOrderDraft } from './useNewOrderDraft.js';
import { useToast } from './useToast.js';
import './order-page.css';

// The new-order form covers every order field except the sections that only
// make sense once an order exists: fulfilment, welcome calls and notes happen
// afterwards, finance's credit check history has nothing to show yet, and
// documents are uploaded against an order that already exists.
const EXCLUDED_NEW_ORDER_SECTIONS = new Set([
  'fulfilment',
  'welcomeCalls',
  'notes',
  'finance',
  'documents',
]);
const NEW_ORDER_SECTIONS = SECTIONS.filter(
  (section) => !EXCLUDED_NEW_ORDER_SECTIONS.has(section.key),
);

export function NewOrderPage({ onBack, onCreated } = {}) {
  const { order, setField, createOrder, discardDraft, draftLabel } = useNewOrderDraft();
  const { message: toastMsg, show: showToast } = useToast();

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

  const renderers = {
    addresses: () => (
      <Addresses order={order} onField={setField} onCopy={copyAddress} />
    ),
    handsetTariff: () => <HandsetTariffSection order={order} onField={setField} />,
    specialRequirement: () => (
      <SpecialRequirement
        value={order.specialRequirement}
        onChange={(v) => setField('specialRequirement', v)}
        onCopy={() => copy(order.specialRequirement, 'Special requirement')}
      />
    ),
  };

  return (
    <div className="os-page">
      <div className="os-page-inner">
        <Breadcrumb
          items={[
            { label: 'Admin' },
            onBack ? { label: 'Orders', onClick: onBack } : { label: 'Orders' },
            { label: 'New order' },
          ]}
        />

        <header className="os-header">
          <div>
            <div className="os-header-eyebrow">Order · new</div>
            <h1 className="os-header-name">New order</h1>
          </div>

          <div className="os-header-actions">
            <div className="os-header-buttons">
              <Button
                variant="secondary"
                onClick={() => {
                  discardDraft();
                  onBack?.();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  createOrder();
                  showToast('Order created');
                  onCreated?.();
                }}
              >
                Create order
              </Button>
            </div>
            <div className="os-draft-status" role="status" aria-live="polite">
              {draftLabel && (
                <>
                  <span className="os-draft-dot" />
                  <span>{draftLabel}</span>
                </>
              )}
            </div>
          </div>
        </header>

        <nav className="os-navbar" aria-label="New order sections">
          {NEW_ORDER_SECTIONS.map((section) => (
            <a
              key={section.key}
              className="os-navlink"
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

        {NEW_ORDER_SECTIONS.map((section) => (
          <SectionCard key={section.key} section={section}>
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

function SectionCard({ section, children }) {
  return (
    <section id={section.id}>
      <Card>
        <h2 className="os-sec-heading os-sec-heading--spaced">
          <span className="os-section-title">{section.title}</span>
        </h2>
        <div id={`${section.id}-body`}>{children}</div>
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
    ) : (
      <Input
        label={field.label}
        hint={field.hint}
        placeholder={field.placeholder}
        type={field.type ?? 'text'}
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
  const showPrevious = isLessThanThreeYears(order.timeAtAddress);
  const blocks = showPrevious
    ? ADDRESS_BLOCKS
    : ADDRESS_BLOCKS.filter((block) => block.path !== 'previousAddress');

  return (
    <div>
      <div className="os-grid3" style={{ marginBottom: 'var(--space-5)' }}>
        <Select
          label="Time at current address"
          hint="Shows the previous address below when under 3 years."
          options={SELECT_OPTIONS.timeAtAddress}
          value={order.timeAtAddress}
          onChange={(e) => onField('timeAtAddress', e.target.value)}
        />
      </div>
      <div className="os-grid3">
        {blocks.map((block) => (
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
    </div>
  );
}

function SpecialRequirement({ value, onChange, onCopy }) {
  return (
    <div>
      <div className="os-label-row">
        <label htmlFor="new-order-special-requirement-notes">Notes for fulfilment</label>
        <IconButton
          size="sm"
          aria-label="Copy special requirement"
          icon={<Icon name="content_copy" />}
          onClick={onCopy}
        />
      </div>
      <textarea
        id="new-order-special-requirement-notes"
        className="os-ta"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

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
