# Lucky-Lottery

### 機率驗證
``` js
function runLotteryTest() {
    // 獎品池，這裡有 106 個獎項，從 'Prize 1' 到 'Prize 106'
    const pools = [];
    for (let i = 1; i <= 106; i++) {
        pools.push(`Prize ${i}`);
    }

    // GetTicket 函數（這是你提供的改寫過的版本）
    function GetTicket(pools, count) {
        const getRandomInt = (min, max) => {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array); // 使用加密級隨機數生成器
            return Math.floor(array[0] / (0xFFFFFFFF + 1) * (max - min + 1)) + min;
        };

        const poolCopy = [...pools];
        const selected = [];

        for (let i = 0; i < count; i++) {
            if (poolCopy.length === 0) break; // 如果剩餘元素不夠，就提前結束

            const randomIndex = getRandomInt(0, poolCopy.length - 1);  // 基於加密隨機數選擇索引
            selected.push(poolCopy.splice(randomIndex, 1)[0]);  // 選擇並刪除已選元素
        }

        return selected;
    }

    // 設置測試參數
    const totalDraws = 100000;  // 增加抽獎次數到 100000 次
    const count = 1;           // 每次抽取 1 個獎品

    // 根據 pools 自動生成 resultCounts 物件
    const resultCounts = pools.reduce((acc, prize) => {
        acc[prize] = 0;  // 初始化每個獎項的次數為 0
        return acc;
    }, {});

    // 計算理論的中獎率誤差
    const expectedProbability = 1 / pools.length; // 每個獎項的理論機率
    const expectedError = Math.sqrt(totalDraws * expectedProbability * (1 - expectedProbability)); // 中獎次數的標準差
    const expectedRateError = (expectedError / totalDraws) * 100; // 轉換為中獎率的誤差百分比

    // 執行抽獎 100000 次
    for (let i = 0; i < totalDraws; i++) {
        const result = GetTicket(pools, count);
        resultCounts[result[0]]++;  // 統計每次抽中的獎品
    }

    // 用來統計超過誤差範圍和在誤差範圍內的數量
    let errorExceededCount = 0;
    let withinErrorRangeCount = 0;
    let maxErrorExceeded = 0;  // 用來記錄超出誤差範圍的最大誤差值

    // 輸出每個獎項的機率和誤差判斷
    console.log("抽獎結果統計（每個獎項的機率與誤差判斷）:");
    
    for (const prize in resultCounts) {
        const actualCount = resultCounts[prize];
        const actualRate = (actualCount / totalDraws) * 100; // 實際中獎率（百分比）

        // 計算誤差
        const error = Math.abs(actualRate - (expectedRateError + expectedProbability * 100)); // 實際中獎率與期望中獎率的誤差

        // 判斷誤差是否超過預期的誤差範圍
        if (error > expectedRateError) {
            errorExceededCount++;  // 超過誤差範圍的獎項數量
            if (error > maxErrorExceeded) {
                maxErrorExceeded = error;  // 更新最大的超出誤差值
            }
            console.log(`警告：${prize}的誤差 ${error.toFixed(2)}% 超過了預期誤差範圍！`);
        } else {
            withinErrorRangeCount++;  // 在誤差範圍內的獎項數量
        }

        // 輸出每個獎項的中獎率和誤差
        console.log(`${prize}: 實際中獎率 ${(actualRate).toFixed(2)}%，誤差 ${(error).toFixed(2)}%`);
    }

    // 顯示結果統計
    console.log("\n結果統計:");
    console.log(`超過誤差範圍的獎項數量: ${errorExceededCount}`);
    console.log(`在誤差範圍內的獎項數量: ${withinErrorRangeCount}`);
    console.log(`每個獎項的預期中獎率誤差範圍: ±${expectedRateError.toFixed(2)}%`);
    console.log(`超出誤差範圍的最大誤差值: ${maxErrorExceeded.toFixed(2)}%`);  // 輸出最大誤差值
}

// 執行測試
runLotteryTest();

```