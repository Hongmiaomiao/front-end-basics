// 参考掘金文章
// https://juejin.cn/post/6987224048564437029
let arr = [
    { id: 1, name: '1', pid: 0 },
    { id: 2, name: '2', pid: 1 },
    { id: 3, name: '3', pid: 1 },
    { id: 4, name: '4', pid: 3 },
    { id: 5, name: '5', pid: 3 },
];

let tree = [
    {
        "id": 1,
        "name": "1",
        "pid": 0,
        "children": [
            {
                "id": 2,
                "name": "2",
                "pid": 1,
                "children": []
            },
            {
                "id": 3,
                "name": "3",
                "pid": 1,
                "children": [
                    {
                        "id": 4,
                        "name": "4",
                        "pid": 3,
                        "children": []
                    }
                ]
            }
        ]
    }
]


const arrayToTree = (items) => {
    let map = {};
    let res = [];
    for (const item of items) {
        map[item.id] = { ...item, children: map[item.id]?.children || [] };
        if (item.pid === 0) {
            res.push(map[item.id]);
        }
        if (!map[item.pid]) {
            map[item.pid] = {
                id: item.pid,
                children: []
            }
        }
        map[item.pid].children.push(map[item.id]);

    }
    console.log('res', JSON.stringify(res));
}

arrayToTree(arr);

