import myVnode from "./myVnode";



// 只考虑必传三个参数的情况
// h(sel,data,'文字')
// h(sel,data,[])
// h(sel,data,h())
export default function (sel, data, c) {
    //排除其他传参情况
    if (arguments.length != 3) {
        throw new Error('请传入三个参数')
    }
    // 检测参数c的类型
    if (typeof c == 'string' || typeof c == "number") {
        //情况一
        return myVnode(sel, data, undefined, c, undefined)
    } else if (Array.isArray(c)) {
        //情况二
        //由于在传入h函数的时候，已经执行了【也就是已经逐级向外成为了返回的对象】，因此这里只需要收集返回的对象即可
        let children = []
        c.forEach(k => {
            if (!typeof k == 'object' && !k.hasOwnProperty('sel')) {
                throw new Error('传入的数组参数中有项不是h函数')
            }
            children.push(k)
        })
        return myVnode(sel,data,children,undefined,undefined)
    } else if (typeof c == 'object' && c.hasOwnProperty('sel')) {
        //情况三
        let children=[c]
        return myVnode(sel,data,children,undefined,undefined)
    } else {
        throw new Error('传入参数不正确')
    }
}