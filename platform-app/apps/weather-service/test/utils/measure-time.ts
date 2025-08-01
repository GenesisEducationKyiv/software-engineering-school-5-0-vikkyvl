export async function averageDuration(
  requestFn: () => Promise<any>,
  communicationType: string,
  iterations: number = 1000,
): Promise<void> {
  const durations: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    await requestFn();
    const end = Date.now();

    durations.push(end - start);
  }

  const avg = durations.reduce((a, b) => a + b, 0) / iterations;
  const min = Math.min(...durations);
  const max = Math.max(...durations);

  console.log(
    `${communicationType} — average execution time per request: ${avg} ms`,
  );
  console.log(`Min: ${min} ms | Max: ${max} ms\n`);
}
