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
          className="sm:max-w-[600px] h-[85vh] sm:h-[600px] 
                     max-sm:w-screen max-sm:h-screen max-sm:max-w-none max-sm:rounded-none
                     p-0 gap-0 overflow-hidden"
        >
          <DialogHeader className="px-4 py-2 border-b">
            <DialogTitle>Share Your Feedback</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <iframe
              src={GOOGLE_FORM_URL}
              className="w-full h-full border-0"
              title="Feedback Form"
              loading="lazy"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
