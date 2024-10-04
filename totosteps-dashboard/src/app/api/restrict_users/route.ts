const baseURL = process.env.BASE_URL;

export async function PATCH(request: Request) {
    const requestData = await request.json();
    console.log('Received data:', requestData);

    try {
        const { userId, action } = requestData;

        if (!userId || !action) {
            return new Response(JSON.stringify({ error: 'User ID and action are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (action !== 'restrict' && action !== 'restore') {
            return new Response(JSON.stringify({ error: 'Invalid action. Must be either "restrict" or "restore"' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log(`Performing ${action} action on user:`, userId);

        const response = await fetch(`${baseURL}/api/users/${userId}/${action}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error ${action}ing user:`, response.status, errorText);
            throw new Error(`Failed to ${action} user: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        return new Response(JSON.stringify({ message: `User ${action}ed successfully`, ...result }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(`Error in POST /api/users:`, error);
        return new Response(JSON.stringify({ error: `Failed to perform user action: ${(error as Error).message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}