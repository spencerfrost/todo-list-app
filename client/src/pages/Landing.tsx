import React, { useState } from "react";
import LoginRegister from "./LoginRegister";

const Landing: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      {!showAuth ? (
        <>
          <h1 className="text-4xl font-bold mb-4">Welcome to TaskMaster</h1>
          <p className="text-xl mb-8">
            Organize your tasks, boost your productivity!
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Get Started
          </button>
        </>
      ) : (
        <LoginRegister />
      )}
    </div>
  );
};

export default Landing;
