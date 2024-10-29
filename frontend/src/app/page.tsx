"use client";
import H1 from "@/components/typography/H1";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { useQuestions } from "@/components/QuestionsProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

import QuestionTable from "@/components/QuestionTable";
import { useEffect, useState } from "react";

export default function Home() {
  const { questions, refetchQuestions, searchQuestions } = useQuestions();
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    setSelected([]);
  }, [questions]);

  return (
    <>
      <div className="p-10 flex flex-col gap-8">
        <H1>CAIQ</H1>
        <div className="w-full border-t border-secondary pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  searchTerm.length > 0 ? searchQuestions(searchTerm) : refetchQuestions();
                }
              }}
              className="h-10 w-fit min-w-[320px] bg-blue-200/5"
            />
            <Button
              type="submit"
              className="h-10"
              onMouseDown={() => (searchTerm.length > 0 ? searchQuestions(searchTerm) : refetchQuestions())}
            >
              <FaMagnifyingGlass />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <AssignQuestionsDialog selectedQuestions={selected} refetchQuestions={refetchQuestions} />
            <CreateQuestionDialog refetchQuestions={refetchQuestions} />
          </div>
        </div>
        <QuestionTable data={questions} selected={selected} setSelected={setSelected} />
      </div>
    </>
  );
}

const CreateQuestionDialog = ({ refetchQuestions }: { refetchQuestions: () => Promise<void> }) => {
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
};

export const AssignQuestionsDialog = ({
  selectedQuestions,
  refetchQuestions,
  buttonText,
}: {
  selectedQuestions: string[];
  refetchQuestions: () => Promise<void>;
  buttonText?: string;
}) => {
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
};
