import React from 'react';

interface ChangelogSectionProps {
  changelogs?: Array<{ version?: string; notes?: string }>;
}

export default function ChangelogSection({ changelogs = [] }: ChangelogSectionProps) {
  return (
    <section>
      <h3>Changelog</h3>
      {changelogs.length === 0 ? (
        <p>No hay registros de cambios disponibles.</p>
      ) : (
        <ul>
          {changelogs.map((c, i) => (
            <li key={i}>
              <strong>{c.version ?? 'v?'}</strong>: {c.notes ?? ''}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
