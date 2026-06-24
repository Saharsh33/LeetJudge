import React from 'react';
import Badge from './Badge';

export default function DifficultyBadge({ difficulty }) {
  const isEasy = difficulty === 'EASY';
  const isMedium = difficulty === 'MEDIUM';

  const color = isEasy ? 'var(--status-accepted)' : isMedium ? 'var(--status-tle)' : 'var(--status-wrong)';
  const bg = isEasy ? 'var(--status-accepted-bg)' : isMedium ? 'var(--status-tle-bg)' : 'var(--status-wrong-bg)';

  return (
    <Badge color={color} bg={bg} border="transparent">
      {difficulty}
    </Badge>
  );
}
