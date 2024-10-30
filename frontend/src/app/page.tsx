"use client";
import H1 from "@/components/typography/H1";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useQuestions } from "@/components/QuestionsProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QuestionTable from "@/components/QuestionTable";
import { useEffect, useState } from "react";
import AssignQuestionsDialog from "@/components/AssignQuestionsDialog";
import CreateQuestionDialog from "@/components/CreateQuestionDialog";

export default function Home() {
  const { questions, refetchQuestions, searchQuestions } = useQuestions();
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [selectedAssignee, setSelectedAssignee] = useState<string | undefined>(undefined);
  const assignees = Array.from(
    new Set(questions.filter((question) => question.assignedTo).map((question) => question.assignedTo))
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    setSelected([]);
  }, [questions]);

  console.log("selectedAssignee", selectedAssignee);

  return (
    <>
      <div className="p-10 flex flex-col gap-8">
        <H1>CAIQ</H1>
        <div className="w-full border-t border-secondary pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (searchTerm.length > 0) {
                      searchQuestions(searchTerm);
                    } else {
                      refetchQuestions();
                    }
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
            <Select
              onValueChange={(assignee) => setSelectedAssignee(assignee === "all" ? undefined : assignee)}
              defaultValue={selectedAssignee}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All assignees</SelectItem>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee} value={assignee ?? ""}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <AssignQuestionsDialog selectedQuestions={selected} refetchQuestions={refetchQuestions} />
            <CreateQuestionDialog refetchQuestions={refetchQuestions} />
          </div>
        </div>
        <QuestionTable
          data={selectedAssignee ? questions.filter((question) => question.assignedTo === selectedAssignee) : questions}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </>
  );
}
