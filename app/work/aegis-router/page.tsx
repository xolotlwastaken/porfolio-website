import type { Metadata } from "next";
import { ProjectRoute, getProjectMetadata } from "@/components/project-route";

export const metadata: Metadata = getProjectMetadata("aegis-router");

export default function AegisRouterPage() {
  return <ProjectRoute slug="aegis-router" />;
}
