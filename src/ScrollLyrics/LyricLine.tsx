import { forwardRef } from "react";

export const LyricLine = forwardRef<
  HTMLDivElement,
  {
    foreign: string;
    translation: string;
    active: boolean;
    fontSize: number;
    color: string;
    distPercent?: number;
  }
>(({ foreign, translation, active, fontSize, color, distPercent }, ref) => {
  // 计算透明度
  const opacityForeign = active ? 0.85 : 0.25;
  // 计算模糊值，active时不模糊，distPercent越大模糊值越大
  const blurValue = active
    ? 0
    : distPercent !== undefined
      ? Math.round(Math.min(Math.pow(distPercent, 2) * 2 + 2, 6))
      : 0;

  const styleLyricLine: React.CSSProperties = {
    textAlign: "left",
    paddingLeft: "40px",
    paddingRight: "40px",
    fontSize: fontSize,
    color: color,
    padding: "8.120px 48.720px",
    filter: `blur(${blurValue}px)`,
  };

  const styleForeign: React.CSSProperties = {
    opacity: opacityForeign,
    fontFamily: "serif",
    fontSize: "60px",
    lineHeight: "normal",
  };

  const styleTranslation: React.CSSProperties = {
    opacity: opacityForeign * 0.5,
    fontFamily: '"Roboto"',
    fontSize: "30px",
  };

  return (
    <div ref={ref} style={styleLyricLine}>
      <div style={styleForeign}>{foreign}</div>
      <div style={styleTranslation}>{translation}</div>
    </div>
  );
});
