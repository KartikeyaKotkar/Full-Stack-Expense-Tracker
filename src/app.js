document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginBox = document.getElementById('login-box');
    const signupBox = document.getElementById('signup-box');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const toSignupLink = document.getElementById('to-signup');
    const toLoginLink = document.getElementById('to-login');
    const logoutBtn = document.getElementById('logout-btn');
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalAmountDisplay = document.getElementById('total-amount');
    const userDisplay = document.getElementById('user-display');
    const showFormBtn = document.getElementById('show-form-btn');
    const expenseModal = document.getElementById('expense-modal');
    const closeModalBtn = document.querySelector('.close-modal');

    let expenseChart = null;

    const updateUIState = () => {
        if (protectRoute()) {
            authSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            userDisplay.textContent = `Welcome, ${localStorage.getItem('username')}`;
            renderDashboard();
        } else {
            authSection.classList.remove('hidden');
            dashboardSection.classList.add('hidden');
        }
    };

    toSignupLink.onclick = (e) => {
        e.preventDefault();
        loginBox.classList.add('hidden');
        signupBox.classList.remove('hidden');
    };

    toLoginLink.onclick = (e) => {
        e.preventDefault();
        signupBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
    };

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        if (Auth.signup(username, password)) {
            signupBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
            signupForm.reset();
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (Auth.login(username, password)) {
            updateUIState();
            loginForm.reset();
        }
    });

    logoutBtn.onclick = () => Auth.logout();

    const renderDashboard = async () => {
        if (!protectRoute()) return;
        const expenses = await db.expenses.orderBy('createdAt').reverse().toArray();
        renderTable(expenses);
        updateStats(expenses);
        renderChart(expenses);
    };

    const renderTable = (expenses) => {
        expenseList.innerHTML = '';
        expenses.forEach(exp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="badge ${exp.category.toLowerCase()}">${exp.category}</span></td>
                <td>₹${parseFloat(exp.amount).toFixed(2)}</td>
                <td>${new Date(exp.createdAt).toLocaleDateString()}</td>
                <td>${new Date(exp.updatedAt).toLocaleDateString()}</td>
                <td class="text-muted">${exp.comments || '-'}</td>
                <td class="action-btns">
                    <button class="btn-icon btn-edit" onclick="editExpense(${exp.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteExpense(${exp.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            expenseList.appendChild(tr);
        });
    };

    const updateStats = (expenses) => {
        const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        totalAmountDisplay.textContent = `₹${total.toFixed(2)}`;
    };

    const renderChart = (expenses) => {
        const categories = {};
        expenses.forEach(exp => {
            categories[exp.category] = (categories[exp.category] || 0) + parseFloat(exp.amount);
        });

        const ctx = document.getElementById('expenseChart').getContext('2d');
        if (expenseChart) expenseChart.destroy();

        expenseChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#64748b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'system-ui' } } }
                }
            }
        });
    };

    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('expense-id').value;
        const category = document.getElementById('category').value;
        const amount = document.getElementById('amount').value;
        const comments = document.getElementById('comments').value;

        const expenseData = { category, amount, comments, updatedAt: Date.now() };

        if (id) {
            await db.expenses.update(parseInt(id), expenseData);
        } else {
            expenseData.createdAt = Date.now();
            await db.expenses.add(expenseData);
        }

        closeModal();
        renderDashboard();
    });

    showFormBtn.onclick = () => {
        document.getElementById('modal-title').textContent = 'Add Expense';
        document.getElementById('submit-btn-text').textContent = 'Save Expense';
        expenseForm.reset();
        document.getElementById('expense-id').value = '';
        expenseModal.classList.remove('hidden');
    };

    closeModalBtn.onclick = closeModal;
    window.onclick = (e) => { if (e.target == expenseModal) closeModal(); };

    function closeModal() { expenseModal.classList.add('hidden'); }

    window.deleteExpense = async (id) => {
        if (confirm('Are you sure?')) {
            await db.expenses.delete(id);
            renderDashboard();
        }
    };

    window.editExpense = async (id) => {
        const exp = await db.expenses.get(id);
        document.getElementById('expense-id').value = exp.id;
        document.getElementById('category').value = exp.category;
        document.getElementById('amount').value = exp.amount;
        document.getElementById('comments').value = exp.comments;
        document.getElementById('modal-title').textContent = 'Edit Expense';
        document.getElementById('submit-btn-text').textContent = 'Update Expense';
        expenseModal.classList.remove('hidden');
    };

    updateUIState();
});
