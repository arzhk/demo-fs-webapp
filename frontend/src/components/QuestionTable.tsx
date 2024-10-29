import React, { useState } from "react";
import P from "@/components/typography/P";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QuestionFields } from "backend/src/controllers/questions";
import Link from "next/link";
import Tag from "./Tag";

interface QuestionTableProps {
  data: QuestionFields[];
  selected: string[];
  setSelected: (selected: string[]) => void;
}

function QuestionTable(props: QuestionTableProps) {
  const { selected, setSelected } = props;

  const handleSelectAll = () => {
    if (selected.length === props.data.length) {
      setSelected([]);
    } else {
      setSelected(props.data.map((question) => question.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((selectedId) => selectedId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="pl-4">
              <Checkbox onCheckedChange={handleSelectAll} checked={selected.length === props.data.length} />
            </div>
          </TableHead>
          {["Question", "Assigned To", "Status"].map((header) => (
            <TableHead key={header}>
              <P>{header}</P>
            </TableHead>
          ))}
        </TableRow>
        {props?.data?.map((question) => (
          <TableRow key={question._recordId}>
            <TableCell className="min-w-[64px]">
              <div className="pl-4 min-h-[48px] flex items-center">
                <Checkbox onCheckedChange={() => handleSelect(question.id)} checked={selected.includes(question.id)} />
              </div>
            </TableCell>
            <TableCell className="font-medium w-full">
              <Link href={`/${question.id}`}>{question.question}</Link>
            </TableCell>
            <TableCell className="min-w-[200px]">
              {question.assignedTo && <Tag className="bg-accent">{question.assignedTo}</Tag>}
            </TableCell>
            <TableCell className="min-w-[200px]">
              <Tag className={question.answer ? "bg-success" : "bg-destructive"}>
                {question.answer ? "Answered" : "Unanswered"}
              </Tag>
            </TableCell>
          </TableRow>
        ))}
        {props.data.length === 0 && (
          <TableRow>
            <TableCell>
              <P className="min-h-[40px] flex items-center text-blue-200/40">No questions found.</P>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        )}
      </TableHeader>
    </Table>
  );
}

export default QuestionTable;
