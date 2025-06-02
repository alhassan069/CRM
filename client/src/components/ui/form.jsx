import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Form = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <form
      ref={ref}
      className={cn("space-y-6", className)}
      {...props}
    />
  );
});
Form.displayName = "Form";

const FormField = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    />
  );
});
FormField.displayName = "FormField";

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      className={cn("w-full", className)}
      {...props}
    />
  );
});
FormInput.displayName = "FormInput";

const FormTextarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <Textarea
      ref={ref}
      className={cn("w-full", className)}
      {...props}
    />
  );
});
FormTextarea.displayName = "FormTextarea";

const FormSelect = React.forwardRef(({ className, options, ...props }, ref) => {
  return (
    <Select {...props}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});
FormSelect.displayName = "FormSelect";

const FormButton = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn("w-full", className)}
      {...props}
    />
  );
});
FormButton.displayName = "FormButton";

export {
  Form,
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormButton,
}; 