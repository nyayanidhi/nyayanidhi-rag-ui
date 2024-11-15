import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("verify payment body");
    console.log(body);
    // Call your backend API
    const response = await fetch(`${process.env.NEXT_NN_WEBSITE_URL}/api/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Payment verification failed');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}