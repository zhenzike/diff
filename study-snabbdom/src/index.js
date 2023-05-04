import myH from "./mySnabbdom/myH";
import myPatch from "./mySnabbdom/myPatch";


const container = document.getElementById('container')
const btn = document.getElementById('btn')

let vnode1 = myH('ul', {}, [
   myH('li', { key: 'A' }, 'A'),
   myH('li', { key: 'B' }, 'B')
])

let vnode2 = myH('ul', {}, [
   myH('li', { key: 'E' }, 'E'),
   myH('li', { key: 'A' }, 'A'),
   myH('li', { key: 'B' }, 'B')
])

let vnode3 = myH('ul', {}, '怒海')

myPatch(container, vnode3)

btn.onclick = function () {
   myPatch(vnode3, vnode1)
}

