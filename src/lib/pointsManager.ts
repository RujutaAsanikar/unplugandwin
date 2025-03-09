
// A simple utility to manage points across the application

// Get the current points from localStorage or use default
export const getUserPoints = (): { current: number; target: number } => {
  const savedPoints = localStorage.getItem('userPoints');
  if (savedPoints) {
    return JSON.parse(savedPoints);
  }
  return {
    current: 0,
    target: 30000
  };
};

// Save points to localStorage
export const saveUserPoints = (points: { current: number; target: number }) => {
  localStorage.setItem('userPoints', JSON.stringify(points));
};

// Add points and return the updated total
export const addPoints = (amount: number): { current: number; target: number } => {
  const currentPoints = getUserPoints();
  const updatedPoints = {
    ...currentPoints,
    current: currentPoints.current + amount
  };
  saveUserPoints(updatedPoints);
  return updatedPoints;
};
