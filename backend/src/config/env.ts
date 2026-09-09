export function requiredEnv(name: string, developmentFallback?: string): string {
  const value = process.env[name];
  if (value) return value;
  if (process.env.NODE_ENV === "production") throw new Error(`${name} must be configured in production`);
  return developmentFallback ?? "";
}
