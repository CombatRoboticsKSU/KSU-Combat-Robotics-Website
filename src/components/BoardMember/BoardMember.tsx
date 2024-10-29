import React from 'react';
import styles from './BoardMember.module.css';
import Link from '@docusaurus/Link';
import LinkedInIcon from '@site/static/img/LinkedIn-Logos/linkedIn.png'; // Adjust path as necessary

interface BoardMemberProps {
  name: string;
  imageSrc: string;
  title: string;
  stats: (string | JSX.Element)[];
  bio: string;
  linkedIn: string;
}

const BoardMember: React.FC<BoardMemberProps> = ({ name, imageSrc, title, stats, bio, linkedIn }) => {
  return (
    <div className={styles.boardMemberCard}>
      <img src={imageSrc} alt={`${name}'s photo`} className={styles.boardMemberImage} />
      <h2 className={styles.boardMemberName}>{name}</h2>
      <p className={styles.boardMemberTitle}>{title}</p>
      <ul className={styles.boardMemberStats}>
        {stats.map((stat, index) => (
          <li key={index}>{stat}</li>
        ))}
      </ul>
      <p className={styles.boardMemberBio}>{bio}</p>
      <Link to={linkedIn} className={styles.boardMemberLinkedIn} target="_blank" rel="noopener noreferrer">
        <img src={LinkedInIcon} alt="LinkedIn" className={styles.linkedInIcon} />
      </Link>
    </div>
  );
};

export default BoardMember;
