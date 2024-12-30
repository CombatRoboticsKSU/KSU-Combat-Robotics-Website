import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import BoardMember from '@site/src/components/BoardMember/BoardMember';

import styles from './index.module.css';
//need to add information about how to sponsor us (sponsorship packages, etc)
//add SKB Cases after Friday meeting (9/20/24)

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Current Leadership
        </Heading>
        <div className={styles.buttons}>

        </div>
      </div>
    </header>
  );
}
// Introducting the TWATS board XD
export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
      <Layout
        title={`Home`}
        description="Landing page for KSU Combat Robotics domain">
        <main>
          <HomepageHeader />
          <div className={styles['board-members-container']}>
            <BoardMember
              name="Austin Thebner"
              imageSrc="/USINGimg/austint.jpg"
              title="President"
              stats={["Years in Robotic: 4 with no previous experience", 
                "Club Member: 2 years", 
                "Major: Mechanical engineering technology BA & Engineering technology ma",
                "Fun Fact: I am colorblind",
                <>Personal Bot: <Link to="/pbots/pnuematador">PNUEMATADOR</Link></>
              ]}
              bio="Austin has been leading the club for 3 years and specializes in mechanical design and strategy."
            />
            <BoardMember
              name="Gregory Wenner"
              imageSrc="/USINGimg/greg.jpg"
              title="Vice President"
              stats={[
                "Years in Robotics: 9",
                "Club Member: 3 years",
                "Major: Aerospace Engineering",
                "Fun Fact: I am apart of a professional unicycling team.",
                <>Personal Bot: <Link to="/pbots/Flashstorm">Flash-STORM</Link></>
              ]}
              bio= ""//"Greg is the club's Vice President and has been a member for 3 years. He specializes in electrical design and programming."
            />
            <BoardMember
              name="Adam Turniski"
              imageSrc="/USINGimg/adam.jpg"
              title="Treasurer"
              stats={["Years in Robotics: 1", "Club Member: 2 years", "Major: Mechatronics Engineering", , "Fun Fact: I like to fish and cook and I am also apart of the AFS chapter at Kent."]}
              bio="Adam is an aspiring engineer from northeast Ohio that loves automation and robotics"
            />
            <BoardMember
              name="Austin Sternberg"
              imageSrc="/USINGimg/austins.jpg"
              title="Project Manager"
              stats={["Years in Robotics: 8.5", "Club Member: 2 years", "Major: Computer Science","Fun Fact: I built this website!"]}
              bio="Austin is the club's Project Manager and has been a member for 2 years. He has been in combat robotics since 6th grade and is slowly developing his own 12lb bot."
            />
          </div>
        </main>
      </Layout>
    );
  }