import myUpdateChildren from "./myUpdateChildren"
import createElement from "./createElement"

export default function myPatchVnode(oldVnode,newVnode) {
    newVnode.elm=oldVnode.elm
    //判断新旧vnode是否是同一个对象
    if (oldVnode === newVnode) return
    //新节点有text属性
    if (newVnode.text != undefined && (newVnode.children == undefined || newVnode.children.length == 0)) {
        if (newVnode.text != oldVnode.text) {
            oldVnode.elm.innerText = newVnode.text
        }
    } else {
       
        //    新vnode没有text属性，有children
        if (oldVnode.children != undefined && oldVnode.children.length > 0) {
            // 老的有children，此为最复杂情况，即新老都有children
             myUpdateChildren(oldVnode.elm,oldVnode.children,newVnode.children)
           
        } else {
            //老的没有children
            oldVnode.elm.innerHTML = ''
            newVnode.children.forEach(k => {
                let dom = createElement(k)
                oldVnode.elm.appendChild(dom)
            })
            // oldVnode.elm.appendChild(createElement(newVnode.children))
        }
    }
  

}