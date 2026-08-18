import { Check, TriangleAlert } from "lucide-react";
import type * as React from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "@/components/opencode/card";

type FeedbackCardProps = {
  variant: "success" | "warning";
  title: string;
  children: React.ReactNode;
};

export function FeedbackCard({ variant, title, children }: FeedbackCardProps) {
  const accent =
    variant === "success" ? "border-l-success" : "border-l-warning";
  const Icon = variant === "success" ? Check : TriangleAlert;
  const iconColor = variant === "success" ? "text-success" : "text-warning";

  return (
    <Card tone="soft" className={`border-l-4 ${accent}`}>
      <CardHeader className="mb-[8px] flex-row items-center gap-[8px]">
        <Icon className={`size-[16px] ${iconColor}`} aria-hidden />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody className="text-[14px] text-body">{children}</CardBody>
    </Card>
  );
}
