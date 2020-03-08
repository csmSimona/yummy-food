import { createGlobalStyle } from 'styled-components';

export const GrobalIconStyle = createGlobalStyle`
@font-face {font-family: "iconfont";
  src: url('./iconfont.eot?t=1583510111340'); /* IE9 */
  src: url('./iconfont.eot?t=1583510111340#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
  url('./iconfont.woff?t=1583510111340') format('woff'),
  url('./iconfont.ttf?t=1583510111340') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('iconfont.svg?t=1583510111340#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-xiaoxi1:before {
  content: "\e621";
}

.icon-xiaoxi2:before {
  content: "\e61f";
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

.icon-shangdian:before {
  content: "\e67a";
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

.icon-wo:before {
  content: "\e7ab";
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
