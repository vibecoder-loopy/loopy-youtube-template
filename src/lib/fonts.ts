let fontLoaded = false;

export function loadFont() {
  if (typeof document === "undefined" || fontLoaded) return;
  fontLoaded = true;

  // Neo둥근모 + Neo둥근모 Code (고정폭) 로드
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: 'NeoDunggeunmo';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.3/NeoDunggeunmo.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'NeoDunggeunmoCode';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.3/NeoDunggeunmo.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }
  `;
  document.head.appendChild(style);
}

export function getFontFamily(): string {
  return "'NeoDunggeunmo', monospace";
}

export function getTitleFontFamily(): string {
  return "'NeoDunggeunmo', monospace";
}

export function getSmallFontFamily(): string {
  return "'NeoDunggeunmoCode', 'NeoDunggeunmo', monospace";
}
