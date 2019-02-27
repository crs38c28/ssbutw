# **SSBUTW-DEV**

NodeCG Scoreboard system / overlay for Super Smash Bros Ultimate(Special).

This is a Dev bundle. The final bundle will be created after `npm watch` or `npm build`.

You can download the final NodeCG bundle in [bundle branch](https://github.com/crs38c28/ssbutw/tree/bundle), which is build by Travis-CI automatically.

Check **[Wiki Page](https://github.com/crs38c28/ssbutw/wiki)** for more tutorials/details.

## What is NodeCG

NodeCG is a broadcast graphics framework and application.  
You can use NodeCG to create broadcast graphics and control panels.

It's being used in [Games Done Quick](https://github.com/GamesDoneQuick/agdq19-layouts) / [RTAinJapan](https://github.com/RTAinJapan/rtainjapan-layouts) etc.

[Github](https://github.com/nodecg/nodecg) | [Website](https://nodecg.com/NodeCG.html) | [Youtube Tutorial](https://www.youtube.com/watch?v=vBAZXchbI3U&list=PLTEhlYdONYxv1wk2FsIpEz92X3x2E7bSx)

[Hoishinさん](https://github.com/Hoishin)の[NodeCG説明(日本語)](https://qiita.com/Hoishin/items/36dcea6818b0aa9bf1cd)  

You need NodeCG to use / develop with this scoreboard.  

## NodeCG

There are three parts in NodeCG.

1. dashboard - the control panel you can control the score / player's info / import player's data etc.
2. graphics - the overlay / layout for OBS/streaming.
3. extension - the server side code/script.

## Recommanded

- [OBS Studio](https://obsproject.com/)
- Browser: Chrome/Chromium

## Dependencies

1. Vue.js
2. [Vuetify](https://vuetifyjs.com/) - UI Component
3. [vue-i18n](https://github.com/kazupon/vue-i18n) - Multiple Language Support
4. [googlei18n/region-flags](https://github.com/googlei18n/region-flags) - Country flags
5. [marcrd/smash-ultimate-assets](https://github.com/marcrd/smash-ultimate-assets) - SVG Stock Icons
6. [Pon57/StreamControl-for-UMBR](https://github.com/Pon57/StreamControl-for-UMBR) - for Layout Demo

## Languages (i18n)

this project support 3 languages.  
files are under `src/lang/`

1. Traditional Chinese (Taiwan) 支援繁體中文(台灣)
2. Japanese (Japan) 日本語 対応している
3. English (US)

## Dashboard - Scoreboard 1v1 Singles
![scoreboard](https://i.imgur.com/CxnKxjt.png)
### Feature
- swap players
- Reset Score
- Custom / 2nd name (EX: English / Japanese GamerTags)
- Sponsor Prefix / Country
- Custom Pool (EX: Pool H1) or Winners Losers / Top 8 / Grand Finals etc.
- Put [L] after the Losers side player's GamerTag (When Grand Finals)
- Display **Stock Icon(ストコン)** for each round. (Need Layout Support)

## Dashboard - Scoreboard 2v2 Doubles
![Doubles](https://i.imgur.com/G3eyrJ0.png)
### Feature
- Team Color (R/G/B/Y)
- Drag player's name to Swap.

## Dashboard - Player List Management / Import
![list](https://i.imgur.com/Bs5uJjV.png)
### Feature
- Import tournament's players from challonge (need challonge API Key)
- Import pool's players from smash.gg (need smash.gg API Key)
- Add a player into Player List
- Save player's info into Database
- When you use Scoreboard, you can select a player from Player List

## Dashboard - Player Data Management / Import / Export
![DB](https://i.imgur.com/7YHBOD7.png)
### Feature
- Save as a JSON file
- Import JSON file to database
- Manage a player's info (EX: tag/twitter/main character)
- When you use Scoreboard -> select a player -> It will help you fill in these info
- use GamerTag as key... so let's hope you don't have two LIGHT in the tournament LOL.

## Dashboard - Ban Pick
![BP](https://i.imgur.com/E6DYYnd.png)
### Feature
- Import List from [Ban.Pages](https://bans.page/)
- EX: 1h-44h-40h-3h-39h_62h-42h-85h-19h-79h-37h
- Select Starter/Counter Pick Sets
- Reset
- Change the size to fit the screen
- You can Setup a Pad/Notebook for Players to pick their Stages

![Pad](https://i.imgur.com/mRxoSWG.png)

## Graphics - Scoreboard Layout Demo

1. UMEBURA - number
2. UMEBURA - light
3. HIROSUMA Style - stock icon
4. Genesis 6 Top 8 / Naifu Wars Style

### UMEBURA - number / light
![number](https://i.imgur.com/sjHOT2S.png)
![light](https://i.imgur.com/iI2NDMg.png)
[Author - Pon57](https://twitter.com/ganopon) |
[Github](https://github.com/Pon57/StreamControl-for-UMBR) | [Website](http://shigaming.com/2018/11/30/streamcontroltemplate2019/)

This layout is used for [UMEBURA](http://piosuma.blog.jp/).  
The light version count score as a light bar.  
I change this layout from jQuery/StreamControl to Vue.js/NodeCG version.  
light version only support BO3/5.  
use number version if you want to do a crew battle (or score > 3)

### HIROSUMA Style - stock icon
![Stock](https://i.imgur.com/qUBWTk9.png)
[Author - Karupist](https://twitter.com/karupist) |
[Japanese Tumblr Post](https://karupist.tumblr.com/post/180844600200/)

This layout is similar to UMEBURA.  
But it use stock icon to create a more fantastic layout.

### Genesis 6 Top 8 / Naifu Wars Style
![Tag](https://i.imgur.com/YXAS5gm.png)
This layout put player's tag on the smash player's tag.

### Frostbite 2019 style - 2v2 Doubles
![Doubles](https://i.imgur.com/9ADfrSi.png)
4 players layout.  
Also has flags and team score.

## Graphics - Stage Ban/Pick Layout Demo

### List Style
![List](https://i.imgur.com/xZx59CK.png)
List all Stages. Show Banned/Picked Icon.

### Genesis 6 Style
![Pick](https://i.imgur.com/lW0vhlU.png)
List only Banned/Picked Stage. (With transition/animation)
