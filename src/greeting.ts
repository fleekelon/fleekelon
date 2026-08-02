export function getGreeting(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    throw new Error("name must not be empty");
  }

  return `Hello from ${trimmed}`;
}
