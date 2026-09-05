import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;

    user: {
      id?: string;
      role?: string;
      phone?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role?: string;
    phone?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    role?: string;
    phone?: string;
    error?: string;
  }
}