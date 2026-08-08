import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Card className="w-[500px] text-center space-y-6">
        <h1 className="text-4xl font-bold">
          AI Mock Interview Platform
        </h1>

        <p className="text-gray-500">
          Practice interviews with AI and improve your skills.
        </p>

        <Button>
          Get Started
        </Button>
      </Card>
    </div>
  );
}

export default Home;