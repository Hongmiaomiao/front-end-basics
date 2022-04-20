// 深度优先搜索的经典题目，最多的连通性1的查找，递归思路
// https://leetcode-cn.com/problems/er-cha-shu-de-shen-du-lcof/

// 深度优先搜索，要遍历到所有节点，同时不要做重复反问的事情。遍历每个节点，这个节点代表的area大小就是每次从它的四个方向扩充出去的是1的数量的和，然后再对四个方向再去扩充（这一步就是递归）


var maxIslandArea = function (grid) {
    console.log('test')
    let m = grid.length;
    let n = grid[0]?.length;
    let area = 0;
    const isIlandArea = (i, j) => {
        if (i < 0 || j < 0 || i > (m - 1) || j > (n - 1)) {
            return 0;
        } else {
            if (grid[i][j] === 1) {
                grid[i][j] = 0;
                return 1 + isIlandArea(i + 1, j) + isIlandArea(i, j + 1) + isIlandArea(i - 1, j) + isIlandArea(i, j - 1);
            }
            return 0;
        }
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            area = Math.max(area, isIlandArea(i, j));
        }

    }
    return area;
}

// exp1
let text1 = [[0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]]
maxIslandArea(text1)