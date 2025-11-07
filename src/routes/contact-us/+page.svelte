<svelte:head>
  <title>Contact KSU Combat Robotics</title>
  <meta name="description" content="Linear series of events and milestones of our club" />
</svelte:head>

<header class="hero hero--primary heroBanner">
  <div class="container">
    <h1 class="hero__title">Contact Us</h1>
    <p class="hero__subtitle">Have questions or comments? Want to support us? Let us know!</p>
  </div>
</header>

<main>
    <div
        style="width: 100%; padding: 40px; display: flex; justify-content: center; align-items: center;"
    >
        <div style="max-width: 1500px">
            <h4>Questions? Comments? Want to support us? Let us know!</h4>

            <form class="contact-form">
                <div>
                    <label for="name">Name</label>
                    <input id="name" type="text" name="name" required />
                </div>

                <div>
                    <label for="title">Title</label>
                    <input id="title" type="text" name="title" required />
                </div>

                <div>
                    <label for="message">Message</label>
                    <textarea id="message" name="message" required></textarea>
                </div>

                <button type="submit">Send</button>
            </form>
        </div>
    </div>
</main>

<style>
  .hero {
    width: 100vw;        /* full viewport width */
    margin-left: calc(50% - 50vw); /* escape parent padding/margin */

    background: #0000001d;
    color: white;
    text-align: center;
    padding: 4rem 0;
  }

  .hero__title {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .hero__subtitle {
    font-size: 1.2rem;
  }

  a {
    color: #ebab21;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  h1,h2,h3,p {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .contact-form {
    max-width: 400px;
    margin: 50px auto;
    padding: 2rem;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .contact-form label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.3rem;
    color: #333;
    text-align: left;
  }

  .contact-form input,
  .contact-form textarea {
    width: 90%;
    padding: 0.7rem 0.9rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .contact-form input:focus,
  .contact-form textarea:focus {
    border-color: #4466ee;
    outline: none;
    box-shadow: 0 0 0 3px rgba(68, 102, 238, 0.2);
  }

  .contact-form textarea {
    resize: vertical;
    min-height: 100px;
  }

  .contact-form button {
    background-color: #4466ee;
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    padding: 0.8rem;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
  }

  .contact-form button:hover {
    background-color: #3454d1;
  }

  .contact-form button:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    section {
      flex-direction: column;
    }

    section img {
      margin-bottom: 20px;
      margin-right: 0;
      width: 100%;
      max-width: 400px;
    }
  }
</style>