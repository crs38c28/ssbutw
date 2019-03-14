export const STATUS_DROP_WAIT = 'wait';
export const STATUS_DROP_IMPORT = 'import';
export const STATUS_DROP_ERROR = 'error';
export const STATUS_DROP_SUCCESS = 'success';

export const LANGUAGE_LIST = [
  { text: '繁體中文 (TAIWAN)', value: 'zh_Hant_TW' },
  { text: 'English (US)', value: 'en_US' },
  { text: '日本語 (JAPAN)', value: 'ja_JP' },
];

export const REP_PLAYERDB_DEFAULT = {
  Zackray: {
    name: 'ザクレイ',
    prefix: 'GW',
    country: 'JP',
    twitter: 'Ssb4_Zackray',
    fighters: ['44'],
  },
  Nairo: {
    name: 'Nairo',
    prefix: 'NRG',
    country: 'US',
    twitter: 'NairoMK',
    fighters: ['21e', '54', '29'],
  },
};
export const REP_PLAYERLIST_DEFAULT = ['Zackray', 'Nairo'];

export const REP_SETTING_DEFAULT = {
  lang: 'zh_Hant_TW',
  chkey: null,
  sggkey: null,
};

export const REP_TOURNAMENT_DEFAULT = {
  event: '',
  progress: '',
  location: '',
  final: 0,
  bo: 3,
  playerCount: 2,
  player: [{
    displayName: '',
    country: null,
    twitter: '',
    score: 0,
    stock_icon: [null, null, null, null, null],
    color: null,
  },
  {
    displayName: '',
    country: null,
    twitter: '',
    score: 0,
    stock_icon: [null, null, null, null, null],
    color: null,
  },
  {
    displayName: '',
    country: null,
    twitter: '',
    score: 0,
    stock_icon: [null, null, null, null, null],
    color: null,
  },
  {
    displayName: '',
    country: null,
    twitter: '',
    score: 0,
    stock_icon: [null, null, null, null, null],
    color: null,
  },
  ],
};

export const COLOR_DEFAULT = [
  { text: 'None', value: null },
  { text: 'R', value: 'R' },
  { text: 'G', value: 'G' },
  { text: 'B', value: 'B' },
  { text: 'Y', value: 'Y' },
];

export const STAGES_DEFAULT = {
  counterPick: false,
  st: ['1h', '3h', '44h', '40h', '39h'],
  cp: ['62h', '42h', '85h', '19h', '79h', '37h'],
  banPick: {
    ban: [],
    pick: [],
  },
};

export const STAGES = [
  'None', 'Battlefield', 'Big Battlefield', 'Final Destination', 'Peach\'s Castle', 'Kongo Jungle', 'Hyrule Castle', 'Super Happy Tree', 'Dream Land',
  'Saffron City', 'Mushroom Kingdom', 'Princess Peach\'s Castle', 'Rainbow Cruise', 'Kongo Falls', 'Jungle Japes', 'Great Bay', 'Temple', 'Brinstar', 'Yoshi\'s Island (Melee)',
  'Yoshi\'s Story', 'Fountain of Dreams', 'Green Greens', 'Corneria', 'Venom', 'Pokemon Stadium', 'Onett', 'Mushroom Kingdom II', 'Brinstar Depths', 'Big Blue',
  'Fourside', 'Delfino Plaza', 'Mushroomy Kingdom', 'Figure-8 Circuit', 'WarioWare, Inc.', 'Bridge of Eldin', 'Norfair', 'Frigate Orpheon', 'Yoshi\'s Island (Brawl)',
  'Halberd', 'Lylat Cruise', 'Pokemon Stadium 2', 'Port Town Aero Dive', 'Castle Siege', 'Distant Planet', 'Smashville', 'New Pork City', 'Summit', 'Skyworld',
  'Shadow Moses Island', 'Luigi\'s Mansion', 'Pirate Ship', 'Spear Pillar', '75m', 'Mario Bros.', 'Hanenbow', 'Green Hill Zone', '3D Land', 'Golden Plains', 'Paper Mario',
  'Gerudo Valley', 'Spirit Train', 'Dream Land GB', 'Unova Pokemon League', 'Prism Tower', 'Mute City SNES', 'Magicant', 'Arena Ferox', 'Reset Bomb Forest', 'Tortimer Island',
  'Balloon Fight', 'Living Room', 'Find Mii', 'Tomodachi Life', 'PictoChat 2', 'Mushroom Kingdom U', 'Mario Galaxy', 'Mario Circuit', 'Skyloft', 'The Great Cave Offensive',
  'Kalos Pokemon League', 'Coliseum', 'Flat Zone X', 'Palutena\'s Temple', 'Gamer', 'Garden of Hope', 'Town and City', 'Wii Fit Studio', 'Boxing Ring', 'Gaur Plain', 'Duck Hunt',
  'Wrecking Crew', 'Pilotwings', 'Wuhu Island', 'Windy Hill Zone', 'Wily Castle', 'PAC-LAND', 'Super Mario Maker', 'Suzaku Castle', 'Midgar', 'Umbra Clock Tower',
  'New Donk City Hall', 'Great Plateau Tower', 'Moray Towers', 'Dracula\'s Castle',
];

