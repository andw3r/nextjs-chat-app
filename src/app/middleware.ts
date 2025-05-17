// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

//   if (!token) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/api/friends/:path*", "/api/messages/:path*", "/api/users/:path*", "/api/conversations/:path*"],
// };