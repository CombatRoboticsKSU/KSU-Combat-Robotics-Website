import React, { useState } from 'react';
import Layout from '@theme/Layout';

import './styles.module.css';

const EmailForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your form submission logic here
    console.log({ name, email, message });
    setSubmitted(true);
  };

//THIS WILL NOT WORK YET,I NEED TO ADD THE FORM SUBMISSION LOGIC
//Probably using Formspree or something similar

  return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        {submitted ? (
          <p>Thank you for your message. We will get back to you soon.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
  );
};

export default EmailForm;
