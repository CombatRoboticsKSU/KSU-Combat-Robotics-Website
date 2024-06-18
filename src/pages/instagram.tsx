import React from 'react';
import InstagramEmbed from '@site/src/components/insta/InstagramEmbed';

const App: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fafafa' }}>
      <InstagramEmbed />
    </div>
  );
};

export default App;
