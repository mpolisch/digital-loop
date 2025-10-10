import { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function GET(req: NextRequest) {

    const backendLoginUrl = `${BACKEND_URL}/api/spotify/login`;
  
  // Preserve any query parameters if needed
  const searchParams = req.nextUrl.searchParams;
  const finalUrl = searchParams.toString() 
    ? `${backendLoginUrl}?${searchParams.toString()}`
    : backendLoginUrl;

  // Redirect to backend
  return Response.redirect(finalUrl);
}