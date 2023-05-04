# snabbdom

snabbdom是瑞典语单词，单词原意“速度”;

snabbdom是著名的虚拟DOM库，是diff算法的鼻祖，**Vue源码借鉴了snabbdom**;

官方git: https://github.com/snabbdom/snabbdom

## 安装snabbdom

在git上的snabbdom源码是用Typescript写的，git上并不提供编译好的JavaScript版本

如果要直接使用build出来的JavaScript版的snabbdom库，可以从npm上下载

```
npm i -D snabbdom
```

==在安装的包文件夹中 src下是ts源码， build下是js源码==。

## 测试环境搭建

- snabbdom库**是DOM库**，**不能在nodejs环境运行**，所以需要搭建webpack和webpack-dev-server开发环境，不需要安装任何loader

- 这里需要注意，必须安装最新版webpack@5，不能安装webpack@4，这是因为webpack4没有读取身份证中exports的能力，建议大家使用这样的版本【==最新版的snabbdom中并没有exports,所以这里可以将cli和server版本改为4==】

- ```
  npm i webpack@5 webpack-cli@3 webpack-dev-server@3
  
  -----现在这样安装--
  npm i -D webpack@5 webpack-cli@4 webpack-dev-server@4
  ```


### webpack.config.js基础配置

```js
const path = require('path');
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        // path: path.resolve(__dirname, 'dist'),
        //使用的publicPath,文件夹不会真正生成，而是在8080端口虚拟生成
        publicPath: '/xuNi/',
        filename: 'bundle.js',
    },
    devServer: {
        //端口号
        port: 8080,
        //静态资源文件夹 contentBase:'www' --现在使用 static: 'XXX'
        static: 'www'
    },
    //Webpack 默认只会解析['.js', '.json', '.wasm']这三种格式的文件,
    //如果需要让 Webpack 支持ts,需要加上extensions的配置
    //当文件中包含ts文件时需要加上以下代码，如还不可以这次运行则需要删除依赖，重新安装
    resolve: {
        extensions: ['.ts', '.js', '.less']
    },

};
```

## 虚拟DOM

==DOM变为虚拟DOM属于**模板编译原理**==。

<img src='./tu/xuNi.jpg'>

### diff发生在虚拟DOM上

==新虚拟DOM和老虚拟DOM进行diff (精细化比较)，算出应该如何最小量更新，最后反映到真正的DOM==。

## h函数

### h函数用来产生虚拟节点

==h函数用来产生**虚拟节点 (vnode)**==：如以下调用h函数

```js
h('a',{props:{href:'http://www.atguigu.com'}},'尚');
```

将得到：

```js
{"sel":"a","data":{ props: {href: 'http://www.atguigu.com'}},"text":"尚")
```

表示真正的节点

```html
<a href='http://www.atguigu.com'>尚</a>
```

### 虚拟节点的属性

```js
{
    children: undefined   //虚拟节点的子元素
    data: {}              //虚拟节点的属性、样式等
    elm: undefined        //对应的真正的DOM节点,undefined表示这个虚拟节点还没有上树
    key: undefined       //key表示这个虚拟节点的唯一标识
    sel:"div"            //表示选择器
    text:"我是一个盒子     //表示文字或者说是标签中间的内容 <a>这里的内容</a>，所以还可以是其他的标签【可用于嵌套】
}
```



### 虚拟节点上树

```js
import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
} from "snabbdom";

// 创建patch函数【diff算法的核心函数】，用于将虚拟节点显示在页面上【虚拟节点上树】
const patch=init([classModule,propsModule,styleModule,eventListenersModule])

//创建虚拟节点,此时并不会在页面上真正的产生a标签
var myVnNode=h('a',{props:{href:'http://www.hao123.com',target:'_blank'}},'guo')

//使虚拟节点上树,一个容器只能让一个虚拟节点上树，除非有内嵌
const container=document.getElementById('container')
patch(container,myVnNode)
```

### h函数嵌套使用，得到虚拟DOM树【重要】

如以下嵌套使用h函数:

```js
h('ul',{},[
    h('li',{},'牛奶'),
    h('li',{},'咖啡')
])  
//  如果只有一个子元素数组符号可以省略
h('ul',{},h('li',{},'牛奶'))  
```

将得到以下虚拟DOM树：

```js
{
    'sel':'ul',
    'data':{},
    'children':[
        {'sel':'li','text':'牛奶'},
        {'sel':'li','text':'咖啡'},
    ]
}
```

### 手写h函数【主干部分】

这里只实现如下三种情况：【也就是要求必须接受三个参数，不考虑其他的传参情况了】

```ts
h(sel,data,[])
h(sel,data,'文字')
h(sel,data,h())
```

#### vnode

```js
//该函数的功能仅仅是传入的参数组合成对象，返回即可
export default function(sel,data,children,text,elm){
      return {
        sel,data,children,text,elm
      }
}
```

