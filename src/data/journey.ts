/**
 * Career journey. Deliberately undated — the sequence is the point, and no
 * dates were provided. `state` drives the visual treatment.
 */

export type JourneyState = 'past' | 'now' | 'next';

export interface JourneyStage {
  marker: string;
  title: string;
  description: string;
  state: JourneyState;
}

export const journey: JourneyStage[] = [
  {
    marker: 'Foundation',
    title: 'BBA',
    description:
      'A business administration degree. Where the habit of understanding a problem as a product — who it’s for, what it’s worth solving — started.',
    state: 'past',
  },
  {
    marker: 'Shift',
    title: 'Web Development',
    description:
      'Moved deliberately into building for the web: HTML, CSS, JavaScript and React, and the discipline of making interfaces that actually work.',
    state: 'past',
  },
  {
    marker: 'Depth',
    title: 'Full-Stack Development',
    description:
      'Extended into the back end — Node.js, APIs, databases, auth and deployment — so an idea could become a complete, running application.',
    state: 'past',
  },
  {
    marker: 'Focus',
    title: 'AI / GenAI',
    description:
      'Went deep on generative AI: the OpenAI APIs and Claude, structured outputs, prompt and system design, and the failure modes that come with models.',
    state: 'past',
  },
  {
    marker: 'Now',
    title: 'AI Engineering',
    description:
      'Building AI-powered products end to end with an AI-first workflow — structured generation, guardrails, tested critical paths, real deployment.',
    state: 'now',
  },
  {
    marker: 'Next',
    title: 'Agentic AI',
    description:
      'Designing tool-calling agents and automated workflows that plan and act — with the same emphasis on scoping, safety and evaluation.',
    state: 'next',
  },
];
