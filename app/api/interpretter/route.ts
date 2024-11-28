import { NextResponse } from 'next/server';
import getServerUser from "@/helpers/getServerUser";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await getServerUser();

    if (!user) {
      return NextResponse.redirect("/login");
    }
    
    const response = await fetch(`${process.env.NEXT_NN_WEBSITE_URL}/api/interpretter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        email: user.email
      })
    });

    if (!response.ok) {
      throw new Error('Backend request failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('Error in interpretter route:', error);
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        {
          success: false,
          data: "Please check your subscription plan",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        data: "Failed to process request. Please try again" 
      },
      { status: error.response?.status || 500 }
    );
  }
}