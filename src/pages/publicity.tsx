import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures/index';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
        In the News
        </Heading>
        <p className="hero__subtitle">History of Media-Coverage</p>
        <div className={styles.buttons}></div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`In the News`}
      description="Linear series media-coverage of our club">
      <main>
        <HomepageHeader />

       {/* Embedded Local Video */}
        {/*<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
          <video width="640" height="360" controls>
            <source src="/USINGimg/Xbots Promo Video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>*/}

        <div style={{ width: '100%', padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ maxWidth: '1500', padding: '20px' }}>

            <section style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <Heading as="h2">Lorem Ipsum</Heading>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. In temporibus, quidem repellat possimus qui vitae maiores optio. Expedita, eos cumque aliquid, vero explicabo consectetur sequi at nulla numquam eveniet error.
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
    </Layout>
  );
}