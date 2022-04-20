/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
//  输入：root = [3,9,20,null,null,15,7]
//  输出：[[3],[9,20],[15,7]]
var levelOrder = function(root) {
    if(!root) return [];
    let currentLevel = [root];
    let currentIndex = 0;
    let res = []
    while(currentLevel.length){
        let newLevel = [];
        for(let i=0;i<currentLevel.length;i++){
            let node = currentLevel[i]
            res[currentIndex] = res[currentIndex] || []
            res[currentIndex].push(node.val)
            if(node.left){ newLevel.push(node.left)  };
            if(node.right){ newLevel.push(node.right)}
        }
        currentIndex++
        currentLevel = newLevel
    }
    return res
};

// 改进上面的办法，可以只用一个数组来存层次数据，不需要用两个数组（只需要每次开始便利前获取一个当层数组长度即为当前层次的长度，shift了长度个后剩下的就是下一层的。）

var levelOrder = function(root){
    if(!root){
        return [];
    }
    const ret = [];
    const currentLevelArr = [];
    while(currentLevelArr.length){
        let currentLevelSize = currentLevelArr.length;
        ret.push([]);
        for(let i=0;i<currentLevelSize;i++){
            let node = currentLevelArr.shift();
            ret[ret.length - 1].push(node.val);
            if(node.left){ currentLevelArr.push(node.left)};
            if(node.right){ currentLevelArr.push(node.right)};
        }
    }
    return ret;
}

