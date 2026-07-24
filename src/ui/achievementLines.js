export function getAchievementListLines(achievement, isUnlocked) {
  if (isUnlocked) {
    const percent = Math.round(achievement.idleBonus * 100);
    return [
      { text: `✓ ${achievement.name}  (+${percent}% idle)`, kind: 'unlocked-title' },
      { text: `   ${achievement.description}`, kind: 'unlocked-desc' },
    ];
  }

  return [{ text: '○ ???', kind: 'locked' }];
}
