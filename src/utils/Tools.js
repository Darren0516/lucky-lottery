const Tools = {
    /**
     * 抽獎
     * @param {Array} pools - 抽獎池陣列
     * @param {number} count - 需要抽取的數量
     * @returns {Array} - 返回抽取的結果
     */
    GetTicket(pools, count) {
        // 使用當前時間的 ticks 作為隨機種子
        const seed = Date.now();

        // 使用 Math.random() 根據種子來生成隨機數
        const random = (seed) => {
            // 設置隨機種子為當前時間 (可以將種子改為更具體的時間數值進行混合)
            const pseudoRandom = Math.sin(seed) * 10000;
            return pseudoRandom - Math.floor(pseudoRandom);  // 轉換為 0-1 之間的浮點數
        };

        // 用於隨機選擇元素的輔助函數
        const getRandomIndex = (arr, seed) => {
            return Math.floor(random(seed) * arr.length);
        };

        // 複製 pools 陣列來防止修改原始資料
        const poolCopy = [...pools];
        const selected = [];

        // 隨機選擇 count 個元素
        for (let i = 0; i < count; i++) {
            if (poolCopy.length === 0) break; // 如果剩餘元素不夠，就提前結束

            const randomIndex = getRandomIndex(poolCopy, seed + i);  // 基於種子選擇元素
            selected.push(poolCopy.splice(randomIndex, 1)[0]);  // 選擇並刪除已選元素
        }

        return selected;
    }
};

export default Tools;