<script>
  // In SvelteKit, use <a href="/path"> for internal links, 
  // or use <a target="_blank"> for external ones.
  import { onMount } from 'svelte';
</script>

<svelte:head>
  <title>History of KSU Combat Robotics</title>
  <meta name="description" content="Linear series of events and milestones of our club" />
</svelte:head>

<header class="hero hero--primary heroBanner">
  <div class="container">
    <h1 class="hero__title">Combat Robotics History</h1>
    <p class="hero__subtitle">History of our club and bots</p>
  </div>
</header>

<main>
  <div
    style="width: 100%; padding: 40px; display: flex; justify-content: center; align-items: center;"
  >
    <div style="max-width: 1500px; padding: 20px;">

      <!-- Section 1 -->
      <section style="display: flex; align-items: center; margin-bottom: 40px;">
        <img
          src="/USINGimg/team_w.JPG"
          alt="Beginnings"
          style="width: 400px; margin-right: 20px; border-radius: 8px;"
        />
        <div class="container">
          <h2>Beginnings (2016-2018)</h2>
          <p>
            The club began in 2016 when the founding members: Maddie Wilson, Chad Soukup, Dan Youst,
            Damon Mandideto, and Emily Perine decided to start the club under the name of “X-Bots”.
            They approached Professor Trent True and asked him to be the academic advisor. He
            accepted despite starting at Kent State the year before.
          </p>
          <p>
            The first bots of the club were The Twins,
            <a href="/wiki/SorApp">Sorcerer & Apprentice</a>. The Twins were two seven and a half
            pound bots, equipped with titanium wedges that allowed for a strong control game. They
            were active from the start until 2019 when Big-Ish was introduced. During their years,
            they went through a few revisions until they found success at Dayton and the National
            Robotics League's competition in Pittsburgh. Their final and most successful redesign
            was wide-body bots with 6061 Aluminum wedges equipped to the front of the bots. The twins
            would be moved to the junior team in late 2017, and then retired after 2019.
          </p>
          <p>
            After many competitions with The Twins the team decided to create a bot with a more
            aggressive style. This led to the idea of OSHA Approved. It was designed by Mike Nelson
            and kept the defensive style of the twins but added a proper weapon. The design was very
            low profile, with a cut off pyramid look to it. Aluminum wedges surrounded the rectangular
            body of the bot entirely except where the weapon was. It came equipped with a dual spinning
            vertical blade set up, which greatly helped the aggressive style the club was developing.
            Over its few years of life OSHA Approved was seen only at NRL competitions. For the 2018
            season, OSHA Approved became OSHA Improved with a significant changes to its weapon and
            armor. Unfortunately, the OSHA series of bots where decommissioned in late 2019.
          </p>
        </div>
      </section>

      <!-- Section 2 -->
      <section style="display: flex; align-items: center; margin-bottom: 40px;">
        <img
          src="/USINGimg/bigish_old.jpg"
          alt="Big-Ish"
          style="width: 400px; margin-right: 20px; border-radius: 8px;"
        />
        <div class="container">
          <h2>Big-Ish's Introduction (2019-2022)</h2>
          <p>
            After a few years of the club existing, new members began to make a mark on its legacy.
            One notable introduction was Brendan Steele. He joined in 2018 and was the lead designer
            on the club's next bot, <a href="/wiki/bigish">Big-Ish</a>. Big-Ish is a tall 12lb bot
            with a large vertical spinning blade in the middle of its two halves. The design takes
            heavy inspiration from the BattleBots competitor
            <a href="https://hugebattlebots.com" target="_blank" rel="noopener noreferrer">HUGE</a>.
            Big-Ish's design and creation was finished in 2019, right as Covid-19 began to take its
            toll on the club. Because of Covid, Brendan had to finish the bot at home, and the team
            was rushed to finish it for its first competition.
          </p>
          <p>
            On top of rushing Big-Ish, Covid brought up other challenges for the club. The overall
            member count dwindled greatly and almost led to the club disbanding. This also caused the
            decommissioning of The Twins. Fortunately, with the creation of Big-Ish and the determination
            of its members, the club prevailed. Following the lift of Covid restrictions, Big-Ish was
            able to properly compete at the National Havoc Robot League (NHRL). Big-Ish found success,
            winning three out of its five matches.
          </p>
        </div>
      </section>

      <!-- Section 3 -->
      <section style="display: flex; align-items: center; margin-bottom: 40px;">
        <img
          src="/USINGimg/FlashBang.jpg"
          alt="Flash-BANG"
          style="width: 400px; margin-right: 20px; border-radius: 8px;"
        />
        <div class="container">
          <h2>The Current Age (2022-Present)</h2>
          <p>
            During these more recent years, the club went through a large expansion and gained many
            members. The board members reorganized and created the structural foundation of what we
            know the club as today. They also introduced a third bot to the club,
            <a href="/wiki/flashbang">Flash-BANG</a>. Flash-BANG is a twelve-pound bot equipped with a
            drum spinner. The bot was originally designed by Austin Thebner & Gregory Wenner. It has
            fought at NHRL a few times and has competed at the Dayton competition.
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