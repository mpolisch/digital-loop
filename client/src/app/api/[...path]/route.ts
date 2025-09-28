import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params;
    const backendPath = path.join("/").replace(/^proxy\//, "");
    const url = `${BACKEND_URL}/api/${backendPath}${req.nextUrl.search}`;
    console.log("Proxying GET to:", url);
    const res = await fetch(url, {
      headers: { "Content-Type": "applicaton/json" },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}

async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params;
    const backendPath = path.join("/").replace(/^proxy\//, "");
    const url = `${BACKEND_URL}/api/${backendPath}${req.nextUrl.search}`;
    console.log(url);

    const body = await req.text();
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}
export { GET, POST };
