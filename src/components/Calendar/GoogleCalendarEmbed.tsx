import React from 'react';

const GoogleCalendarEmbed: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
    <iframe
      src="https://calendar.google.com/calendar/embed?src=c_17f0fd8b65f2f6389fc72f9a7a34ccc5cd4b6ff26a37a429e3c5c4530abad9ae%40group.calendar.google.com&ctz=America%2FNew_York"
      style={{ border: 0, width: '80vw', maxWidth: 2200, height: 800 }}
      frameBorder="0"
      scrolling="no"
      title="KSU Combat Robotics Calendar"
    ></iframe>
  </div>
);

export default GoogleCalendarEmbed;
