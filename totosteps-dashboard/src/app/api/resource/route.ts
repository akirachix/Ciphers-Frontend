import { NextResponse } from 'next/server';
const baseURL = process.env.BASE_URL

export async function GET() {
  try {
    const response = await fetch(`${baseURL}/api/resources/`);
    const resources = await response.json();

    return NextResponse.json({ resources });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching resources'+ (error as Error).message }, { status: 500 });
  }
}
