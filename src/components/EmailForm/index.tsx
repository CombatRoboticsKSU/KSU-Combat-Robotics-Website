import React, { ChangeEvent, FormEvent, useState } from 'react';
import emailjs from 'emailjs-com';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import './styles.module.css';

const EmailForm: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();
  const SERVICE_ID = siteConfig.customFields.EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = siteConfig.customFields.EMAILJS_TEMPLATE_ID;
  const USER_ID = siteConfig.customFields.EMAILJS_USER_ID;

  if (!SERVICE_ID || !TEMPLATE_ID || !USER_ID) {
    console.error('Missing EmailJS environment variables:', {
      SERVICE_ID,
      TEMPLATE_ID,
      USER_ID,
    });
  }

  // fallback to empty string to avoid crash
  const safeServiceId = SERVICE_ID || '';
  const safeTemplateId = TEMPLATE_ID || '';
  const safeUserId = USER_ID || '';

  const [form, setForm] = useState({ name: '', email: '', title: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.debug('Form updated:', { ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');
    console.debug('Submitting form:', form);
    try {
      const messageWithEmail = `${form.message}\n\nSender Email: ${form.email}`;
      console.debug('Message sent to API:', {
        from_name: form.name,
        subject: form.title,
        message: messageWithEmail,
      });
      console.log('About to send email with:', {
        serviceId: safeServiceId,
        templateId: safeTemplateId,
        userId: safeUserId,
        payload: {
          from_name: form.name,
          subject: form.title,
          message: messageWithEmail,
        },
      });
      await emailjs.send(
        safeServiceId,
        safeTemplateId,
        {
          from_name: form.name,
          subject: form.title,
          message: messageWithEmail,
          reply_to: form.email, // Pass the email directly as well
        },
        safeUserId
      );
      setStatus('Message sent!');
      setForm({ name: '', email: '', title: '', message: '' });
      console.debug('Form reset after send');
    } catch (error) {
      setStatus('Failed to send. Please try again.');
      console.error('Email send failed:', error);
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div style={{ textAlign: 'center', padding: '10px'}}>
        <form onSubmit={handleSubmit} style={{ maxWidth: 900, margin: '0 auto' }}>
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
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Subject:</label>
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
};

export default EmailForm;
