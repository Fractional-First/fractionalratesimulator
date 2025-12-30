import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeXG4JZ_pS1sWCFHFVsr9Yuam3QOnqeACSmbPL6vwLix1npMw/viewform?embedded=true";

export const FeedbackTab = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Fixed tab on the right side of the screen */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 
                   bg-accent text-accent-foreground 
                   px-1.5 py-4 rounded-l-none rounded-r-md
                   shadow-lg hover:bg-accent/90 
                   transition-colors duration-200
                   [writing-mode:vertical-rl] rotate-180"
        aria-label="Open feedback form"
      >
        <span className="text-sm font-medium">Feedback</span>
      </button>

      {/* Modal with embedded Google Form */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="sm:max-w-[600px] h-[90vh] sm:h-[700px] 
                     max-sm:w-screen max-sm:h-screen max-sm:max-w-none max-sm:rounded-none
                     p-0 gap-0 overflow-hidden [&>button]:hidden"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Share Your Feedback</DialogTitle>
          </DialogHeader>
          
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-3 top-3 z-50 rounded-full bg-white border border-gray-300 shadow-lg p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>

          <iframe
            src={GOOGLE_FORM_URL}
            className="w-full h-full border-0"
            title="Feedback Form"
            loading="lazy"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
