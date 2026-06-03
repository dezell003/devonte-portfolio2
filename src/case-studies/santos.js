/**
 * Case-study data bundle for Dropping Wisdom with Santos.
 * Same shape as solace.js / paiwares.js. Sections defined inline.
 */
import { NAV } from '../site-meta.js';

const META = [
  { label: 'ROLES',    values: ['UX/UI Designer', 'Information Architect'] },
  { label: 'TIMELINE', values: ['1 Week'] },
  { label: 'TEAM',     values: ['1 Contract Designer'] },
  { label: 'TOOLS',    values: ['Figma', 'AI-assisted Testing'] },
];

// Mobile-iframe sizing — Lovable prototype + podpage shipped site both
// render best at phone width inside this layout.
const MOBILE_IFRAME = {
  iframeNativeWidth: 390,
  iframeHeaderCrop: 0,
  iframeFooterCrop: 0,
};

const sections = {
  discovery: {
    label: 'P04_01 // DISCOVERY',
    phaseTitle: 'TURNING A PODCAST INTO A PRODUCT',
    summary: 'Translating a long-form podcast into a product home of its own.',
    steps: [
      {
        image: '/assets/santos-hero.webp',
        imageAlt: "Dropping Wisdom with Santos homepage — the show's new product home, consolidating a scattered content presence",
        panel: {
          title: 'TURNING A PODCAST INTO A PRODUCT',
          body: `
            <p>Dropping Wisdom with Santos is a long-form podcast built around reflection, identity, and lived experience.</p>
            <p>Santos had spent years building the show. Episodes, recurring themes, a clear voice, a real audience.</p>
            <p>But everything outside the audio lived in scattered places. A podcast host. A few social accounts. No home of its own.</p>
            <p>I came on as the only designer to turn that catalogue into a product.</p>
          `,
          callouts: [
            { body: 'No brand guidelines. No analytics. No engineering partner.' },
            { body: "The goal was a responsive site that could carry the show's identity, make the back catalogue findable, and give Santos a platform he could grow into later." },
          ],
        },
      },
      {
        image: '/assets/santos-inventory.webp',
        imageAlt: 'Two-column inventory diagram contrasting what already existed against what was missing at the start of the project',
        panel: {
          title: 'WHAT I HAD TO WORK WITH',
          body: `
            <p>What existed was the show itself. Episodes, themes, voice, personality.</p>
            <p>What didn&rsquo;t exist was almost everything a designer usually starts with.</p>
            <p>No design system. No content strategy. No data on which episodes mattered most or how new listeners were finding the show.</p>
            <p>That gap was the actual brief.</p>
          `,
          callouts: [
            { body: 'The work wasn&rsquo;t &ldquo;design a podcast site.&rdquo; It was &ldquo;figure out what this product is, then design it.&rdquo;' },
          ],
        },
      },
    ],
  },

  constraints: {
    label: 'P04_02 // CONSTRAINTS & REQUIREMENTS',
    phaseTitle: 'CONSTRAINTS I WAS DESIGNING AROUND',
    summary: 'Naming the boundaries up front so the work could survive them.',
    steps: [
      {
        image: '/assets/santos-constraints.webp',
        imageAlt: 'Three labeled constraint rows describing the boundaries the design had to work within',
        panel: {
          title: 'CONSTRAINTS I WAS DESIGNING AROUND',
          body: `
            <p>A few things set the boundaries early, and I designed against them from the start instead of hitting them later.</p>
            <p>I was working solo. No developer to sanity-check feasibility in real time. So I avoided anything I couldn&rsquo;t hand off cleanly.</p>
            <p>Podcast listeners are on phones. Usually mid-task. So the site had to work one-handed before it worked anywhere else.</p>
            <p>And there were no features to hide behind. No search, no accounts, no playlists. The content and the path to it were the whole product.</p>
          `,
          callouts: [
            { body: 'Typography, hierarchy, and rhythm had to do the work that features usually do.' },
          ],
        },
      },
      {
        image: '/assets/santos-look.webp',
        imageAlt: "Desktop home screen showing the visual language derived from the show's voice — dark UI, bold display type, single restrained accent color",
        panel: {
          title: 'TRANSLATING VOICE INTO A LOOK',
          body: `
            <p>With no brand system to inherit, the identity had to come from the show itself.</p>
            <p>I listened through episodes and wrote down what kept coming up. Direct. Expressive. A little raw. More conversation than broadcast.</p>
            <p>Then I used that as the brief for the visual language.</p>
            <p>That turned into a dark UI, bold display type, and one accent color used sparingly enough that it still meant something when it showed up.</p>
            <p>The harder call was knowing when to dial it back. Expressive design fails when personality starts eating legibility.</p>
          `,
          callouts: [
            { body: 'Every loud move was paired with a quieter one somewhere else on the page.' },
          ],
        },
      },
    ],
  },

  design: {
    label: 'P04_03 // DESIGN',
    phaseTitle: 'STRUCTURING CONTENT FOR DISCOVERY',
    summary: 'Designing for the new listener when there&rsquo;s no data on the old one.',
    steps: [
      {
        image: '/assets/santos-index.webp',
        imageAlt: 'Episode index screen — featured episode up front, episodes grouped by theme rather than date',
        panel: {
          title: 'STRUCTURING CONTENT FOR DISCOVERY',
          body: `
            <p>Without analytics, I couldn&rsquo;t optimize for what people actually wanted.</p>
            <p>So I designed for what I&rsquo;d expect a new listener to need.</p>
            <p>A featured episode up front. Episodes grouped by themes instead of dates. Clear ways into the back catalogue for the people who finished an episode and wanted more.</p>
          `,
          callouts: [
            { body: 'Most podcast sites default to reverse chronological order. For a show with a thematic spine, that&rsquo;s the wrong call.' },
            { body: 'Leading with curation added editorial work for Santos, but the trade was worth it. A new listener could land on the site and understand what the show was about, not just when the last episode dropped.' },
          ],
        },
      },
      {
        iframe: 'https://elevated-canvas-room.lovable.app/',
        ...MOBILE_IFRAME,
        imageAlt: 'Live mobile prototype of the podcast site, designed for thumb-reach and one-handed use',
        panel: {
          title: 'DESIGNING FOR MOBILE FIRST',
          body: `
            <p>Engagement on a content site isn&rsquo;t really about clever interactions. It&rsquo;s about whether the page invites a second scroll.</p>
            <p>I worked the mobile layout first. Tap targets, thumb reach, where the play button sits when you&rsquo;re holding the phone one-handed.</p>
          `,
          callouts: [
            { body: 'Desktop grew out of that, not the other way around.' },
            { body: 'Rhythm carried more weight than I expected. Long mobile pages die when every section looks the same. Alternating density and giving featured content extra room kept the page moving.' },
          ],
        },
      },
      {
        image: '/assets/santos-testing.webp',
        imageAlt: 'Three labeled rows describing the AI-driven testing methods used as the validation layer',
        panel: {
          title: 'TESTING WITHOUT A RESEARCH BUDGET',
          body: `
            <p>There were no users to recruit and no budget for sessions. So I leaned on AI-driven testing as the validation layer.</p>
            <p>I ran the key screens through AI reviewers prompted as usability auditors. The most useful things it caught were weak affordance on mobile play controls, and a hierarchy issue where featured and recent episodes were reading at the same visual weight.</p>
            <p>I also had AI roleplay a first-time listener narrating their way through the experience &mdash; landing, finding an episode, and playing it. Two real problems came out of that: a dead-end on the episode detail page, and an unclear entry point into themes that I&rsquo;d been assuming were self-explanatory.</p>
            <p>Then I ran an AI-assisted contrast check on the dark UI and accent pairings. One combination failed for body text. I adjusted it and re-checked.</p>
            <p>What this kind of testing doesn&rsquo;t tell you is how a real listener feels on the page. Whether the tone lands, and more importantly, whether the site actually converts a casual visitor into a subscriber.</p>
            <p>Those are open questions. I&rsquo;d close them with real sessions and analytics once the site had some time to live.</p>
          `,
          callouts: [
            { body: 'Naming the gap feels more honest than pretending it isn&rsquo;t there.' },
          ],
        },
      },
    ],
  },

  outcome: {
    label: 'P04_04 // OUTCOME',
    phaseTitle: 'TRADEOFFS',
    summary: 'Being honest about what got cut and what got carried.',
    steps: [
      {
        image: '/assets/santos-tradeoffs.webp',
        imageAlt: 'Three tradeoff rows, each showing what was cut on the left resolving into what was kept on the right',
        panel: {
          title: 'TRADEOFFS',
          body: `
            <p>Every cut had a cost worth being honest about.</p>
            <p><strong>Dense episode indexes.</strong> This made navigation harder for listeners who already know the catalogue, but new-listener clarity mattered more right now.</p>
            <p><strong>Experimental per-episode layouts.</strong> This gave up the chance for each episode page to feel like its own thing, but consistency was the only way to keep the site shippable solo.</p>
            <p><strong>Heavier navigation.</strong> This hurt discoverability of secondary pages. But a simpler nav protected the editorial feel of the homepage, which was doing most of the work.</p>
          `,
          callouts: [
            { body: 'None of these were the right answer in the abstract, but they were the right answer for this show at this stage.' },
          ],
        },
      },
      {
        iframe: 'https://www.podpage.com/dropping-wisdom-with-santos/',
        ...MOBILE_IFRAME,
        imageAlt: 'Shipped Dropping Wisdom with Santos site — the scattered content presence consolidated into a single product surface',
        panel: {
          title: 'WHERE IT LANDED',
          body: `
            <p>An identity that matches the show&rsquo;s voice. A structure that supports discovery instead of just listing. A mobile experience designed for how people actually arrive. A surface area small enough that one person can keep it running.</p>
            <p>The quieter outcome was having a clear point of view on what the product is. Which meant future decisions, like adding a section or a sponsor placement, had something to be measured against.</p>
          `,
          callouts: [
            { body: 'The final site moved Santos from a scattered content presence to a single product surface.' },
          ],
        },
      },
      {
        image: '/assets/santos-balance.webp',
        imageAlt: 'A balance diagram positioning visual expression against clarity, with a closing takeaway',
        panel: {
          title: 'DESIGNING FOR VOICE, NOT JUST INTERFACE',
          body: `
            <p>This project wasn&rsquo;t about building a complex system.</p>
            <p>It was about translating personality into structure.</p>
            <p>Success meant knowing when to push visual expression &mdash; and when to pull back for clarity.</p>
            <p>The final result feels expressive, but still usable. And that balance is what makes content-driven products work.</p>
          `,
        },
      },
    ],
  },
};

