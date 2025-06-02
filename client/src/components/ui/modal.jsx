import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Modal = React.forwardRef(({ 
  className,
  trigger,
  title,
  description,
  children,
  footer,
  ...props 
}, ref) => {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className={cn("sm:max-w-[425px]", className)}>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">
          {children}
        </div>
        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
});
Modal.displayName = "Modal";

const ModalTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      className={cn("", className)}
      {...props}
    >
      {children}
    </Button>
  );
});
ModalTrigger.displayName = "ModalTrigger";

const ModalFooter = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex justify-end gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});
ModalFooter.displayName = "ModalFooter";

export {
  Modal,
  ModalTrigger,
  ModalFooter,
}; 