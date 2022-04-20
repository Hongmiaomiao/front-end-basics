

// state、addOne、plusOne、getState
class useRedux {
  constructor(state){
  let val = state
  }
  addOne (){
    this.val++;
    console.log(this.val)
  }
   plusOne(){
    this.val--;
    console.log(this.val)
  }
   getState(){
    console.log(this.val)
    return this.val;
  }
}


// 大数相加
function bigNumAdd (a,b){
  let numa = String(a).split('');
  let numb = String(b).split('');
  let res = [];
  let maxLength = Math.max(numa.length,numb.length);
  for(let i=0;i<maxLength;i++){
    // 位数可能不一样
    num[a] = numa[a] || 0
    num[b] = numb[b] || 0
   res[i] += (numa[a] + numb[b]) 
      if(res[i] > 10){
        res[i+1] = 1;
        res[i] = res[1] - 10;
      }
  }
  return res.join('');
}