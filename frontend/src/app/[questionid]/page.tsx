"use client";
import ErrorBanner from "@/components/ErrorBanner";
import { useQuestions } from "@/components/QuestionsProvider";
import Tag from "@/components/Tag";
import H1 from "@/components/typography/H1";
import P from "@/components/typography/P";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AssignQuestionsDialog from "@/components/AssignQuestionsDialog";

function QuestionPage() {
  const { questions, refetchQuestions } = useQuestions();
  const { questionid } = useParams();
  const data = questions.find((question) => question.id === questionid);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>(data?.answer || "");

  const handleDeleteQuestion = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${questionid}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/");
        await refetchQuestions();
      } else {
        throw new Error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleAnswerQuestion = async () => {
    try {
      if (isEditing) setIsEditing(false);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${questionid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer,
          answeredBy: "answer@test.com",
          answeredAt: new Date().toISOString(),
          updatedBy: "answer@test.com",
        }),
      });

      if (response.ok) {
        await refetchQuestions();
      } else {
        throw new Error("Failed to answer question");
      }
    } catch (error) {
      console.error("Error answering question:", error);
    }
  };

  if (!data) {
    return (
      <div className="p-10">
        <ErrorBanner message="Question not found" />
      </div>
    );
  }

  return (
    <div className="p-10 flex gap-8">
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-8 w-full basis-4/6">
        <div>
          <H1>{data.question}</H1>
          <P className="text-primary text-sm mt-1">Created {new Date(data.createdAt).toLocaleDateString()}</P>
        </div>
        {!data.answer ? (
          <div className="w-full flex flex-col gap-2">
            <Textarea
              placeholder="Enter Answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  e.preventDefault();
                  handleAnswerQuestion();
                }
              }}
              className="w-full bg-blue-200/5 h-32"
            />
            <Button className="w-fit ml-auto" onMouseDown={handleAnswerQuestion}>
              Submit Answer
            </Button>
          </div>
        ) : !isEditing ? (
          <div className="border p-4 rounded-lg bg-blue-200/5">
            <P className="text-primary font-bold text-sm">Answer:</P>
            <P>{data.answer}</P>
            {data.answeredAt && data.answeredBy && (
              <P className="text-blue-200/40 text-sm border-t mt-4 pt-2">
                Answered at {new Date(data.answeredAt).toLocaleTimeString()} on{" "}
                {new Date(data.answeredAt).toLocaleDateString()} by {data.answeredBy}
              </P>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2">
            <Textarea
              placeholder="Enter Answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full bg-blue-200/5 h-32"
            />
            <Button className="w-fit ml-auto" onMouseDown={handleAnswerQuestion}>
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="p-5 rounded-lg border bg-blue-300/5 text-card-foreground min-w-[200px] basis-2/6 flex flex-col gap-4 h-fit">
        <P className="text-blue-200/40 text-sm border-b pb-4">
          Last updated{" "}
          {data.updatedAt
            ? `${new Date(data.updatedAt).toLocaleDateString()} at ${new Date(
                data.updatedAt
              ).toLocaleTimeString()} by ${data.updatedBy}`
            : "N/A"}
        </P>
        <StatusRow>
          <P className="font-medium">Status:</P>
          <Tag className={cn("text-sm", data.answer ? "bg-success" : "bg-destructive")}>
            {data.answer ? "Answered" : "Unanswered"}
          </Tag>
        </StatusRow>
        <StatusRow>
          <P className="font-medium">Assigned To:</P>
          {data.assignedTo ? <Tag className="bg-accent">{data.assignedTo}</Tag> : <P className="text-sm">Unassigned</P>}
        </StatusRow>
        <div className="flex flex-col gap-2">
          {questionid && (
            <AssignQuestionsDialog
              selectedQuestions={[typeof questionid === "string" ? questionid : questionid[0]]}
              refetchQuestions={refetchQuestions}
              buttonText="Reassign Question"
            />
          )}
          <Button
            variant="outline"
            disabled={!data.answer}
            size="lg"
            onMouseDown={() => {
              setIsEditing(true);
            }}
          >
            Update Answer
          </Button>
          <Button variant="destructive" onClick={handleDeleteQuestion} className="mt-8">
            {isDeleting ? "Deleting..." : "Delete Question"}
          </Button>
        </div>
      </div>
    </div>
  );
}

const StatusRow = (props: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between w-full gap-4">{props.children}</div>
);

export default QuestionPage;
