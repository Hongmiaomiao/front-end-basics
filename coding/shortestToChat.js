

var shortestToChar = (s, c) => {
    let prev;
    let next;
    let res = []
    for (let i = 0; i < s.length; i++) {
        if (s[i] === c) {
            prev = i
        }
        res[i] = isNaN(prev) ? Infinity : i - prev;
        console.log(s[i] === c, prev, i, res[i])
    }
    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] === c) {
            next = i
        }
        res[i] = Math.min((isNaN(next) ? Infinity : next - i), res[i])
    }
    console.log(res)
    return res;
}


shortestToChar("loveleetcode", "e")
shortestToChar("baaa", "b")
