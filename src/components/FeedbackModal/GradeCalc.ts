export const percentToGrade = [
  { min: 96, max: 100, grade: 1.0 },
  { min: 91, max: 95, grade: 1.3 },
  { min: 86, max: 90, grade: 1.7 },
  { min: 81, max: 85, grade: 2.0 },
  { min: 76, max: 80, grade: 2.3 },
  { min: 71, max: 75, grade: 2.7 },
  { min: 66, max: 70, grade: 3.0 },
  { min: 61, max: 65, grade: 3.3 },
  { min: 56, max: 60, grade: 3.7 },
  { min: 50, max: 55, grade: 4.0 },
  { min: 0, max: 49, grade: 5.0 },
];

export function getGradeFromPoints(
  points: number,
  totalPoints: number
): number | undefined {
  const percent = Math.round((points / totalPoints) * 100);
  return percentToGrade.find(({ min, max }) => percent >= min && percent <= max)
    ?.grade;
}
