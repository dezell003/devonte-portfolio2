/**
 * Case-study data bundle for Solace, consumed by the scrolling
 * case-study layout (`createCaseStudy` in components/home-v2.js).
 *
 * Shape:
 *   phases , ordered chapter list. Each: { slug, code, label, title }
 *   sections, per-slug content (steps, panels, images). Reuses the
 *              existing sections.js so /solace and /solace-v2 stay in sync.
 *   sidebar, { wordmark, meta, nav } for the shared shell sidebar.
 *   title  , visually-hidden <h1> text for the page.
 */
import { sections } from '../sections.js';
import { NAV } from '../site-meta.js';

const META = [
  { label: 'ROLES',    values: ['UI Designer', 'UX Researcher', 'Information Architect'] },
  { label: 'TIMELINE', values: ['8 Weeks'] },
  { label: 'TEAM',     values: ['2 Designers'] },
  { label: 'TOOLS',    values: ['Figma', 'Zoom', 'Google Workspace'] },
];

export default {
  title: 'Solace, Guided Support for Emotional Wellness (scroll layout)',
  header: {
    eyebrow: 'P01 // CASE_STUDY // PRJ.VR-02',
    title: 'SOLACE',
    subtitle: 'Guided support for emotional wellness, turning overwhelmed users into supported ones.',
    context: `
      <p>Solace is a mobile experience that reframes mental-health support around <em>emotion</em> rather than technique. Instead of asking overwhelmed users to browse a library of coping exercises, it guides them from a quick emotional check-in straight to relief.</p>
      <p>The goal was to remove decisions at the exact moment decisions feel hardest. This case study walks through the research, design, testing, and outcomes across an 8-week project.</p>
    `,
    hero: {
      type: 'lottie',
      src: '/assets/solace-hero.json',
      pauseAt: 3,
    },
    outcomes: [
      {
        figure: '~30', unit: 'SEC',
        descriptor: 'From stress to relief',
        implication: 'Faster activation, reduces early-session abandonment risk',
      },
      {
        figure: '5', unit: '/5',
        descriptor: 'Reached a relief technique within 10s in testing',
        implication: 'Low-friction entry, favorable retention signal at this stage',
      },
      {
        figure: '4', unit: '/5',
        descriptor: 'Completed check-in unassisted on first try',
        implication: 'Minimal onboarding cost; supports word-of-mouth growth',
      },
    ],
  },
  phases: [
    { slug: 'research',   code: 'P01_01', label: 'RESEARCH',   title: 'EXPLORING MENTAL HEALTH' },
    { slug: 'design',     code: 'P01_02', label: 'DESIGN',     title: 'CRAFTING THE SOLUTION'   },
    { slug: 'testing',    code: 'P01_03', label: 'TESTING',    title: 'FEEDBACK & REVISION'     },
    { slug: 'next-steps', code: 'P01_04', label: 'NEXT STEPS', title: 'MOVING FORWARD'          },
  ],
  sections,
  sidebar: { wordmark: 'SOLACE', meta: META, nav: NAV },
  prev: { label: 'Santos', href: '#/santos' },
  next: { label: 'Atlas',  href: '#/atlas'  },
};
