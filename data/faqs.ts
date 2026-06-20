import { site } from "@/data/site";

export interface FAQ {
  question: string;
  answer: string;
}

const fullAddress = `${site.address.line1}, ${site.address.suburb} ${site.address.state} ${site.address.postcode}`;

export const generalFAQs: FAQ[] = [
  {
    question: "Where is Arrow Industries based?",
    answer: `Our workshop is at ${fullAddress} — north of Melbourne, easy access from the Hume Freeway and the Western and Metropolitan Ring Roads.`,
  },
  {
    question: "Do you build to spec or work from a catalogue?",
    answer:
      "Every Arrow body and trailer is built to your spec. We work from your application, payload and chassis to size and configure the unit — there's no off-the-shelf range.",
  },
  {
    question: "What lead times should I expect?",
    answer:
      "Lead times depend on workload and spec, but most custom builds run between 6 and 14 weeks from confirmed order. Repairs and roadworthy work are usually scheduled within days.",
  },
  {
    question: "Do you service trucks you didn't build?",
    answer:
      "Yes. Our workshop services and repairs tippers, dog trailers and semis of any make. Hydraulics, structural welding, modifications and roadworthy testing all welcome.",
  },
];
