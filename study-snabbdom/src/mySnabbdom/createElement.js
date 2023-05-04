//真正创建节点。将vnode创建为DOM，插入到pivot【标杆节点】这个元素中
export default function createElement(vnode) {
    let domNode = document.createElement(vnode.sel)
    //有子节点还是有文本
    if (vnode.text != '' && vnode.children == undefined || vnode.children.length == 0) {//内部为文本
        domNode.innerText = vnode.text
    } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
        //内部是子节点，需要递归创建节点
        vnode.children.forEach(k => {
            //创建出子节点的DOM，一旦调用createElement意味着:创建出DOM了，并且它的elm属性指向了创建出的DOM,但是还没有上树,是一个孤儿节点。
            let childrenDOM = createElement(k)
            domNode.appendChild(childrenDOM)
        })

    }
    vnode.elm = domNode
    //返回elm，elm是一个纯DOM对象
    return vnode.elm
}