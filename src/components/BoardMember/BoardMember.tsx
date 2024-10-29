import React from 'react';
import styles from './BoardMember.module.css';

interface BoardMemberProps {
  name: string;
  imageSrc: string;
  title: string;
  stats: string[];
  bio: string;
}

const BoardMember: React.FC<BoardMemberProps> = ({ name, imageSrc, title, stats, bio }) => {
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
    </div>
  );
};

export default BoardMember;
