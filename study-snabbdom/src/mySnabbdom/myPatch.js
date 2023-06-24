import myVnode from "./myVnode";
import createElement from "./createElement";
import myPatchVnode from "./myPatchVnode";

export default function (oldVnode, newVnode) {
    // console.log('oldVnode',JSON.parse(JSON.stringify(oldVnode)),JSON.parse(JSON.stringify(newVnode)));
    //判断传入的第一个参数，是DOM节点还是虚拟节点
    if (oldVnode.sel == '' || oldVnode.sel == undefined) {
        //传入的第一个参数是DOM节点，此时要包装为虚拟节点
        oldVnode = myVnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode)
    }

    //判断old和new是不是一个同一个节点
    if (oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {  //同一个节点
   
        myPatchVnode(oldVnode, newVnode)
    } else { //不是同一个节点
     
        let newVnodeElm = createElement(newVnode)
        //插入到老节点之前
        if (oldVnode.elm.parentNode && newVnodeElm) {
            oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
        }
        oldVnode.elm.parentNode.removeChild(oldVnode.elm)
       
    }
}