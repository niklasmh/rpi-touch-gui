import { useEffect, useState } from "react";

let initialList = [];
let initialZoom = 1;
try {
  initialList = JSON.parse(localStorage.getItem("list")) || [];
  initialZoom = JSON.parse(localStorage.getItem("zoom")) || 1;
} catch (e) {}

function App() {
  const [list, setList] = useState(initialList);
  const [cursorShouldHide, hideCursor] = useState(false);
  const [zoom, setZoom] = useState(initialZoom);

  // Yup, this is what I eat on a daily basis
  const [stuff] = useState(
    `
--- Frokost
yoghurt 🍨 10
cornflakes 🌽
bixit 🍪
rundstykker 🥖
blåbærsyltetøy 🍓
bringebærsyltetøy 🍓
smør 🧈 50
--- Brunch
bolognese 🍝
nachos 🌮
risgrøt 🥣 10
mellombar 🍫
billys 🍕
tikka 🥡
macncheese 🧀
nudler 🍜
melk 🥛 20
--- Middag
kjøttdeig 🥩 10
karbonadedeig 🥩 10
biff 🥩 10
kylling 🍗
grandis 🍕
mais(åpnet) 🌽 2
sopp 🍄 8
tomat 🍅 3
løk 🧅 15
gulerøtter 🥕 20
naanbrød 🍞 20
`
      .trim()
      .split("\n")
      .map((item) => {
        const [name, emoji = "", days = "100"] = item.split(" ");
        const time = parseInt(days) * 24 * 60 * 60 * 1000;
        return { name, emoji, time };
      })
  );

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    localStorage.setItem("zoom", JSON.stringify(zoom));
  }, [zoom]);

  return (
    <div className="App" style={{ zoom, cursor: cursorShouldHide ? "none" : "default" }}>
      <div>
        <button onClick={() => document.documentElement.requestFullscreen()}>Fullscreen ⏹</button>
        <button onClick={() => window.location.reload()}>Refresh 🔃</button>
        <button onClick={() => hideCursor((hide) => !hide)}>{cursorShouldHide ? "Show" : "Hide"} cursor 🖱</button>
        <button onClick={() => setZoom((zoom) => zoom + 0.1)}>Zoom +</button>
        <button onClick={() => setZoom((zoom) => zoom - 0.1)}>Zoom -</button>
        {stuff.map(({ name, emoji, time }) =>
          name === "---" ? (
            <div key={emoji} className="gap">
              {emoji}
            </div>
          ) : (
            <button
              key={name}
              style={{ cursor: cursorShouldHide ? "none" : "default" }}
              onClick={() => setList((l) => [...l, { name, emoji, id: Date.now(), expires: Date.now() + time }])}
            >
              {name} {emoji}
            </button>
          )
        )}
      </div>
      <div className="items">
        {Object.values(
          list
            .sort((a, b) => b.expires - a.expires)
            .reduce((acc, e) => {
              return {
                ...acc,
                [e.name]: {
                  ...e,
                  count: acc[e.name] ? acc[e.name].count + 1 : 1,
                  onClick: () => setList((l) => l.filter((i) => i.id !== e.id)),
                },
              };
            }, {})
        )
          .sort((a, b) => a.expires - b.expires)
          .map((e) => (
            <div key={e.name} onClick={e.onClick} className="item">
              {e.name} {e.emoji} ({e.count})
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
