import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import EmailForm from '@site/src/components/EmailForm/index';

import styles from './index.module.css';

export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
      <Layout
        title={`Contact Us!`}
        description="This page provides an email form to contact us and get a response">
        <main>
          <div style={{ width: '100%', height: '100vh' }}>
            <div style={{ textAlign: 'center', padding: '10px'}}>
                <p className='hero__title'>Questions? Comments? Want to support us? Let us know!</p>
                <EmailForm />
            </div>
          </div>
        </main>
      </Layout>
    );
}