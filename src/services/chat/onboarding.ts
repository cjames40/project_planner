import type { ProjectType } from '@/domain/types'

const TYPE_CONTEXT: Record<ProjectType, string> = {
  greenfield: `Since this is a **greenfield** project, let's make sure we nail the fundamentals before building. Key areas to think about:
- What problem are we solving, and for whom?
- Who are the key stakeholders and decision-makers?
- What external systems will we need to integrate with?
- Are there regulatory, technical, or organizational constraints?
- What are the biggest risks to delivery?`,

  migration: `**Migration** projects come with unique challenges — we need to keep the lights on while moving. Let's think through:
- What's driving the migration? (Cost, compliance, end-of-life, scale?)
- What systems are being migrated from and to?
- Who are the stakeholders most affected by the transition?
- What are the data migration risks and rollback strategies?
- Are there hard deadlines or compliance constraints?`,

  modernization: `**Modernization** is about improving what exists without starting from scratch. Let's explore:
- What's the current system's biggest pain points?
- Which components are being modernized and which stay as-is?
- Who are the key stakeholders and what do they care about?
- What technical constraints does the existing system impose?
- What's the strangler fig vs. big-bang vs. incremental strategy?`,

  integration: `**Integration** projects live and die by their interfaces. Let's map out:
- What systems need to talk to each other?
- What data flows between them, and in which direction?
- Who owns each system and what are their SLAs?
- Are there data classification or compliance constraints?
- What happens when an integration point goes down?`,

  platform: `**Platform** projects need to serve multiple consumers well. Let's think about:
- Who are the platform's consumers (internal teams, external partners)?
- What capabilities does the platform need to expose?
- What are the non-functional requirements (scale, latency, availability)?
- Are there organizational or regulatory constraints?
- What's the biggest risk to adoption?`,

  other: `Let's start by understanding the project landscape:
- What problem does this project solve?
- Who are the key stakeholders?
- What external systems or dependencies are involved?
- Are there any known constraints or risks?
- What does success look like?`,
}

export function getOnboardingMessage(projectName: string, projectType: ProjectType, description: string): string {
  return `Welcome! I'm here to help you plan **${projectName}**.

${TYPE_CONTEXT[projectType]}

You mentioned: *"${description}"*

Let's start building out your plan. Tell me more about the project — what's the context, who's involved, and what concerns are top of mind? I'll capture scope items, stakeholders, risks, constraints, and integration points as we go.`
}
