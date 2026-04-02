const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, 'data/users.json');

const seed = async () => {
    const hashedPassword = await bcrypt.hash('abdulrehman', 10);
    const user = { _id: '1', username: 'abdulrehman', email: 'abdulrehman@gmail.com', password: hashedPassword };
    fs.writeFileSync(USERS_FILE, JSON.stringify([user], null, 2));
    console.log('User seeded successfully: abdulrehman / abdulrehman');
};

seed();
