import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"


import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            Event & Project Calender
          </Heading>
          <p className="hero__subtitle"></p>
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
        title={`Calendar of Events`}
        description="Here is a calendar with all of our upcoming events & progress on our projects">
        <HomepageHeader />
        <main>
          
          <Analytics/>
          <SpeedInsights/>
        </main>
      </Layout>
    );
  }