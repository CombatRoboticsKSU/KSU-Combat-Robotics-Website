import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: React.ReactNode; // Allowing JSX or text
  Img: string;
  description: React.ReactNode; // Allowing JSX or text
};

const FeatureList: FeatureItem[] = [
  {
    title: (
      <Link to="/wiki/flashbang">
        <button style={{ fontSize: '25px', padding: '15px 25px' }}>
          Flash-BANG
        </button>
      </Link>
    ),
    Img: 'USINGimg/FlashBang.jpg', // Assuming the image is in the static folder
    description: (
      <>
        Hit them Hard, Hit them Fast <br />
        <br />
        Flash-BANG is named after our school's mascot, a golden eagle named Flash. It takes significant inspiration from Battlebots like Minotaur & Copperhead.
      </>
    ),
  },
  {
    title: (
      <Link to="/wiki/bigish">
        <button style={{ fontSize: '25px', padding: '15px 25px' }}>
          Big-ISH
        </button>
      </Link>
    ),
    Img: 'USINGimg/Bigish_new.JPG', // Assuming the image is in the static folder
    description: (
      <>
        It's not HUGE, It's not small, It's BIG-ISH <br />
        <br />
        BIG-ISH is built to resemble the Battlebot HUGE, but at the 12lb weight class. It also features significant improvements & design tweaks that contribute to its ability to be competitive.
      </>
    ),
  },
];

function Feature({ title, Img, description }: FeatureItem) {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--center">
        <img src={Img} className={styles.featureImg} alt="Feature" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
