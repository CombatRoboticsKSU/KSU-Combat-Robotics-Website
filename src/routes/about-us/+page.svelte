<script lang="ts">
  import { onMount } from 'svelte';
</script>

<svelte:head>
  <title>History of KSU Combat Robotics</title>
  <meta
    name="description"
    content="Linear series of events and milestones of our club"
  />
</svelte:head>

<header class="w-screen bg-black/10 text-white text-center py-16 px-4 flex justify-center items-center">
  <div class="max-w-4xl">
    <h1 class="text-4xl md:text-5xl font-bold mb-2">Combat Robotics History</h1>
    <p class="text-lg opacity-90">History of our club and bots</p>
  </div>
</header>

<main class="flex justify-center items-center w-full py-16 px-6 bg-white dark:bg-neutral-900 transition-colors duration-300">
  <div class="w-full max-w-[1500px] space-y-16">

    <!-- Section 1 -->
    <section class="flex flex-col md:flex-row items-center gap-8">
      <img
        src="/USINGimg/team_w.JPG"
        alt="Beginnings"
        class="w-full md:w-[400px] rounded-lg shadow-md"
      />
      <div class="container text-neutral-800 dark:text-neutral-200 space-y-4">
        <h2 class="text-2xl font-semibold">Beginnings (2016-2018)</h2>
        <p>
          The club began in 2016 when the founding members: Maddie Wilson, Chad Soukup,
          Dan Youst, Damon Mandideto, and Emily Perine decided to start the club under
          the name of “X-Bots”. They approached Professor Trent True and asked him to be
          the academic advisor. He accepted despite starting at Kent State the year before.
        </p>
        <p>
          The first bots of the club were The Twins,
          <a href="/wiki/SorApp" class="text-amber-400 hover:underline">Sorcerer & Apprentice</a>.
          The Twins were two seven and a half pound bots, equipped with titanium wedges that
          allowed for a strong control game. They were active from the start until 2019 when
          Big-Ish was introduced. During their years, they went through a few revisions until
          they found success at Dayton and the National Robotics League's competition in
          Pittsburgh. Their final and most successful redesign was wide-body bots with 6061
          Aluminum wedges equipped to the front of the bots. The twins would be moved to the
          junior team in late 2017, and then retired after 2019.
        </p>
        <p>
          After many competitions with The Twins, the team decided to create a bot with a
          more aggressive style. This led to the idea of OSHA Approved. It was designed by
          Mike Nelson and kept the defensive style of the twins but added a proper weapon.
          The design was very low profile, with a cut off pyramid look to it. Aluminum wedges
          surrounded the rectangular body of the bot entirely except where the weapon was.
          It came equipped with a dual spinning vertical blade set up, which greatly helped
          the aggressive style the club was developing. Over its few years of life OSHA Approved
          was seen only at NRL competitions. For the 2018 season, OSHA Approved became OSHA Improved
          with significant changes to its weapon and armor. Unfortunately, the OSHA series of bots
          were decommissioned in late 2019.
        </p>
      </div>
    </section>

    <!-- Section 2 -->
    <section class="flex flex-col md:flex-row items-center gap-8">
      <img
        src="/USINGimg/bigish_old.jpg"
        alt="Big-Ish"
        class="w-full md:w-[400px] rounded-lg shadow-md"
      />
      <div class="container text-neutral-800 dark:text-neutral-200 space-y-4">
        <h2 class="text-2xl font-semibold">Big-Ish's Introduction (2019-2022)</h2>
        <p>
          After a few years of the club existing, new members began to make a mark on its legacy.
          One notable introduction was Brendan Steele. He joined in 2018 and was the lead designer
          on the club's next bot,
          <a href="/wiki/bigish" class="text-amber-400 hover:underline">Big-Ish</a>.
          Big-Ish is a tall 12lb bot with a large vertical spinning blade in the middle of its two halves.
          The design takes heavy inspiration from the BattleBots competitor
          <a
            href="https://hugebattlebots.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-amber-400 hover:underline"
            >HUGE</a
          >. Big-Ish's design and creation was finished in 2019, right as Covid-19 began to take
          its toll on the club. Because of Covid, Brendan had to finish the bot at home, and the
          team was rushed to finish it for its first competition.
        </p>
        <p>
          On top of rushing Big-Ish, Covid brought up other challenges for the club. The overall
          member count dwindled greatly and almost led to the club disbanding. This also caused
          the decommissioning of The Twins. Fortunately, with the creation of Big-Ish and the
          determination of its members, the club prevailed. Following the lift of Covid restrictions,
          Big-Ish was able to properly compete at the National Havoc Robot League (NHRL). Big-Ish found
          success, winning three out of its five matches.
        </p>
      </div>
    </section>

    <!-- Section 3 -->
    <section class="flex flex-col md:flex-row items-center gap-8">
      <img
        src="/USINGimg/FlashBang.jpg"
        alt="Flash-BANG"
        class="w-full md:w-[400px] rounded-lg shadow-md"
      />
      <div class="container text-neutral-800 dark:text-neutral-200 space-y-4">
        <h2 class="text-2xl font-semibold">The Current Age (2022-Present)</h2>
        <p>
          During these more recent years, the club went through a large expansion and gained many
          members. The board members reorganized and created the structural foundation of what we
          know the club as today. They also introduced a third bot to the club,
          <a href="/wiki/flashbang" class="text-amber-400 hover:underline">Flash-BANG</a>.
          Flash-BANG is a twelve-pound bot equipped with a drum spinner. The bot was originally
          designed by Austin Thebner & Gregory Wenner. It has fought at NHRL a few times and has
          competed at the Dayton competition.
        </p>
        <p>
          Nowadays, the club continues with two active bots, Big-Ish and Flash-BANG. With these bots,
          they attend competitions when possible, with the main goal being to win NHRL. They also
          started a tradition of hosting an all-plastic bot competition. The first competition was
          held in the fall of 2023 and featured 1.5lb all-plastic bots. This is being followed by a
          3lb all-plastic competition in the spring of 2025.
        </p>
      </div>
    </section>
  </div>
</main>