import { FileWithOption } from "@/hooks/useModelStore";

export function UploadFormCreate(
  files: FileWithOption[],
  outputSection: string,
  user: any
) {
  const sessionid = user.email + "_" + new Date().getTime();
  const formData = new FormData();

  formData.append("user_id", user.id);
  formData.append("session_id", sessionid);
  formData.append("output_request", outputSection);
  formData.append("email_id", user.email);
  files.forEach((fileObject: FileWithOption, index: number) => {
    formData.append(`file_type${index + 1}`, fileObject.option);
    if (fileObject.file) {
      formData.append(`file${index + 1}`, fileObject.file);
    }
  });

  localStorage.setItem("session_id", sessionid);

  return formData;
}
