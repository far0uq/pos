import { createAuthOptions } from "./options";

const handler = NextAuth(createAuthOptions);

export { handler as GET, handler as POST };
