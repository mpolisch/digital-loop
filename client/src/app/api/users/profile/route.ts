import { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader) {
    return Response.json({ error: 'Authorization header required' }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return Response.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}