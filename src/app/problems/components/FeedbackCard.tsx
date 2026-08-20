import { Check, Info, TriangleAlert } from "lucide-react";
import type * as React from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "@/components/opencode/card";

type FeedbackCardVariant = "success" | "warning" | "neutral";

type FeedbackCardProps = {
  variant: FeedbackCardVariant;
  title: string;
  children: React.ReactNode;
};

const ACCENT_BY_VARIANT: Record<FeedbackCardVariant, string> = {
  success: "border-l-success",
  warning: "border-l-warning",
  neutral: "border-l-hairline-strong",
};

const ICON_COLOR_BY_VARIANT: Record<FeedbackCardVariant, string> = {
  success: "text-success",
  warning: "text-warning",
  neutral: "text-mute",
};

const ICON_BY_VARIANT: Record<FeedbackCardVariant, typeof Check> = {
  success: Check,
  warning: TriangleAlert,
  neutral: Info,
};

export function FeedbackCard({ variant, title, children }: FeedbackCardProps) {
  const accent = ACCENT_BY_VARIANT[variant];
  const iconColor = ICON_COLOR_BY_VARIANT[variant];
  const Icon = ICON_BY_VARIANT[variant];

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
