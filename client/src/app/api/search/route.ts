import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function GET(req: NextRequest) {

  const q = req.nextUrl.searchParams.get("q")?.trim();
  const type = req.nextUrl.searchParams.get("type")?.trim();

  if (!q || !type) {
    return NextResponse.json(
      {error: 'Both query & type parameters are required.'},
      {status: 400}
    );
  }
  
  try {    
    const url = `${BACKEND_URL}/api/spotify/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}`;
    console.log("Searching via backend: ", url);
    
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    
    const data = await res.json();
    const allowedStatus = [200, 400, 404];
    if (allowedStatus.includes(res.status)) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
    }
  
  } catch (err) {
  
    console.error("Search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  
  }
}