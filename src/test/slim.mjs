// test xpath functions
import { sync } from 'slimdom-sax-parser';
import fonto from 'fontoxpath';
import * as fs from 'fs';

 //https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
const Node = {
  ELEMENT_NODE:1
};
const { evaluateXPath, evaluateXPathToString } = fonto;
const filePath = "../test/test-xml/function-catalog.xml"
const txt = fs.readFileSync(filePath, "utf8")

const document = sync(txt, { position: true });


function isOutside(node, target) {
 
  if (node.nodeType === Node.ELEMENT_NODE) return target < node.position.start || target > node.closePosition.end;
  return target < node.position.start || target > node.position.end
};

// return  node closest to target starting from node or undefined if none
function pathTo(node, target) {
  if (isOutside(node, target)) return undefined;
  let childs = node.childNodes;
  let leftIndex = 0;
  let guess = 0;
  let rightIndex = childs.length - 1;

  // While the left iterator is less than or equal to the right iterator continue the loop  
  while (leftIndex <= rightIndex) {
    // update the guess after the iterators have changed
    guess = Math.floor((leftIndex + rightIndex) / 2); // If the element at guess equals target return 1
    var c = childs[guess];

    if (!isOutside(c, target)) {
      //console.log("hit",guess)
      return pathTo(c, target);

      // If target < than mid element reduce the right index by 1
    } else if (target < c.position.start) {
      rightIndex = guess - 1;

      // If target > than mid element increase the left index by 1
    } else {
      leftIndex = guess + 1;
    }
  }  // can go no further
  return node;
};

//console.log("result",find(document,cur));
for(var cur=0;cur<txt.length;cur++)
{
let x = pathTo(document.documentElement, cur)
if (!x ) {
  console.log(cur," (fail)" )
} else {
  let t = x
  //console.log("result",t);
  let hits = evaluateXPathToString('path($foo)', null, null, { foo: t });
  console.log(cur,hits);
}
}
//hits.forEach(node=>node.position.line);
//console.log(`position: ${hits[0].position.start}, close: ${hits[0].closePosition.end}`)