import type { Metadata } from "next";
import { ProjectRoute, getProjectMetadata } from "@/components/project-route";

export const metadata: Metadata = getProjectMetadata("schedura");

export default function ScheduraPage() {
  return <ProjectRoute slug="schedura" />;
}
