import { NextResponse } from 'next/server';
const baseURL = process.env.BASE_URL

export async function GET() {
  try {
    const response = await fetch(`${baseURL}/api/users/`);
    const users = await response.json();

    const filteredUsers = users.filter(
      (user: { first_name: string; last_name: string }) => user.first_name && user.last_name
    );

    return NextResponse.json({ users: filteredUsers });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching users' + (error as Error).message}, { status: 500 });
  }
}
