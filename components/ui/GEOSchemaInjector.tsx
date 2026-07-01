import React from 'react';

interface GEOSchemaInjectorProps {
  schema: Record<string, any>;
}

export const GEOSchemaInjector: React.FC<GEOSchemaInjectorProps> = ({ schema }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
};
