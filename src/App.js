import { useEffect, useState } from "react";

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
      <div>
        <button onClick={() => window.location.reload()}>Refresh</button>
        {stuff.map((s) => (
          <button key={s} onClick={() => setList((l) => [...l, { name: s, id: Date.now(), date: Date.now() }])}>
            {s}
          </button>
        ))}
      </div>
      <div className="items">
        {Object.values(
          list
            .sort((a, b) => b.date - a.date)
            .reduce((acc, e) => {
              console.log(acc);
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
          .sort((a, b) => a.date - b.date)
          .map((e) => (
            <div key={e.name} onClick={e.onClick} className="item">
              {e.name} ({e.count})
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
