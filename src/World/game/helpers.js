export function getRandomInt(min, max) {
  const alignedMin = Math.ceil(min);
  const alignedMax = Math.floor(max);

  return Math.floor(Math.random() * (alignedMax - alignedMin + 1)) + min;
}
