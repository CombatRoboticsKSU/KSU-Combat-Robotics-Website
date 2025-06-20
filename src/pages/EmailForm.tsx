import React, { ChangeEvent, FormEvent, useState } from 'react';
import emailjs from 'emailjs-com';

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID as string;
const USER_ID = process.env.REACT_APP_EMAILJS_USER_ID as string;

export default function EmailForm() {
  const [form, setForm] = useState({ name: '', title: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name,
          subject: form.title,
          message: form.message,
        },
        USER_ID
      );
      setStatus('Message sent!');
      setForm({ name: '', title: '', message: '' });
    } catch (error) {
      setStatus('Failed to send. Please try again.');
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div style={{ textAlign: 'center', padding: '10px'}}>
        <p className='hero__title'>Questions? Comments? Want to support us? Let us know!</p>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Message:</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Send</button>
          <div>{status}</div>
        </form>
      </div>
    </div>
  );
}
