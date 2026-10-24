/**
 * Website templates. Same honesty rule as projects.ts: every line here was
 * checked against the live preview, or the template's own README and source,
 * and nothing is described that does not exist.
 *
 * The previews in /public/templates are captures of the live sites: 1440x900
 * on a desktop and 390x844 on a phone, taken at weekday lunchtime so the
 * opening-hours badge reads "open", with the floating theme control hidden
 * (it is a demo tool, not part of the design) and the clinic's phone number
 * hidden from the nav. Saffron & Smoke is captured once per theme.
 *
 * Swatch colours are read out of each template's own stylesheet. The stage
 * behind a preview is the variant's accent colour, and `ink` is whatever reads
 * on it, so each template sits on a colour that is already its own.
 */

export type TemplateImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type TemplateVariant = {
  id: string;
  label: string;
  /** What this variant is for, in the template's own words. */
  note?: string;
  /** Swatches, as they appear in the template's CSS. */
  colors: string[];
  /** Names of those colours, where the template's own CSS names them. */
  names?: string;
  /** The colour of the stage behind the previews, and the ink that reads on it. */
  stage: string;
  ink: string;
  desktop: TemplateImage;
  mobile: TemplateImage;
};

export type Template = {
  slug: string;
  number: string;
  name: string;
  category: string;
  oneLiner: string;
  /** What is actually in it. One idea per line. */
  inside: string[];
  tech: string[];
  /** Shown in the browser bar of the preview. */
  host: string;
  /** The first is the default. More than one turns on the theme switcher. */
  variants: TemplateVariant[];
  links: { preview: string };
};

const desktop = (src: string, alt: string): TemplateImage => ({ src, width: 1600, height: 1000, alt });
const mobile = (src: string, alt: string): TemplateImage => ({ src, width: 600, height: 1298, alt });

export const templates: Template[] = [
  {
    slug: 'twacha-clinic',
    number: '01',
    name: 'Twacha Clinic',
    category: 'Dermatology clinic',
    oneLiner:
      'A website for a skin and hair clinic: the doctor, the treatments, what a first visit looks like, and a booking request that goes straight to WhatsApp.',
    inside: [
      'A hero drawn live in WebGL — no video, no 3D library. A serum droplet falls onto a satin surface as you scroll.',
      'The four layers of skin as a pinned 3D stack that separates as you scroll, with the concerns found at each depth.',
      'Treatments link into the booking form with the concern already chosen; the form then opens WhatsApp with the message written.',
      'All copy and facts live in one folder of data files, so a new clinic means editing content, not components.',
      'Reduced-motion fallbacks, privacy and terms pages, and structured data for search.',
    ],
    tech: ['Next.js 16', 'TypeScript', 'Tailwind CSS 4', 'GSAP', 'Lenis', 'Framer Motion'],
    host: 'twacha-clinic.vercel.app',
    variants: [
      {
        id: 'default',
        label: 'Twacha Clinic',
        colors: ['#faf7f2', '#ddcfbd', '#8b5e48', '#2a2623'],
        names: 'Ivory · Beige · Clay · Charcoal',
        stage: '#8b5e48',
        ink: '#faf7f2',
        desktop: desktop(
          '/templates/twacha-desktop.webp',
          'The Twacha Clinic template on a desktop screen: a cream satin hero with the headline “Healthy Skin. Expert Care. Confidence That Shows.”',
        ),
        mobile: mobile(
          '/templates/twacha-mobile.webp',
          'The Twacha Clinic template on a phone, with a Book Appointment and WhatsApp bar fixed along the bottom.',
        ),
      },
    ],
    links: { preview: 'https://twacha-clinic.vercel.app/' },
  },
  {
    slug: 'saffron-and-smoke',
    number: '02',
    name: 'Saffron & Smoke',
    category: 'Restaurant',
    oneLiner:
      'A website for a modern Indian restaurant, with a menu built for the QR code on the table and table reservations over WhatsApp.',
    inside: [
      'Three themes, switched from a panel on the page: Peacock for fine dining, Matcha for cafés and bakeries, Tamarind for street food and late nights.',
      'A menu page with search, a veg-only filter, nine categories, and tags for new, spicy and chef’s picks.',
      'A home page with chef’s picks and prices, the story in numbers, guest reviews, and opening hours by day.',
      'Reservations open WhatsApp with the message already started; call and directions are one link away.',
    ],
    tech: ['Next.js', 'Tailwind CSS'],
    host: 'saffron-and-smoke-snowy.vercel.app',
    variants: [
      {
        id: 'peacock',
        label: 'Peacock',
        note: 'Modern Indian · fine dining',
        colors: ['#0f2526', '#f0a93b'],
        stage: '#f0a93b',
        ink: '#0f2526',
        desktop: desktop(
          '/templates/saffron-peacock-desktop.webp',
          'The Saffron & Smoke template in its Peacock theme on a desktop screen: deep teal, with the headline “Slow-cooked over coal. Served with stories.” beside a photograph of a thali.',
        ),
        mobile: mobile(
          '/templates/saffron-peacock-mobile.webp',
          'The Saffron & Smoke template in its Peacock theme on a phone, with Call, WhatsApp and Menu buttons along the bottom.',
        ),
      },
      {
        id: 'matcha',
        label: 'Matcha',
        note: 'Cafés · bakeries · brunch',
        colors: ['#f3f5ef', '#2e6b4f'],
        stage: '#2e6b4f',
        ink: '#f3f5ef',
        desktop: desktop(
          '/templates/saffron-matcha-desktop.webp',
          'The Saffron & Smoke template in its Matcha theme on a desktop screen: pale green with deep green accents.',
        ),
        mobile: mobile(
          '/templates/saffron-matcha-mobile.webp',
          'The Saffron & Smoke template in its Matcha theme on a phone.',
        ),
      },
      {
        id: 'tamarind',
        label: 'Tamarind',
        note: 'Street food · late-night',
        colors: ['#24100f', '#ffc53d'],
        stage: '#ffc53d',
        ink: '#24100f',
        desktop: desktop(
          '/templates/saffron-tamarind-desktop.webp',
          'The Saffron & Smoke template in its Tamarind theme on a desktop screen: dark maroon with bright yellow accents.',
        ),
        mobile: mobile(
          '/templates/saffron-tamarind-mobile.webp',
          'The Saffron & Smoke template in its Tamarind theme on a phone.',
        ),
      },
    ],
    links: { preview: 'https://saffron-and-smoke-snowy.vercel.app/' },
  },
];
