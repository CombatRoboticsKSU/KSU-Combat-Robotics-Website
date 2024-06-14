import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Our Sponsors / How to Sponsor the Team
        </Heading>
        <p className="hero__subtitle">Our generous sponsors make our bot projects & competitions possible. We would not be here without them.</p>
        <div className={styles.buttons}>
          
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Sponsorship`}
      description="Information about current sponsors, and the way to sponsor us in the future">
      <HomepageHeader />
      <main>
        <p className='hero__title'>Current Sponsors:</p>
        <ul>
          <li>WardJet</li>
          <li>IT Gresa</li>
          <li>Bad-Ass Motors</li>
          <li>Repeat Robotics</li>
          <li>SendCutSend</li>
        </ul>

        <p className='hero__title'>Interested in Sponsoring Us?</p>
        <p className='hero_subtitle'>Here are the details</p>
      </main>
    </Layout>
  );
}
