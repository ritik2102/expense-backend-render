const token = localStorage.getItem('token');
const downloadList = document.getElementById('download-list');
const downloadsHead = document.getElementById('downloads-head');



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

            boardButton.onclick = async function (e) {

                e.preventDefault();
                const res = await axios.get('http://localhost:3000/premium/getLeaderboard', { headers: { "Authorization": token } });
                const data = res.data.resData;

                const heading = document.createElement('h2');
                heading.appendChild(document.createTextNode('Leaderboard'));
                leaderboardList.appendChild(heading);
                for (let i = 0; i < data.length; i++) {
                    const li = document.createElement('li');
                    if (i % 2 === 0) {
                        li.classList.add('leaderboard-list-item-even')
                    }
                    else {
                        li.classList.add('leaderboard-list-item-odd')
                    }
                    li.appendChild(document.createTextNode(`Name-${data[i].name}  Total Expense-${data[i].total_expense}`));
                    leaderboardList.appendChild(li);
                }
            }

            await axios.get('http://localhost:3000/users/getDownloads', { headers: { "Authorization": token } })
                .then(response => {
                    const files = response.data.response;
                    downloadsHead.appendChild(document.createTextNode('Downloaded files'));
                    files.forEach((file) => {
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.href = file.url;
                        a.appendChild(document.createTextNode(`    Download file again`))
                        li.appendChild(document.createTextNode(`${file.file_name}`));
                        li.appendChild(a);
                        downloadList.appendChild(li);
                    })

                })
                .catch(err => {
                    throw new Error(err);
                })
        }
    }
    catch (err) {
        console.log(err);
    }
})
