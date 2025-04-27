import "./index.css";
import { Composition } from "remotion";
import { ScrollLyrics, scrollLyricsSchema } from "./ScrollLyrics";
import { lyrics } from "./data";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ScrollLyrics"
        component={ScrollLyrics}
        durationInFrames={600}
        fps={30}
        width={720}
        height={1080}
        schema={scrollLyricsSchema}
        defaultProps={{
          lyricsColor: "#ffffff",
          animationStrategy: "spring",
          springConfig: {
            damping: 10,
            mass: 0.5,
            stiffness: 100,
          },
          durationInFrames: 15,
          backgroundTimeFactor: 0.1,
          lyrics: lyrics,
        }}
      />
    </>
  );
};
