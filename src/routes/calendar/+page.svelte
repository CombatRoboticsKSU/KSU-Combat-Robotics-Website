<svelte:head>
  <title>Calendar of Events | KSU Combat Robotics</title>
  <meta
    name="description"
    content="View upcoming meetings, competitions, and milestones for KSU Combat Robotics."
  />
</svelte:head>

<header
  class="w-screen bg-black/10 text-white text-center py-24 px-4 flex items-center justify-center"
>
  <div class="max-w-3xl">
    <h1 class="text-4xl md:text-5xl font-bold mb-4">Meetings & Competition Dates</h1>
    <p class="text-lg opacity-90">
      Stay up to date with our club's events and milestones
    </p>
  </div>
</header>

<main
  class="flex flex-col items-center gap-8 py-12 px-4 bg-white dark:bg-neutral-900 transition-colors duration-300"
>
  <section class="w-full max-w-5xl text-center">
    <h2 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
      Upcoming Events
    </h2>
    <p class="text-neutral-600 dark:text-neutral-300 mb-8 text-base">
      View our club's official calendar for meeting times, competitions, and build sessions.
    </p>

    <div
      class="rounded-xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-700"
    >
      <div class="flex justify-center my-8">
        <iframe
          src="https://calendar.google.com/calendar/embed?src=ksu.fightingrobotics%40gmail.com&ctz=America%2FNew_York"
          class="border-0 w-[90vw] max-w-[2200px] h-[800px] sm:h-[600px] md:h-[700px]"
          frameborder="0"
          scrolling="no"
          title="KSU Combat Robotics Calendar"
        ></iframe>
      </div>
    </div>
  </section>
</main>