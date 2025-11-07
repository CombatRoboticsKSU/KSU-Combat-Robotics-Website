<svelte:head>
  <title>Calendar of Events | KSU Combat Robotics</title>
  <meta
    name="description"
    content="View upcoming meetings, competitions, and milestones for KSU Combat Robotics."
  />
</svelte:head>

<!-- HERO SECTION -->
<header class="hero">
  <div class="hero-content">
    <h1>Meetings & Competition Dates</h1>
    <p>Stay up to date with our club’s events and milestones</p>
  </div>
</header>

<!-- MAIN CONTENT -->
<main class="page-content">
  <section class="calendar-section">
    <h2>Upcoming Events</h2>
    <p class="calendar-subtitle">
      View our club’s official calendar for meeting times, competitions, and build sessions.
    </p>

    <div class="calendar-wrapper">
      <div style="display: flex; justify-content: center; margin: 2rem 0;">
        <iframe
            src="https://calendar.google.com/calendar/embed?src=c_17f0fd8b65f2f6389fc72f9a7a34ccc5cd4b6ff26a37a429e3c5c4530abad9ae%40group.calendar.google.com&ctz=America%2FNew_York"
            style="border: 0; width: 80vw; max-width: 2200px; height: 800px;"
            frameborder="0"
            scrolling="no"
            title="KSU Combat Robotics Calendar"
        ></iframe>
        </div>
    </div>
  </section>
</main>

<style>
  /* === HERO SECTION === */
  .hero {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    background: #0000001d;
    color: white;
    text-align: center;
    padding: 6rem 1rem 5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-content {
    max-width: 800px;
  }

  .hero h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .hero p {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  /* === MAIN PAGE === */
  .page-content {
    padding: 3rem 1rem 5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  /* === CALENDAR SECTION === */
  .calendar-section {
    width: 100%;
    max-width: 1000px;
    text-align: center;
  }

  .calendar-section h2 {
    font-size: 1.8rem;
    color: #1f1f1f;
    margin-bottom: 0.5rem;
  }

  .calendar-subtitle {
    color: #555;
    margin-bottom: 2rem;
    font-size: 1.05rem;
  }

  .calendar-wrapper {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }

  iframe {
    border: 0;
    width: 100%;
    height: 700px;
  }

  @media (max-width: 768px) {
    .hero {
      padding: 4rem 1rem;
    }

    iframe {
      height: 500px;
    }
  }

  /* Dark mode support (optional) */
  @media (prefers-color-scheme: dark) {
    .calendar-section h2 {
      color: #f5f5f5;
    }
    .calendar-subtitle {
      color: #ccc;
    }
    .page-content {
      background-color: #111;
      color: #f5f5f5;
    }
  }
</style>