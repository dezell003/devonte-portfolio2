/**
 * Case-study data bundle for Atlas, a music-discovery project.
 * Consumed by the scrolling case-study layout (`createCaseStudy`).
 *
 * Same shape as case-studies/solace.js:
 *   phases , ordered chapters [{ slug, code, label, title }]
 *   sections, per-slug content { label, phaseTitle, steps[] }
 *   sidebar, { wordmark, meta, nav }
 *   title  , visually-hidden page <h1>
 *
 * Drop matching .webp assets into /public/assets/.
 */
import { NAV } from '../site-meta.js';

const META = [
  { label: 'ROLES',    values: ['UI Designer', 'UX Researcher', 'Information Architect'] },
  { label: 'TIMELINE', values: ['8 Weeks'] },
  { label: 'TEAM',     values: ['2 Designers'] },
  { label: 'TOOLS',    values: ['Figma', 'Zoom', 'Google Workspace'] },
];

const sections = {
  // ──────────────────────────────────────────────────────────
  // P02_01, RESEARCH
  // ──────────────────────────────────────────────────────────
  research: {
    label: 'P02_01 // RESEARCH',
    phaseTitle: 'MEANINGFUL DISCOVERY',
    summary: 'Interviews on how listeners decide what is worth playing, and why fast discovery rarely means confident discovery.',
    steps: [
      // Step 1, Discovery feels fast, but decisions don’t
      {
        image: '/assets/discovery-comparison.webp',
        imageAlt:
          'Comparison labeled “Fast Discovery ≠ Good Discovery”, fast-discovery surfaces (infinite scroll, autoplay playlists, algorithmic feeds, personalized surfaces) paired with their failures (skip within seconds, unclear relevance, distrust recommendations, lose promising tracks later)',
        panel: {
          title: 'DISCOVERY FEELS FAST, BUT DECISIONS DON&rsquo;T',
          body: `
            <p>Streaming platforms make music instantly available. But availability isn&rsquo;t the same as confidence.</p>
            <p>When I spoke with listeners, the friction wasn&rsquo;t finding music, it was deciding whether something was even worth trying before pressing play.</p>
            <p>That pattern wasn&rsquo;t about algorithmic failures, it was about signal failures.</p>
            <p>Even strong recommendations break down if users can&rsquo;t evaluate them well enough to act.</p>
            <p>Atlas started by focusing on one central question:</p>
          `,
          callouts: [
            { body: 'How do we help someone reach a confident first play faster?' },
          ],
        },
      },

      // Step 2, Signals that shaped direction
      {
        image: '/assets/research-signals.webp',
        imageAlt:
          'Insights-to-direction diagram, four research insights (skipping creates fatigue, mood drives discovery entry, discovery windows are short, people trust context not algorithms) each mapped to a design direction',
        panel: {
          title: 'SIGNALS THAT SHAPED DIRECTION',
          body: `
            <p>Early research pointed to something subtle but consistent:</p>
            <p>After talking to listeners, Atlas became less about expanding discovery surfaces and more about strengthening evaluation signals.</p>
            <p>Instead of treating browsing as an exploration space, I began treating it as a decision window.</p>
          `,
          callouts: [
            { body: 'Listeners don&rsquo;t explore randomly, they explore with intent.' },
          ],
          meta: [
            { label: 'Methods', body: 'User Interviews &amp; Lightweight Surveys' },
            { label: 'Participants', body: '5 music lovers varying in depth of discovery' },
            { label: 'Focus', body: 'Understand users&rsquo; discovery methods, goals, &amp; frustrations' },
          ],
        },
      },

      // Step 3, Framing the design strategy
      {
        image: '/assets/design-priorities.webp',
        imageAlt:
          '“Three Priorities That Guided Every Decision”, three columns (Start With Intent, Evaluate Faster, Capture Without Committing) each with supporting bullet points',
        panel: {
          title: 'FRAMING THE DESIGN STRATEGY',
          body: `
            <p>From those signals, I defined three priorities that guided every later decision.</p>
            <p>Moving forward, Atlas became a system designed around confidence before pressing play.</p>
          `,
          callouts: [
            { label: 'Start With Intent', body: 'Give users direction before they see content.' },
            { label: 'Evaluate Faster', body: 'Expose key musical moments (intro, verse, chorus, etc.), allowing users to preview the right moment sooner.' },
            { label: 'Capture Without Commitment', body: 'Allow listeners to collect possibilities before deciding what stayed, reducing pressure during discovery and making exploration feel controllable.' },
          ],
        },
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // P02_02, DESIGN
  // ──────────────────────────────────────────────────────────
  design: {
    label: 'P02_02 // DESIGN',
    phaseTitle: 'CRAFTING CONFIDENCE',
    summary: 'Reframing discovery from a browsing surface into a sequence of confident decisions.',
    steps: [
      // Step 1, The discovery model
      {
        image: '/assets/discovery-models.webp',
        imageAlt:
          '“Discovery Models” comparison of Playlists, Algorithmic feed, and Atlas across what each starts with, how it works, and when it breaks down',
        panel: {
          title: 'THE DISCOVERY MODEL',
          body: `
            <p>Most streaming apps start with playlists, feeds, or a search. Atlas starts with:</p>
            <p>Playlists reduce effort by letting users choose containers instead of individual tracks, however this relies heavily on trust in the systems curating them.</p>
            <p>Algorithmic feeds go even further by removing decisions almost entirely. This enables speed but at the cost of transparency.</p>
            <p>When listeners don&rsquo;t understand why recommendations appear or how to adjust them, discovery starts to feel arbitrary, and they fall back on skipping or familiar music.</p>
            <p>Atlas starts earlier in the process by asking context, reducing ambiguity before exploration even begins and shifting discovery from filtering results to setting direction.</p>
          `,
          callouts: [
            { body: '&ldquo;What kind of discovery session are you in?&rdquo;' },
          ],
        },
      },

      // Step 2, Restructuring discovery
      {
        image: '/assets/discovery-flow.webp',
        imageAlt:
          'Side-by-side flow diagrams, Traditional Models (open app to browse feed to skip to browse to maybe play, “hesitation disguised as exploration”) versus the Atlas Model (open app, curiosity, intent, results, test, decide, play, save)',
        panel: {
          title: 'RESTRUCTURING DISCOVERY',
          body: `
            <p>Traditional discovery flows often look like this:<br>browse &rarr; browse &rarr; browse &rarr; &hellip;maybe play</p>
            <p>This works when listeners already trust recommendations. But when they don&rsquo;t, browsing becomes hesitation disguised as exploration.</p>
            <p>Instead, I reframed discovery as a sequence of decisions:</p>
            <p>Most streaming interfaces treat playback as the moment evaluation begins. Atlas treats playback as the moment evaluation ends.</p>
            <p>That shift moves discovery earlier in the interaction.</p>
            <p>Instead of asking users to commit to a full track just to learn whether it fits, Atlas helps them compare options quickly, understand relevance sooner, and decide with less risk.</p>
            <p>This changed what the interface needed to do and made Atlas less about navigating a catalog and more about supporting confident decisions <strong>before</strong> play.</p>
          `,
          callouts: [
            { body: 'Curiosity &rarr; Intent &rarr; Test &rarr; Decide &rarr; Play &rarr; Save' },
          ],
        },
      },

      // Step 3, Interaction that improved confidence (variants: 5 features)
      {
        panel: {
          title: 'INTERACTION THAT IMPROVED CONFIDENCE',
          body: `
            <p>Once discovery became a decision flow, the interface had to help listeners evaluate options quickly.</p>
            <p>These core features were implemented:</p>
            <p>Together, these shift discovery from browsing to confident evaluation.</p>
          `,
          callouts: [
            { label: 'Intent Cards', body: 'Starts discovery with context; reducing ambiguity, preventing aimless browsing, and allowing listeners to steer recommendations from the start.' },
            { label: 'Novelty Controls', body: 'Turning discovery into something adjustable rather than unpredictable, making exploration feel safer without making it repetitive.' },
            { label: 'Highlight Previews', body: 'Shorten the evaluation window and helps listeners decide faster without committing to a full listen.' },
            { label: 'Element Tags', body: 'Surface the musical character of a track at a glance.' },
          ],
        },
        defaultVariant: 'intent-cards',
        variantControl: 'TabStrip',
        variants: [
          { id: 'intent-cards',       label: 'Intent Cards',       image: '/assets/confidence-intent-cards.webp',       imageAlt: 'Atlas Discovery Mode screen with the Intent Cards feature highlighted' },
          { id: 'novelty-slider',     label: 'Novelty Slider',     image: '/assets/confidence-novelty-slider.webp',     imageAlt: 'Atlas Discovery Mode screen with the Familiar,Brand New novelty slider highlighted' },
          { id: 'highlight-previews', label: 'Highlight Previews', image: '/assets/confidence-highlight-previews.webp', imageAlt: 'Atlas Discovery Mode screen with the Highlight Previews feature highlighted' },
          { id: 'element-tags',       label: 'Element Tags',       image: '/assets/confidence-element-tags.webp',       imageAlt: 'Atlas Discovery Mode screen with the Element Tags feature highlighted' },
          { id: 'temporary-save',     label: 'Temporary Save',     image: '/assets/confidence-temporary-save.webp',     imageAlt: 'Atlas Discovery Mode screen with the Temporary Save feature highlighted' },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // P02_03, TESTING
  // ──────────────────────────────────────────────────────────
  testing: {
    label: 'P02_03 // TESTING',
    phaseTitle: 'ACCORDING TO USERS',
    summary: 'Moderated usability tests validated the guided decision flow and surfaced targeted refinements.',
    steps: [
      // Step 1, Can listeners find something worth playing faster? (variants: 3 screens)
      {
        panel: {
          title: 'CAN LISTENERS FIND SOMETHING WORTH PLAYING FASTER?',
          body: `
            <p>Testing Atlas with users gave me key insights on how to move closer towards their goals with music discovery:</p>
          `,
          callouts: [
            { label: 'Intent Cards Reduced Start Friction', body: 'Listeners began discovery sessions faster using intent cards instead of browsing or search.' },
            { label: 'Highlight Previews Accelerated Track Evaluation', body: 'Users preferred jumping directly to key moments rather than scrubbing through full tracks.' },
            { label: 'Tags and Novelty Controls Increased Trust', body: 'Element tags and familiarity tuning clarified why tracks appeared and how recommendations would feel.' },
            { label: 'Preview Labels Needed Stronger Familiarity', variant: 'warning', body: 'Users expected recognizable labels for clear song navigation.' },
          ],
          meta: [
            { label: 'Methods', body: 'Moderated remote usability tests' },
            { label: 'Participants', body: '5 users with varying levels of streaming platform experience' },
            { label: 'Focus', body: 'Validating clarity and confident path to first-play' },
          ],
        },
        defaultVariant: 'screen-1',
        variantControl: 'CarouselDots',
        variants: [
          { id: 'screen-1', label: 'Screen 1', image: '/assets/usability-questions1.webp', imageAlt: 'Atlas Discovery Mode screen annotated with usability-test questions, view 1' },
          { id: 'screen-2', label: 'Screen 2', image: '/assets/usability-questions2.webp', imageAlt: 'Atlas Discovery Mode screen annotated with usability-test questions, view 2' },
          { id: 'screen-3', label: 'Screen 3', image: '/assets/usability-questions3.webp', imageAlt: 'Atlas Discovery Mode screen annotated with usability-test questions, view 3' },
        ],
      },

      // Step 2, Designing through feedback (variants: 4 changes)
      {
        panel: {
          title: 'DESIGNING THROUGH FEEDBACK',
          body: `
            <p>Testing confirmed the core direction of Atlas, but it also revealed where discovery needed stronger clarity, flexibility, and evaluation support.</p>
            <p>I focused the next iteration cycle on helping users understand recommendations faster and move through discovery with less hesitation.</p>
            <p>I introduced several targeted changes:</p>
          `,
          callouts: [
            { label: 'Intent Chips', body: 'Reducing uncertainty at session start and reinforced a sense of control over discovery direction.' },
            { label: 'Expandable Subcategories', body: 'Allowing users to move from high-level mood/activity selections into more precise discovery paths without switching to different methods.' },
            { label: 'Searchable Element Tags', body: 'Enabled faster relevance scanning before committing to playbacks.' },
            { label: 'Temporary Saves vs. Favorites', body: 'Making a clear distinction between session-based saves and permanent saves, reinforcing the flexibility of discovery.' },
          ],
        },
        defaultVariant: 'intent-chips',
        variantControl: 'TabStrip',
        variants: [
          { id: 'intent-chips',  label: 'Intent Chips',  image: '/assets/feedback-intent-chips.webp',  imageAlt: 'Before/after comparison of the Atlas Discovery Mode screen showing the Intent Chips change' },
          { id: 'subcategories', label: 'Subcategories', image: '/assets/feedback-subcategories.webp', imageAlt: 'Before/after comparison showing expandable subcategories added to Discovery Mode' },
          { id: 'element-tags',  label: 'Element Tags',  image: '/assets/feedback-element-tags.webp',  imageAlt: 'Before/after comparison showing searchable element tags added to Discovery Mode' },
          { id: 'favorites',     label: 'Favorites',     image: '/assets/feedback-favorites.webp',     imageAlt: 'Before/after comparison showing temporary saves versus favorites in Discovery Mode' },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // P02_04, NEXT STEPS
  // ──────────────────────────────────────────────────────────
  'next-steps': {
    label: 'P02_04 // NEXT STEPS',
    phaseTitle: 'MOVING FORWARD',
    summary: 'Outcomes of Atlas and what designing for the moment before play taught me.',
    steps: [
      // Step 1, A faster path to first play
      {
        image: '/assets/atlas-in-hand.webp',
        imageAlt: 'A person holds a phone displaying the Atlas Discovery Mode screen',
        panel: {
          title: 'A FASTER PATH TO FIRST PLAY',
          body: `
            <p>Atlas improved the moment where discovery typically breaks: the decision to try something new.</p>
            <p>The result is a more confident path from curiosity to commitment:</p>
          `,
          callouts: [
            { body: 'Listeners start discovery with clear direction instead of browsing aimlessly.' },
            { body: 'Enabled faster, more confident, first-play decisions.' },
            { body: 'Reduced skip fatigue by supporting quick evaluation before committing to a full track.' },
          ],
        },
      },

      // Step 2, Designing for the moment before play
      {
        image: '/assets/atlas-moment-before-play.webp',
        imageAlt: 'Closing reflection panel for the Atlas case study',
        panel: {
          title: 'DESIGNING FOR THE MOMENT BEFORE PLAY',
          body: `
            <p>This project changed how I think about discovery.</p>
            <p>I started Atlas assuming the problem was navigation, but through research and testing I realized the real friction happens earlier than that.</p>
            <p>It happens in the moment someone asks:<br>Is this even worth trying?</p>
            <p>Listeners aren&rsquo;t overwhelmed by a lack of music. They&rsquo;re overwhelmed by uncertainty.</p>
            <p>They don&rsquo;t want more options. They want clearer signals.</p>
            <p>Designing Atlas shifted my focus from organizing content to orchestrating confidence.</p>
          `,
        },
      },
    ],
  },
};

export default {
  title: 'Atlas, Confident Music Discovery (scroll layout)',
  header: {
    eyebrow: 'P02 // CASE_STUDY // PRJ.AX-99',
    title: 'ATLAS',
    subtitle: 'Confident music discovery, helping listeners reach a worthwhile first play, faster.',
    context: `
      <p><em>[Placeholder]</em> A short context blurb explaining the Atlas project, what it is, who it is for, and the core problem it solves. Replace this copy in <code>src/case-studies/atlas.js</code>.</p>
      <p><em>[Placeholder]</em> A second sentence framing scope: research, design, testing, and outcomes across the project.</p>
    `,
    hero: {
      type: 'video',
      src: '/assets/atlas-hero.webm',
      poster: '',
      caption: '[ FIG_00 // FINAL_PROTOTYPE ]',
    },
    outcomes: [
      { figure: 'TBD', unit: '',   descriptor: 'Placeholder outcome, replace in atlas.js', caption: '// metric pending' },
      { figure: 'TBD', unit: '',   descriptor: 'Placeholder outcome, replace in atlas.js', caption: '// metric pending' },
      { figure: 'TBD', unit: '',   descriptor: 'Placeholder outcome, replace in atlas.js', caption: '// metric pending' },
    ],
  },
  phases: [
    { slug: 'research',   code: 'P02_01', label: 'RESEARCH',   title: 'MEANINGFUL DISCOVERY' },
    { slug: 'design',     code: 'P02_02', label: 'DESIGN',     title: 'CRAFTING CONFIDENCE'  },
    { slug: 'testing',    code: 'P02_03', label: 'TESTING',    title: 'ACCORDING TO USERS'   },
    { slug: 'next-steps', code: 'P02_04', label: 'NEXT STEPS', title: 'MOVING FORWARD'       },
  ],
  sections,
  sidebar: { wordmark: 'ATLAS', meta: META, nav: NAV },
  prev: { label: 'Paiwares', href: '#/paiwares'  },
  next: { label: 'Solace',   href: '#/solace-v2' },
};
