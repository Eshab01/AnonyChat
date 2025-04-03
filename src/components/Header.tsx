
import { Shield } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-card/50 backdrop-blur-md border-b border-border/50 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-2">
        <Shield className="w-6 h-6 text-anony-primary animate-pulse-slow" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-anony-primary to-anony-accent bg-clip-text text-transparent">
          AnonyChat
        </h1>
      </div>
      <div className="flex items-center">
        <span className="text-xs px-2 py-1 rounded-full bg-anony-success/20 text-anony-success border border-anony-success/30 animate-pulse-slow flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-anony-success mr-1 animate-ping"></span>
          Secure & Anonymous
        </span>
      </div>
    </header>
  );
};

export default Header;
