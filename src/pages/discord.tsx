import React, { useEffect } from 'react';

const RedirectPage: React.FC = () => {
  useEffect(() => {
    window.location.href = 'https://www.discord.gg/qxqDEgcKns'; // Replace with your target URL
  }, []);

  return <div>Redirecting...</div>;
};

export default RedirectPage;
