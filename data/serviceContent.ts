import type { FAQ } from "@/data/faqs";

export interface KeyFeature {
  title: string;
  description: string;
}

export interface BuildOption {
  title: string;
  description: string;
}

export interface ServiceContent {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lede: string;
  intro: string;
  keyFeatures: KeyFeature[];
  useCases: string[];
  buildOptions: BuildOption[];
  compliance: string[];
  faqs: FAQ[];
  ctaHeading: string;
  ctaBody: string;
  ctaPrimaryLabel?: string;
}

export const serviceContent: Record<string, ServiceContent> = {
  "tipper-truck-bodies": {
    metaTitle: "Tipper Truck Bodies — Custom Built for Civil, Quarry, Haulage & Waste",
    metaDescription:
      "Custom tipper bodies engineered to your chassis, payload and application. Built for civil, quarry, haulage and waste operators. ADR-compliant, fabricated in-house.",
    h1: "Tipper bodies built for demanding payloads, day in, day out.",
    lede: "Custom tipper bodies engineered to your chassis, payload and application — built for civil, quarry, haulage and waste operations.",
    intro:
      "Every Arrow tipper is purpose-built around the job. We start with your application, payload and operating environment, then engineer a body that's sized for legal payload, balanced for the chassis and finished to handle daily punishment.",
    keyFeatures: [
      {
        title: "Configured for legal payload",
        description:
          "Body length, height and floor gauge sized to chassis, application and target payload.",
      },
      {
        title: "Balanced for the chassis",
        description:
          "Sub-frame and hoist engineered to spread load and handle hoist forces without flex or fatigue.",
      },
      {
        title: "Built to handle the load",
        description:
          "Floor and wall plates spec'd to your material — standard duty through to abrasion-rated builds.",
      },
      {
        title: "Tailgates to suit the job",
        description:
          "Barn-door, top-hinged, sealed waste or grain — engineered with the right seal and latch system.",
      },
      {
        title: "Hoists matched to cycle",
        description:
          "Front, twin-ram or under-body hoists configured to your dump cycle and tipping environment.",
      },
      {
        title: "Tow members and coupling options",
        description:
          "28.5T and 34T rated tow members, compatible with ringfeeder, pintle and Bartlett ball couplings — configured to suit your trailer and operating setup.",
      },
    ],
    useCases: [
      "Civil construction site cycles",
      "Quarry and aggregate haulage",
      "Bulk grain and stockfeed",
      "Sand, soil and landscape supply",
      "Spoil removal and earthworks",
      "Asphalt and road maintenance",
      "Waste, recyclables and green waste",
      "Coal and mine-spec haulage",
    ],
    buildOptions: [
      {
        title: "Body length & height",
        description:
          "Sized to your chassis wheelbase and target payload. Side heights from 600mm to 1500mm+ to suit density and stability.",
      },
      {
        title: "Floor & wall thickness",
        description:
          "Floor and wall plate gauges spec'd to your loads — standard duty through to abrasion-rated builds for high-density material.",
      },
      {
        title: "Hoist configuration",
        description:
          "Front-mount, under-body twin-ram or scissor hoists. Cycle time and lift angle matched to your tipping environment.",
      },
      {
        title: "Tailgate & ladder rack",
        description:
          "Barn-door, top-hinged or grain-style tailgates with auto-latch options. Optional ladder racks, tarps and load covers.",
      },
      {
        title: "Hydraulics & PTO",
        description:
          "Truck-mounted PTO and pump matched to your hoist. Tank, valves and lines installed and pressure-tested before delivery.",
      },
      {
        title: "Lighting & compliance",
        description:
          "LED rear and side-marker lighting, reflective tape, mud flaps and rear-impact protection to ADR standard.",
      },
    ],
    compliance: [
      "Designed and built to ADR (Australian Design Rules) requirements",
      "Q&T 450 grade structural steel from accredited Australian suppliers",
      "PBS-aware design where access permits apply",
      "Hydraulics tested and certified before handover",
      "Roadworthy-ready — VicRoads Licensed Vehicle Testing available in-house",
      "Compliance plates, weight stamps and load-restraint guidance supplied",
    ],
    faqs: [
      {
        question: "Can you build to suit any chassis?",
        answer:
          "Yes. We've built tipper bodies for every major Japanese, European and American truck brand. Send us your chassis make, model and wheelbase and we'll size the body to suit.",
      },
      {
        question: "What lead time should I expect for a new tipper body?",
        answer:
          "Most tipper builds run 6–12 weeks from confirmed order, depending on workload, spec and finish. We'll confirm a date in writing before you commit.",
      },
      {
        question: "Do you offer fleet pricing for multiple bodies?",
        answer:
          "Yes — fleet operators ordering multiple identical units get scheduled build slots and pricing reflective of repeat work. Talk to us about your roll-out plan.",
      },
      {
        question: "Can I supply my own paint colour or fleet livery?",
        answer:
          "Absolutely. We finish to any 2-pack colour code you specify. If you need signage applied, we can coordinate with your preferred signwriter or recommend one.",
      },
      {
        question: "Do you back the work after delivery?",
        answer:
          "Yes — repairs, modifications and after-sales support are handled by the same workshop that built the unit. Coverage details are confirmed at order.",
      },
    ],
    ctaHeading: "Ready to spec your tipper?",
    ctaBody:
      "Tell us your application, payload and requirements — we'll come back with a build proposal and pricing.",
    ctaPrimaryLabel: "Request a Tipper Quote",
  },

  "dog-trailers": {
    metaTitle: "Dog Trailers — Engineered for Balance, Stability & Legal Payload",
    metaDescription:
      "Tri-axle and quad-axle dog trailers matched to your tipper for legal payload, balance and durability. Built for civil, quarry, haulage and bulk transport.",
    h1: "Dog trailers engineered for balance, stability and consistent haulage.",
    lede: "Tri-axle and quad-axle dog trailers matched to your tipper for legal payload, balance and durability.",
    intro:
      "A dog only earns its keep when it's matched properly. We pair each unit to the tipper it'll run behind — same construction, balanced axle loads and a drawbar geometry that handles real cornering and reversing.",
    keyFeatures: [
      {
        title: "Matched to your tipper",
        description:
          "Body, sub-frame and finish specified to mirror the lead unit — built as a working pair, not a mismatched combination.",
      },
      {
        title: "Tri or quad axle",
        description:
          "Tri-axle for general haulage, quad-axle for maximum legal payload under your access permit.",
      },
      {
        title: "Drawbar built for real loads",
        description:
          "Engineered drawbar with reinforced bushings and quality couplings — built for real cornering, not catalogue test cases.",
      },
      {
        title: "Air or mechanical suspension",
        description:
          "Air suspension for ride and load equalisation, mechanical for heavy off-highway use.",
      },
      {
        title: "Wear-rated body plate",
        description:
          "Same abrasion-resistant body construction as our tippers — dent-tolerant and easy to repair.",
      },
      {
        title: "Tow members and coupling options",
        description:
          "28.5T and 34T rated tow members, compatible with ringfeeder, pintle and Bartlett ball couplings — configured to suit your trailer and operating setup.",
      },
    ],
    useCases: [
      "Quarry and aggregate haulage",
      "Civil and earthworks contractors",
      "Bulk haulage and grain",
      "Coal and mine-spec haulage",
      "Sand and soil distribution",
      "Long-distance freight",
    ],
    buildOptions: [
      {
        title: "Axle group",
        description:
          "Tri-axle, quad-axle or specialist configurations to maximise mass under your access permit.",
      },
      {
        title: "Suspension & axles",
        description:
          "Air or mechanical suspension matched to load and route, with disc or drum brake options.",
      },
      {
        title: "Tailgate style",
        description:
          "Top-hinged, barn-door or sealed tailgate with manual or air-actuated latch.",
      },
      {
        title: "Body capacity",
        description:
          "Sized to match your tipper's volume and payload target — no mismatched combinations.",
      },
      {
        title: "Hoist (if tipping)",
        description:
          "Front-mount or under-body hoist matched to body length and tipping angle.",
      },
      {
        title: "Finish & livery",
        description:
          "2-pack paint to your fleet colour, signwriting-ready surface preparation.",
      },
    ],
    compliance: [
      "Designed and built to ADR (Australian Design Rules) requirements",
      "PBS-compatible builds available with appropriate access permits",
      "Drawbar and chassis welds inspected before handover",
      "Compliance plates, axle weights and tare certificates supplied",
      "Roadworthy-ready — VicRoads Licensed Vehicle Testing available in-house",
    ],
    faqs: [
      {
        question: "Can you build a dog to suit a tipper I already own?",
        answer:
          "Yes. Send us photos, dimensions and the tipper's payload spec. We'll design a dog that pairs cleanly — body height, hoist style, finish and capacity matched to the lead unit.",
      },
      {
        question: "What's the lead time on a new dog trailer?",
        answer:
          "Typical builds run 8–14 weeks depending on axle group, suspension and workload. We'll confirm in writing before you commit.",
      },
      {
        question: "Tri-axle or quad-axle — which should I choose?",
        answer:
          "Quad-axle gives you more legal mass under most access permits, but adds tare. Tri-axle is lighter and cheaper to operate. We'll help you weigh the trade-off against your typical payload.",
      },
      {
        question: "Do you offer PBS-compatible builds?",
        answer:
          "Yes — we can build dog trailers to suit PBS combinations where you've got the access permit in place. Send us the permit and we'll engineer to it.",
      },
    ],
    ctaHeading: "Ready to spec your dog trailer?",
    ctaBody:
      "Tell us your application, payload and requirements — we'll come back with a build proposal and pricing.",
    ctaPrimaryLabel: "Request a Dog Trailer Quote",
  },

  "semi-trailers": {
    metaTitle: "Semi Trailers — ADR-Compliant Tipping & Flat-Deck Builds",
    metaDescription:
      "Tipping and flat-deck semi trailers built to ADR and VicRoads standards. Focused on strength, efficiency and long-term use for bulk haulage and freight operators.",
    h1: "Semi trailers engineered for long-haul performance.",
    lede: "Tipping and flat-deck semi trailers built to ADR and VicRoads standards — focused on strength, efficiency and long-term use.",
    intro:
      "Our semi trailers are built around the load you'll actually carry. Tipping or flat-deck, single or B-double, we engineer the chassis, sub-frame and body to put your payload on the road safely and cost-effectively.",
    keyFeatures: [
      {
        title: "Engineered chassis",
        description:
          "Chassis rails sized to combination mass and route demands — strong where it counts, light where it doesn't.",
      },
      {
        title: "Tipping or flat-deck",
        description:
          "Tipping semis for bulk and quarry, flat-deck variants for general freight — both engineered around your payload.",
      },
      {
        title: "Running gear and coupling systems",
        description:
          "Configured for durability and matched to your load, route and trailer setup.",
      },
      {
        title: "PBS-aware design",
        description:
          "Built to PBS specifications where you've got access — suitable for B-double, A-double and rigid-and-dog combinations.",
      },
      {
        title: "Tipping bodies built to last",
        description:
          "Wear-rated body plate construction — long life, low maintenance, easy to repair.",
      },
      {
        title: "Tow members and coupling options",
        description:
          "28.5T and 34T rated tow members, compatible with ringfeeder, pintle and Bartlett ball couplings — configured to suit your trailer and operating setup.",
      },
    ],
    useCases: [
      "Bulk haulage and inter-regional freight",
      "Quarry and aggregate distribution",
      "Sand, soil and landscape supply",
      "Construction site material delivery",
      "Grain and stockfeed",
      "B-double and A-double operations",
    ],
    buildOptions: [
      {
        title: "Tipping or flat-deck",
        description:
          "Tipping semis for bulk and quarry; flat-deck variants for general freight.",
      },
      {
        title: "Axle configuration",
        description:
          "Tri-axle and quad-axle groups, PBS-compatible spreads, lift-axle options.",
      },
      {
        title: "Suspension",
        description:
          "Air-bag suspension with load-equalisation, or mechanical for heavy-duty applications.",
      },
      {
        title: "Brakes & ABS/EBS",
        description:
          "Disc or drum brakes with ABS/EBS to ADR, plus roll-stability options where required.",
      },
      {
        title: "Body length & spec",
        description:
          "Body length, side height and tailgate style matched to your typical payload and dump environment.",
      },
      {
        title: "Lighting & compliance",
        description:
          "LED running, marker and stop lights, reflective tape and rear-impact protection to ADR.",
      },
    ],
    compliance: [
      "Designed and built to ADR (Australian Design Rules) requirements",
      "PBS-compatible builds available with appropriate access permits",
      "ABS/EBS and braking systems tested before handover",
      "Compliance plates, axle weights and VIN supplied",
      "Roadworthy-ready — VicRoads Licensed Vehicle Testing available in-house",
    ],
    faqs: [
      {
        question: "Can you build B-double sets?",
        answer:
          "Yes. We build matched A and B trailers for B-double combinations and can spec them to your prime mover and access permit.",
      },
      {
        question: "What's a typical semi-trailer lead time?",
        answer:
          "Most semi trailer builds run 10–16 weeks from confirmed order, depending on configuration and finish. We'll confirm a delivery date in writing before you commit.",
      },
      {
        question: "Do you handle registration paperwork?",
        answer:
          "We provide compliance documentation, weight plates and a roadworthy certificate. Final registration is handled with VicRoads — we can guide you through the process.",
      },
      {
        question: "Can you supply spec drawings before I commit?",
        answer:
          "Yes. We provide GA drawings and a written spec for review before any deposit. Sign-off happens before steel is cut.",
      },
    ],
    ctaHeading: "Ready to spec your semi trailer?",
    ctaBody:
      "Tell us your application, payload and requirements — we'll come back with a build proposal and pricing.",
    ctaPrimaryLabel: "Request a Semi Trailer Quote",
  },

  "repairs-servicing": {
    metaTitle: "Truck Repairs & Servicing Melbourne — Tipper, Trailer, Hydraulics",
    metaDescription:
      "Truck body and trailer repairs in Melbourne. Hydraulics, structural welding, modifications and preventative servicing in our Campbellfield workshop.",
    h1: "Truck body and trailer repairs, in Melbourne.",
    lede: "Hydraulics, structural welding, modifications and preventative servicing — for tippers, dogs and semis of any make.",
    intro:
      "Our workshop services and repairs the trucks we build — and the trucks we didn't. Whether you've put a body through a hard year, need a tailgate rebuilt, want a hoist serviced or need a structural repair after an incident, our team can get the unit back on the road. We work on every major brand, supply genuine and quality aftermarket parts, and turn jobs around fast.",
    keyFeatures: [
      {
        title: "Structural welding & repair",
        description:
          "Cracked rails, fatigued cross-members, repair after collision or rollover. Engineering-led structural fixes that bring the unit back to compliance.",
      },
      {
        title: "Hydraulics service",
        description:
          "Hoist repair, ram resealing, valve replacement, hydraulic line and pump work. Pressure-tested before the unit leaves the floor.",
      },
      {
        title: "Tailgate & body repair",
        description:
          "Rebuilds for tailgates, side-walls, headboards, ladder racks and sub-frames. Body sections re-skinned in matching steel.",
      },
      {
        title: "Modifications & retrofits",
        description:
          "Headboard upgrades, body extensions, hoist upgrades, lighting retrofits, tarp systems — engineered to fit and finish like factory.",
      },
      {
        title: "Preventative servicing",
        description:
          "Scheduled inspection, hoist service, brake adjustment, axle and suspension checks. Minor jobs handled before they become major bills.",
      },
      {
        title: "Genuine & quality parts",
        description:
          "Stocked components from JOST, SAF-Holland, WABCO, Hella and Wurth. Right parts, fitted right, the first time.",
      },
    ],
    useCases: [
      "Post-collision body and chassis repair",
      "Hoist not lifting or holding pressure",
      "Cracked tipper floor or wall",
      "Damaged tailgate and latch system",
      "Suspension or axle replacement",
      "Brake system overhaul",
      "Lighting and electrical fault diagnosis",
      "Pre-sale or pre-lease vehicle prep",
    ],
    buildOptions: [
      {
        title: "Diagnostic inspection",
        description:
          "Bring the unit in, we'll inspect, photograph the issues and quote in writing before any work starts.",
      },
      {
        title: "Insurance work",
        description:
          "We work with major heavy-vehicle insurers and can manage assessor inspections and quoting from our workshop.",
      },
      {
        title: "Roadworthy combo",
        description:
          "Pair repair work with an in-house roadworthy inspection — get the unit fixed and certified in one workshop visit.",
      },
      {
        title: "Fleet servicing",
        description:
          "Scheduled servicing for fleet operators — set inspection intervals, predictable downtime, predictable bills.",
      },
    ],
    compliance: [
      "Structural repairs documented for insurance and engineering sign-off",
      "Hydraulic systems pressure-tested before handover",
      "Roadworthy-ready repairs — RWC available in-house",
      "Genuine and quality aftermarket parts only",
      "Workshop staff with 25+ years of heavy-vehicle experience",
    ],
    faqs: [
      {
        question: "Do you only service trucks Arrow built?",
        answer:
          "No — we service tippers, dog trailers and semis of any make. If it's heavy and it tips, hauls or carries, we can work on it.",
      },
      {
        question: "Can you handle insurance repairs?",
        answer:
          "Yes. We work with the major heavy-vehicle insurers, host assessor inspections in our workshop, and quote in line with their assessment process.",
      },
      {
        question: "How quickly can you book me in?",
        answer:
          "Diagnostic inspections are usually within a week. Repair scheduling depends on parts availability and workshop load — we'll give you a realistic in-and-out time before you commit.",
      },
      {
        question: "Can I get a roadworthy at the same time?",
        answer:
          "Yes. We're a VicRoads-licensed testing station, so you can have repairs and a roadworthy certificate done in one workshop visit.",
      },
    ],
    ctaHeading: "Truck body or trailer needs work?",
    ctaBody:
      "Bring it to our Campbellfield workshop. We'll inspect, quote in writing and book you in fast.",
    ctaPrimaryLabel: "Book a Repair",
  },

  "licensed-vehicle-testing": {
    metaTitle: "Roadworthy Certificates Campbellfield — Heavy Vehicle Testing",
    metaDescription:
      "VicRoads Licensed Vehicle Testing (LVT) in Campbellfield. Roadworthy certificates for heavy and light vehicles. Same-day where possible.",
    h1: "Roadworthy certificates, Campbellfield workshop.",
    lede: "VicRoads-licensed vehicle testing for heavy and light vehicles. Fast turnaround, on-site inspections, certificates issued same-day where possible.",
    intro:
      "We're a VicRoads Licensed Vehicle Testing (LVT) station — which means we can issue roadworthy certificates for heavy vehicles, trailers and light vehicles directly from our Campbellfield workshop. Selling a truck? Re-registering? Bringing a unit back from interstate? Book it in, drop it off, and we'll have it back on the road compliant.",
    keyFeatures: [
      {
        title: "Heavy vehicle RWCs",
        description:
          "Roadworthy testing for prime movers, rigid trucks, tippers, dog trailers and semi trailers.",
      },
      {
        title: "Light vehicle RWCs",
        description:
          "Cars, utes and light commercials — tested and certified in our same workshop.",
      },
      {
        title: "Same-day where possible",
        description:
          "Most inspections are completed within a few hours. Minor defects can often be repaired and re-tested in the same visit.",
      },
      {
        title: "Trailer & body inspections",
        description:
          "Specialist knowledge of tipper bodies, dog trailers and semi-trailer construction — built into the inspection.",
      },
      {
        title: "On-site repair capability",
        description:
          "Defects? Our workshop can repair lights, brakes, suspension, tailgates and structural issues so you leave with a certificate.",
      },
      {
        title: "VicRoads-licensed",
        description:
          "Fully licensed Vehicle Testing station — your certificate is recognised by VicRoads for registration and transfer.",
      },
    ],
    useCases: [
      "Selling a heavy vehicle privately",
      "Re-registering an unregistered truck or trailer",
      "Interstate vehicle relocation to Victoria",
      "Pre-purchase inspection before buying second-hand",
      "Annual fleet inspection and compliance",
      "Light vehicle private sale or transfer",
    ],
    buildOptions: [
      {
        title: "Standard RWC inspection",
        description:
          "Walk-through inspection covering brakes, lights, suspension, tyres, structure and emissions. Certificate issued on pass.",
      },
      {
        title: "Inspection + repair",
        description:
          "Fail items repaired in-house and the unit re-inspected the same day where workshop load allows.",
      },
      {
        title: "Pre-purchase inspection",
        description:
          "Independent inspection report before you buy — we'll tell you what's good, what's questionable and what'll cost.",
      },
      {
        title: "Fleet inspection block",
        description:
          "Bulk fleet inspections scheduled for predictable downtime and predictable cost.",
      },
    ],
    compliance: [
      "VicRoads Licensed Vehicle Testing station — certificates accepted statewide",
      "Heavy vehicle and light vehicle scope",
      "Inspectors with 25+ years of heavy-vehicle workshop experience",
      "Repair work done in the same workshop — no shuffling between providers",
      "Documented inspection reports supplied with every certificate",
    ],
    faqs: [
      {
        question: "How long does a roadworthy take?",
        answer:
          "Most inspections take 60–90 minutes. If anything fails, we'll talk through repair options and re-test the same day where possible.",
      },
      {
        question: "Do I need to book in advance?",
        answer:
          "Yes — booking is recommended, especially for heavy vehicles. Call us or fill in the quote form and we'll come back with the next available slot.",
      },
      {
        question: "What does a roadworthy cost?",
        answer:
          "Cost depends on vehicle type. Light vehicles, rigid trucks, prime movers and trailers are priced separately. Phone us for a current price list — there are no hidden charges.",
      },
      {
        question: "What if my vehicle fails?",
        answer:
          "We'll give you a defect list in writing. You can have us repair it in the same workshop and re-inspect, or take it elsewhere — the choice is yours.",
      },
    ],
    ctaHeading: "Need a roadworthy certificate?",
    ctaBody:
      "Book your heavy or light vehicle in for a VicRoads-licensed inspection at our Campbellfield workshop.",
    ctaPrimaryLabel: "Book a Roadworthy",
  },
};

export const getServiceContent = (slug: string) => serviceContent[slug];
