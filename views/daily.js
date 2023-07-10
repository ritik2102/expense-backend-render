const expenseList = document.getElementById('expense-list');
const razorpayBtn = document.getElementById('razorpayBtn');
const token = localStorage.getItem('token');
const dateField = document.getElementById('date-field');
const monthField = document.getElementById('month-field');
const yearField = document.getElementById('year-field');
const expensesHeading = document.getElementById('expenses-heading');
const expenseTable = document.getElementById('expense-table');
const pagination = document.getElementById('pagination');
const reportButton = document.getElementById('report-button');
const downloadList = document.getElementById('download-list');
const downloadsHead = document.getElementById('downloads-head');

const dateHead = document.getElementById('date-head');
const netMoneyField = document.getElementById('net-money');
const numberFieldsButton = document.getElementById('number-fields-submit');
const numberFields = document.getElementById('number-fields');

let numRows = localStorage.getItem('numRows');

const leaderboardTable = document.getElementById('leaderboard-table');
const leaderboardHeading = document.getElementById('leaderboard-heading');

if (!numRows) {
    localStorage.setItem('numRows', 10);
}
numberFieldsButton.onclick = async (e) => {
    try {
        e.preventDefault();
        const num = numberFields.value;
        localStorage.setItem('numRows', num);
        numRows = num;
        getProducts(1);
    }
    catch (err) {
        console.log(err);
    }
}





function expenseDataHandler(response) {
    try {
        let netExpenses = 0;
        let netSavings = 0;
        let i = -1;
        response.forEach((record) => {
            i++;

            if (record.name === null) {
                netSavings += record.price;
            }
            else {
                netExpenses += record.price;
            }
            logData(record, i);
        });
        // showPagination(pageData);

        const netMoney = document.createElement('h2');
        if (netSavings - netExpenses >= 0) {
            netMoney.appendChild(document.createTextNode(`Net savings- ${netSavings - netExpenses}`));
        }
        else {
            netMoney.appendChild(document.createTextNode(`Net expenses- ${netExpenses - netSavings}`));
        }

        netMoneyField.appendChild(netMoney);
    } catch (err) {
        console.log(err);
    }
}

