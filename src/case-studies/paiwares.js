/**
 * Case-study data bundle for pAIwares Onboarding.
 * Same shape as case-studies/solace.js. Sections are defined inline
 * (Atlas-style) rather than imported from sections.js.
 */
import { NAV } from '../site-meta.js';

const META = [
  { label: 'ROLES',    values: ['UI Designer', 'Information Architect'] },
  { label: 'TIMELINE', values: ['1 Week'] },
  { label: 'TEAM',     values: ['1 Contract Designer'] },
  { label: 'TOOLS',    values: ['Figma', 'Lovable', 'Microsoft Teams'] },
];

const sections = {
  requirements: {
    label: 'P03_01 // ROLES & REQUIREMENTS',
    phaseTitle: 'FINDING A PATH TO MERCHANT ACTIVATION',
    summary: 'Translating fragmented operational requirements into a usable onboarding journey.',
    steps: [
      {
        image: '/assets/paiwares1.png',
        imageAlt: 'pAIwares onboarding landing page screen showing the merchant setup entry point',
        panel: {
          title: 'REQUIREMENTS BEFORE STRUCTURE',
          body: `
            <p>The challenge wasn&rsquo;t defining what information needed to be collected. That already existed.</p>
            <p>The real challenge was organizing those requirements into a flow merchants could realistically complete.</p>
            <p>Most onboarding information lived across spreadsheets and stakeholder sketches. Stakeholders understood the system internally, but the onboarding experience itself lacked structure, hierarchy, and progression.</p>
          `,
          callouts: [
            { body: 'My role was to translate operational requirements into a usable onboarding journey.' },
          ],
        },
      },
      {
        image: '/assets/paiwares2.png',
        imageAlt: 'Diagram showing four project constraints converging on a single goal tile — Reduce friction without removing complexity',
        panel: {
          title: 'UNDERSTANDING THE CONSTRAINTS',
          body: `
            <p>This project moved quickly and operated within tight constraints:</p>
            <ul>
              <li>Fixed compliance and processing requirements</li>
              <li>Partial visibility into backend logic</li>
              <li>Evolving field dependencies</li>
              <li>Limited implementation timeline</li>
            </ul>
            <p>Because much of the system behavior was already defined, the focus wasn&rsquo;t open-ended exploration.</p>
            <p>It was clarity.</p>
          `,
          callouts: [
            { body: 'The goal became reducing friction without removing complexity.' },
          ],
        },
      },
    ],
  },

  structure: {
    label: 'P03_02 // STRUCTURE',
    phaseTitle: 'FROM ARTIFACTS TO BLUEPRINTS',
    summary: 'Shaping flow structure and screen hierarchy from stakeholder artifacts.',
    steps: [
      {
        image: '/assets/paiwares3.png',
        imageAlt: 'pAIwares onboarding flow screen carousel showing the structured setup stages',
        caption: "Stakeholder's Assets",
        variants: [
          { id: 'screen-1', label: 'Screen 1', image: '/assets/paiwares3.png', imageAlt: 'pAIwares onboarding flow screen 1' },
          { id: 'screen-2', label: 'Screen 2', image: '/assets/paiwares4.png', imageAlt: 'pAIwares onboarding flow screen 2' },
          { id: 'screen-3', label: 'Screen 3', image: '/assets/paiwares5.png', imageAlt: 'pAIwares onboarding flow screen 3' },
        ],
        defaultVariant: 'screen-1',
        variantControl: 'CarouselDots',
        panel: {
          title: 'STAKEHOLDER INPUT → FLOW LOGIC',
          body: `
            <p>Stakeholders provided several artifacts during the project:</p>
            <ul>
              <li>Requirement matrices</li>
              <li>Equipment selection sketches</li>
              <li>Onboarding notes and confirmation examples</li>
            </ul>
            <p>These documents explained what the system needed, but not how users should experience it.</p>
            <p>I worked closely with stakeholders to identify:</p>
            <ul>
              <li>Which fields belonged together</li>
              <li>Which inputs depended on earlier selections</li>
              <li>Where users were most likely to hesitate</li>
            </ul>
            <p>This collaboration shaped both the flow structure and screen hierarchy.</p>
          `,
        },
      },
      {
        image: '/assets/paiwares6.png',
        imageAlt: 'Five numbered onboarding stage tiles arranged left to right: Business Details, Processing Setup, Equipment Selection, Documentation, Confirmation',
        panel: {
          title: 'BUILDING STRUCTURE BEFORE SCREENS',
          body: `
            <p>Before designing interfaces, I focused on organizing the onboarding architecture itself.</p>
            <p>One of the biggest risks in enterprise onboarding is cognitive overload &mdash; especially when users are asked to complete long forms without understanding why information is grouped together.</p>
            <p>To simplify the experience, I introduced a step-based flow that separated onboarding into clear stages:</p>
            <ul>
              <li>Business Details</li>
              <li>Processing Setup</li>
              <li>Equipment Selection</li>
              <li>Documentation</li>
              <li>Confirmation</li>
            </ul>
            <p>This created smaller decision points and helped merchants move through onboarding progressively instead of confronting the entire system at once.</p>
          `,
        },
      },
    ],
  },

  design: {
    label: 'P03_03 // DESIGN',
    phaseTitle: 'FLOW & TRUST',
    summary: 'Aligning a new onboarding flow with an active product ecosystem.',
    steps: [
      {
        iframe: 'https://fresh-pathfinder.lovable.app/onboarding',
        imageAlt: 'Live pAIwares onboarding prototype showing the merchant setup interface aligned with the existing product UI',
        panel: {
          title: 'DESIGNING INSIDE A LIVE PRODUCT',
          body: `
            <p>Because pAIwares already had an active product ecosystem, consistency became an important part of the design process.</p>
            <p>Before expanding the onboarding experience, I analyzed:</p>
            <ul>
              <li>Existing interface patterns</li>
              <li>Component styles</li>
              <li>Interaction behaviors</li>
            </ul>
            <p>Using tools like Figma and Lovable, I gathered visual references, mapped recurring UI patterns, and explored ways to align onboarding with the broader product environment.</p>
            <p>This helped ensure the new flow felt connected to the existing platform rather than designed in isolation.</p>
            <p>The fast-paced timeline also required rapid iteration. Using these tools, I was able to:</p>
            <ul>
              <li>Generate and test layout directions quickly</li>
              <li>Iterate on onboarding structures efficiently</li>
              <li>Explore interaction ideas before refining them in high fidelity</li>
              <li>Maintain consistency with existing UI patterns and styling</li>
            </ul>
          `,
          callouts: [
            { body: 'This allowed the project to move quickly while still feeling cohesive, scalable, and implementation-ready.' },
          ],
        },
      },
      {
        iframe: 'https://paiwares-onboarding.lovable.app/onboarding',
        imageAlt: 'Refined pAIwares onboarding prototype showing improved field grouping, step transitions, and confirmation states',
        panel: {
          title: 'REFINING THROUGH ITERATION',
          body: `
            <p>With the core flow established, I iterated on screen hierarchy, interaction clarity, and progression between steps to ensure the experience remained easy to follow despite the amount of required information.</p>
            <p>This included refining:</p>
            <ul>
              <li>Field grouping and spacing</li>
              <li>Step transitions and progression cues</li>
              <li>Equipment selection interactions</li>
              <li>Confirmation and review states</li>
            </ul>
            <p>Because onboarding requirements and backend logic were still evolving, designs were updated continuously alongside stakeholder feedback and technical discussions.</p>
          `,
          callouts: [
            { body: 'Iteration wasn&rsquo;t a final polish pass, it was a crucial part of the process &mdash; helping align business requirements, user clarity, and implementation feasibility in real time.' },
            { body: 'Turning completion into reassurance.' },
          ],
        },
      },
    ],
  },

  collaboration: {
    label: 'P03_04 // COLLABORATION & HAND-OFF',
    phaseTitle: 'THE OUTCOME',
    summary: 'How stakeholder collaboration shaped the onboarding system into an implementation reference.',
    steps: [
      {
        image: '/assets/paiwares9.png',
        imageAlt: 'Funnel diagram showing scattered inputs distilled through synthesis into three key design decisions',
        panel: {
          title: 'DESIGNING THROUGH COLLABORATION',
          body: `
            <p>Because some backend behaviors and dependencies were still evolving, collaboration became a core part of the design process.</p>
            <p>Rather than designing independently and validating later, I worked iteratively with stakeholders to:</p>
            <ul>
              <li>Confirm requirements in real time</li>
              <li>Adjust sequencing as logic evolved</li>
              <li>Align interface decisions with operational needs</li>
            </ul>
            <p>This helped the onboarding flow function as both a user experience and a shared implementation reference for the team.</p>
          `,
          callouts: [
            { body: 'Confirm requirements in real time' },
            { body: 'Adjust sequencing as logic evolved' },
            { body: 'Align interface decisions with operational needs' },
          ],
        },
      },
      {
        image: '/assets/paiwares10.png',
        imageAlt: 'Four labeled slider scales each showing a deliberate tradeoff position between competing priorities',
        panel: {
          title: 'TRADEOFFS AND PRIORITIES',
          body: `
            <p>Given the project timeline and technical limitations, several decisions prioritized clarity and implementation speed:</p>
            <ul>
              <li>Structured progression over complex branching</li>
              <li>Predictable navigation over dynamic automation</li>
              <li>Reduced cognitive load over feature depth</li>
            </ul>
            <p>The goal wasn&rsquo;t to create the most flexible onboarding system possible.</p>
            <p>It was to create one merchants could successfully complete.</p>
          `,
        },
      },
      {
        iframe: 'https://paiwares-onboarding.lovable.app/onboarding',
        imageAlt: 'Final pAIwares onboarding flow shown as a cohesive end-to-end merchant activation experience',
        panel: {
          title: 'FOUNDATION FOR ACTIVATION',
          body: `
            <p>The prototype delivered:</p>
            <ul>
              <li>A structured step-based onboarding flow</li>
              <li>Organized requirements aligned with system logic</li>
              <li>Equipment selection designed for comparison decisions</li>
              <li>Confirmation states that clarified next steps</li>
            </ul>
            <p>The project transformed fragmented onboarding documentation into a cohesive user experience stakeholders could align around and move toward implementation with confidence.</p>
          `,
          callouts: [
            { body: 'A structured step-based onboarding flow' },
            { body: 'Organized requirements aligned with system logic' },
            { body: 'Equipment selection designed for comparison decisions' },
            { body: 'Confirmation states that clarified next steps' },
          ],
        },
      },
      {
        component: `
          <div class="paiwares-kit" aria-label="Onboarding component library — interactive">
            <header class="paiwares-kit__head">
              <h4 class="paiwares-kit__title">COMPONENT LIBRARY</h4>
              <p class="paiwares-kit__caption">Onboarding was assembled from one consistent kit &mdash; the same controls reused across all five steps.</p>
            </header>

            <div class="paiwares-kit__grid">
              <figure class="paiwares-kit__cell">
                <div class="paiwares-kit__card">
                  <div class="paiwares-kit__buttons">
                    <button type="button" class="paiwares-kit__btn paiwares-kit__btn--primary">Save &amp; continue</button>
                    <button type="button" class="paiwares-kit__btn paiwares-kit__btn--ghost">Back</button>
                  </div>
                </div>
                <figcaption>Buttons</figcaption>
              </figure>

              <figure class="paiwares-kit__cell">
                <div class="paiwares-kit__card">
                  <label class="paiwares-kit__field">
                    <span class="paiwares-kit__field-label paiwares-kit__field-label--required">Corporate / legal name</span>
                    <input type="text" class="paiwares-kit__input" placeholder="Acme Holdings LLC" />
                  </label>
                </div>
                <figcaption>Input Fields</figcaption>
              </figure>

              <figure class="paiwares-kit__cell">
                <div class="paiwares-kit__card">
                  <label class="paiwares-kit__field">
                    <span class="paiwares-kit__field-label">Business type</span>
                    <select class="paiwares-kit__select">
                      <option>LLC</option>
                      <option>C-Corp</option>
                      <option>S-Corp</option>
                      <option>Partnership</option>
                      <option>Sole Proprietor</option>
                    </select>
                  </label>
                </div>
                <figcaption>Dropdown Menus</figcaption>
              </figure>

              <figure class="paiwares-kit__cell">
                <div class="paiwares-kit__card">
                  <div class="paiwares-kit__radios" role="radiogroup" aria-label="Processing channel">
                    <label class="paiwares-kit__radio">
                      <input type="radio" name="paiwares-kit-channel" checked />
                      <span>Card present / keyed</span>
                    </label>
                    <label class="paiwares-kit__radio">
                      <input type="radio" name="paiwares-kit-channel" />
                      <span>Card swiped</span>
                    </label>
                    <label class="paiwares-kit__radio">
                      <input type="radio" name="paiwares-kit-channel" />
                      <span>Internet / online</span>
                    </label>
                  </div>
                </div>
                <figcaption>Radio groups</figcaption>
              </figure>

              <figure class="paiwares-kit__cell">
                <div class="paiwares-kit__card">
                  <label class="paiwares-kit__checkbox">
                    <input type="checkbox" checked />
                    <span>Same as DBA address</span>
                  </label>
                </div>
                <figcaption>Checkboxes</figcaption>
              </figure>

              <figure class="paiwares-kit__cell">
                <div class="paiwares-kit__card">
                  <div class="paiwares-kit__stepper" role="group" aria-label="Onboarding progress">
                    <ol class="paiwares-kit__steps">
                      <li class="paiwares-kit__step is-active"><span class="paiwares-kit__pip">1</span></li>
                      <li class="paiwares-kit__step-connector paiwares-kit__step-connector--filled" aria-hidden="true"></li>
                      <li class="paiwares-kit__step"><span class="paiwares-kit__pip">2</span></li>
                      <li class="paiwares-kit__step-connector" aria-hidden="true"></li>
                      <li class="paiwares-kit__step"><span class="paiwares-kit__pip">3</span></li>
                      <li class="paiwares-kit__step-connector" aria-hidden="true"></li>
                      <li class="paiwares-kit__step"><span class="paiwares-kit__pip">4</span></li>
                      <li class="paiwares-kit__step-connector" aria-hidden="true"></li>
                      <li class="paiwares-kit__step"><span class="paiwares-kit__pip">5</span></li>
                    </ol>
                    <span class="paiwares-kit__step-caption">Step 1 of 5 &mdash; Business Details</span>
                  </div>
                </div>
                <figcaption>Step indicators</figcaption>
              </figure>
            </div>
          </div>
        `,
        panel: {
          title: 'DESIGNING IN A SYSTEM',
          body: `
            <p>This project reinforced that enterprise UX often isn&rsquo;t about simplifying systems completely.</p>
            <p>It&rsquo;s about making complex systems understandable.</p>
            <p>Success came from balancing user clarity, stakeholder requirements, and implementation realities &mdash; while moving quickly inside a constrained environment.</p>
            <p>The result was an onboarding framework designed not just around screens, but around the operational realities behind them.</p>
          `,
        },
      },
    ],
  },
};

