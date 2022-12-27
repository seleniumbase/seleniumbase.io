import { _ as __vitePreload } from "./index.1ac4eab2.js";
const getRandomArbitrary = (min, max) => parseInt(Math.random() * (max - min) + min, 10);
const generateRandomRGBColor = () => `rgb(${getRandomArbitrary(0, 255)}, ${getRandomArbitrary(0, 255)}, ${getRandomArbitrary(0, 255)}, 0.002)`;
async function makeItSlow() {
  const useless = await __vitePreload(() => import("./bigbigcode2.fe61ce75.js"), true ? [] : void 0);
  console.log(useless);
  let shouldPrint = true;
  for (let i = 0; i < 1e4; i++) {
    let random = 0;
    random = Math.floor(Math.random() * 100);
    const el = document.getElementById("invisible");
    if (shouldPrint)
      console.log(random);
    shouldPrint = false;
    if (el) {
      el.innerText = `${random}`.repeat(3);
      el.style.color = `${generateRandomRGBColor()}`;
      el.style.backgroundColor = `${generateRandomRGBColor()}`;
    }
  }
}
export {
  makeItSlow
};
//# sourceMappingURL=slow.16630059.js.map
