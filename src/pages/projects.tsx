import React, { useEffect } from 'react';

const RedirectPage: React.FC = () => {
  useEffect(() => {
    window.open(
      'https://sharing.clickup.com/9011781189/b/h/4-90112834328-2/597252a6b651153',
      '_blank'
    );
    window.history.back();
  }, []);

  return <div>Redirecting...</div>;
};

export default RedirectPage;
