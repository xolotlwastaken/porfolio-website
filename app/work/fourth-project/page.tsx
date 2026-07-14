import type { Metadata } from "next";
import { ProjectRoute, getProjectMetadata } from "@/components/project-route";

export const metadata: Metadata = getProjectMetadata("fourth-project");

export default function FourthProjectPage() {
  return <ProjectRoute slug="fourth-project" />;
}
