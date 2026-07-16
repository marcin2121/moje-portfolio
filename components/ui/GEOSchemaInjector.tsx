import React, { useMemo } from 'react';

interface GEOSchemaInjectorProps {
  schema: Record<string, unknown>;
}

export const GEOSchemaInjector: React.FC<GEOSchemaInjectorProps> = ({ schema }) => {
  const safeJson = useMemo(() => {
    return JSON.stringify(schema).replace(/</g, '\\u003c');
  }, [schema]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
};
