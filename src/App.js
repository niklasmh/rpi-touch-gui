import { useEffect, useState } from "react";
import "./App.css";

let initialList = [];
try {
  initialList = JSON.parse(localStorage.getItem("list")) || [];
} catch (e) {}

function App() {
  const [list, setList] = useState(initialList);

  // Yup, this is what I eat on a daily basis
  const [stuff] = useState(
    `
kjøttdeig
biff
karbonadedeig
yoghurt
bolognese
billys
tikka
risgrøt
macncheese
tikkaboks
cornflakes
bixit
naanbrød
smør
tomat
løk
sopp
blåbærsyltetøy
bringebærsyltetøy
rundstykker
grandis
melk
nudler
fries
saft
brus
øl
vin
mellombar
kylling
tacoshell
nachos
`
      .trim()
      .split("\n")
  );

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <div className="App">
      <button onClick={() => window.location.reload()}>Refresh</button>
      <br />
      {stuff.map((s) => (
        <button key={s} onClick={() => setList((l) => [...l, { name: s, id: Date.now(), date: Date.now() }])}>
          {s}
        </button>
      ))}
      <br />
      {list
        .sort((a, b) => a.date - b.date)
        .map((e) => (
          <div key={e.name} onClick={() => setList((l) => l.filter((i) => i.id !== e.id))}>
            {e.name}
          </div>
        ))}
    </div>
  );
}

export default App;
