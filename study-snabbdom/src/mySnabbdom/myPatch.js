import myVnode from "./myVnode";
import createElement from "./createElement";

export default function (oldVnode, newVnode) {
    //判断传入的第一个参数，是DOM节点还是虚拟节点
    if (oldVnode.sel == '' || oldVnode.sel == undefined) {
        //传入的第一个参数是DOM节点，此时要包装为虚拟节点
        oldVnode = myVnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode)
    }

    //判断old和new是不是一个同一个节点
    if (oldVnode.key == newVnode.key && oldVnode.sel == newVnode.sel) {  //同一个节点
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

            } else {
                //老的没有children
                oldVnode.elm.innerHTML=''
                newVnode.children.forEach(k => {
                    let dom = createElement(k)
                    oldVnode.elm.appendChild(dom)
                })
                // oldVnode.elm.appendChild(createElement(newVnode.children))
            }
        }

    } else { //不是同一个节点
        let newVnodeElm = createElement(newVnode)
        //插入到老节点之前
        if (oldVnode.elm.parentNode && newVnodeElm) {
            oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
        }
        oldVnode.elm.parentNode.removeChild(oldVnode.elm)
    }
}