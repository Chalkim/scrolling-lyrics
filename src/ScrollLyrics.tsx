import {
  interpolate,
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { LyricLine } from "./ScrollLyrics/LyricLine";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import Background from "./ScrollLyrics/Background";
import { zColor } from "@remotion/zod-types";

const lyricSchema = z.object({
  start: z.number(), // 歌词开始时间
  end: z.number(), // 歌词结束时间
  foreign: z.string(), // 外文歌词
  translation: z.string(), // 翻译歌词
});

export const scrollLyricsSchema = z.object({
  // 歌词颜色
  lyricsColor: zColor(),
  // 动画策略
  animationStrategy: z
    .enum(["spring", "interpolate"]),
  // spring 动画配置
  springConfig: z
    .object({
      damping: z.number(),
      mass: z.number(),
      stiffness: z.number(),
    }),
  // 动画时长
  durationInFrames: z.number(),
  // 时间因子
  backgroundTimeFactor: z.number(),
  // 歌词数据
  lyrics: z.array(lyricSchema),
});

export const ScrollLyrics: React.FC<z.infer<typeof scrollLyricsSchema>> = ({
  lyricsColor,
  animationStrategy,
  springConfig,
  durationInFrames,
  backgroundTimeFactor,
  lyrics,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const currentTime = frame / fps;

  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [offsetY, setOffsetY] = useState(0);
  const [prevOffsetY, setPrevOffsetY] = useState(0);

  // 查找开始时间距离最近的歌词
  const closestIndex = lyrics
    .slice()
    .reverse()
    .findIndex((line) => currentTime >= line.start);
  
  // 防止没有歌词或在第一行歌词开始之前的情况出错
  const safeIndex =
    closestIndex === -1 ? 0 : lyrics.length - 1 - closestIndex; // 转换回正序索引

  useEffect(() => {
    const currentLine = lineRefs.current[safeIndex];
    if (currentLine && containerRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const lineTop = currentLine.offsetTop;
      const lineHeight = currentLine.offsetHeight;

      // 激活行居中
      const targetOffset = containerHeight / 2 - (lineTop + lineHeight / 2);

      setPrevOffsetY(offsetY);
      setOffsetY(targetOffset);
      // 取消第一行的滚动动画
      if (safeIndex === 0) {
        setPrevOffsetY(targetOffset);
      }
    }
  }, [safeIndex]);

  // 根据策略选择动画
  const scrollOffset =
    animationStrategy === "spring"
      ? spring({
          frame,
          from: prevOffsetY,
          to: offsetY,
          fps,
          delay: lyrics[safeIndex].start * fps,
          config: springConfig,
          durationInFrames,
        })
      : interpolate(
          frame,
          [
            lyrics[safeIndex].start * fps,
            lyrics[safeIndex].start * fps + durationInFrames,
          ],
          [prevOffsetY, offsetY],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

  return (
    <AbsoluteFill
      style={{
        background: "black",
      }}
    >
      <Background timeFactor={backgroundTimeFactor}>
        <div
          ref={containerRef}
          style={{
            height: `${height}px`,
            overflow: "hidden",
            position: "relative",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明的暗色背景
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              top: `${scrollOffset}px`,
            }}
          >
            {lyrics.map((line, idx) => {
              const isActive = idx === safeIndex;

              // 计算距离中心位置
              const lineRef = lineRefs.current[idx];
              const lineCenter = lineRef
                ? lineRef.offsetTop + (lineRef.offsetHeight || 0) / 2 + offsetY
                : 0;

              const distFromActiveLine = Math.abs(height / 2 - lineCenter);
              const distPercent = (distFromActiveLine / height) * 2;

              // 计算top到中心的距离百分比
              const lineTop = lineRef ? lineRef.offsetTop + offsetY : 0;
              const distTopPercent =
                Math.abs(lineTop - height / 2) / (height / 2);

              const isVisible = distTopPercent < 1;

              return (
                <LyricLine
                  key={idx}
                  ref={(el) => {
                    lineRefs.current[idx] = el;
                  }}
                  foreign={line.foreign}
                  translation={line.translation}
                  active={isActive}
                  fontSize={36}
                  color={lyricsColor}
                  distPercent={isVisible ? distPercent : undefined}
                />
              );
            })}
          </div>
        </div>
      </Background>
    </AbsoluteFill>
  );
};
