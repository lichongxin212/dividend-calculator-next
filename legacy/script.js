document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate');
    const resultsSection = document.querySelector('.results');
    let returnsChart = null;

    calculateBtn.addEventListener('click', () => {
        calculatePortfolioSummary();
        resultsSection.classList.remove('hidden');
        
        // 计算滚动位置
        const offset = resultsSection.offsetTop - 20;  // 减去20px的偏移量，让视觉效果更好
        
        // 平滑滚动
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    });

    function calculatePortfolioSummary() {
        // 只选择主要行，排除展开的详情行
        const rows = Array.from(document.querySelectorAll('#stockInfoTable tbody tr')).filter(row => !row.classList.contains('dividend-details'));
        
        let portfolioAmount = 0;
        let annualDividendIncome = 0;
        const stockData = [];
        const monthlyDividends = Array(12).fill(0);

        // 收集数据
        rows.forEach(row => {
            // 确保只处理包含输入框的行
            const priceInput = row.querySelector('.price-input');
            const quantityInput = row.querySelector('.quantity-input');
            
            if (priceInput && quantityInput) {
                const symbol = row.querySelector('td:first-child').textContent.trim();
                const price = parseFloat(priceInput.value) || 0;
                const quantity = parseInt(quantityInput.value) || 0;
                const dividends = parseFloat(row.querySelector('td:nth-child(3)').textContent.replace('$', ''));
                const frequency = getFrequencyFromText(row.querySelector('td:nth-child(2)').textContent);
                
                const investmentAmount = price * quantity;
                portfolioAmount += investmentAmount;
                annualDividendIncome += dividends * quantity;

                // 收集饼图数据
                stockData.push({
                    symbol: symbol,
                    amount: investmentAmount
                });

                // 计算月度股息分布
                if (frequency > 0) {
                    const dividendData = row.dividendData;
                    if (dividendData && dividendData.results) {
                        const today = new Date();
                        const oneYearAgo = new Date();
                        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                        
                        dividendData.results.forEach(div => {
                            const exDivDate = new Date(div.ex_dividend_date);
                            if (exDivDate >= oneYearAgo && exDivDate <= today) {
                                const month = exDivDate.getMonth();
                                monthlyDividends[month] += div.cash_amount * quantity;
                            }
                        });
                    }
                }
            }
        });

        const annualDividendYield = (annualDividendIncome / portfolioAmount) * 100;

        // 更新摘要卡片
        document.querySelector('.summary-card:nth-child(1) .amount').textContent = 
            `$${portfolioAmount.toFixed(2)}`;
        document.querySelector('.summary-card:nth-child(2) .amount').textContent = 
            `$${annualDividendIncome.toFixed(2)}`;
        document.querySelector('.summary-card:nth-child(3) .amount').textContent = 
            `${annualDividendYield.toFixed(2)}%`;

        // 创建饼图
        createPortfolioChart(stockData);
        // 创建月度股息柱状图
        createMonthlyDividendChart(monthlyDividends);
    }

    function getFrequencyFromText(text) {
        switch (text) {
            case 'Monthly': return 12;
            case 'Quarterly': return 4;
            case 'Bi-annually': return 2;
            case 'Annually': return 1;
            default: return 0;
        }
    }

    function createPortfolioChart(data) {
        const ctx = document.getElementById('portfolioChart').getContext('2d');
        
        if (window.portfolioChart instanceof Chart) {
            window.portfolioChart.destroy();
        }

        // 计算总金额
        const total = data.reduce((sum, item) => sum + item.amount, 0);

        window.portfolioChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.map(item => item.symbol),
                datasets: [{
                    data: data.map(item => item.amount),
                    backgroundColor: [
                        '#4CAF50',  // 主色调：标准绿
                        '#00C853',  // 亮绿色
                        '#1B5E20',  // 深绿色
                        '#64DD17',  // 青柠绿
                        '#004D40',  // 深青色
                        '#00BFA5',  // 蓝绿色
                        '#33691E',  // 橄榄绿
                        '#76FF03'   // 荧光绿
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Portfolio Allocation',
                        padding: {
                            top: 10,
                            bottom: 20
                        },
                        font: {
                            size: 18,
                            weight: 500
                        }
                    },
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                size: 13
                            },
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                        const value = data.datasets[0].data[i];
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        return {
                                            text: `${label} (${percentage}%)`,
                                            fillStyle: data.datasets[0].backgroundColor[i],
                                            hidden: isNaN(value),
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        titleFont: {
                            size: 13
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `$${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    function createMonthlyDividendChart(data) {
        const ctx = document.getElementById('monthlyDividendChart').getContext('2d');
        
        if (window.monthlyDividendChart instanceof Chart) {
            window.monthlyDividendChart.destroy();
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        window.monthlyDividendChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Expected Monthly Dividends',
                    data: data,
                    backgroundColor: '#4CAF50'  // 使用新的主色调
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Expected Monthly Dividend Income',
                        padding: {
                            top: 10,
                            bottom: 20
                        },
                        font: {
                            size: 18,
                            weight: 500
                        }
                    },
                    legend: {
                        display: false
                    },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        offset: 5,
                        formatter: value => `$${value.toFixed(2)}`,
                        color: '#2E7D32',  // 使用深一点的绿色提高可读性
                        font: {
                            size: 10
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            font: {
                                size: 13
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: 13
                            },
                            callback: value => `$${value.toFixed(2)}`
                        },
                        suggestedMax: function(context) {
                            const max = Math.max(...context.chart.data.datasets[0].data);
                            return max * 1.2;
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    // 添加股票搜索功能
    const searchBtn = document.getElementById('searchStock');
    const tickerInput = document.getElementById('ticker');
    const dropdownContainer = document.querySelector('.autocomplete-dropdown');
    let selectedIndex = -1;
    let searchResults = [];

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 替换 API key
    const POLYGON_API_KEY = 'Y8hrbNpzzjb9CYjEANUWFHYvvQaS8f3p';
    const BASE_URL = 'https://api.polygon.io';

    // 修改搜索股票函数
    async function searchStocks(query) {
        try {
            const response = await fetch(`${BASE_URL}/v3/reference/tickers?search=${query}&active=true&sort=ticker&market=stocks&order=asc&limit=5&apiKey=${POLYGON_API_KEY}`);
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('Error searching stocks:', error);
            return [];
        }
    }

    // 更新下拉列表显示
    function updateDropdown(results) {
        dropdownContainer.innerHTML = '';
        searchResults = results;
        
        results.forEach((result, index) => {
            const item = document.createElement('div');
            item.className = `autocomplete-item${index === selectedIndex ? ' selected' : ''}`;
            item.innerHTML = `
                <span>${result.ticker}</span>    
                <span class="autocomplete-name">${result.name}</span>
            `;
            
            item.addEventListener('click', () => {
                tickerInput.value = result.ticker;
                dropdownContainer.classList.add('hidden');
                fetchStockData(result.ticker);
            });
            
            dropdownContainer.appendChild(item);
        });
        
        dropdownContainer.classList.toggle('hidden', results.length === 0);
    }

    // 处理输入
    const handleInput = debounce(async (event) => {
        const query = event.target.value.trim();
        if (query.length < 2) {
            dropdownContainer.classList.add('hidden');
            return;
        }
        
        const results = await searchStocks(query);
        updateDropdown(results);
    }, 300);

    // 处理键盘导
    function handleKeydown(event) {
        if (dropdownContainer.classList.contains('hidden')) return;
        
        switch(event.key) {
            case 'ArrowDown':
                event.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, searchResults.length - 1);
                updateDropdown(searchResults);
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                updateDropdown(searchResults);
                break;
                
            case 'Enter':
                event.preventDefault();
                if (selectedIndex >= 0 && searchResults[selectedIndex]) {
                    tickerInput.value = searchResults[selectedIndex].ticker;
                    dropdownContainer.classList.add('hidden');
                    fetchStockData(searchResults[selectedIndex].ticker);
                } else if (tickerInput.value.trim()) {
                    fetchStockData(tickerInput.value.trim());
                }
                break;
                
            case 'Escape':
                dropdownContainer.classList.add('hidden');
                selectedIndex = -1;
                break;
        }
    }

    // 添加事件监听器
    tickerInput.addEventListener('input', handleInput);
    tickerInput.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.autocomplete-container')) {
            dropdownContainer.classList.add('hidden');
            selectedIndex = -1;
        }
    });

    // 添加获取频率文本的助函数
    function getFrequencyText(frequency) {
        switch (frequency) {
            case 0:
                return 'One-time';
            case 1:
                return 'Annually';
            case 2:
                return 'Bi-annually';
            case 4:
                return 'Quarterly';
            case 12:
                return 'Monthly';
            default:
                return 'N/A';
        }
    }

    // 添加自定义提示框函数
    function showAlert(message) {
        // 创建提示框元素
        const overlay = document.createElement('div');
        overlay.className = 'alert-overlay';
        overlay.innerHTML = `
            <div class="alert-box">
                <div class="alert-message">${message}</div>
                <button class="alert-button">OK</button>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(overlay);
        
        // 触发动画
        setTimeout(() => overlay.classList.add('show'), 10);
        
        // 添加关闭事件
        const closeAlert = () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        };
        
        overlay.querySelector('.alert-button').addEventListener('click', closeAlert);
    }

    // 修改显示股票信息函数中的提示
    function displayStockInfo(symbol, price, dividendData) {
        const tbody = document.querySelector('#stockInfoTable tbody');
        
        // 检查现有行数
        const existingRows = Array.from(tbody.querySelectorAll('tr')).filter(row => !row.classList.contains('dividend-details'));
        if (existingRows.length >= 5) {
            showAlert('Maximum 5 stocks allowed in the portfolio. Please remove some stocks before adding new ones.');
            return;
        }

        // 获取股息频率
        const frequency = dividendData.results && dividendData.results[0] ? 
            dividendData.results[0].frequency : 0;
        
        let totalDividends = 0;
        
        if (dividendData.results) {
            const today = new Date();
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            
            dividendData.results.forEach(div => {
                const exDivDate = new Date(div.ex_dividend_date);
                if (exDivDate >= oneYearAgo && exDivDate <= today) {
                    totalDividends += div.cash_amount;
                }
            });
        }
        
        const annualYield = totalDividends / price * 100;

        // 创建主行
        const tr = document.createElement('tr');
        tr.dividendData = dividendData;
        tr.innerHTML = `
            <td>
                <button class="delete-btn" title="Delete">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                        <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
                    </svg>
                </button>
                ${symbol}
            </td>
            <td>${getFrequencyText(frequency)}</td>
            <td class="dividend-cell">
                <span class="dividend-amount">$${totalDividends.toFixed(2)}</span>
                <button class="expand-btn" title="Show dividend history">
                    <svg viewBox="0 0 24 24" width="120" height="12">
                        <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                    </svg>
                </button>
            </td>
            <td>
                <input type="number" class="price-input" value="${price.toFixed(2)}" min="0.01" step="0.01">
            </td>
            <td>${annualYield.toFixed(2)}%</td>
            <td>
                <input type="number" class="quantity-input" value="100" min="1" step="1">
            </td>
            <td>$${(price * 100).toFixed(2)}</td>
        `;

        // 添加展开行（初始隐藏）
        const detailsTr = document.createElement('tr');
        detailsTr.className = 'dividend-details hidden';
        detailsTr.innerHTML = `
            <td colspan="7">
                <div class="dividend-history">
                    ${getDividendHistoryRows(dividendData)}
                </div>
            </td>
        `;

        // 添加开按钮点击事件
        const expandBtn = tr.querySelector('.expand-btn');
        expandBtn.addEventListener('click', () => {
            detailsTr.classList.toggle('hidden');
            expandBtn.classList.toggle('expanded');
        });

        // 添加删除按钮事件监听
        const deleteBtn = tr.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            tr.remove();
            detailsTr.remove();
        });
        
        // 获取输入元素
        const priceInput = tr.querySelector('.price-input');
        const quantityInput = tr.querySelector('.quantity-input');
        const yieldCell = tr.querySelector('td:nth-child(5)');
        const investmentCell = tr.querySelector('td:last-child');
        
        // 更新计算函数
        const updateCalculations = () => {
            const currentPrice = parseFloat(priceInput.value) || 0;
            const quantity = parseInt(quantityInput.value) || 0;
            
            // 更新年化收益率
            const newYield = currentPrice > 0 ? (totalDividends / currentPrice * 100) : 0;
            yieldCell.textContent = `${newYield.toFixed(2)}%`;
            
            // 更新投资金额
            investmentCell.textContent = `$${(currentPrice * quantity).toFixed(2)}`;
        };
        
        // 添加价格输入事件监听
        priceInput.addEventListener('input', updateCalculations);
        
        // 添加数量输入事件监听
        quantityInput.addEventListener('input', updateCalculations);
        
        // 添加到表格
        tbody.appendChild(tr);
        tbody.appendChild(detailsTr);
    }

    // 修改生成分红历史记录的函数
    function getDividendHistoryRows(dividendData) {
        if (!dividendData.results) return '';

        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        return dividendData.results
            .filter(div => {
                const exDivDate = new Date(div.ex_dividend_date);
                return exDivDate >= oneYearAgo && exDivDate <= today;
            })
            .map(div => `
                <div class="dividend-row">
                    <div class="dividend-cell ticker-cell">
                        <span class="indent"></span>
                    </div>
                    <div class="dividend-cell date-cell">
                        ${new Date(div.ex_dividend_date).toLocaleDateString()}
                    </div>
                    <div class="dividend-cell amount-cell">
                        $${div.cash_amount.toFixed(4)}
                    </div>
                    <div class="dividend-cell"></div>
                    <div class="dividend-cell"></div>
                    <div class="dividend-cell"></div>
                    <div class="dividend-cell"></div>
                </div>
            `).join('');
    }

    // 修改获取股票数据函数中的提示
    async function fetchStockData(symbol) {
        const searchBtn = document.getElementById('searchStock');
        searchBtn.disabled = true;
        try {
            // 获取当前股价
            const priceResponse = await fetch(`${BASE_URL}/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`);
            const priceData = await priceResponse.json();

            if (priceData.results && priceData.results[0]) {
                const price = priceData.results[0].c; // 收盘价
                const dividendResponse = await fetch(
                    `${BASE_URL}/v3/reference/dividends?ticker=${symbol}&limit=12&order=desc&apiKey=${POLYGON_API_KEY}`
                );
                const dividendData = await dividendResponse.json();
                displayStockInfo(symbol, price, dividendData);
            } else {
                showAlert('Error fetching stock data. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
            showAlert('Error fetching stock data. Please try again later.');
        } finally {
            searchBtn.disabled = false;
        }
    }

    // 添加搜索按钮点击事件
    searchBtn.addEventListener('click', () => {
        const symbol = tickerInput.value.trim();
        if (symbol) {
            fetchStockData(symbol.toUpperCase());
        }
    });

    // 添加快速输入按钮的事件处理
    document.querySelectorAll('.quick-ticker-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const ticker = btn.dataset.ticker;
            tickerInput.value = ticker;
            fetchStockData(ticker);
        });
    });

    // // 添加默认股票数据
    // async function loadDefaultStocks() {
    //     const defaultStocks = ['SCHD', 'JEPI'];
    //     for (const symbol of defaultStocks) {
    //         await fetchStockData(symbol);
    //     }
    // }

    // // 页面加载时获取默认股票数据
    // loadDefaultStocks();
}); 