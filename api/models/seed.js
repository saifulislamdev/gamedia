// This file is for inserting mock data into the database tables
// Tables must be setup first (./db-setup.js)

const express = require('express');
const app = express();
const pool = require('./index');
const login = require('./login');
const post = require('./post');

async function seed() {
    const res1 = await login.createLogin('saifulislam', 'ronnyisacoolguy', 'nysaifulislam@gmail.com', 'Saiful', 'Islam', pool);
    const res2 = await login.createLogin('ronnycoste', 'saifulisacoolguy', 'ronny21.97@gmail.com', 'Ronny', 'Coste', pool);
    const res3 = await post.createPost('saifulislam', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.techradar.com%2Fnews%2Fpubg-mobile-season-18&psig=AOvVaw0caDp_E6srAIhzVhrfhY5S&ust=1620626873475000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLCGyN73u_ACFQAAAAAdAAAAABAR', 'PUBG Mobile is the best mobile game out right now!', false, pool);
    const res4 = await post.createPost('saifulislam', 'https://i.pinimg.com/originals/b6/10/61/b61061e30848782d4f3d58424de7f47c.png', 'Got my new skin! #pubgmobile #glacier', false, pool):
    const res5 = await post.createPost('saifulislam', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.gq.com%2Fstory%2Fpoor-toad&psig=AOvVaw0NFuqacLQLxUl6HuN8HWY5&ust=1620596222066000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLiSv8OFu_ACFQAAAAAdAAAAABAT', 'Toad appreciation post', false, pool);
}

// inserts mock data
seed();

app.listen(3006, () => console.log('Listening on 3006'));