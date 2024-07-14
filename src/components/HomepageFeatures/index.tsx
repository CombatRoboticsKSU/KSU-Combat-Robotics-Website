import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: JSX.Element;
  Img: string; // Image source as a string
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: (
      <Link to="/wiki/Flash-Bang">
        <button style={{ fontSize: '25px', padding: '15px 25px' }}>
          Flash-BANG
        </button>
      </Link>
    ),
    Img: 'USINGimg/FlashBang.jpg',
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
      <Link to="/wiki/Big-ISH">
        <button style={{ fontSize: '25px', padding: '15px 25px' }}>
          Big-ISH
        </button>
      </Link>
    ),
    Img: 'USINGimg/Bigish.JPG',
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
        <img src={Img} className={styles.featureImg} alt={title.toString()} />
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
