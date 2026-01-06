const USERS_KEY = 'expense_tracker_users';
const TOKEN_KEY = 'auth_token';

const Auth = {
    getUsers: () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),

    signup: (username, password) => {
        const users = Auth.getUsers();
        if (users.find(u => u.username === username)) {
            alert("User already exists!");
            return false;
        }
        users.push({ username, password });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        alert("Sign up successful! Please login.");
        return true;
    },

    login: (username, password) => {
        const users = Auth.getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
            const payload = btoa(JSON.stringify({
                username: user.username,
                exp: Date.now() + (3600 * 1000)
            }));
            const signature = btoa("simulated_secret_key");
            const token = `${header}.${payload}.${signature}`;

            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem('username', username);
            return true;
        } else {
            alert("Invalid credentials!");
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('username');
        window.location.reload();
    },

    getToken: () => localStorage.getItem(TOKEN_KEY)
};

const protectRoute = () => {
    const token = Auth.getToken();
    if (!token) return false;
    return true;
};

window.Auth = Auth;
window.protectRoute = protectRoute;
