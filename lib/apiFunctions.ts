import axios from "axios";

import { FileWithOption } from "@/hooks/useModelStore";

type getUserResponse = {
  success: boolean;
  User: User;
};

type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export const uploadApiFunction = async (
  files: FileWithOption[],
  outputType: string,
  iFiles: FileWithOption[]
) => {
  const formData = new FormData();
  formData.append("output_request", outputType);

  files.forEach((fileObject: FileWithOption, index: number) => {
    formData.append(`file_type${index + 1}`, fileObject.option);
    if (fileObject.file) {
      formData.append(`file${index + 1}`, fileObject.file);
    }
  });

  const {
    data: userData,
  }: {
    data: getUserResponse;
  } = await axios.get("/api/getUser");

  const session_id = userData.User.email + "_" + new Date().getTime();
  formData.append("email_id", userData.User.email ?? "");
  formData.append("user_id", userData.User.email ?? "");
  formData.append("session_id", session_id);

  const response = await axios.post(
    `${process.env.NEXT_NN_WEBSITE_URL}/upload`,
    formData
  );

  const final = {
    success: true,
    data: {
      session_id,
      resp_data: response.data,
    },
  };

  if (response.status !== 200 || !final.success) {
    return {
      success: false,
      data: "Oops! Something didnt work",
    };
  }

  const stage1 = final.data;
  console.log(stage1);
  localStorage.setItem("session_id", stage1.session_id);

  const converse = iFiles.length > 0 ? true : false;

  let existingFiles: string[][] = [];
  let notExist: string[][] = [];

  if (iFiles.length === 0) {
    notExist = stage1.resp_data.file_info;
  } else {
    iFiles.forEach((iFile) => {
      stage1.resp_data.file_info.forEach((fileInfo: string[]) => {
        let filename: string | undefined = iFile.file?.name.replace(/ /g, "_");
        if (fileInfo[0] === iFile.option && fileInfo[1] === filename) {
          existingFiles.push(fileInfo);
        } else {
          notExist.push(fileInfo);
        }
      });
    });
  }

  const stage2input = {
    chosen_file_tuples: existingFiles,
    unchosen_file_tuples: notExist,
    converse: converse,
    session_id: stage1.session_id,
    output_type: outputType,
  };

  const stage2response = await axios.post("/api/chooseRoute", stage2input);
  console.log(stage2response.data.data);
  localStorage.setItem(
    "final_response",
    JSON.stringify({
      success: true,
      session_id: stage1.session_id,
      converse,
      stage1,
      stage2: stage2response.data.data,
    })
  );

  return {
    success: true,
    session_id: stage1.session_id,
    converse,
    stage1,
    stage2: stage2response.data.data,
    next_route: stage2response.data.data.next_route,
  };
};

export const sendMailApi = async () => {
  const storedResponse = localStorage.getItem("final_response");
  const convo_key = parseInt(localStorage.getItem("convo_key") || "0", 10);

  if (!storedResponse) {
    console.log("No data found in localStorage");
    return {
      success: false,
      error: "No data found in localStorage",
    };
  }

  let parsedResp;
  try {
    parsedResp = JSON.parse(storedResponse);
  } catch (error) {
    console.error("Error parsing JSON from localStorage:", error);
    return {
      success: false,
      error: "Invalid data in localStorage",
    };
  }

  if (!parsedResp.session_id || !parsedResp.stage2) {
    console.error("Missing required data in parsed response");
    return {
      success: false,
      error: "Incomplete data in localStorage",
    };
  }

  let body: {
    session_id: string;
    converse: boolean;
    moreinfo_data: any;
    convo_key?: Number;
  } = {
    session_id: parsedResp.session_id,
    converse: parsedResp.converse,
    moreinfo_data: parsedResp.stage2,
  };

  if (parsedResp.converse) {
    body.convo_key = 1;
  }

  try {
    const response: any = await axios.post("/api/outputRoute", body);
    localStorage.clear();
    return {
      success: true,
      respdata: response.data,
    };
  } catch (error) {
    console.error("Error sending mail:", error);
    return {
      success: false,
      error: "Failed to send mail",
    };
  }
};

export const chatGenerate = async (
  initCall: boolean,
  convo_key?: string,
  history_path?: string,
  message?: string
) => {
  const storageResp = localStorage.getItem("final_response");
  const parsedResp = storageResp ? JSON.parse(storageResp) : {};

  let body = {};

  if (initCall) {
    body = {
      session_id: parsedResp.session_id,
      convo_moreinfo_data: parsedResp.stage2,
      initial_call: true,
    };
  } else {
    body = {
      session_id: parsedResp.session_id,
      convo_key: convo_key,
      history_path: history_path,
      message: message,
    };
  }

  try {
    const response = await axios.post("/api/chatRoute", body, {
      timeout: 120000,
      timeoutErrorMessage: "Request timed out after 2 minutes",
    });
    console.log(response);

    return {
      success: response.data.success,
      data: response.data.data as {
        ai_response: string;
        continue: boolean;
        convo_key: string;
        history_path: string;
      },
      status: response.status,
    };
  } catch (error: any) {
    console.error("Error:", error.message);
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      // Return an appropriate error object for handling in ChatOutput

      //uncomment when migrate to fast api
      //await axios.post("/api/timeoutError", { session_id: parsedResp.session_id });

      return {
        success: false,
        data: {
          ai_response: "The request timed out. Please try again later.",
          continue: false,
          convo_key: "",
          history_path: "",
        },
        status: 408,
      };
    }
    throw error; // Rethrow other errors for further handling
  }
};
