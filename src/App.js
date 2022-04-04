import { useEffect, useState, useRef } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

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
  const [inputFocus, setInputFocus] = useState(false);
  const nameRef = useRef();
  const timeRef = useRef();

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

  const addToList = ({ time, ...item }) => {
    setInputFocus(false);
    setList((l) => [...l, { id: Date.now(), expires: Date.now() + time * 24 * 60 * 60 * 1000, ...item }]);
  };

  return (
    <div className="App" style={{ zoom, cursor: cursorShouldHide ? "none" : "default" }}>
      <div>
        <button onClick={() => document.documentElement.requestFullscreen()}>Fullscreen ⏹</button>
        <button onClick={() => window.location.reload()}>Refresh 🔃</button>
        <button onClick={() => hideCursor((hide) => !hide)}>{cursorShouldHide ? "Show" : "Hide"} cursor 🖱</button>
        <button onClick={() => setZoom((zoom) => zoom + 0.1)}>Zoom +</button>
        <button onClick={() => setZoom((zoom) => zoom - 0.1)}>Zoom -</button>
        <input ref={nameRef} onFocus={() => setInputFocus(true)} />
        <input ref={timeRef} type="number" defaultValue={5} />
        <button
          onClick={() => {
            addToList({ name: nameRef.current.value, emoji: "", time: timeRef.current.value });
            nameRef.current.value = "";
          }}
        >
          Add
        </button>
        {stuff.map(({ name, emoji, time }) =>
          name === "---" ? (
            <div key={emoji} className="gap">
              {emoji}
            </div>
          ) : (
            <button
              key={name}
              style={{ cursor: cursorShouldHide ? "none" : "default" }}
              onClick={() => addToList({ name, emoji, time })}
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
      {inputFocus && (
        <div className="keyboard">
          <Keyboard
            onChange={(value) => (nameRef.current.value = value)}
            onKeyPress={(key) => {
              if (key === "{enter}") {
                addToList({ name: nameRef.current.value, emoji: "", time: timeRef.current.value });
                nameRef.current.value = "";
                setInputFocus(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
