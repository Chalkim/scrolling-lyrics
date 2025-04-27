import "./index.css";
import { Composition } from "remotion";
import { ScrollLyrics, scrollLyricsSchema } from "./ScrollLyrics";

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
          backgroundColor: "rgba(0, 0, 0, 0.20)",
          animationStrategy: "spring" as const,
          springConfig: { mass: 1, damping: 100, stiffness: 10 },
          durationInFrames: 45,
          backgroundTimeFactor: 0.1,
          lyrics: [
            {
              start: 0,
              end: 2,
              foreign: "Bonjour tout le monde.",
              translation: "大家好。",
            },
            {
              start: 2,
              end: 7,
              foreign:
                "Aujourd'hui, il fait très beau et le ciel est d'un bleu éclatant.",
              translation: "今天天气非常好，天空湛蓝明亮。",
            },
            {
              start: 7,
              end: 13,
              foreign:
                "Je voudrais aller au parc pour profiter du soleil et respirer l'air frais.",
              translation: "我想去公园晒太阳，呼吸新鲜空气。",
            },
            {
              start: 13,
              end: 19,
              foreign:
                "Nous pourrions organiser un pique-nique et inviter quelques amis à nous rejoindre.",
              translation: "我们可以组织一次野餐，还可以邀请一些朋友一起来。",
            },
            {
              start: 19,
              end: 23,
              foreign:
                "N'oublie pas d'apporter de l'eau, des fruits et une couverture pour s'asseoir.",
              translation: "别忘了带水、水果和一条可以坐的毯子。",
            },
            {
              start: 23,
              end: 27,
              foreign:
                "Ce sera une journée merveilleuse pleine de rires et de bons souvenirs.",
              translation: "这将是充满欢笑和美好回忆的一天。",
            },
            {
              start: 27,
              end: 29,
              foreign: "Tu es disponible cet après-midi?",
              translation: "你今天下午有空吗？",
            },
            {
              start: 29,
              end: 33,
              foreign:
                "Sinon, nous pouvons aussi y aller demain si tu préfères.",
              translation: "如果不行的话，我们也可以改到明天。",
            },
            {
              start: 33,
              end: 36,
              foreign: "Le parc est plus calme en semaine.",
              translation: "平日里公园更安静。",
            },
            {
              start: 36,
              end: 41,
              foreign:
                "J'ai entendu dire qu'ils ont installé de nouvelles aires de jeux pour les enfants.",
              translation: "我听说那里新建了儿童游乐区。",
            },
            {
              start: 41,
              end: 46,
              foreign:
                "Il y a aussi un petit lac où l'on peut faire du pédalo.",
              translation: "还有一个小湖，可以踩脚踏船。",
            },
            {
              start: 46,
              end: 50,
              foreign: "Je n'ai pas fait de pédalo depuis longtemps.",
              translation: "我很久没踩过脚踏船了。",
            },
            {
              start: 50,
              end: 53,
              foreign: "Ce sera une bonne occasion d'essayer à nouveau.",
              translation: "这正是一个好机会重新尝试一下。",
            },
            {
              start: 53,
              end: 56,
              foreign: "Penses-tu pouvoir amener ta sœur avec toi?",
              translation: "你能带上你妹妹一起吗？",
            },
            {
              start: 56,
              end: 61,
              foreign:
                "Elle aime beaucoup les pique-niques et je suis sûr qu'elle passerait un très bon moment.",
              translation: "她很喜欢野餐，我相信她一定会很开心的。",
            },
            {
              start: 61,
              end: 64,
              foreign:
                "Nous pouvons également préparer quelques jeux pour rendre la journée encore plus amusante.",
              translation: "我们还可以准备一些游戏，让这一天更有趣。",
            },
            {
              start: 64,
              end: 68,
              foreign: "Peut-être un frisbee, un ballon ou même des cartes?",
              translation: "也许带个飞盘、足球，或者扑克牌？",
            },
            {
              start: 68,
              end: 73,
              foreign:
                "N'oublions pas d'apporter de la crème solaire, il va faire très chaud.",
              translation: "别忘了带防晒霜，天气会很热。",
            },
            {
              start: 73,
              end: 77,
              foreign:
                "Je suis vraiment impatient de passer cette journée avec vous tous.",
              translation: "我真的很期待和大家一起度过这一天。",
            },
            {
              start: 77,
              end: 80,
              foreign: "Alors, on se retrouve à quelle heure ?",
              translation: "那么，我们几点见面呢？",
            },
          ],
        }}
      />
    </>
  );
};
