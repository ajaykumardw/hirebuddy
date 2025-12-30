// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'

// const prisma = new PrismaClient()

export const authOptions = {

  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    CredentialProvider({
      // ** The name to display on the sign in form (e.g. 'Sign in with...')
      // ** For more details on Credentials Provider, visit https://next-auth.js.org/providers/credentials
      name: 'Credentials',
      type: 'credentials',

      /*
       * As we are using our own Sign-in page, we do not need to change
       * username or password attributes manually in following credentials object.
       */
      credentials: {},
      async authorize(credentials) {
        /*
         * You need to provide your own logic here that takes the credentials submitted and returns either
         * an object representing a user or value that is false/null if the credentials are invalid.
         * For e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
         * You can also use the `req` object to obtain additional parameters (i.e., the request IP address)
         */
        const { email, password, isCandidate, jobApply } = credentials

        try {
          // ** Login API Call to match the user credentials and receive user data in response along with his role
          const res = await fetch(`${process.env.API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: email, password, isCandidate: isCandidate, jobApply })
          })

          const data = await res.json()

          if (res.status === 401) {
            throw new Error(JSON.stringify(data))
          }

          if (res.status === 403) {
            throw new Error(JSON.stringify(data))
          }

          if (res.status === 200) {
            /*
             * Please unset all the sensitive information of the user either from API response or before returning
             * user data below. Below return statement will set the user object in the token and the same is set in
             * the session which will be accessible all over the app.
             */
            return {
              id: data.id,
              name: data.name,
              email: data.email,
              first_name: data.first_name,
              last_name: data.last_name,
              user_type: data.user_type,
              token: data.token,
              profile_image: data.profile_image,
            }
          }

          return null
        } catch (e) {
          throw new Error(e.message)
        }
      }
    }),


    // ** ...add more providers here
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     * If you use a custom credentials provider, user accounts will not be persisted in a database by NextAuth.js (even if one is configured).
     * The option to use JSON Web Tokens for session tokens must be enabled to use a custom credentials provider.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 1 * 24 * 60 * 60 // ** 1 day
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/login'
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    /*
     * While using `jwt` as a strategy, `jwt()` callback will be called before
     * the `session()` callback. So we have to add custom parameters in `token`
     * via `jwt()` callback to make them accessible in the `session()` callback
     */
    async jwt({ token, user }) {
      if (user) {


        // console.log('tokenUser', user, token);

        /*
         * For adding custom parameters to user in session, we first need to add those parameters
         * in token which then will be available in the `session()` callback
         */
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.firstName = user.first_name;
        token.lastName = user.last_name;
        token.userId = user.id;
        token.userType = user.user_type;
        token.token = user.token;
        token.profileImage = user.profile_image;
      }

      return token
    },
    async session({ session, token }) {

      // session.user = {
      //   name: token.name,
      //   email: token.email,
      //   firstName: token.firstName,
      //   lastName: token.lastName,
      //   userId: token.userId,
      //   userType: token.userType,
      //   token: token.token,
      // };

      // console.log('session in session', session);

      // return session;

      if (session.user) {
        // ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.userId = token.userId;
        session.user.userType = token.userType;
        session.user.token = token.token;
        session.user.profileImage = token.profileImage;
      }

      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}
