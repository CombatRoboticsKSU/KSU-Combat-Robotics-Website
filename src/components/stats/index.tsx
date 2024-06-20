// src/EmbeddedPage.tsx
import React from 'react';

interface EmbeddedPageProps {
  url: string;
  title: string;
}

const EmbeddedPage: React.FC<EmbeddedPageProps> = ({ url, title }) => {
  return (
    <div style={{ width: '100%', height: '100%', border: 'none' }}>
      <iframe 
        src={url} 
        title={title}
        style={{ width: '100%', height: '100%', border: 'none' }}
        allowFullScreen
      />
    </div>
  );
};

export default EmbeddedPage;
