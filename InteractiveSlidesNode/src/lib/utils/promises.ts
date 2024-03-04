export function delay(ts = 1000): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ts)
  })
}
