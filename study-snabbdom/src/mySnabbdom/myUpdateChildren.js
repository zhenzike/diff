import myPatchVnode from './myPatchVnode'
import createElement from './createElement';

export default function myUpdateChildren(parentElm, oldChildren, newChildren) {

    let oldStartPointer = 0;                     // 旧前指针
    let oldEndPointer = oldChildren.length - 1;  // 旧后指针
    let newStartPointer = 0;                     // 新前指针
    let newEndPointer = newChildren.length - 1;  // 新后指针

    let oldStartVnode = oldChildren[oldStartPointer];   // 旧前节点
    let oldEndVnode = oldChildren[oldEndPointer];       // 旧后节点
    let newStartVnode = newChildren[newStartPointer];   // 新前节点
    let newEndVnode = newChildren[newEndPointer]        // 新后节点

    let keyMap = null


    while (oldStartPointer <= oldEndPointer && newStartPointer <= newEndPointer) {
        //遇见被标记为undefined虚拟节点时，直接跳过

        if (oldStartVnode == undefined|| oldChildren[oldStartPointer] === undefined) {
            oldStartVnode = oldChildren[++oldStartPointer]
        } else if (oldEndVnode == undefined || oldChildren[oldEndPointer] === undefined) {
            oldEndVnode = oldChildren[--oldEndPointer]
        } else if (newStartVnode == undefined || newChildren[newStartPointer] === undefined) {
            newStartVnode = newChildren[++newStartPointer]
        } else if (newEndVnode == undefined || newChildren[newEndPointer] === undefined) {
            newEndVnode = newChildren[--newEndPointer]
        } else if (checkSameVnode(newStartVnode, oldStartVnode)) {   //新前与旧前 指针指向的节点是同一个节点【是否命中】，则开始精细化对比
            console.log('新前与旧前1');
            myPatchVnode(oldStartVnode,newStartVnode)
            newStartVnode = newChildren[++newStartPointer]    //新前下移
            oldStartVnode = oldChildren[++oldStartPointer]    //旧前下移       
        }  //新后与旧后
        else if (checkSameVnode(newEndVnode, oldEndVnode)) {
            console.log('新后与旧后2');
            myPatchVnode( oldEndVnode,newEndVnode)
            newEndVnode = newChildren[--newEndPointer]    //新后上移
            oldEndVnode = oldChildren[--oldEndPointer]    //旧后上移         
        }  //新后与旧前
        else if (checkSameVnode(newEndVnode, oldStartVnode)) {
            console.log('新后与旧前3');
            myPatchVnode(oldStartVnode,newEndVnode)
            // 移动节点，将旧前指向的节点，移动到旧后之后
            parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)

            newEndVnode = newChildren[--newEndPointer]    //新后上移
            oldStartVnode = oldChildren[++oldStartPointer]    //旧前下移     
        } //新前与旧后
        else if (checkSameVnode(newStartVnode, oldEndVnode)) {
            console.log('新前与旧后4');
            myPatchVnode(oldEndVnode,newStartVnode)
            // 移动节点，将旧后指向的节点，移动到旧前之前
            parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
            newStartVnode = newChildren[++newStartPointer]    //新前下移
            oldEndVnode = oldChildren[--oldEndPointer]    //旧后上移     
        } else {
            //全都没有命中
            console.log('全未命中');
            //寻找旧节点中key与index的map，用于寻找新前节点是否为新增，以及插入位置
            if (!keyMap) {
                keyMap = {}
                for (let i = oldStartPointer; i <= oldEndPointer; i++) {
                    const key = oldChildren[i].key
                    if (key != undefined) {
                        keyMap[key] = i
                    }
                }
            }
            //    寻找新前节点在旧节点的keyMap中的映射的位置序号
            const idxInOld = keyMap[newStartVnode.key]
            //如果inxInOld是undefined表示它是全新的项,不是则需要移动
            if (idxInOld == undefined) {
                //创建新前节点的DOM并将该项移动至旧前节点的DOM之前
                parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
            } else {
                const elmToMove = oldChildren[idxInOld]   //获取老节点中与新前节点对应的节点，用于移动      
                myPatchVnode(elmToMove, newStartVnode)
                oldChildren[idxInOld] = undefined
                parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
            }
            newStartVnode = newChildren[++newStartPointer]

        }
    }


    //循环结束
    if (newStartPointer <= newEndPointer) { //循环结束后新前仍旧小于新后，说明有节点需要插入
        for (let i = newStartPointer; i <= newEndPointer; i++) {
            const before=newChildren[newEndPointer+1]==null?null:newChildren[newEndPointer+1].elm;
            console.log(before);
            parentElm.insertBefore(createElement(newChildren[i]), before)
        }
    } else if (oldStartPointer <= oldEndPointer) {  //循环结束后旧前仍旧小于旧后，说明有节点需要删除
        for (let i = oldStartPointer; i <= oldEndPointer; i++) {
            oldChildren[i] && parentElm.removeChild(oldChildren[i].elm)
        }
    }
}

//判断是否为同一个节点
function checkSameVnode(a, b) {

    return a.sel == b.sel && a.key == b.key
}