import { createGlobalStyle } from 'styled-components';

export const GrobalIconStyle = createGlobalStyle`
@font-face {font-family: "iconfont";
  src: url('./iconfont.eot?t=1584542047314'); /* IE9 */
  src: url('./iconfont.eot?t=1584542047314#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
  url('./iconfont.woff?t=1584542047314') format('woff'),
  url('./iconfont.ttf?t=1584542047314') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('./iconfont.svg?t=1584542047314#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.back {
  font-size: 1.4rem;
  color: #000;
  font-weight: bold;
}

.icon-caidan:before {
  content: "\e62f";
}

.icon-xihuan2:before {
  content: "\e63b";
}

.icon-xihuan1:before {
  content: "\e63d";
}

.icon-fanhui:before {
  content: "\e61f";
}

.icon-menu:before {
  content: "\e617";
}

.icon-wo1:before {
  content: "\e612";
}

.icon-shangdian-:before {
  content: "\e610";
}

.icon-zan:before {
  content: "\e63a";
}

.icon-dianzan:before {
  content: "\e60c";
}

.icon-fabu:before {
  content: "\e66f";
}

.icon-fenxiang2:before {
  content: "\e61e";
}

.icon-shoucang:before {
  content: "\e661";
}

.icon-set:before {
  content: "\e63c";
}

.icon-pinglun:before {
  content: "\e678";
}

.icon-xiaoxi:before {
  content: "\e6a5";
}

.icon-shouye:before {
  content: "\e60e";
}

.icon-pinglun1:before {
  content: "\e648";
}

.icon-fabu1:before {
  content: "\e615";
}

.icon-shoucang1:before {
  content: "\e60f";
}

.icon-sousuo:before {
  content: "\e622";
}

.icon-icon_tianjiahaoyou:before {
  content: "\e657";
}

`;
