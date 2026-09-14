import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://megeb-plus-backend.vercel.app";

/**
 * Get expiration time from a Django JWT.
 */
function getTokenExpiration(accessToken: string): number {
  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64").toString()
    );

    return payload.exp * 1000;
  } catch {
    // Fallback: consider the token expired after 5 minutes.
    return Date.now() + 5 * 60 * 1000;
  }
}

/**
 * Refresh the Django access token using
 * the Django refresh token.
 */
async function refreshAccessToken(token: {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  role?: string;
  phone?: string;
  error?: string;
}) {
  try {
    if (!token.refreshToken) {
      return {
        ...token,
        accessToken: undefined,
        accessTokenExpires: undefined,
        error: "RefreshAccessTokenError",
      };
    }

    

    const response = await fetch(
      `${API_BASE_URL}/api/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: token.refreshToken,
        }),
        cache: "no-store",
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      
      return {
        ...token,
        accessToken: undefined,
        accessTokenExpires: undefined,
        error: "RefreshAccessTokenError",
      };
    }

    const refreshedTokens = JSON.parse(responseText);

    if (!refreshedTokens.access) {
      

      return {
        ...token,
        accessToken: undefined,
        accessTokenExpires: undefined,
        error: "RefreshAccessTokenError",
      };
    }

    
    return {
      ...token,
      accessToken: refreshedTokens.access,
      accessTokenExpires: getTokenExpiration(
        refreshedTokens.access
      ),
      error: undefined,
    };
  } catch  {
    

    return {
      ...token,
      accessToken: undefined,
      accessTokenExpires: undefined,
      error: "RefreshAccessTokenError",
    };
  }
}

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        identifier: {
          label: "Email or Phone",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (
          !credentials?.identifier ||
          !credentials?.password
        ) {
          return null;
        }

        try {
          const response = await fetch(
            `${API_BASE_URL}/api/auth/login/`,
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                identifier: credentials.identifier,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (!data.access || !data.refresh) {
            return null;
          }

          return {
            id: data.email || data.phone,
            name: data.full_name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            accessToken: data.access,
            refreshToken: data.refresh,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * Runs when the JWT is created or accessed.
     */
    async jwt({ token, user }) {
      /**
       * Initial login.
       */
      if (user) {
        token.accessToken =
          user.accessToken;

        token.refreshToken =
          user.refreshToken;

        token.role =
          user.role;

        token.phone =
          user.phone;

        token.accessTokenExpires =
          user.accessToken
            ? getTokenExpiration(
                user.accessToken
              )
            : undefined;

        return token;
      }

      /**
       * Convert Auth.js JWT values from unknown
       * into the types used by our application.
       */
      const accessToken =
        typeof token.accessToken === "string"
          ? token.accessToken
          : undefined;

      const refreshToken =
        typeof token.refreshToken === "string"
          ? token.refreshToken
          : undefined;

      const accessTokenExpires =
        typeof token.accessTokenExpires === "number"
          ? token.accessTokenExpires
          : undefined;

      const role =
        typeof token.role === "string"
          ? token.role
          : undefined;

      const phone =
        typeof token.phone === "string"
          ? token.phone
          : undefined;

      const error =
        typeof token.error === "string"
          ? token.error
          : undefined;

      /**
       * Access token is still valid.
       */
      if (
        accessToken &&
        accessTokenExpires &&
        Date.now() < accessTokenExpires
      ) {
        
        return {
          ...token,
          accessToken,
          refreshToken,
          accessTokenExpires,
          role,
          phone,
          error,
        };
      }

      /**
       * Access token has expired.
       * Ask Django for a new one.
       */
      return refreshAccessToken({
        accessToken,
        refreshToken,
        accessTokenExpires,
        role,
        phone,
        error,
      });
    },

    /**
     * Controls what is exposed through
     * the client-side session.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.role =
          typeof token.role === "string"
            ? token.role
            : undefined;

        session.user.phone =
          typeof token.phone === "string"
            ? token.phone
            : undefined;
      }

      /**
       * Expose the current Django access token
       * to the client-side API client.
       */
      session.accessToken =
        typeof token.accessToken === "string"
          ? token.accessToken
          : undefined;

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
});