export const STAGES_JP = [
  'None', '戦場', '大戦場', '終点', 'ピーチ城 上空', 'コンゴジャングル', 'ハイラル城', 'スーパーしあわせのツリー', 'プププランド', 'ヤマブキシティ', 'いにしえの王国', 'ピーチ城', 'レインボークルーズ', 'いかだと滝',
  'ジャングルガーデン', 'グレートベイ', '神殿', 'ブリンスタ', 'ヨースター島', 'ヨッシーストーリー', '夢の泉', 'グリーングリーンズ', '惑星コーネリア', '惑星ベノム', 'ポケモンスタジアム', 'オネット', 'いにしえの王国 USA',
  'ブリンスタ深部', 'ビッグブルー', 'フォーサイド', 'ドルピックタウン', 'いにしえっぽい王国', 'エイトクロスサーキット', 'メイド イン ワリオ', 'オルディン大橋', 'ノルフェア', 'フリゲートオルフェオン', 'ヨッシーアイランド',
  '戦艦ハルバード', 'ライラットクルーズ', 'ポケモンスタジアム2', 'ポートタウン エアロダイブ', '攻城戦', 'とある星', 'すま村', 'ニューポークシティ', '頂上', '天空界', 'シャドーモセス島', 'ルイージマンション', '海賊船',
  'テンガンざん やりのはしら', '75m', 'マリオブラザーズ', 'エレクトロプランクトン', 'グリーンヒルゾーン', '3Dランド', '野原', 'ペーパーマリオ', 'ゲルドの谷', '汽車', 'プププランド GB', 'イッシュポケモンリーグ', 'プリズムタワー',
  'ミュートシティ SFC', 'マジカント', 'フェリア闘技場', '初期化爆弾の森', 'コトブキランド', 'バルーンファイト', '子犬がいるリビング', 'すれちがい伝説', 'トモダチコレクション', 'ピクトチャット2', 'マリオUワールド', 'マリオギャラクシー',
  'マリオサーキット', 'スカイロフト', '洞窟大作戦', 'カロスポケモンリーグ', '闘技場', 'フラットゾーンX', 'エンジェランド', 'ゲーマー', '再会の花園', '村と街', 'Wii Fit スタジオ', '特設リング', 'ガウル平原', 'ダックハント', 'レッキングクルー',
  'パイロットウイングス', 'ウーフーアイランド', 'ウィンディヒル', 'ワイリー基地', 'パックランド', 'スーパーマリオメーカー', '朱雀城', 'ミッドガル', 'アンブラの時計塔', 'ニュードンク市庁舎', '始まりの塔', 'タチウオパーキング', 'ドラキュラ城',
];
