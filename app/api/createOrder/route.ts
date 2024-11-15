import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan_id, user_email } = body;

    // Call your backend API
    console.log("request body");
    console.log(body);

    const response = await fetch(`${process.env.NEXT_NN_WEBSITE_URL}/api/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to create order');
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}