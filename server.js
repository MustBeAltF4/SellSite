const express = require('express');
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const session = require('express-session');
const registeredUsers = new Set();

const app = express();
const port = 3000;

const sessionSecretKey = '5d9f843a8b1f9ec16f32d7b0c6be029a147d1e783b8b4e7f36c0f5211aa78e9c';

const db_params = {
    user: 'postgres',
    host: 'localhost',
    database: '',
    password: '',
    port: 5432,
};

const db = new Client(db_params);
db.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Error connecting to the database', err));

(async () => {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                nickname VARCHAR(50) NOT NULL,
                password VARCHAR(255) NOT NULL,
                registration_date TIMESTAMP DEFAULT NOW()
            )
        `;
        await db.query(createTableQuery);
    } catch (error) {
        console.error('Error creating table', error);
    }
})();

app.use(session({
    secret: sessionSecretKey,
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(__dirname));
app.use(express.json());


app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.post('/register', async (req, res) => {
    const { email, nickname, password } = req.body;

    try {
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Неправильный формат email' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Пароль должен содержать не менее 8 символов' });
        }

        const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
        const emailCheckResult = await db.query(checkEmailQuery, [email]);


        if (registeredUsers.has(email)) {
            return res.status(400).json({ message: 'Пользователь уже зарегистрирован' });
        }

        

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = 'INSERT INTO users (email, nickname, password) VALUES ($1, $2, $3)';
        await db.query(insertUserQuery, [email, nickname, hashedPassword]);
        
        registeredUsers.add(email);

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
        
    } catch (error) {
        console.error('Error during registration', error);
        res.status(500).json({ message: 'Ошибка при регистрации', error: error.message });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const getUserQuery = 'SELECT * FROM users WHERE email = $1';
        const userResult = await db.query(getUserQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Пользователь с таким email не найден' });
        }

        const user = userResult.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неправильный пароль' });
        }

        req.session.user = user;

        res.status(200).json({ message: 'Вход успешен' });
    } catch (error) {
        console.error('Error during login', error);
        res.status(500).json({ message: 'Ошибка при входе' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session', err);
            return res.status(500).json({ message: 'Ошибка при выходе' });
        }
        
        res.status(200).json({ message: 'Выход успешен' });
    });
});

app.post('/change-password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.session.user.id;

    try {
        const getUserQuery = 'SELECT * FROM users WHERE id = $1';
        const userResult = await db.query(getUserQuery, [userId]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Пользователь не найден' });
        }

        const user = userResult.rows[0];

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неправильный старый пароль' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updatePasswordQuery = 'UPDATE users SET password = $1 WHERE id = $2';
        await db.query(updatePasswordQuery, [hashedNewPassword, userId]);

        res.status(200).json({ message: 'Пароль успешно изменен' });
    } catch (error) {
        console.error('Error changing password', error);
        res.status(500).json({ message: 'Ошибка при изменении пароля' });
    }
});

app.get('/vpn.html', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/index.html');
    }

    res.sendFile(__dirname + '/vpn.html');
});

app.get('/get-user-data', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Пользователь не авторизован' });
    }

    const { nickname, email, registration_date } = req.session.user;
    const userData = {
        username: nickname,
        email: email,
        registrationDate: registration_date,
    };

    res.status(200).json(userData);
});


function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
