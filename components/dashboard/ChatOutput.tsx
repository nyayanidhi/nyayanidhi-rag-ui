import { useEffect, useState } from "react";
import ProgressSteps from "../general/ProgressSteps";
// @ts-ignore
import { Send } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { chatGenerate } from "@/lib/apiFunctions";
import { useProgressStore } from "@/hooks/useModelStore";

type Chat = {
  response: string;
  user: string;
};

const ChatOutput = () => {
  const { increase } = useProgressStore();
  const [inputText, setInputText] = useState<string>("");
  const [sendText, setSendText] = useState<string>("");
  const [chatText, setChatText] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initFlag, setInitFlag] = useState<boolean>(true);
  const [convoKey, setConvoKey] = useState<string>("");
  const [historyPath, setHistoryPath] = useState<string>("");

  useEffect(() => {
    chatCallRun();
  }, []);

  const chatCallRun = async () => {
    setLoading(true);
    if (!initFlag && inputText === "") {
      setLoading(false);
      return;
    }
    if (chatText.length > 0) {
      setSendText(inputText);
      setChatText([...chatText, { response: inputText, user: "user" }]);
      setInputText("");
    }
    const { data, success, status } = await chatGenerate(
      initFlag,
      convoKey,
      historyPath,
      inputText
    );

    if (success) {
      setInitFlag(false);
      setConvoKey(data.convo_key ?? "");
      setHistoryPath(data.history_path);
      if (!data.continue) {
        console.log(data.convo_key);
        localStorage.setItem("convo_key", data.convo_key);
        console.log("Convo key saved to local storage");
        setTimeout(() => {
          increase(25);
          return;
        }, 1000);
      }

      setChatText((prev) => [
        ...prev,
        { response: data.ai_response, user: "AI" },
      ]);
    } else {

      const errorMessage = status === 408
        ? "Our servers are currently busy. Please try again later."
        : "Failed to initialize chat";

      setChatText((prev) => [
        ...prev,
        {
          response: errorMessage,
          user: "AI",
        },
      ]);
    }
    window.scrollTo(0, document.body.scrollHeight);
    setLoading(false);
  };
  return (
    <>
      <ProgressSteps />
      <section className="flex flex-col justify-between h-screen">
        <ChatDisplay chatList={chatText} loading={loading} />
        <footer className="sticky bottom-0 z-10 bg-white border-t border-gray-200 pt-2 pb-3 sm:pt-4 sm:pb-6 dark:bg-slate-900 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative border rounded-md">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="p-4 pb-12 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="Ask me anything..."
              ></textarea>

              <div className="absolute bottom-px inset-x-px p-2 rounded-b-md bg-white dark:bg-slate-900">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-x-1">
                    <button
                      type="button"
                      onClick={chatCallRun}
                      className="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
};

const ChatDisplay = ({
  chatList,
  loading,
}: {
  chatList: Chat[];
  loading: boolean;
}) => {
  if (chatList.length === 0) {
    return <div className="flex items-center">Loading...</div>;
  }

  return (
    <ul className="mt-16 space-y-5">
      {chatList.map((chat, index) => {
        return (
          <>
            <ChatMsg key={index} chat={chat} />
          </>
        );
      })}
      {loading && <div>Loading...</div>}
    </ul>
  );
};

const ChatMsg = ({ chat }: { chat: Chat }) => {
  return (
    <li className="py-2 sm:py-4">
      <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-2xl flex gap-x-2 sm:gap-x-4">
          {chat.user === "AI" && (
            <Avatar className="flex-shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-600">
              <AvatarFallback className="text-sm font-medium leading-none ">
                NN
              </AvatarFallback>
            </Avatar>
          )}

          <div
            className={`grow mt-2 space-y-3 flex ${
              chat.user === "user" && "justify-end"
            }`}
          >
            <p
              className={`text-gray-800 p-2 rounded-b-xl ${
                chat.user === "AI"
                  ? "bg-slate-100 rounded-e-xl"
                  : "bg-blue-500 !text-white rounded-s-xl"
              }`}
            >
              {chat.response}
            </p>
          </div>
          {chat.user === "user" && (
            <Avatar className="flex-shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-600">
              <AvatarFallback className="text-sm font-medium leading-none ">
                U
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </li>
  );
};

export default ChatOutput;
