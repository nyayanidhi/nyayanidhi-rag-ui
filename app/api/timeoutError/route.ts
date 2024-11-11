import { NextResponse } from 'next/server';
import { checkUser } from '@/helpers/checkUser';

export async function POST(request: Request) {
    try {
        // Check user authentication

        const { session_id } = await request.json();

        if (!session_id) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        // Call the backend endpoint
        const response = await fetch(`${process.env.NEXT_NN_WEBSITE_URL}/timeout_errors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id }),
        });

        if (!response.ok) {
            throw new Error('Failed to log timeout error');
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error logging timeout:', error);
        return NextResponse.json(
            { error: 'Failed to log timeout error' },
            { status: 500 }
        );
    }
} 