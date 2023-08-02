/* 
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
export const authOptions = {
  providers: [
    CredentialsProvider(
        {async authorize(credentials) {
        try {
          // Fetch user from your database with credentials.name
          const users = await query('SELECT * FROM Users WHERE username = ?', [credentials.name]);
          const user = users[0];
      
          if (user && await bcrypt.compare(credentials.password, user.password)) {
            return user;
          }
        } catch (error) {
          console.error('Error in authorize function', error);
        }
      
        // Return null if validation fails
        return null;
      },}),
  ], 
  
  //3. jwt 써놔야 잘됩니다 + jwt 만료일설정
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30일
  },

  callbacks: {
    //4. jwt 만들 때 실행되는 코드
    //user변수는 DB의 유저정보담겨있고 token.user에 뭐 저장하면 jwt에 들어갑니다.
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = {};
        token.user.userid = user.userid;
        token.user.username = user.username;
      }
      return token;
    }, 
    //5. 유저 세션이 조회될 때 마다 실행되는 코드
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
    adapter: 
  },
  secret: "", 
};
export default NextAuth(authOptions); */
