// An original word list curated for "one-word clue" party guessing games.
// Mix of concrete nouns, places, people/roles, animals, food, and everyday
// concepts that most groups of adults can give a clean single-word clue for.
const WORDS = [
  // Everyday objects
  'umbrella', 'toothbrush', 'backpack', 'candle', 'mirror', 'blanket', 'ladder',
  'suitcase', 'pillow', 'wallet', 'scissors', 'hammer', 'anchor', 'compass',
  'telescope', 'balloon', 'lantern', 'whistle', 'trophy', 'necklace', 'bracelet',
  'crown', 'shield', 'sword', 'flag', 'kite', 'drum', 'violin', 'trumpet',
  'guitar', 'piano', 'camera', 'clock', 'calendar', 'envelope', 'stamp',
  'map', 'key', 'lock', 'chain', 'rope', 'net', 'basket', 'bucket', 'broom',
  'vacuum', 'blender', 'toaster', 'kettle', 'thermometer', 'battery', 'magnet',
  'microscope', 'binoculars', 'flashlight', 'matches', 'firework', 'bubble',

  // Places
  'volcano', 'island', 'desert', 'jungle', 'glacier', 'canyon', 'waterfall',
  'lighthouse', 'castle', 'pyramid', 'cave', 'bridge', 'tunnel', 'airport',
  'harbor', 'library', 'museum', 'stadium', 'palace', 'temple', 'market',
  'farm', 'zoo', 'aquarium', 'playground', 'cemetery', 'campsite', 'oasis',
  'peninsula', 'valley', 'cliff', 'meadow', 'swamp', 'reef', 'iceberg',
  'greenhouse', 'windmill', 'skyscraper', 'cabin', 'cottage', 'tent',

  // Animals
  'penguin', 'giraffe', 'octopus', 'kangaroo', 'dolphin', 'elephant', 'gorilla',
  'flamingo', 'peacock', 'hedgehog', 'squirrel', 'raccoon', 'otter', 'walrus',
  'chameleon', 'scorpion', 'jellyfish', 'butterfly', 'firefly', 'woodpecker',
  'ostrich', 'platypus', 'koala', 'panda', 'cheetah', 'crocodile', 'tortoise',
  'seahorse', 'lobster', 'beaver', 'bat', 'owl', 'eagle', 'shark', 'whale',

  // Food & drink
  'pancake', 'pretzel', 'popcorn', 'spaghetti', 'sushi', 'taco', 'burrito',
  'pizza', 'lasagna', 'omelet', 'pancake', 'waffle', 'croissant', 'baguette',
  'donut', 'cupcake', 'pudding', 'marshmallow', 'lemonade', 'smoothie',
  'avocado', 'pineapple', 'watermelon', 'coconut', 'mango', 'strawberry',
  'broccoli', 'mushroom', 'garlic', 'cinnamon', 'honey', 'pretzel', 'peanut',
  'popsicle', 'milkshake', 'sandwich', 'burger', 'noodles', 'dumpling',

  // People, roles & fictional figures
  'astronaut', 'pirate', 'wizard', 'detective', 'firefighter', 'lifeguard',
  'referee', 'surgeon', 'dentist', 'plumber', 'electrician', 'librarian',
  'photographer', 'chef', 'farmer', 'sailor', 'knight', 'ninja', 'superhero',
  'vampire', 'mermaid', 'dragon', 'unicorn', 'robot', 'alien', 'ghost',
  'zombie', 'clown', 'juggler', 'acrobat', 'magician', 'explorer', 'scientist',
  'teacher', 'artist', 'musician', 'author', 'president', 'king', 'queen',

  // Sports & games
  'basketball', 'volleyball', 'badminton', 'bowling', 'archery', 'gymnastics',
  'skateboard', 'surfboard', 'snowboard', 'marathon', 'triathlon', 'wrestling',
  'checkers', 'dominoes', 'crossword', 'puzzle', 'chess', 'karate', 'fencing',
  'hockey', 'cricket', 'rugby', 'golf', 'tennis', 'boxing', 'diving',

  // Nature & weather
  'rainbow', 'hurricane', 'tornado', 'avalanche', 'earthquake', 'blizzard',
  'thunder', 'lightning', 'eclipse', 'meteor', 'galaxy', 'comet', 'sunrise',
  'sunset', 'frost', 'drought', 'monsoon', 'tsunami', 'mountain', 'river',
  'forest', 'ocean', 'coral', 'crystal', 'boulder', 'moss',

  // Transportation
  'submarine', 'helicopter', 'rocket', 'canoe', 'sailboat', 'bulldozer',
  'tractor', 'scooter', 'bicycle', 'motorcycle', 'skateboard', 'wheelchair',
  'elevator', 'escalator', 'parachute', 'hot-air balloon', 'sled', 'raft',

  // Abstract / activities
  'birthday', 'wedding', 'vacation', 'graduation', 'reunion', 'festival',
  'carnival', 'parade', 'auction', 'interview', 'rehearsal', 'meditation',
  'karaoke', 'campfire', 'picnic', 'bonfire', 'harvest', 'recycling',
  'gravity', 'friendship', 'silence', 'echo', 'shadow', 'reflection',
  'gossip', 'trust', 'courage', 'patience', 'curiosity', 'nostalgia',

  // Household & school
  'backpack', 'chalkboard', 'notebook', 'calculator', 'globe', 'textbook',
  'homework', 'recess', 'locker', 'uniform', 'yearbook', 'diploma',
  'thermostat', 'doorbell', 'mailbox', 'fireplace', 'chimney', 'attic',
  'basement', 'balcony', 'staircase', 'closet', 'curtain', 'chandelier'
];

// De-duplicate (a couple of words like "pancake" and "backpack" appear
// twice above across categories) and freeze the list.
const UNIQUE_WORDS = Object.freeze([...new Set(WORDS)]);

function createWordDeck() {
  const deck = [...UNIQUE_WORDS];
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

module.exports = { WORDS: UNIQUE_WORDS, createWordDeck };
