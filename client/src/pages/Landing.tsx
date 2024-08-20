import React, { useState } from "react";
import { Button } from "../components/ui/button";
import LoginRegister from "./LoginRegister";

const Landing: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      {!showAuth ? (
        <>
          <h1 className="text-4xl font-bold mb-4 text-foreground">Welcome to TaskMaster</h1>
          <p className="text-xl mb-8 text-foreground">
            Organize your tasks, boost your productivity!
          </p>
          <Button
            onClick={() => setShowAuth(true)}
            className="font-bold py-2 px-4 rounded transition duration-300"
          >
            Get Started
          </Button>
        </>
      ) : (
        <LoginRegister />
      )}
    </div>
  );
};

export default Landing;
