import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import EmailForm from '../components/EmailForm';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Contact Us
        </Heading>
        <p className="hero__subtitle">Have questions or comments? Want to support us? Let us know!</p>
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
        title={`Contact Us!`}
        description="This page provides an email form to contact us and get a response">
        <main>
          <HomepageHeader />
              <EmailForm />
        </main>
      </Layout>
    );
}