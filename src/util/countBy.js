function countBy (arr, func) {
    let count = 0;
    arr.forEach(function () {
        if (func.apply(this, arguments)) {
            count ++;
        }
    });
    return count;
}

module.exports = countBy;
