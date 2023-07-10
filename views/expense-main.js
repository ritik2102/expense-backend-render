const razorpayBtn = document.getElementById('razorpayBtn');

const priceField = document.getElementById('price');
const productField = document.getElementById('product');
const categoryField = document.getElementById('category');
const salaryField=document.getElementById('amount');

const mainSection = document.getElementById('main-section');
const leaderboardList = document.getElementById('leaderboardList');
const leaderboardTable = document.getElementById('leaderboard-table');
const leaderboardHeading = document.getElementById('leaderboard-heading');
const token = localStorage.getItem('token');

async function addExpense(e) {

    try {
        e.preventDefault();
        const price = priceField.value;
        const product = productField.value;
        const category = categoryField.value;
        console.log(price, product, category);
        const data = {
            'price': price,
            'product': product,
            'category': category,
        };
        console.log(data);
        const res = await axios.post('http://localhost:3000/expense/post-expense', data, { headers: { "Authorization": token } });
        window.location.reload();
    }
    catch (err) {
        console.log(err);
    }

}

async function addSalary(e) {

    try {
        e.preventDefault();
        const price = salaryField.value;
        const category = 'salary';
        const data = {
            'price': price,
            'category': category,
        };
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:3000/expense/post-salary', data, { headers: { "Authorization": token } });
        console.log(res.data.resData);
        window.location.reload();
    }
    catch (err) {
        console.log(err);
    }

}


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

                const res = await axios.post('http://localhost:3000/users/updateToken', '', { headers: { "Authorization": token } });
                localStorage.setItem('token', res.data.token);
                window.location.reload();
            }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on("payment.failed", function (response) {
            alert("Something went wrong");
        });
    }
    catch (err) {
        throw new Error(err);
    }
}

function comparator(x, y) {
    try {
        return x.amount < y.amount;
    }
    catch (err) {
        throw new Error(err);
    }
}

// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:3000/purchase/premiumOrNot', { headers: { "Authorization": token } });
//         const isPremium = response.data.isPremium;

//         if (isPremium === 'true') {
//             razorpayBtn.innerHTML = 'Premium User 👑';
//             razorpayBtn.classList.add('premiumButton');

//             const boardButton = document.getElementById('leader-board');
//             boardButton.classList.add('boardButton');

//             boardButton.onclick = async function (e) {

//                 e.preventDefault();
//                 const res = await axios.get('http://localhost:3000/premium/getLeaderboard', { headers: { "Authorization": token } });
//                 const data = res.data.resData;

//                 const heading = document.createElement('h2');
//                 heading.appendChild(document.createTextNode('Leaderboard'));
//                 leaderboardList.appendChild(heading);
//                 for (let i = 0; i < data.length; i++) {
//                     const li = document.createElement('li');
//                     li.classList.add('leaderboard-list-item')
//                     if (i % 2 === 0) {
//                         li.classList.add('leaderboard-list-item-even')
//                     }
//                     else {
//                         li.classList.add('leaderboard-list-item-odd')
//                     }
//                     li.appendChild(document.createTextNode(`Name-${data[i].name}  Total Expense-${data[i].total_expense}`));
//                     leaderboardList.appendChild(li);
//                 }
//             }
//         }
//     }
//     catch(err){
//         throw new Error(err);
//     }
// })
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