#### h函数

```js
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
```

#### key值的作用

**不加key值**：

==此时由于没有加上key值，<span style='color:red'>节点E将是在列表末尾插入一个节点</span>，然后将第一个节点的值换为E,第二个节点的值换为A，第三个换为B==。近乎推倒重来效率极低。

```js
const container=document.getElementById('container')
let vnode1=h('ul',{},[
    h('li',{},'A'),
    h('li',{},'B')
]) 
patch(container,vonde1)

let vnode2=h('ul',{},[
    h('li',{},'E'),
    h('li',{},'A'),
    h('li',{},'B')
]) 
//点击按钮时，将vnode1变为vnode2
btn.onclick=function(){
    patch(vonde1,vode2)
}
```

**加上key值**：

==加上key值后，为节点加上了唯一标识，patch函数将会判断出新旧树之间没有变化的节点，并正确的进行最小量更新，<span style='color:red'>此时节点E将是在列表头部插入一个节点</span>==。而没有对之后的节点重新渲染，效率更高。

```js
const container=document.getElementById('container')
let vnode1=h('ul',{},[
    h('li',{key:'A'},'A'),
    h('li',{key:'B'},'B')
]) 
patch(container,vonde1)

let vnode2=h('ul',{},[
    h('li',{key:'E'},'E'),
    h('li',{key:'A'},'A'),
    h('li',{key:'B'},'B')
]) 
//点击按钮时，将vnode1变为vnode2
btn.onclick=function(){
    patch(vonde1,vode2)
}
```

**==结论==**：

- key是这个节点的唯一标识，告诉diff算法，在更改前后它们是同一个DOM节点。

- **只有是同一个虚拟节点，才进行精细化比较**，否则就是暴力删除旧的、插入新的。

  - **延伸问题**:==**如何定义是同一个虚拟节点**==?答:**<span style='color:red'>选择器相同且key相同</span>**。

  - ```js
    let vnode1=h('ul',{},[
        h('li',{key:'A'},'A'),
        h('li',{key:'B'},'B')
    ]) 
    
    let vnode2=h('ol',{},[
        h('li',{key:'E'},'E'),
        h('li',{key:'A'},'A'),
        h('li',{key:'B'},'B')
    ]) 
    btn.onclick=function(){
        patch(vonde1,vode2)
    }
    //由于父节点的dom发生了变化，因此不再进行最小量更新，而是直接重新渲染
    ```

    

- **只进行同层比较，不会进行跨层比较**。即使是同一片虚拟节点，但是跨层，不再进行最小量更新。而是暴力删除旧的、然后插入新的。

  - ```js
    let vnode1=h('div',{},[
        h('p',{key:'A'},'A'),
        h('p',{key:'B'},'B')
    ]) 
    
    let vnode2=h('div},h('section',[
        h('p',{key:'A'},'A'),
        h('p',{key:'B'},'B')
    ])
    btn.onclick=function(){
        patch(vonde1,vode2)
    }
    //此时由于尽管节点没有变化，但是由于多了一层section父节点，还是不会进行最小量更新
    ```

    

## 手写patch函数

<img src='tu/patch流程.png'>

### createElement

```js
//真正创建节点。将vnode以及其子节点创建为DOM
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
```

### patch函数【删除插入部分】

```js
const myVnode=myH('ul',{},[
   myH('li',{},'A'),
   myH('li',{},'B'),
   myH('li',{},'C'),
])
const container=document.getElementById('container')
myPatch(container,myVnode)

//------------上方为测试用例---------
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
        
        
      //这里进行精细化比较
        
        
    } else { //不是同一个节点
        let newVnodeElm = createElement(newVnode)
        //插入到老节点之前
        if (oldVnode.elm.parentNode && newVnodeElm) {
            oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
        }
        oldVnode.elm.parentNode.removeChild(oldVnode.elm)
    }
}
```

### 精细化比较

**当oldVnode与newVnode的sel以及key相同时【同一个节点】**：

<img src='tu/key与sel相同.png'>

#### 新旧节点text的不同情况

```js
export default function (oldVnode, newVnode) {
    if (oldVnode.sel == '' || oldVnode.sel == undefined) {
         //......
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
            }
        }

    } else { //不是同一个节点
    }
}
```

#### 新节点有children旧节点没有

```js
export default function (oldVnode, newVnode) {
    //判断传入的第一个参数，是DOM节点还是虚拟节点
    if (oldVnode.sel == '' || oldVnode.sel == undefined) {
          //......
    }

    //判断old和new是不是一个同一个节点
    if (oldVnode.key == newVnode.key && oldVnode.sel == newVnode.sel) {  //同一个节点
        //判断新旧vnode是否是同一个对象
        if (oldVnode === newVnode) return
        //新节点有text属性
        //......
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
            }
        }

    } else { //不是同一个节点
          //......
            }
}
```

#### 新旧节点都有children

