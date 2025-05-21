import React from 'react';

const GoogleCalendarEmbed: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
    <iframe
      src="https://calendar.google.com/calendar/embed?src=ksu.fightingrobotics%40gmail.com&ctz=America%2FNew_York"
      style={{ border: 0, width: '80vw', maxWidth: 2200, height: 800 }}
      frameBorder="0"
      scrolling="no"
      title="KSU Combat Robotics Calendar"
    ></iframe>
  </div>
);

export default GoogleCalendarEmbed;
