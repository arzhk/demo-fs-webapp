import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CreateQuestionDialog({ refetchQuestions }: { refetchQuestions: () => Promise<void> }) {
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleNewQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuestion(e.target.value);
  };

  const handleCreateQuestion = async () => {
    try {
      if (isCreating) return;
      if (!newQuestion) return;
      if (newQuestion.length < 10) return;

      setIsCreating(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: newQuestion,
          createdBy: "testuser@test.com",
        }),
      });

      if (response.ok) {
        await refetchQuestions();
      }
    } catch (e) {
      console.log(e);
      alert("An error occurred when creating the question. Please try again.");
    } finally {
      setNewQuestion("");
      setIsOpen(false);
      setIsCreating(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="success" size="lg" onClick={() => setIsOpen(true)}>
          <FaPlus /> Create Question
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Question</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter your question..."
          value={newQuestion}
          onChange={handleNewQuestionChange}
          className="bg-blue-200/5 h-10"
          onKeyDown={(e) => e.key === "Enter" && handleCreateQuestion()}
        />
        <DialogFooter>
          <Button variant="success" size="lg" onClick={handleCreateQuestion}>
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateQuestionDialog;
