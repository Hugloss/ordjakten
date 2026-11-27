/*
 * Editorial layer: explicit, concept-aware picture distractors.
 * Only IDs listed here are eligible for the picture-only level.
 * Images are never inferred from a word automatically. In particular,
 * grumlig, skrovlig and bucklig are NOT illustrated by generic objects.
 * All emoji choices require a real-device editorial check before wide release.
 */
window.ORDJAKTEN_CURATION = {
  // Editorial relevance for children, not measured word-frequency rankings.
  // These remain in the library and the explicitly chosen extension level.
  extensionWords: [
    'sv-0040','sv-0063','sv-0096','sv-0097','sv-0099','sv-0101','sv-0102',
    'sv-0103','sv-0104','sv-0105','sv-0106','sv-0107','sv-0111','sv-0113',
    'sv-0115','sv-0116','sv-0117','sv-0118','sv-0120','sv-0121'
  ],
  extensionExpressions: ['ut-0014','ut-0017','ut-0026','ut-0027','ut-0028','ut-0035','ut-0041','ut-0042'],
  // A harder round can use familiar words about feelings, cooperation and
  // instructions. It does not need to replace them with literary vocabulary.
  hardWords: [
    'sv-0071','sv-0072','sv-0073','sv-0074','sv-0075','sv-0076','sv-0077',
    'sv-0078','sv-0079','sv-0080','sv-0081','sv-0082','sv-0083','sv-0084',
    'sv-0085','sv-0086','sv-0087','sv-0088','sv-0089','sv-0090','sv-0091',
    'sv-0092','sv-0093','sv-0094','sv-0095'
  ],
  easy: {
    'sv-0002': [['🪨','Sten'], ['🔑','Nyckel'], ['🥄','Sked']],
    'sv-0004': [['🍌','Banan'], ['🧸','Nalle'], ['🥒','Gurka']],
    'sv-0007': [['🪵','Vedträ'], ['🧦','Strumpa'], ['🥔','Potatis']],
    'sv-0013': [['🧸','Nalle'], ['🪶','Fjäder'], ['🏀','Boll']],
    'sv-0016': [['📕','Bok'], ['🚪','Dörr'], ['📏','Linjal']],
    'sv-0017': [['🐟','Fisk'], ['🐍','Orm'], ['🐸','Groda']],
    'sv-0018': [['📕','Bok'], ['🪨','Sten'], ['🧸','Nalle']],
    'sv-0022': [['🐞','Nyckelpiga'], ['🐘','Elefant'], ['🐸','Groda']],
    'sv-0023': [['🦓','Zebra'], ['🐘','Elefant'], ['🐸','Groda']],
    'sv-0027': [['🌷','Tulpan'], ['🌻','Solros'], ['🌲','Gran']],
    'sv-0028': [['🧊','Isbit'], ['🍦','Glass'], ['🍎','Äpple']],
    'sv-0034': [['⚽','Fotboll'], ['🎲','Tärning'], ['🍊','Apelsin']],
    'sv-0035': [['🪑','Stol'], ['🪨','Sten'], ['🧱','Tegelsten']],
    'sv-0037': [['📕','Bok'], ['🧸','Nalle'], ['🧱','Tegelsten']],
    'sv-0046': [['☀️','Solsken'], ['🌨️','Snöfall'], ['🌫️','Dimma']],
    'sv-0047': [['☀️','Solsken'], ['🌧️','Regn'], ['🌫️','Dimma']],
    'sv-0048': [['🌨️','Snöfall'], ['🌧️','Regn'], ['🌫️','Dimma']],
    'sv-0049': [['☀️','Solsken'], ['🌈','Regnbåge'], ['🌪️','Tornado']],
    'sv-0050': [['☀️','Solsken'], ['🌈','Regnbåge'], ['🌨️','Snöfall']],
    'sv-0051': [['☀️','Solsken'], ['🌈','Regnbåge'], ['🌨️','Snöfall']],
    'sv-0052': [['🔥','Eld'], ['☀️','Sol'], ['☕','Varm dryck']],
    'sv-0053': [['🧊','Isbit'], ['❄️','Snöflinga'], ['🥶','Fruset ansikte']],
    'sv-0054': [['🏊','Simmare'], ['🏃','Löpare'], ['🚶','Gående']],
    'sv-0055': [['🏃','Löpare'], ['🛫','Flygplan'], ['🚴','Cyklist']],
    'sv-0056': [['🏃','Löpare'], ['🏊','Simmare'], ['🚴','Cyklist']],
    'sv-0057': [['🏊','Simmare'], ['🛫','Flygplan'], ['😴','Sovande ansikte']],
    'sv-0059': [['😢','Ansikte med tår'], ['😨','Skrämt ansikte'], ['😮','Förvånat ansikte']],
    'sv-0066': [['⚽','Fotboll'], ['🔺','Triangel'], ['🥒','Gurka']],
    'sv-0067': [['⚽','Fotboll'], ['🟥','Kvadrat'], ['🍊','Apelsin']],
    'sv-0068': [['📕','Bok'], ['🪵','Träbit'], ['🥔','Potatis']]
  },
  // Avoid showing the actual answer in a reversed-definition prompt.
  reviewClues: {
    'sv-0009': 'Ett jämnt, långdraget ljud som till exempel ett flygande bi kan ge ifrån sig.',
    'sv-0068': 'Som fungerar som en magnet eller dras till en magnet, till exempel järn.'
  },
  // Content is grouped to favor plausible, relevant distractors instead of random nonsense.
  groups: {
    medium: [
      ['sv-0001','sv-0019','sv-0021','sv-0036','sv-0041','sv-0043','sv-0044','sv-0011','sv-0025','sv-0031'],
      ['sv-0003','sv-0026','sv-0029','sv-0030','sv-0033','sv-0039'],
      ['sv-0006','sv-0009','sv-0010','sv-0032','sv-0038','sv-0045'],
      ['sv-0042','sv-0073','sv-0084','sv-0090','sv-0092','sv-0091'],
      ['sv-0071','sv-0072','sv-0074','sv-0075','sv-0076','sv-0077','sv-0078','sv-0079','sv-0080','sv-0087'],
      ['sv-0081','sv-0082','sv-0083','sv-0085','sv-0086','sv-0089','sv-0095'],
      ['sv-0088','sv-0093','sv-0094','sv-0092','sv-0074','sv-0079']
    ],
    hard: [
      ['sv-0096','sv-0097','sv-0101','sv-0102','sv-0103','sv-0104','sv-0112','sv-0120'],
      ['sv-0098','sv-0100','sv-0111','sv-0118','sv-0119','sv-0113'],
      ['sv-0099','sv-0107','sv-0110','sv-0114','sv-0115','sv-0116'],
      ['sv-0105','sv-0106','sv-0108','sv-0109','sv-0117','sv-0113'],
      ['sv-0121','sv-0109','sv-0117','sv-0097','sv-0112','sv-0118']
    ]
  },
  // Avoid distractors with substantially overlapping definitions.
  nearSynonyms: [
    ['sv-0001','sv-0019'], ['sv-0006','sv-0032'], ['sv-0088','sv-0094'],
    ['sv-0072','sv-0077'], ['sv-0078','sv-0081'], ['sv-0081','sv-0082'],
    ['sv-0079','sv-0088'], ['sv-0093','sv-0094'],
    ['sv-0096','sv-0120'], ['sv-0110','sv-0114'], ['sv-0099','sv-0110'],
    ['sv-0098','sv-0111'], ['sv-0105','sv-0106'], ['sv-0107','sv-0116'],
    ['sv-0012','sv-0093'], ['sv-0002','sv-0015'], ['sv-0013','sv-0065'],
    ['sv-0077','sv-0108'], ['sv-0100','sv-0118'], ['sv-0109','sv-0121'],
    ['sv-0004','sv-0013'], ['sv-0004','sv-0065'], ['sv-0018','sv-0039'],
    ['sv-0019','sv-0041'], ['sv-0075','sv-0078']
  ]
};
