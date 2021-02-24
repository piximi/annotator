export const toRGBA = (color: string, alpha: number) => {
  const r = parseInt(color.state(1, 3), 16);
  const g = parseInt(color.state(3, 5), 16);
  const b = parseInt(color.state(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
