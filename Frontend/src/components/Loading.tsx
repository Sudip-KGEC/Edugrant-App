import { Loader2 } from "lucide-react";

const LoadingOverlay = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Processing...</p>
    </div>
  </div>
);

export default LoadingOverlay