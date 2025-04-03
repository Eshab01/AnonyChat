
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const EncryptionIndicator = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="fixed bottom-4 left-4 bg-card/80 backdrop-blur-sm text-xs px-3 py-1 rounded-full border border-anony-success/30 flex items-center space-x-1 cursor-help transition-all hover:bg-card/90 hover:shadow-md hover:shadow-anony-success/10">
          <Lock className="h-3 w-3 text-anony-success animate-pulse-slow" />
          <span className="text-anony-success">End-to-End Encrypted</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-card/90 backdrop-blur-md shadow-xl">
        <p className="max-w-xs">
          Your messages are secured with end-to-end encryption. 
          Only you and your chat partner can read them.
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default EncryptionIndicator;
