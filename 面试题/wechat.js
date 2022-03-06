// 第一题：
// 给定两个版本号，比较两个版本号的大小。.号作为分割符使用，版本号中只有数和.号。  （0.1 < 1.1.1 < 1.2 < 13.37  ）
// 例如： 
// 给定一个function输入两个参数 targetVersion , currentVersion  
// 比较后返回   1， 0 ，-1 ( 大 ，等于 ，小于 )

function compareVersion(targetVersion, currentVersion) {
    let targetArr = targetVersion.split('.');
    let currentArr = currentVersion.split('.');
    let minLen = Math.min(targetArr.length, currentArr.length);
    for (let i = 0; i < minLen; i++) {
        if (targetArr[i] > currentArr[i]) {
            return 1;
        } else if (targetArr[i] < currentArr[i]) {
            return -1;
        }
    }
    // 走到这里说明前面的位置都相同
    if (targetArr.length > currentArr.length) { return 1; }
    if (targetArr.length < currentArr.length) { return -1 }
    return 0;
}

// console.log(compareVersion('0.1','1.1.1'));
// console.log(compareVersion('1.2','3.7'));
// console.log(compareVersion('1.1.1','1.1.1'));




// 第二题：
// 给定一个整数数组和一个目标值，找出数组中和为目标值的两个数。 算法要求 o(n)
// (一个值只能用一次，匹配多个值，需要都返回 ，(  find([2，2，1，1，1，5，55] , 3) 输出 [2,1] , [2,1] )


const find = function(arr,sum){
    let result = [];
    let map = { }
    arr.map((item,index)=> {
        if(map[item]){
            map[item]++;
        }else{
            // 记录出现的次数
            map[item] = 1;
        }

    })
    console.log(map)
    // 遍历数组，找出和这个数加和的另一个数，并且注意数的位置不能出现多次 => 第二个条件可以通过只在剩下的数中查找满足
    for(let i=0;i<arr.length;i++){
        let target = sum - arr[i];
        if(map[target]>=1){
            map[target]--;
            map[arr[i]]--;
            result.push([arr[i],target]);
        }
    }
    return result;
}

// find([2,2,1,1,1,5,55] , 3)





// 第三题 
// 给定一个非负整数，你至多可以交换一次数字中的任意两位。返回你能得到的最大值。
// （输入: 2736输出: 7236 , 输入 98583 ，输出 98853）

function getMax(num){
    // 最大值是否在第一位 => 交换到第一位
    // 第二个值是否在第二位 => 交换到第二位
    // 思路 => 先对这个num做一个排序，然后比对
    let arr = String(num).split('');
    let sortArr = arr.concat().sort((a,b) =>{return b-a} )
    let i =0;
    while(arr[i] === sortArr[i]){i++;}
    if(i === arr.length -1) { return num; }
    let target = sortArr[i];
    // 这里要注意查找到的位置必须在第i位之后的第一个索引才是真正的位置
    // let findInArr = arr.concat();
    // findInArr.slice(i);

    // let findIndex = i + findInArr.lastIndexOf(target);
    // let item = arr[findIndex];
    //  arr[findIndex] = arr[i];
    let findIndex = 
     arr[i] = item;
    //  console.log(arr,sortArr,findIndex,arr[findIndex]);
     console.log(arr.join(''))
    return arr.join('');
}

getMax(93689)
// getMax(98583)
