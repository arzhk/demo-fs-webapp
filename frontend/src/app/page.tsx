import H1 from "@/components/typography/H1";
import P from "@/components/typography/P";
import { Button } from "@/components/ui/button";
import { FaHouse, FaPlus } from "react-icons/fa6";

export default function Home() {
  return (
    <>
      <div className="p-10 flex flex-col gap-8">
        <H1>CAIQ</H1>
        <div className="w-full border-t border-secondary px-6 py-5 flex items-center justify-between">
          <Button variant="success" size="lg">
            <FaPlus /> Create Question
          </Button>
        </div>
      </div>
    </>
  );
}
