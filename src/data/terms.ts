/**
 * Terms & Conditions for agentic-finance.live, as approved by More & More (26 Nov 2026).
 *
 * Wording is More & More's own: change it only with their approval. The company's registered address
 * is deliberately not published. As a safeguard, a paragraph, list item or line that holds a bracketed
 * placeholder, such as "[applicable jurisdiction]", is not shown on the page (see `hasPlaceholder`),
 * and a section left with nothing to show is skipped; the sections renumber themselves.
 */

export type TermsBlock =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'h'; text: string }
  | { kind: 'lines'; lines: string[] };

export type TermsSection = { id: string; title: string; blocks: TermsBlock[] };

export const termsMeta = {
  lastUpdated: 'November 26, 2026',
  byline: 'Agentic Finance | By More & More',
};

const p = (text: string): TermsBlock => ({ kind: 'p', text });
const list = (...items: string[]): TermsBlock => ({ kind: 'list', items });
const h = (text: string): TermsBlock => ({ kind: 'h', text });
const lines = (...l: string[]): TermsBlock => ({ kind: 'lines', lines: l });

export const termsSections: TermsSection[] = [
  {
    id: 'introduction',
    title: 'Introduction and Acceptance',
    blocks: [
      p('Welcome to Agentic Finance (agentic-finance.live), a global business ecosystem operated by More & More ("Agentic Finance," "More & More," "we," "us," or "our").'),
      p('These Terms and Conditions govern your access to and use of our website, network, events, publications, digital resources and associated services (collectively, the "Platform").'),
      p('By accessing or using the Platform, you agree to these Terms and Conditions. If you do not agree, please discontinue your use of the Platform.'),
    ],
  },
  {
    id: 'nature-of-the-platform',
    title: 'Nature of the Platform',
    blocks: [
      p('Agentic Finance is a global business, innovation and networking ecosystem connecting financial institutions, investors, venture capital firms, startups, technology providers, corporations and other industry participants.'),
      p('The Platform facilitates professional networking, business development, industry education, research, events, commercial introductions and strategic partnerships.'),
      p('Agentic Finance does not provide regulated investment services, execute financial transactions, hold customer funds or act as a financial intermediary.'),
    ],
  },
  {
    id: 'no-financial-advice',
    title: 'No Financial or Investment Advice',
    blocks: [
      p('All information, research, publications, reports, rankings, indexes, presentations, discussions and other materials provided through the Platform are intended for general informational and educational purposes.'),
      p('Nothing published or communicated through Agentic Finance constitutes:'),
      list(
        'Financial or investment advice.',
        'Legal, regulatory or tax advice.',
        'A recommendation to purchase, sell or hold any financial instrument or digital asset.',
        'An offer or solicitation to invest in any company, fund, security or financial product.',
        'A guarantee of financial returns or commercial success.',
      ),
      p('Users are solely responsible for conducting their own independent due diligence and obtaining appropriate professional advice before making financial, investment or commercial decisions.'),
    ],
  },
  {
    id: 'network-membership',
    title: 'Network Membership and Applications',
    blocks: [
      p('The Agentic Finance Network provides opportunities for organizations and individuals to participate in a global financial and technological ecosystem.'),
      p('Basic network membership is free of charge. Additional services, commercial partnerships, promotional opportunities, business development support and enhanced visibility may be offered under separate commercial arrangements.'),
      p('By submitting an application, you confirm that:'),
      list(
        'The information provided is accurate and not misleading.',
        'You are authorized to represent the organization identified in your application.',
        'You have the necessary rights to provide any submitted materials.',
        'You will conduct yourself professionally and comply with applicable laws and regulations.',
      ),
      p('Agentic Finance reserves the right to review, approve, reject, suspend or terminate membership applications or participation based on legitimate business, compliance, security or reputational considerations.'),
      p('Submission of an application does not guarantee acceptance, participation, introductions or commercial opportunities.'),
    ],
  },
  {
    id: 'business-introductions',
    title: 'Business Introductions and Commercial Relationships',
    blocks: [
      p('Agentic Finance may facilitate introductions between investors, startups, financial institutions, service providers, potential customers and other ecosystem participants.'),
      p('Such introductions do not constitute an endorsement, investment recommendation, certification or guarantee regarding any participating organization.'),
      p('Any commercial relationship, investment, transaction or agreement resulting from an introduction is undertaken independently by the relevant parties.'),
      p('Agentic Finance shall not be responsible for the performance, representations, financial condition, regulatory status or contractual obligations of third parties, except where required by applicable law.'),
    ],
  },
  {
    id: 'events',
    title: 'Events, Conferences and Participation',
    blocks: [
      p('Agentic Finance organizes, promotes and participates in conferences, summits, networking sessions, private dinners, webinars and other industry events internationally.'),
      p('Event registration, attendance, speaking opportunities and participation may be subject to additional eligibility requirements, capacity limitations and event-specific terms.'),
      p('Agentic Finance reserves the right, where reasonably necessary, to modify event dates, locations, agendas, speakers, formats and participation arrangements.'),
      p('Paid registrations, sponsorships and commercial participation are subject to the applicable booking terms or executed commercial agreements, including relevant cancellation and refund provisions.'),
      p('Participation in an event does not guarantee access to any particular speaker, investor, organization, business opportunity or private networking session.'),
    ],
  },
  {
    id: 'sponsorships',
    title: 'Sponsorships and Commercial Partnerships',
    blocks: [
      p('Sponsorship packages, strategic partnerships, promotional services and other paid opportunities are governed by their respective commercial proposals, order forms or written agreements.'),
      p('Information displayed on the Platform regarding partnership opportunities is provided for general informational purposes and does not constitute a binding commercial offer.'),
      p('Where a separately executed agreement conflicts with these Terms and Conditions, the executed agreement shall prevail in relation to the specific commercial arrangement, subject to applicable law.'),
    ],
  },
  {
    id: 'index-research-publications',
    title: 'AF100 Index, Research and Publications',
    blocks: [
      p('The Agentic Finance Index, AF100, industry reports, company profiles, market insights, rankings and other research materials are intended to provide general industry information and highlight developments across the financial and technological ecosystem.'),
      p('Such materials may rely on publicly available information, third-party sources, company submissions, editorial assessments and proprietary methodologies.'),
      p('Agentic Finance does not guarantee the accuracy, completeness, independence or continued availability of such information.'),
      p("Inclusion in any index, directory, publication or company listing does not constitute an investment recommendation, regulatory approval or certification of an organization's financial standing."),
      p('Commercial or sponsored relationships that materially influence editorial content or placement will be disclosed where applicable.'),
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property Rights',
    blocks: [
      p('Unless otherwise indicated, all proprietary content, branding, designs, graphics, methodologies, databases, publications, photographs, videos and website materials are owned by or licensed to More & More or its respective affiliates.'),
      p('Users may access publicly available materials for personal, informational and legitimate internal business purposes.'),
      p('Without prior written authorization, users may not:'),
      list(
        'Reproduce, distribute, resell or commercially exploit proprietary materials.',
        'Scrape, harvest or systematically extract information from the Platform.',
        'Copy or commercially reproduce proprietary indexes, databases or research.',
        'Use Agentic Finance or More & More trademarks in a manner that implies unauthorized affiliation or endorsement.',
        'Circumvent technical restrictions or security controls.',
      ),
      p('Third-party trademarks, company names and logos remain the property of their respective owners.'),
    ],
  },
  {
    id: 'third-party-logos',
    title: 'Third-Party Logos, Brand Representation and Ecosystem Participation',
    blocks: [
      p('Agentic Finance and More & More may display the names, logos, trademarks and brand identities of organizations across their websites, event materials, ecosystem directories, publications and promotional communications, where authorized or otherwise lawfully permitted.'),
      p("The appearance of an organization's name or logo may reflect different forms of professional engagement, including, but not limited to:"),
      list(
        'Previous or ongoing business communications.',
        'Introductory meetings and exploratory discussions.',
        'Attendance or registration at past or upcoming events.',
        'Participation by company representatives, executives or employees.',
        'Expressions of interest in events, partnerships or network activities.',
        'Previous or ongoing collaboration.',
        'Participation in the wider Agentic Finance ecosystem.',
        'Confirmed sponsorships, partnerships or commercial relationships, where applicable.',
      ),
      p("Unless expressly stated otherwise, the display of a company's name or logo does not constitute a representation that Agentic Finance or More & More has directly worked with, been retained by, received financial compensation from, or entered into a formal commercial partnership with that organization."),
      p('Similarly, such display does not imply an endorsement, recommendation, official affiliation, sponsorship or approval by the respective organization.'),
      p('Participation by an individual associated with an organization does not necessarily constitute participation or endorsement by the organization itself.'),
      p('Agentic Finance endeavors to represent its professional relationships accurately and in good faith. Organizations identified specifically as confirmed sponsors or official partners shall be represented as such only where the relevant relationship has been established.'),
      p('All third-party logos, trademarks and brand identities remain the intellectual property of their respective owners.'),
      h('Logo Removal and Correction Requests'),
      p('We respect the intellectual property rights and brand representation preferences of all organizations.'),
      p('Should any organization prefer not to have its name, logo, trademark or brand identity displayed on our Platform or associated materials, or believe that its relationship with Agentic Finance has been inaccurately represented, we encourage its authorized representatives to contact us directly:'),
      list('Guy Kaufman, Head of Partnerships: guy@mnm.live', 'Tal Mor, Founder: tal@mnm.live'),
      p("Please include the organization's name and, where possible, the relevant webpage or material."),
      p('Upon receipt of a legitimate request, we will review it promptly and remove or correct the relevant representation in materials under our control within a reasonable timeframe.'),
      p("The absence of a removal request does not constitute consent, endorsement or authorization to use an organization's intellectual property."),
      h('Submitted Company Materials'),
      p('By submitting company descriptions, logos, biographies, photographs or other materials expressly intended for publication or promotion, you grant Agentic Finance a non-exclusive, worldwide, royalty-free license to display and use those materials for the relevant network, event or promotional purposes.'),
      p('You confirm that you possess the necessary rights and permissions to submit such materials.'),
      p('Information submitted privately through application or contact forms will not automatically be treated as material authorized for public publication.'),
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy and Personal Information',
    blocks: [
      p('Agentic Finance may collect and process personal and professional information through network applications, event registrations, contact forms, partnership inquiries, newsletter subscriptions and other interactions with the Platform.'),
      p('Personal information is processed in accordance with our Privacy Policy and applicable data protection laws.'),
      p('Information may be used for application management, event administration, business communications, relevant introductions and Platform operations, as described in our Privacy Policy.'),
      p('Marketing communications and disclosures to third parties will be managed in accordance with applicable legal requirements.'),
      p('Users may exercise their applicable data protection rights by contacting us.'),
    ],
  },
  {
    id: 'photography-media',
    title: 'Photography, Media and Event Coverage',
    blocks: [
      p('Agentic Finance events may include professional photography, video recording, interviews, livestreaming and media coverage.'),
      p('Such materials may be used for editorial, educational, documentary and promotional purposes, subject to applicable privacy laws, event notices and any required permissions.'),
      p('Additional consent may be requested where appropriate, including for interviews, testimonials or individually focused promotional materials.'),
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    blocks: [
      p('Users must not use the Platform to:'),
      list(
        'Engage in fraudulent, unlawful or misleading activities.',
        'Impersonate individuals or organizations.',
        'Distribute unsolicited commercial messages or harvest contact information.',
        'Conduct unauthorized fundraising or investment solicitations.',
        'Introduce malicious software or interfere with Platform security.',
        'Infringe intellectual property, privacy or other third-party rights.',
        'Engage in harassment, discrimination or abusive conduct.',
        'Misrepresent an affiliation, membership or partnership with Agentic Finance.',
      ),
      p('Agentic Finance reserves the right to restrict access or participation in response to violations of these Terms.'),
    ],
  },
  {
    id: 'third-party-services',
    title: 'Third-Party Services and External Links',
    blocks: [
      p('The Platform may contain links to external websites, media publications, registration platforms, partner organizations and third-party services.'),
      p('Agentic Finance does not control or assume responsibility for the content, security, privacy practices or availability of independent third-party services.'),
      p('Use of such services may be subject to their respective terms and privacy policies.'),
    ],
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer of Warranties',
    blocks: [
      p('The Platform and its informational resources are provided on an "as is" and "as available" basis.'),
      p('To the fullest extent permitted by applicable law, Agentic Finance makes no warranties regarding the accuracy, reliability, completeness, availability or suitability of the Platform or its content for any particular purpose.'),
      p('We do not guarantee uninterrupted access, error-free operation, business outcomes, successful fundraising, investment returns or commercial opportunities.'),
    ],
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    blocks: [
      p('To the fullest extent permitted by applicable law, More & More, Agentic Finance and their respective officers, employees, representatives and affiliates shall not be liable for indirect, incidental, consequential or special damages arising from the use of the Platform or participation in its ecosystem.'),
      p('This includes loss of profits, investment losses, lost business opportunities, reputational damage or losses resulting from independent third-party relationships.'),
      p('Nothing in these Terms excludes or restricts liability where such exclusion or restriction is prohibited by applicable law.'),
    ],
  },
  {
    id: 'force-majeure',
    title: 'Force Majeure',
    blocks: [
      p('Agentic Finance shall not be responsible for delays, interruptions or cancellations resulting from circumstances reasonably beyond its control, including natural disasters, geopolitical developments, security incidents, government restrictions, public health emergencies, transportation disruptions or infrastructure failures.'),
      p('Any applicable refund or rescheduling rights shall be determined in accordance with the relevant commercial agreements and applicable law.'),
    ],
  },
  {
    id: 'amendments',
    title: 'Amendments to These Terms',
    blocks: [
      p('Agentic Finance may update these Terms and Conditions periodically to reflect operational, technological, commercial or regulatory developments.'),
      p('The latest version will be made available on the Platform with an updated revision date.'),
      p('Where required by law, material changes will be communicated to affected users or submitted for renewed acceptance.'),
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing Law and Jurisdiction',
    blocks: [
      p('These Terms and Conditions shall be governed by and construed in accordance with the laws of the State of Israel.'),
      p('Any dispute arising out of or in connection with these Terms or the use of the Platform shall be subject to the jurisdiction of the competent courts of the State of Israel, without prejudice to any mandatory rights or protections afforded to users under applicable law.'),
    ],
  },
  {
    id: 'contact',
    title: 'Company and Contact Information',
    // The registered address is left out on purpose: it is a private home address (Guy, 26 Nov 2026).
    blocks: [
      lines(
        'Agentic Finance | More & More',
        'Legal Entity: MORE AND MORE B.D. LTD',
        'Company Registration Number: 517306296',
        'Country of Incorporation: Israel',
        'Business Inquiries: guy@mnm.live',
        'Management and Legal Inquiries: tal@mnm.live',
        'Finance: finance@mnm.live',
        'Website: https://agentic-finance.live',
        'Corporate Website: https://mnm.live',
      ),
    ],
  },
];

/** True while a piece of text still holds a placeholder such as "[applicable jurisdiction]". */
export const hasPlaceholder = (text: string) => /\[[^\]]+\]/.test(text);

/** The sections as they are shown: placeholder text left out, and any section left empty skipped. */
export function publishedTermsSections(): TermsSection[] {
  return termsSections
    .map((s) => ({
      ...s,
      blocks: s.blocks
        .map((b): TermsBlock | null => {
          if (b.kind === 'list') {
            const items = b.items.filter((i) => !hasPlaceholder(i));
            return items.length ? { ...b, items } : null;
          }
          if (b.kind === 'lines') {
            const l = b.lines.filter((i) => !hasPlaceholder(i));
            return l.length ? { ...b, lines: l } : null;
          }
          return hasPlaceholder(b.text) ? null : b;
        })
        .filter((b): b is TermsBlock => b !== null),
    }))
    .filter((s) => s.blocks.length > 0);
}

