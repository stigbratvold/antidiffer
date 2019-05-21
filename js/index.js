var animation = bodymovin.loadAnimation({
  container: document.getElementById("innsikt"), // Required
  path: "http://antidiffer.no/AntiDiffer_Shape_1.json", // Required
  renderer: "svg", // Required: svg/canvas/html
  loop: true, // Optional
  autoplay: true, // Optional
  name: "Innsikt" // Name for future reference. Optional.
});

var animation = bodymovin.loadAnimation({
  container: document.getElementById("design"), // Required
  path: "http://antidiffer.no/AntiDiffer_Shape_2.json", // Required
  renderer: "svg", // Required: svg/canvas/html
  loop: true, // Optional
  autoplay: true, // Optional
  name: "Design" // Name for future reference. Optional.
});

var animation = bodymovin.loadAnimation({
  container: document.getElementById("teknologi"), // Required
  path: "http://antidiffer.no/AntiDiffer_Shape_3.json", // Required
  renderer: "svg", // Required: svg/canvas/html
  loop: true, // Optional
  autoplay: true, // Optional
  name: "Teknologi" // Name for future reference. Optional.
});
