import myH from "./mySnabbdom/myH";
import myPatch from "./mySnabbdom/myPatch";


const container = document.getElementById('container')
const btn = document.getElementById('btn')

let vnode1 = myH('ul', {}, [
   myH('li', { key: 'A' }, 'A'),
   myH('li', { key: 'B' }, 'B'),
   myH('li', { key: 'C' }, 'C'),
   myH('li', { key: 'D' }, 'D'),
   myH('li', { key: 'E' }, 'E'),
])

let vnode2 = myH('ul', {}, [

   myH('li', { key: 'V' }, 'V'),
   myH('li', { key: 'E' }, 'E'),
   myH('li', { key: 'O' }, 'O'),
   myH('li', { key: 'D' }, 'D'),
   myH('li', { key: 'C' }, 'C'),
   myH('li', { key: 'QQQ' }, 'QQQ'),
   myH('li', { key: 'B' }, 'B'),
   myH('li', { key: 'A' }, 'A'),
])

myPatch(container, vnode1)

btn.onclick = function () {
   myPatch(vnode1, vnode2)
}

