export async function POST(request: Request) {
    const { email, password } = await request.json();
    const baseUrl = process.env.BASE_URL;
   
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
      });
    }
  
    try {
      const response = await fetch(`${baseUrl}/auth/login`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
    
      if (!response.ok) {
        const errorText = await response.text();
        return new Response(JSON.stringify({ error: errorText || 'An error occurred during login' }), {
          status: response.status,
        });
      }
  
      return new Response(JSON.stringify(result), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 500,
      });
    }
  }
 
 