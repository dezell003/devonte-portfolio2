/**
 * Section content for each phase of the case study.
 *
 * Route → /:slug/:step  (1-indexed step)
 *   research    → P01_01
 *   design      → P01_02
 *   testing     → P01_03
 *   next-steps  → P01_04
 *
 * A step may declare:
 *   image / imageAlt              — single image
 *   variants / defaultVariant /
 *     variantControl              — multiple swappable images with a
 *                                   selector (TogglePills | CarouselDots | TabStrip)
 *   panel.body                    — narrative HTML
 *   panel.callouts                — emphasized list items (optional warning variant)
 *   panel.meta                    — small methodology strip at the bottom
 *
 * Drop matching .webp files into /public/assets/.
 */
export const sections = {
  // ──────────────────────────────────────────────────────────
  // P01_01 — RESEARCH
  // ──────────────────────────────────────────────────────────
  research: {
    label: 'P01_01 // RESEARCH',
    phaseTitle: 'EXPLORING MENTAL HEALTH',
    summary: 'User interviews on how people choose coping techniques under stress — and why most apps overwhelm them.',
    tradeoff: {
      considered: 'Building a richer technique library with smarter filters',
      chose: 'Reframing the entry point from technique-first to emotion-first',
      cut: 'Catalog browsing UI; deferred until trust in the guided flow is proven',
    },
    steps: [
      // Step 1 — Too many options
      {
        image: '/assets/too-many-options.webp',
        lottie: '/assets/too-many-options.json',
        imageAlt:
          'Comparison of Headspace, Calm, and How We Feel mobile apps showing dense feature menus',
        panel: {
          title: 'WHEN STRESS HITS, CHOICE BECOMES FRICTION',
          body: `
            <p>Most mental health apps start by offering a wide range of techniques.</p>
            <p>At first, that seems like the right approach. More options should mean better support.</p>
            <p>But in practice, it creates friction.</p>
            <p>When users are overwhelmed, even small decisions feel heavy. Asking them to choose from a list of techniques adds pressure at the exact moment they&rsquo;re already struggling.</p>
            <p>I had to rethink what &ldquo;helpful&rdquo; actually meant in this context.</p>
          `,
          callouts: [
            { body: 'How might we guide users from emotional awareness to meaningful relief?' },
          ],
        },
      },

      // Step 2 — Pattern in interviews
      {
        image: '/assets/pattern-in-interviews.webp',
        imageAlt:
          'Diagram showing user quotes about emotional awareness leading to a "breakdown" moment, branching into questions about what to do next',
        panel: {
          title: 'THE PATTERN HIDDEN IN EVERY INTERVIEW',
          body: `
            <p>Across interviews, one pattern kept showing up.</p>
            <p>Users often know they need help in the moment, but struggle to translate their feelings into actions.</p>
            <p>Users didn&rsquo;t want to search for solutions while stressed. They wanted guidance.</p>
            <p>That told me this wasn&rsquo;t a discovery problem. It was a decision problem under emotional strain.</p>
          `,
          meta: [
            { label: 'Methods', body: 'User Interviews &amp; Lightweight Surveys' },
            { label: 'Participants', body: '5 individuals actively managing stress, anxiety, or burnout' },
            { label: 'Focus', body: 'How users identified emotions and chose successful coping strategies' },
          ],
        },
      },

      // Step 3 — Emotion first
      {
        image: '/assets/emotion-first.webp',
        imageAlt:
          'Decision tree comparing a technique-first approach (overwhelming) against an emotion-first approach (guided relief)',
        panel: {
          title: 'WHAT IF RELIEF STARTED WITH EMOTION?',
          body: `
            <p>At this point, I had to make a choice.</p>
            <p>I could improve how techniques were organized &mdash; or I could change where the experience began.</p>
            <p>I chose to shift the starting point.</p>
            <p>This reframed the product from a tool library into a guided support experience.</p>
            <p>While this meant reducing user control, it also meant reducing cognitive load.</p>
            <p>In this context, I believed guidance would be more valuable than freedom.</p>
          `,
          callouts: [
            { label: 'Instead of asking', body: '&ldquo;Which exercise do you want?&rdquo;' },
            { label: 'Solace needed to ask', body: '&ldquo;How are you feeling right now?&rdquo;' },
          ],
        },
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // P01_02 — DESIGN
  // ──────────────────────────────────────────────────────────
  design: {
    label: 'P01_02 // DESIGN',
    phaseTitle: 'CRAFTING THE SOLUTION',
    summary: 'Designing an emotion-first flow that reduces decision overhead in the moment of need.',
    tradeoff: {
      considered: 'Power-user discovery: branching paths, custom playlists, filters',
      chose: 'A single guided check-in → recommend → guide flow with limited branching',
      cut: 'Custom playlist creation and filter UI; revisited as v2 scope after retention validation',
    },
    steps: [
      // Step 1 — Tension between guidance and control
      {
        image: '/assets/tension-guidance-control.webp',
        imageAlt:
          'Three columns showing "too little guidance" (chaos), "balanced" (guided path with optional flexibility), and "too much guidance" (rigid forced path)',
        panel: {
          title: 'THE TENSION BETWEEN GUIDANCE AND CONTROL',
          body: `
            <p>Once I committed to an emotion-first approach, a new challenge surfaced.</p>
            <p>How much should the system guide the user?</p>
            <p>Too much guidance feels restrictive. Too little leaves users overwhelmed.</p>
            <p>I explored both extremes. One version gave users too many branching paths. Another pushed them through a rigid flow.</p>
            <p>Neither worked. The right solution had to sit somewhere in between.</p>
          `,
          callouts: [
            { body: 'How much should the system guide the user?' },
          ],
        },
      },

      // Step 2 — Experience flow
      {
        image: '/assets/experience-flow.webp',
        lottie: '/assets/experience-flow.json',
        imageAlt:
          'Flowchart of the Solace experience: Start → Check-in form → Check-in complete → Personalized recommendations → branching into Physical Movement, Breathing, or Mindfulness Techniques → Technique complete',
        panel: {
          title: 'TURNING EMOTION INTO ACTION',
          body: `
            <p>The experience became a structured flow:<br>Check-in &rarr; Clarify &rarr; Recommend &rarr; Guide</p>
            <p>I approached this by simplifying how decisions are presented, not by removing them entirely.</p>
            <p>Instead of exposing everything at once, I staged decisions across steps. This allowed me to guide users while still giving them a sense of control.</p>
            <p>The goal wasn&rsquo;t to eliminate choice. It was to make each choice feel manageable.</p>
          `,
          callouts: [
            { body: 'Check-in &rarr; Clarify &rarr; Recommend &rarr; Guide' },
          ],
        },
      },

      // Step 3 — From concept to interaction (variants: wireframes ↔ prototype)
      {
        panel: {
          title: 'FROM CONCEPT TO INTERACTION',
          body: `
            <p>Moving into wireframes and prototyping, I made a deliberate constraint:</p>
            <p>I avoided adding extra features or visual noise. Every screen needed to answer one question clearly:<br>&ldquo;What should the user do next?&rdquo;</p>
            <p>This meant cutting ideas that didn&rsquo;t directly support the core flow.</p>
            <p>The result was a more focused experience, even if it meant doing less overall.</p>
          `,
          callouts: [
            { body: 'Prioritize clarity over complexity.' },
          ],
        },
        defaultVariant: 'wireframes',
        variantControl: 'TogglePills',
        variants: [
          {
            id: 'wireframes',
            label: 'Wireframes',
            image: '/assets/from-concept-to-interaction1.webp',
            imageAlt:
              'Five low-fidelity wireframe screens showing the check-in flow from welcome through technique completion',
          },
          {
            id: 'prototype',
            label: 'Prototype',
            image: '/assets/from-concept-to-interaction2.webp',
            imageAlt:
              'The same five screens rendered as a high-fidelity prototype with the Solace visual design',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // P01_03 — TESTING
  // ──────────────────────────────────────────────────────────
  testing: {
    label: 'P01_03 // TESTING',
    phaseTitle: 'FEEDBACK & REVISION',
    summary: 'Five usability tests surfaced four targeted improvements — each tightening clarity without adding complexity.',
    tradeoff: {
      considered: 'A/B testing the emotion-first flow against a free-browse baseline',
      chose: 'Moderated qualitative testing with 5 participants for directional signal',
      cut: 'Quantitative comparison; sample too small to be meaningful at this stage',
    },
    steps: [
      // Step 1 — Reality check (variants: 3 screens via CarouselDots)
      {
        panel: {
          title: 'REALITY CHECK',
          body: '',
          callouts: [
            { label: 'Real User Support',          body: '100% of users found perceived benefits from relief techniques' },
            { label: 'Quick Access to Techniques', body: '100% of users successfully navigated to relief techniques within 10 seconds' },
            { label: 'Intuitive Check-in Flow',    body: '4/5 users completed the check-in process without assistance' },
            { label: 'Accessibility', variant: 'warning', body: '3/5 users struggled with button and text size' },
          ],
          meta: [
            { label: 'Methods',      body: 'Moderated remote usability tests' },
            { label: 'Participants', body: '5 users with varying levels of mental health app experience' },
            { label: 'Focus',        body: 'Validating the key flow and navigation' },
          ],
        },
        defaultVariant: 'screen-1',
        variantControl: 'CarouselDots',
        variants: [
          {
            id: 'screen-1',
            label: 'Screen 1',
            image: '/assets/reality-check1.webp',
            imageAlt: 'Solace Emotional Symptoms screen with usability test questions and validation notes',
          },
          {
            id: 'screen-2',
            label: 'Screen 2',
            image: '/assets/reality-check2.webp',
            imageAlt: 'Solace Body Scan screen with usability test questions about first-time use',
          },
          {
            id: 'screen-3',
            label: 'Screen 3',
            image: '/assets/reality-check3.webp',
            imageAlt: 'Solace Relief Technique Menu with usability test questions about technique selection',
          },
        ],
      },

      // Step 2 — Designing through feedback (variants: 4 changes via TabStrip)
      {
        panel: {
          title: 'DESIGNING THROUGH FEEDBACK',
          body: `
            <p>Testing confirmed the core direction, but it also showed where the experience needed more support. I focused the next round of revisions on strengthening clarity and trust without adding complexity.</p>
            <p>I introduced small but meaningful changes:</p>
            <p>These adjustments helped the experience feel less like a tool and more like guidance.</p>
          `,
          callouts: [
            { label: 'Navigation Improvements', body: 'Clarified next steps between screens' },
            { label: 'Expanded Symptoms',       body: 'Reduced uncertainty during check-in' },
            { label: 'Reinforced Support',      body: 'Increased trust during check-in' },
            { label: 'Strengthened Visuals',    body: 'Made system feedback more explicit' },
          ],
        },
        defaultVariant: 'navigation',
        variantControl: 'TabStrip',
        variants: [
          {
            id: 'navigation',
            label: 'Navigation',
            image: '/assets/designing-through-feedback1.webp',
            imageAlt:
              'Before/after comparison showing the navigation improvement — adding a primary Next button to clarify next steps',
          },
          {
            id: 'symptoms',
            label: 'Symptoms',
            image: '/assets/designing-through-feedback2.webp',
            imageAlt:
              'Before/after comparison showing additional symptoms (Numbness, Anxiety, Irritability) added to the Emotional Symptoms screen',
          },
          {
            id: 'support',
            label: 'Support',
            image: '/assets/designing-through-feedback3.webp',
            imageAlt:
              'Before/after comparison showing reassuring copy ("Let\'s tackle your mental health together") added to the check-in complete screen',
          },
          {
            id: 'visuals',
            label: 'Visuals',
            image: '/assets/designing-through-feedback4.webp',
            imageAlt:
              'Before/after comparison showing the Movement Techniques screen with strengthened visual hierarchy and a background illustration',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // P01_04 — NEXT STEPS
  // ──────────────────────────────────────────────────────────
  'next-steps': {
    label: 'P01_04 // NEXT STEPS',
    phaseTitle: 'MOVING FORWARD',
    summary: 'Outcomes, lessons, and what the next iteration of Solace would look like.',
    tradeoff: {
      considered: 'Layering in social and community features to drive engagement',
      chose: 'Doubling down on the emotion-first signal and personalization depth',
      cut: 'Community/sharing — would dilute the calm, supportive register the brand depends on',
    },
    steps: [
      // Step 1 — A calmer path to support
      {
        image: '/assets/calmer-path.webp',
        imageAlt: 'A person holds a phone displaying the Solace welcome screen',
        panel: {
          title: 'A CALMER PATH TO SUPPORT',
          body: `
            <p>Solace shifted the experience from browsing to guidance.</p>
            <p>Users no longer had to interpret their emotions and search for solutions at the same time. The system helped bridge that gap.</p>
            <p>The result is a more direct path from stress to relief:</p>
          `,
          callouts: [
            { body: 'Made managing mental health feel more personal and supportive, not clinical or overwhelming' },
            { body: 'Helped users reach relevant support in ~30 seconds' },
            { body: 'Reduced cognitive load during stressful moments by shifting the experience from exploration to guidance' },
          ],
        },
      },

      // Step 2 — Designing for human moments
      {
        image: '/assets/designing-for-human-moments.webp',
        lottie: '/assets/designing-for-human-moments.json',
        lottieLoop: true,
        imageAlt:
          'Three Solace mobile screens shown in 3D perspective: Mood Check, Emotional Symptoms, and Physical Symptoms',
        panel: {
          title: 'DESIGNING FOR HUMAN MOMENTS',
          body: `
            <p>This project changed how I think about UX.</p>
            <p>People don&rsquo;t interact with products in ideal conditions. They interact when they&rsquo;re distracted, overwhelmed, or unsure.</p>
            <p>In those moments, too much choice becomes a burden.</p>
            <p>Design isn&rsquo;t just about giving users control.</p>
            <p>Sometimes it&rsquo;s about recognizing when to take some of that weight off their shoulders.</p>
          `,
        },
      },
    ],
  },
};
