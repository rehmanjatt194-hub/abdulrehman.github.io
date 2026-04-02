import Datastore from 'nedb-promises';
import path from 'path';
import fs from 'fs';

// Setup local data folder if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Create individual NeDB stores
const users = Datastore.create({ filename: path.join(dataDir, 'users.db'), autoload: true });
const projects = Datastore.create({ filename: path.join(dataDir, 'projects.db'), autoload: true });
const contents = Datastore.create({ filename: path.join(dataDir, 'contents.db'), autoload: true });
const messages = Datastore.create({ filename: path.join(dataDir, 'messages.db'), autoload: true });

export { users, projects, contents, messages };
