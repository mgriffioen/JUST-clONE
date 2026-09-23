// Fuzzy matching for the guesser's answer. An exact match was too strict for a
// party game — "bike" for "bicycle", "fridge" for "refrigerator", "noodle" for
// "noodles" or a fat-thumbed "elephnat" should all count. A guess is correct
// when, after normalizing, it:
//   1. equals the secret word or one of its accepted alternates (ALIASES),
//   2. differs only by a plural ending (s / es / ies), or
//   3. is a near-miss typo of a long word (see isTypoOf).
const { WORDS } = require('./words');

// Accepted alternates for deck words: short forms, synonyms, and regional or
// alternative spellings. Only list things a group would agree mean the same
// thing — not merely related words. Spacing/hyphens/case don't matter here.
const ALIASES = {
  // Everyday objects
  backpack: ['rucksack', 'knapsack', 'bookbag'],
  umbrella: ['brolly'],
  suitcase: ['valise'],
  wallet: ['billfold'],
  flashlight: ['torch'],
  sunglasses: ['shades'],
  wristwatch: ['watch'],
  mittens: ['mitts'],
  vacuum: ['hoover', 'vacuum cleaner'],
  stepladder: ['step ladder'],

  // Places
  cave: ['cavern'],
  harbor: ['harbour'],
  theater: ['theatre'],
  pharmacy: ['drugstore', 'chemist', 'apothecary'],
  laundromat: ['launderette', 'laundrette'],
  barbershop: ['barber', 'barbers'],
  junkyard: ['scrapyard'],
  cemetery: ['graveyard'],
  campsite: ['campground'],
  racetrack: ['race track', 'racecourse'],
  subway: ['underground', 'metro', 'tube'],

  // Animals
  seagull: ['gull'],
  ladybug: ['ladybird'],
  firefly: ['lightning bug'],
  starfish: ['sea star'],
  raccoon: ['racoon'],
  hyena: ['hyaena'],
  crocodile: ['croc'],
  kangaroo: ['roo'],

  // Food & drink
  donut: ['doughnut'],
  omelet: ['omelette'],
  lasagna: ['lasagne'],
  yogurt: ['yoghurt'],
  licorice: ['liquorice'],
  hummus: ['houmous', 'hummous'],
  ketchup: ['catsup'],
  eggplant: ['aubergine'],
  zucchini: ['courgette'],
  popsicle: ['ice lolly', 'ice pop'],
  burger: ['hamburger'],
  milkshake: ['shake'],
  guacamole: ['guac'],

  // People, roles & fictional figures
  astronaut: ['spaceman', 'cosmonaut'],
  firefighter: ['fireman'],
  referee: ['ref'],
  veterinarian: ['vet'],
  paramedic: ['emt'],
  waiter: ['waitress', 'server'],
  bartender: ['barman', 'barmaid'],
  babysitter: ['sitter'],
  stuntman: ['stuntwoman', 'stunt double'],
  janitor: ['custodian'],
  jeweler: ['jeweller'],
  archaeologist: ['archeologist'],
  lumberjack: ['logger'],
  author: ['writer'],
  pirate: ['buccaneer'],
  wizard: ['sorcerer', 'warlock'],
  detective: ['sleuth', 'private eye'],
  spy: ['secret agent'],
  alien: ['extraterrestrial', 'et'],
  robot: ['droid', 'android'],
  yeti: ['abominable snowman'],

  // Sports & games
  checkers: ['draughts'],
  billiards: ['pool'],
  bobsled: ['bobsleigh'],
  snorkeling: ['snorkelling', 'snorkel'],
  kayaking: ['kayak'],
  climbing: ['rock climbing'],
  diving: ['dive'],

  // Nature & weather
  tornado: ['twister'],
  hurricane: ['cyclone', 'typhoon'],
  tsunami: ['tidal wave'],
  aurora: ['northern lights', 'aurora borealis'],
  meteor: ['shooting star'],

  // Transportation
  bicycle: ['bike', 'pushbike', 'cycle'],
  motorcycle: ['motorbike'],
  submarine: ['sub'],
  helicopter: ['chopper'],
  limousine: ['limo'],
  taxi: ['cab', 'taxicab'],
  firetruck: ['fire engine'],
  elevator: ['lift'],
  trolley: ['tram', 'streetcar'],
  sled: ['sledge', 'sleigh', 'toboggan'],
  zeppelin: ['blimp', 'airship'],

  // Abstract / activities
  vacation: ['holiday'],
  sleepover: ['slumber party'],
  hiccup: ['hiccough'],
  nightmare: ['bad dream'],
  rumor: ['rumour'],

  // Household & school
  chalkboard: ['blackboard'],
  principal: ['headmaster', 'headmistress', 'headteacher'],
  gymnasium: ['gym'],
  laboratory: ['lab'],
  cafeteria: ['canteen', 'lunchroom'],
  refrigerator: ['fridge', 'icebox'],
  microwave: ['microwave oven'],
  faucet: ['tap'],
  bathtub: ['bath', 'tub'],
  mailbox: ['postbox', 'letterbox'],
  staircase: ['stairs', 'stairway'],
  attic: ['loft'],
  basement: ['cellar'],
  lawnmower: ['mower']
};

// Lowercase, strip accents, a leading article, and everything that isn't a
// letter or digit — so "The Hot-Air Balloon" and "hotairballoon" compare equal.
function normalizeGuess(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/^(a|an|the)\s+/, '')
    .replace(/[^a-z0-9]/g, '');
}

// The word plus its likely singular forms. Comparing these sets in both
// directions means "noodle" matches "noodles" and "darts" matches "dart".
function stems(word) {
  const forms = new Set([word]);
  if (word.length > 3 && word.endsWith('s')) forms.add(word.slice(0, -1));
  if (word.length > 4 && word.endsWith('es')) forms.add(word.slice(0, -2));
  if (word.length > 4 && word.endsWith('ies')) forms.add(word.slice(0, -3) + 'y');
  return forms;
}

function sameStem(a, b) {
  const bForms = stems(b);
  return [...stems(a)].some((form) => bForms.has(form));
}

// Optimal string alignment distance: Levenshtein plus adjacent swaps, so
// "elephnat" is one edit from "elephant".
function editDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

// Every deck word and alias, normalized. A guess that is itself one of these
// is a deliberate answer, never a typo — that keeps "tailor" from counting as
// a misspelt "sailor", or "baker" as "bakery".
const KNOWN_ANSWERS = new Set(
  [...WORDS, ...Object.values(ALIASES).flat()].map(normalizeGuess)
);

// Typos are only forgiven on longer words, where one slip can't turn it into
// a different common word (short words like "moose"/"mouse" are too close).
// The first letter must match: people rarely mistype it, and different words
// often differ only there.
function isTypoOf(guess, target) {
  if (target.length < 6 || guess[0] !== target[0]) return false;
  if (KNOWN_ANSWERS.has(guess)) return false;
  const allowed = target.length >= 10 ? 2 : 1;
  if (Math.abs(guess.length - target.length) > allowed) return false;
  return editDistance(guess, target) <= allowed;
}

function acceptedAnswers(secret) {
  const key = String(secret || '').toLowerCase();
  return [secret, ...(ALIASES[key] || [])].map(normalizeGuess).filter(Boolean);
}

function isCorrectGuess(guess, secret) {
  const g = normalizeGuess(guess);
  if (!g) return false;
  return acceptedAnswers(secret).some(
    (answer) => sameStem(g, answer) || isTypoOf(g, answer)
  );
}

module.exports = { isCorrectGuess, normalizeGuess, ALIASES };
