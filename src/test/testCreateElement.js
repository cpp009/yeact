import { createElement } from "../react/ReactElement";

export function testCreateElement() {
  const type = "div";
  const config = {
    key: "summer",
  };

  const txtChild = "I will see you in hell when you in Reno";

  let ret = createElement(type, config, txtChild);
  console.log(ret);

  ret = createElement(function() {}, {
    key: 'you',
    ref: 'myRef'
  }, 'child1', 'chid2')

  console.log(ret)
}

