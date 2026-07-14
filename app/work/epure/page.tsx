import type { Metadata } from "next";
import { ProjectRoute, getProjectMetadata } from "@/components/project-route";

export const metadata: Metadata = getProjectMetadata("epure");

export default function EpurePage() {
  return <ProjectRoute slug="epure" />;
}
