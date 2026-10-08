import {friendshipStory} from './friendship-story';
import {pinoStory} from './pino-story';
export type PictureStory = {id:string;title:string;subtitle:string;description:string;question:string;game?:string;playLabel?:string;musicTheme?:'cloud'|'pino';quietScenes?:readonly number[];pages:readonly {title:string;image:string;alt:string;text:string}[]};
export const renStory:PictureStory={
 id:'ren-wait-v1',title:'まって、いっしょに',subtitle:'モコモとレンのおはなし',description:'歩幅のちがいと、気持ちを伝える6ページ',game:'jump',question:'レンが戻ってきたとき、モコモはどう感じたのかな。',
 pages:[
  {title:'ふわふわの丘で',image:'/stories/ren-wait/01-invite.webp',alt:'黄色いレンが白いモコモに手を差し出す。モコモは首をかしげ、少しだけ笑う。',text:'「あの雲、ぽんってはねるよ」\nはじめて会うレンは、もう片足を上げていた。\nモコモも、少しだけ近づく。\nやってみたい。けれど、足の先が、まだそわそわする。\n「いっしょに、いってもいい？」'},
  {title:'レンは、ぽん、ぽん',image:'/stories/ren-wait/02-ahead.webp',alt:'レンが先の低い雲へ跳び、モコモは後ろの雲にそっと足をのせる。',text:'レンは、ぽん、ぽん。\nモコモは、ひとつずつ。\n足の下で雲がふくらむたび、胸もふわっとした。\n「ねえ、レン、いまの——」\n話したかったことが、レンの背中を追いかけた。'},
  {title:'声が、とどかない',image:'/stories/ren-wait/03-left-behind.webp',alt:'離れた雲にいる二人。モコモは手を胸に寄せて座り、レンが振り返る。',text:'レンが遠くで手を振った。\nモコモは、次の雲へ足を出しかけて、やめた。\n追いかけたい。でも、いそぐと、足がかたくなる。\nぼくとは、あそびたくないのかな。\nそう思うと、「まって」が小さくなった。'},
  {title:'ふりむいたレン',image:'/stories/ren-wait/04-turn-back.webp',alt:'レンが戻ってモコモと向き合う。レンの手は下がり、モコモは目をそらしている。',text:'レンは、となりにモコモがいないことに気づいた。\n「……どうしたの？」\n戻ってきた声に、モコモは顔を上げられなかった。\n「レン、ずっと先にいくから……」\nレンの手が下がった。「いっしょに、あそんでるつもりだった」'},
  {title:'まって、っていってもいい？',image:'/stories/ren-wait/05-say-wait.webp',alt:'モコモが手を差し出し、レンが同じ高さで目を合わせて聞いている。',text:'「ぼく、もう少し、ゆっくりいきたい」\nモコモは、胸のなかの言葉を、ひとつずつ出した。\n「まって、っていってもいい？」\nレンがうなずく。「うん。気づかなくて、ごめんね」\n足の先が、少しやわらかくなった。'},
  {title:'となりで、ぽん',image:'/stories/ren-wait/06-together.webp',alt:'夕焼けの低い雲から二人が並んで小さく跳ぶ。レンはモコモを見て、二人は笑う。',text:'次の雲の前で、レンがモコモを見た。\n「ここ、いけそう？」\n「うん。せーの」\nとなりで、ぽん。ふたりの雲が、同じようにふくらんだ。\n「まって」も言える。そう思うと、もうひとつ、跳んでみたくなった。'},
 ]
};
export const pictureStories:readonly PictureStory[]=[{...friendshipStory,game:'seek',playLabel:'スイとひみつをさがす',description:'出会いと仲直りを描く、6ページの絵本',question:'モコモがスイを見たとき、何を思ったのかな。'},renStory,pinoStory];
