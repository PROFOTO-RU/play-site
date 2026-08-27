export type LanguageMode = 'RUS' | 'ENG' | 'MIX';

export const RUSSIAN_WORDS = [
  'КОВБОЙ', 'НЕСЕТ', 'ОВОЩ', 'РОБОТ', 'БЕЖИТ', 'ЛАЗЕР', 'КОТ', 'ПРЫГАЕТ',
  'АРБУЗ', 'ХАКЕР', 'ВЗЛАМЫВАЕТ', 'СЕРВЕР', 'ШЕФ', 'ГОТОВИТ', 'ПИЦЦА',
  'НИНДЗЯ', 'ТАНЦУЕТ', 'КОСМОС', 'ДРОН', 'СНИМАЕТ', 'ВУЛКАН', 'ДРАКОН',
  'ЛЕТИТ', 'МОЛНИЯ', 'ГЕЙМЕР', 'СТРИМИТ', 'РЕКОРД', 'САМУРАЙ', 'РЕЖЕТ',
  'НЕОН', 'МАШИНА', 'ДРИФТУЕТ', 'НОЧЬ', 'ТРЕНД', 'МЕМ', 'СПОРТСМЕН',
  'КАЧАЕТ', 'МАГИЯ', 'ФОКУС', 'ТЕЛЕПОРТ', 'МОНСТР', 'ЗОМБИ', 'ГОРОД',
  'БОЕЦ', 'ГОНЩИК', 'СКОРОСТЬ', 'КОСМОНАВТ', 'ЛУНА', 'ГЕНИЙ', 'ПАРКУР',
  'ПОБЕДА', 'ПРИКОЛ', 'ЭПИК', 'ТАЙНА', 'ВЗРЫВ', 'КИБОРГ', 'ПЛАНЕТА',
  'ГИТАРА', 'ШОУ', 'ОГОНЬ', 'ЛЕД', 'ОХОТНИК', 'СУПЕРГЕРОЙ', 'ТИТАН',
  'АНИМЕ', 'МЕХА', 'ДЖЕТПАК', 'ПОРТАЛ', 'ШТОРМ', 'БИТВА', 'ТУРБО', 'БОСС'
];

export const ENGLISH_WORDS = [
  'COWBOY', 'CARRIES', 'VEGETABLE', 'ROBOT', 'RUNS', 'LASER', 'CAT',
  'JUMPS', 'WATERMELON', 'HACKER', 'BREACHES', 'SERVER', 'CHEF', 'COOKS',
  'PIZZA', 'NINJA', 'DANCES', 'COSMOS', 'DRONE', 'FILMS', 'VOLCANO',
  'DRAGON', 'FLIES', 'LIGHTNING', 'GAMER', 'STREAMS', 'RECORD', 'SAMURAI',
  'SLICES', 'NEON', 'CYBER', 'DRIFTS', 'NIGHT', 'TREND', 'MEME', 'ATHLETE',
  'LIFTS', 'WORKOUT', 'MAGIC', 'TRICK', 'TELEPORT', 'MONSTER', 'ZOMBIE',
  'CITY', 'FIGHTER', 'RACER', 'SPEED', 'ASTRONAUT', 'MOON', 'GENIUS',
  'PARKOUR', 'VICTORY', 'FUNNY', 'EPIC', 'SECRET', 'EXPLOSION', 'CYBORG',
  'PLANET', 'GUITAR', 'SHOW', 'FIRE', 'ICE', 'HUNTER', 'SUPERHERO',
  'POWER', 'TITAN', 'ANIME', 'MECHA', 'JETPACK', 'PORTAL', 'STORM', 'TURBO'
];

// Curated verified YouTube Shorts & video IDs for guaranteed instant playback fallback
export const CURATED_FALLBACK_IDS = [
  'aqz-KE-bpKQ', // Big Buck Bunny animated short
  'dQw4w9WgXcQ', // Classic music hit
  'kffacxfA7G4', // Justin Bieber Baby
  '9bZkp7q19f0', // Gangnam Style
  'fJ9rUzIMcZQ', // Queen Bohemian Rhapsody
  'kJQP7kiw5Fk', // Despacito
  'CevxZvSJLk8', // Katy Perry Roar
  'OPf0YbXqDm0', // Mark Ronson Uptown Funk
  'hT_nvWreIhg', // OneRepublic Counting Stars
  'JGwWNGJdvx8', // Ed Sheeran Shape of You
  'RgKAFK5djSk', // Wiz Khalifa See You Again
  'e-ORhEE9VVg', // Blank Space
  'uelHwf8o7_U', // Eminem Love The Way You Lie
  '09R8_2nJtjg', // Maroon 5 Sugar
  'YQHsXMglC9A', // Adele Hello
  'fRh_vgS2dFE', // Justin Bieber Sorry
  'L0MK7qz13bU', // Frozen Let It Go
  '2Vv-BfVoq4g', // Ed Sheeran Perfect
  '60ItHLz5WEA', // Alan Walker Faded
  'pB-5XG-DbAA'  // Sia Chandelier
];

export function getRandomWords(mode: LanguageMode, count = 3): string[] {
  let pool: string[] = [];

  if (mode === 'RUS') {
    pool = [...RUSSIAN_WORDS];
  } else if (mode === 'ENG') {
    pool = [...ENGLISH_WORDS];
  } else {
    // MIX: combine both lists
    pool = [...RUSSIAN_WORDS, ...ENGLISH_WORDS];
  }

  // Shuffle and pick `count` distinct words
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
