import { NextResponse } from 'next/server';

const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { firstName, lastName, email, password, role } = data;
        if (!firstName || !lastName || !email || !password || !role ) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }
        const response = await fetch(`${baseUrl}/api/register/`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                role,
                
                
            })
        });
        const result = await response.json();
        if (!response.ok) {
            return NextResponse.json({ error: result.detail || 'Registration failed' }, { status: response.status });
        }
        return NextResponse.json(result, { status: 201, statusText: "Registration Successful" });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

