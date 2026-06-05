// types/clerk.d.ts
export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: "admin" | "user";
    };
  }
}