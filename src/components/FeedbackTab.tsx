import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
                   px-2 py-4 rounded-l-md rounded-r-none
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
          <DialogHeader className="p-4 pb-2 border-b">
            <DialogTitle className="text-lg font-semibold">
              Share Your Feedback
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
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