async function getProducts(page) {

    try {
        expenseTable.innerHTML = '';
        dateHead.innerHTML = '';
        netMoneyField.innerHTML = '';

        expenseTable.innerHTML += '<th>Description</th><th>Category</th><th>Income</th><th>Expense</th>';
        const date = dateField.value;
        const month = monthField.value
        const year = yearField.value;

        const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        const monthIndex = month - 1;
        dateHead.appendChild(document.createTextNode(`${date} ${monthName[monthIndex]} ${year}`));

        await axios.get(`http://localhost:3000/expense/get-expense?page=${page}&&date=${date}&&month=${month}&&year=${year}&&numRows=${numRows}`, { headers: { "Authorization": token } })
            .then(({ data: { response, ...pageData } }) => {
                expenseDataHandler(response);
                showPagination(pageData);
            })
            .catch(err => console.log(err))
    } catch (err) {
        console.log(err);
    }
}
async function showPagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage }) {
    try {
        pagination.innerHTML = '';

        // previous page
        if (hasPreviousPage) {
            if (previousPage !== 1) {
                const btn3 = document.createElement('button');
                btn3.innerHTML = '1';
                btn3.classList.add('pagination-button');
                btn3.addEventListener('click', () => {
                    getProducts(1);
                })
                pagination.appendChild(btn3);
                pagination.appendChild(document.createTextNode('..'));

            }
            const btn = document.createElement('button');
            btn.innerHTML = previousPage;
            btn.classList.add('pagination-button');
            btn.addEventListener('click', () => {
                getProducts(previousPage);
            })
            pagination.appendChild(btn);

        }

        // current page
        const btn1 = document.createElement('button');
        btn1.innerHTML = currentPage;
        btn1.classList.add('pagination-button-current');
        btn1.addEventListener('click', () => {
            getProducts(currentPage);
        })
        pagination.appendChild(btn1);


        // next page
        if (hasNextPage) {
            const btn2 = document.createElement('button');
            btn2.innerHTML = nextPage;
            btn2.classList.add('pagination-button');
            btn2.addEventListener('click', () => {
                getProducts(nextPage);
            })
            pagination.appendChild(btn2);
            if (nextPage !== lastPage) {
                const btn4 = document.createElement('button');
                btn4.innerHTML = lastPage;
                btn4.classList.add('pagination-button');
                btn4.addEventListener('click', () => {
                    getProducts(lastPage);
                })
                pagination.appendChild(document.createTextNode('..'));
                pagination.appendChild(btn4);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function getExpenses(e) {

    try {
        e.preventDefault();

        const date = dateField.value;
        const month = monthField.value
        const year = yearField.value;

        const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        dateHead.appendChild(document.createTextNode(`${date} ${monthName[month]} ${year}`));

        const page = 1;
        await axios.get(`http://localhost:3000/expense/get-expense?page=${page}&&date=${date}&&month=${month}&&year=${year}&&numRows=${numRows}`, { headers: { "Authorization": token } })
            .then(({ data: { response, ...pageData } }) => {
                expenseDataHandler(response);
                showPagination(pageData);
            })
            .catch(err => console.log(err))
    } catch (err) {
        console.log(err);
    }
}

function logData(record, i) {

    try {
        const price = record.price;
        const name = record.name;
        const category = record.category;
        const id = record.id;

        const tableRow = document.createElement('tr');
        const deleteData = document.createElement('td');
        deleteData.classList.add('delete-field');

        if (name === null) {
            const descriptionData = document.createElement('td');
            descriptionData.appendChild(document.createTextNode(`Salary`));
            const categoryData = document.createElement('td');
            categoryData.appendChild(document.createTextNode(`Salary`));
            const incomeData = document.createElement('td');
            incomeData.appendChild(document.createTextNode(`${price}`));
            const expenseData = document.createElement('td');
            expenseData.appendChild(document.createTextNode(``));

            tableRow.appendChild(descriptionData);
            tableRow.appendChild(categoryData);
            tableRow.appendChild(incomeData);
            tableRow.appendChild(expenseData);
            tableRow.appendChild(deleteData);
        }
        else {
            const descriptionData = document.createElement('td');
            descriptionData.appendChild(document.createTextNode(`${name}`));
            const categoryData = document.createElement('td');
            categoryData.appendChild(document.createTextNode(`${category}`));
            const incomeData = document.createElement('td');
            incomeData.appendChild(document.createTextNode(``));
            const expenseData = document.createElement('td');
            expenseData.appendChild(document.createTextNode(`${price}`));

            tableRow.appendChild(descriptionData);
            tableRow.appendChild(categoryData);
            tableRow.appendChild(incomeData);
            tableRow.appendChild(expenseData);
            tableRow.appendChild(deleteData);
        }

        expenseTable.appendChild(tableRow);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add(record.id);
        deleteButton.classList.add('delete-button');

        deleteButton.appendChild(document.createTextNode('Delete'));

        deleteButton.onclick = async () => {
            try {
                let res;
                if (name === null) {
                    res = await axios.post(`http://localhost:3000/expense/delete-salary/${id}`, '', { headers: { "Authorization": token } });
                }
                else {
                    res = await axios.post(`http://localhost:3000/expense/delete-expense/${id}`, '', { headers: { "Authorization": token } });
                }
                if (res.data.resData === 'success') {
                    expenseTable.removeChild(tableRow);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        deleteData.appendChild(deleteButton);
    }
    catch (err) {
        throw new Error(err);
    }

}


window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Every time the server restarts, the backend might not be available, so we are just giving time for backend to start properly
        const response = await axios.get('http://localhost:3000/purchase/premiumOrNot', { headers: { "Authorization": token } });
        const isPremium = response.data.isPremium;
        if (isPremium === 'true') {
            razorpayBtn.innerHTML = 'Premium User 👑';
            razorpayBtn.classList.add('premiumButton');

            const boardButton = document.getElementById('leader-board');
            boardButton.classList.add('boardButton');
            leaderboardTable.style.visibility = 'hidden';

            boardButton.onclick = async function (e) {

                e.preventDefault();
                leaderboardTable.style.visibility = 'visible';
                const res = await axios.get('http://localhost:3000/premium/getLeaderboard', { headers: { "Authorization": token } });
                const data = res.data.resData;

                leaderboardHeading.appendChild(document.createTextNode('Leaderboard'));

                for (let i = 0; i < data.length; i++) {
                    const tr = document.createElement('tr');

                    const rank = i + 1;
                    const rankCol = document.createElement('td');
                    rankCol.classList.add('leaderboard-col');
                    rankCol.appendChild(document.createTextNode(`${rank}`));
                    tr.appendChild(rankCol);

                    const name = data[i].name;
                    const nameCol = document.createElement('td');
                    nameCol.classList.add('leaderboard-col');
                    nameCol.appendChild(document.createTextNode(`${name}`));
                    tr.appendChild(nameCol);

                    const expense = data[i].total_expense;
                    const expenseCol = document.createElement('td');
                    expenseCol.classList.add('leaderboard-col');
                    expenseCol.appendChild(document.createTextNode(`${expense}`));
                    tr.appendChild(expenseCol);

                    leaderboardTable.appendChild(tr);
                }
            }

        }
    }
    catch (err) {
        console.log(err);
    }
})

document.getElementById('razorpayBtn').onclick = async function (e) {
    try {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/purchase/premiumMembership', { headers: { "Authorization": token } });

        var options = {
            "key": response.data.key_id,//key id generated from the dashboard
            "order_id": response.data.order.id,//order id for a particular order
            "handler": async function (response) {
                await axios.post('http://localhost:3000/purchase/updateTransactionStatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: { "Authorization": token } });

                alert("You are a premium user now");
                window.location.reload();
            }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on("payment.failed", function (response) {
            console.log(response);
            alert("Something went wrong");
        });
    }
    catch (err) {
        throw new Error(err);
    }
}

reportButton.onclick = async (e) => {
    try {

        e.preventDefault();
        const response = await axios.get('http://localhost:3000/purchase/premiumOrNot', { headers: { "Authorization": token } });
        const isPremium = response.data.isPremium;
        if (isPremium === 'true') {
            await axios.get('http://localhost:3000/users/download', { headers: { "Authorization": token } })
                .then((response) => {
                    if (response.status === 200) {
                        // Here the backend will send a download link which as soon as opened will
                        // download the file
                        var a = document.createElement('a');
                        a.href = response.data.fileUrl;
                        // downloading it with name myexpense.csv
                        a.download = 'myexpense.csv';
                        a.click();
                        // window.location.reload();
                    } else {
                        throw new Error
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        else {
            alert('Download report function is available for premium users only');
        }

    }
    catch (err) {
        console.log(err);
    }
}




