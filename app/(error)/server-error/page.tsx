import React from "react";

const ServerError = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="block text-7xl font-bold text-rose-500 sm:text-9xl dark:text-white">
          500
        </h1>
        <h1 className="block text-2xl font-bold text-white"></h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Oops, something went wrong.
        </p>
      </div>
    </div>
  );
};

export default ServerError;
