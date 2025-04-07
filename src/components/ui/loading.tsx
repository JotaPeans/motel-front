import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// interface LoadingProps extends HTMLAttributes<HTMLSpanElement> {}

const Loading = ({ ...rest }: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <div
      className={cn(
        rest.className,
        "w-4 h-4 border-4 border-t-transparent rounded-full animate-spin"
      )}
    ></div>
  );
};

export default Loading;
