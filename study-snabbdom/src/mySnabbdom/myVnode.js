//该函数的功能仅仅是传入的参数组合成对象，返回即可
export default function(sel,data,children,text,elm){
      let key=data.key?data.key:null
      return {
        sel,data,children,text,elm,key
      }
}