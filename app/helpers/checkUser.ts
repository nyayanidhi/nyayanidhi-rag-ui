import axios, { AxiosError } from "axios";
import getServerUser from "./getServerUser";


interface ApiResponse {
  success: boolean;
  data: any;
  message?: string;
  statusCode?: number;
}

interface ServerResponse {
  message?: string;
  [key: string]: any;
}

export async function checkUser(emailId: string): Promise<ApiResponse> {
  try {
    const user = await getServerUser();
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Unauthorized: User not authenticated",
        statusCode: 401
      };
    }

    if (!emailId) {
      return {
        success: false,
        data: null,
        message: "Email ID is required",
        statusCode: 400
      };
    }

    if (!process.env.NEXT_NN_WEBSITE_URL) {
      return {
        success: false,
        data: null,
        message: "API URL is not configured",
        statusCode: 500
      };
    }

    const response = await axios.post<ServerResponse>(
      `${process.env.NEXT_NN_WEBSITE_URL}/newuser`,
      JSON.stringify({ 
        email_id: emailId,
        user_id: user.id,
        user_email: user.email
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data,
        statusCode: response.status
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || "Unexpected response from server",
      statusCode: response.status
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ServerResponse>;
      
      switch (axiosError.response?.status) {
        case 400:
          return {
            success: false,
            data: null,
            message: "Invalid email format or missing required fields",
            statusCode: 400
          };
        case 401:
          return {
            success: false,
            data: null,
            message: "Unauthorized access",
            statusCode: 401
          };
        case 403:
          return {
            success: false,
            data: null,
            message: "Access forbidden",
            statusCode: 403
          };
        case 404:
          return {
            success: false,
            data: null,
            message: "User not found",
            statusCode: 404
          };
        case 409:
          return {
            success: false,
            data: null,
            message: "User already exists",
            statusCode: 409
          };
        case 429:
          return {
            success: false,
            data: null,
            message: "Too many requests. Please try again later",
            statusCode: 429
          };
        case 500:
          return {
            success: false,
            data: null,
            message: "Internal server error",
            statusCode: 500
          };
        default:
          return {
            success: false,
            data: null,
            message: axiosError.response?.data?.message || "An unexpected error occurred",
            statusCode: axiosError.response?.status || 500
          };
      }
    }

    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
      statusCode: 500
    };
  }
}
