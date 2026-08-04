import { Input, Select } from '../ds/index.js';
import { HANDSET_OPTIONS, TARIFF_OPTIONS } from './orderCatalog.js';
import { HANDSET_FIELDS, OTHER_SALE_FIELDS, TARIFF_FIELDS } from './schema.js';
import { getIn } from './useOrderDraft.js';

/**
 * Handset and tariff pickers: choosing a catalog entry fills in the fields
 * below it via a batch of onField calls, but each field stays editable
 * afterwards for one-off adjustments. Shared by OrderPage and NewOrderPage.
 */
export function HandsetTariffSection({ order, onField }) {
  const applyCatalog = (prefix, options, fields, id) => {
    onField(`${prefix}.catalogId`, id);
    const entry = options.find((o) => o.value === id);
    fields.forEach((field) => {
      const key = field.path.split('.').pop();
      onField(field.path, entry ? (entry[key] ?? '') : '');
    });
  };

  return (
    <div>
      <div className="os-subhead">Handset</div>
      <div className="os-grid3">
        <Select
          label="Handset"
          hint="Fills in the fields below."
          options={HANDSET_OPTIONS}
          value={order.handsetSelect.catalogId}
          onChange={(e) =>
            applyCatalog('handsetSelect', HANDSET_OPTIONS, HANDSET_FIELDS, e.target.value)
          }
        />
      </div>
      <div className="os-grid3">
        {HANDSET_FIELDS.map((field) => (
          <Input
            key={field.path}
            label={field.label}
            value={getIn(order, field.path)}
            onChange={(e) => onField(field.path, e.target.value)}
          />
        ))}
      </div>

      <div className="os-subhead">Tariff</div>
      <div className="os-grid3">
        <Select
          label="Tariff"
          hint="Fills in the fields below."
          options={TARIFF_OPTIONS}
          value={order.tariffType.catalogId}
          onChange={(e) =>
            applyCatalog('tariffType', TARIFF_OPTIONS, TARIFF_FIELDS, e.target.value)
          }
        />
      </div>
      <div className="os-grid3">
        {TARIFF_FIELDS.map((field) => (
          <Input
            key={field.path}
            label={field.label}
            value={getIn(order, field.path)}
            onChange={(e) => onField(field.path, e.target.value)}
          />
        ))}
      </div>

      <div className="os-subhead">Other</div>
      <div className="os-grid2">
        {OTHER_SALE_FIELDS.map((field) => (
          <Input
            key={field.path}
            label={field.label}
            value={getIn(order, field.path)}
            onChange={(e) => onField(field.path, e.target.value)}
          />
        ))}
      </div>
    </div>
  );
}