export default {
  modifier: 'paiwares',
  title: 'pAIwares, Merchant Onboarding for an AI-Driven Fintech Platform (scroll layout)',
  header: {
    eyebrow: 'P03 // CASE_STUDY // PRJ.NX-78',
    title: 'PAIWARES',
    subtitle: 'Merchant Onboarding for an AI-Driven Fintech Platform.',
    context: `
      <p>pAIwares is a fintech startup building AI-driven tools and transaction processing technology for merchant banking. As the platform expanded, the team needed an onboarding experience that could guide merchants through service setup, equipment configuration, and processing requirements without overwhelming them.</p>
      <p>This case study walks through how operational requirements scattered across spreadsheets and sketches were translated into a structured, step-based merchant activation flow inside a one-week sprint.</p>
    `,
    hero: {
      type: 'lottie',
      src: '/assets/paiwares-design2.json',
      keepBackground: true,
    },
    outcomes: [
      { figure: '05', unit: 'STAGES', descriptor: 'Step-based onboarding flow', implication: 'Smaller decision points reduce cognitive load' },
      { figure: '01', unit: 'WEEK',   descriptor: 'End-to-end design sprint',  implication: 'Rapid iteration inside a constrained environment' },
      { figure: '04', unit: 'INPUTS', descriptor: 'Distilled into design decisions', implication: 'Scattered artifacts unified into a shared reference' },
    ],
  },
  phases: [
    { slug: 'requirements',  code: 'P03_01', label: 'ROLES & REQUIREMENTS',  title: 'FINDING A PATH TO MERCHANT ACTIVATION' },
    { slug: 'structure',     code: 'P03_02', label: 'STRUCTURE',              title: 'FROM ARTIFACTS TO BLUEPRINTS' },
    { slug: 'design',        code: 'P03_03', label: 'DESIGN',                 title: 'FLOW & TRUST' },
    { slug: 'collaboration', code: 'P03_04', label: 'COLLABORATION & HAND-OFF', title: 'THE OUTCOME' },
  ],
  sections,
  sidebar: { wordmark: 'PAIWARES', meta: META, nav: NAV },
  prev: { label: 'Solace', href: '#/solace-v2' },
  next: { label: 'Santos', href: '#/santos'    },
};
