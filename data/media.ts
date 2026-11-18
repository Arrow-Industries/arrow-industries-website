/**
 * Real Arrow photography, graded to one consistent look. When replacing a
 * photo, give the new file a new version number: browsers cache these by name.
 */
const photo = (name: string, alt: string) => ({ src: `/images/site/${name}-v1.jpg`, alt });

export const media = {
  tipperGraphite: photo("tipper-graphite", "Graphite Arrow tipper body on an 8x4 truck"),
  tipperGraphiteRear: photo("tipper-graphite-rear", "Rear three-quarter view of a graphite Arrow tipper body"),
  tipperWhite: photo("tipper-white", "White Arrow tipper body raised on its hoist"),
  tipperRear: photo("tipper-rear", "White Arrow tipper body seen from the rear"),
  tailgate: photo("tailgate-rear", "Rear tailgate of an Arrow tipper body"),
  sitrak: photo("sitrak-front", "SITRAK truck fitted with an Arrow tipper body"),
  scania: photo("scania-tipper", "Scania truck fitted with an Arrow tipper body"),
  scaniaGraphite: photo("scania-graphite", "Scania truck with a graphite Arrow tipper body"),
  mercedes: photo("mercedes-tipper", "Mercedes-Benz truck fitted with an Arrow tipper body"),
  truckAndDogDusk: photo("truck-and-dog-dusk", "Scania truck and Arrow dog trailer combination at dusk"),
  truckAndDog: photo("truck-and-dog", "Truck and dog combination with graphite Arrow bodies"),
  dogWhite: photo("dog-trailer-white", "White Arrow 3-axle dog trailer"),
  dogSide: photo("dog-trailer-side", "Graphite Arrow 4-axle dog trailer, side view"),
  dogGraphite: photo("dog-trailer-graphite", "Graphite Arrow dog trailer showing its drawbar"),
  welding: photo("welding", "Arrow fabricator welding in the Campbellfield workshop"),
  paintBooth: photo("paint-booth", "Arrow body in the paint booth"),
  paintPrep: photo("paint-prep", "Truck cab masked for painting at the Arrow workshop"),
  bodyPainted: photo("body-painted", "Freshly painted Arrow tipper body in the workshop"),
  workshop: photo("workshop-front", "Truck outside the Arrow Industries workshop in Campbellfield"),
  onSite: photo("on-site-loading", "Arrow body being loaded by an excavator on site"),
} as const;

export type Photo = (typeof media)[keyof typeof media];
