// leetcode排序数组
// https://leetcode-cn.com/problems/sort-an-array/submissions/


var swap = function (arr, l, r) {
    let item = arr[l]
    arr[l] = arr[r]
    arr[r] = item;
}

// 简单排序注解
// https://www.runoob.com/w3cnote/insertion-sort.html 菜鸟教程基础算法系列
// https://yuchengkai.cn/docs/cs/algorithm.html#%E6%8C%89%E4%BD%8D%E6%93%8D%E4%BD%9C
// 插入排序一般优于冒泡拍戏

/** 插入排序 */
// 分成两部分，一部分已排序的，一部分未排序，每次从未排序的取一个插入到已排序的数组里。在程序初始的时候已排序的部分就是第一个元素。
var insertion = function (nums) {
    var insertLength = 1;
    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < insertLength; j++) {
            if (nums[i] < nums[j]) {
                swap(nums, i, j);
            }
        }
        insertLength++;
    }
    return nums;
}

/** 冒泡排序 */
// 遍历数组，每次把当年元素和下一个元素比较，每次把大的放到后面
var bubble = function (nums) {
    for (let i = nums.length - 1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            if (nums[j] > nums[j + 1]) {
                swap(nums, j, j + 1)
            }
        }
    }
    return nums
};

/** 选择排序 */
// 选择排序的思路是每次找出剩下数组中最小的，放到已排序部分的最后
var selection = function (nums) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            console.log(i, j, nums[i], nums[j])
            if (nums[j] < nums[i]) {
                console.log('swap')
                swap(nums, i, j)
            }
        }
    }
    console.log(nums)
    return nums
}

/** 归并排序**/
// 待理解补充
// 将数组两两分开分开直到最终包含两个元素，  将两两排好序后开始合并数组（利用双指针）

/** 快速排序 */
// 实现思路
// 1.找一个基准，比基准小的放它左边，基准大的放它右边（两个指针，一个找大数，一个找小树）
// 这个基准越像中位数越好，所以可以从 start\end\mid中取一个最中间的出来，然后开始便利，分成左右两部分，最后把枢纽放进去
// 2. 对基准左右两边的子集重复1操作
// 3. 递归退出条件： 子集只剩下一个元素

var sortPart = function (nums, l, r) {
    if(r <= l  || l<0 || r > nums.length-1) return nums;
    let point = l;
    // let low = point + 1;
    let low = l;
    let high = r;
    while (high > low) {
        if (nums[high] > nums[point]) {
            high--;
        } else {
            if (nums[low] < nums[point]) {
                low++;
            } else {                                    
                swap(nums, high, low);                 
            }  
        }
    }
    // 这里是把第一位作为基准，它会往右交换，所以     要和相集合的点比较大小，只有大于它才能往右去，不然证明该点最小，则不交换
    // if(nums[point]>nums[low]){
    //     swap(nums, point, low);
    // }
    // else if(nums[point] === nums[low]){
    //     if(low === point+1){
    //         point =low;
    //     }
    // }
    swap(nums,point,low);
    sortPart(nums, 0, low);
    sortPart(nums, low+1, nums.length - 1);
}
var quickSort = function (nums) {
    let l = 0;
    let r = nums.length - 1;
     sortPart(nums, l, r);
     console.log(nums);
     return nums;
}

/**test */
var arr = [5, 2, 3, 1];
var arr2=[5,1,1,2,0,0]
// selection(arr)
// quickSort(arr)
quickSort(arr2)

// console.log(sortArray(arr))