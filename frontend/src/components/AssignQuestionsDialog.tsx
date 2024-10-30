import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AssignQuestionsDialog({
  selectedQuestions,
  refetchQuestions,
  buttonText,
}: {
  selectedQuestions: string[];
  refetchQuestions: () => Promise<void>;
  buttonText?: string;
}) {
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleAssignedToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignedTo(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      if (isUpdating) return;
      if (!assignedTo) return;

      setIsUpdating(true);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(assignedTo)) {
        alert("Please enter a valid email address.");
        setAssignedTo("");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionIds: selectedQuestions, assignedTo }),
      });

      if (response.ok) {
        await refetchQuestions();
      }
    } catch (e) {
      console.log(e);
      alert("An error occurred. Please try again.");
    } finally {
      setAssignedTo("");
      setIsOpen(false);
      setIsUpdating(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={selectedQuestions.length === 0}
          variant="outline"
          size="lg"
          className="px-4 bg-blue-200/5"
          onClick={() => setIsOpen(true)}
        >
          {buttonText ?? `Assign Question${selectedQuestions.length > 1 ? "s" : ""}`}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Question</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Assign to..."
          value={assignedTo}
          onChange={handleAssignedToChange}
          className="bg-blue-200/5 h-10"
          onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
        />
        <DialogFooter>
          <Button variant="success" size="lg" onClick={handleUpdate}>
            {isUpdating ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AssignQuestionsDialog;