export default {
  modifier: 'santos',
  title: 'Dropping Wisdom with Santos, Turning a Long-Form Podcast Into a Product (scroll layout)',
  header: {
    eyebrow: 'P04 // CASE_STUDY // PRJ.NX-77',
    title: 'SANTOS',
    subtitle: 'Dropping Wisdom with Santos &mdash; turning a long-form podcast into a product.',
    context: `
      <p>Dropping Wisdom with Santos is a long-form podcast built around reflection, identity, and lived experience &mdash; with a back catalogue scattered across Spotify, Apple Podcasts, YouTube, and Instagram.</p>
      <p>This case study walks through how I came on as the only designer and turned that scattered presence into a single product surface, in one week, with no brand guidelines, no analytics, and no engineering partner.</p>
    `,
    hero: {
      type: 'image',
      src: '/assets/santos-hero.webp',
    },
    outcomes: [
      { figure: '01', unit: 'WEEK',    descriptor: 'Solo design sprint',             implication: 'One person, end-to-end' },
      { figure: '00', unit: 'BUDGET',  descriptor: 'No research budget',             implication: 'AI-driven testing as the validation layer' },
      { figure: '01', unit: 'PRODUCT', descriptor: 'Scattered surfaces unified',     implication: 'A home the show can grow into' },
    ],
  },
  phases: [
    { slug: 'discovery',   code: 'P04_01', label: 'DISCOVERY',                title: 'TURNING A PODCAST INTO A PRODUCT' },
    { slug: 'constraints', code: 'P04_02', label: 'CONSTRAINTS & REQUIREMENTS', title: 'CONSTRAINTS I WAS DESIGNING AROUND' },
    { slug: 'design',      code: 'P04_03', label: 'DESIGN',                   title: 'STRUCTURING CONTENT FOR DISCOVERY' },
    { slug: 'outcome',     code: 'P04_04', label: 'OUTCOME',                  title: 'TRADEOFFS' },
  ],
  sections,
  sidebar: { wordmark: 'SANTOS', meta: META, nav: NAV },
  prev: { label: 'pAIwares', href: '#/paiwares' },
  next: { label: 'Atlas',    href: '#/atlas'    },
};
