// This file is for inserting mock data into the database tables
// Tables must be setup first (./setup.js)

const express = require('express');

const auth = require('./auth');
const connections = require('./connections');
const pool = require('./');
const post = require('./post');

async function seed() {
    const res1 = await auth.createLogin(
        'saifulislam',
        'ronnyisacoolguy',
        'nysaifulislam@gmail.com',
        'Saiful',
        'Islam',
        pool
    );
    const res2 = await auth.createLogin(
        'ronnycoste',
        'saifulisacoolguy',
        'ronny21.97@gmail.com',
        'Ronny',
        'Coste',
        pool
    );
    const res3 = await auth.createLogin(
        'gamedia',
        'saifulandronny',
        'gamedia@gmail.com',
        'Gamedia',
        '',
        pool
    );
    const res4 = await auth.createLogin(
        'ctp',
        'saifulandronnyarethebest',
        'cunytechprep@gmail.com',
        'CUNY Tech Prep',
        '',
        pool
    );
    const res5 = await post.createPost(
        'saifulislam',
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.techradar.com%2Fnews%2Fpubg-mobile-season-18&psig=AOvVaw0caDp_E6srAIhzVhrfhY5S&ust=1620626873475000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLCGyN73u_ACFQAAAAAdAAAAABAR',
        'PUBG Mobile is the best mobile game out right now!',
        false,
        pool
    );
    const res6 = await post.createPost(
        'saifulislam',
        'https://i.pinimg.com/originals/b6/10/61/b61061e30848782d4f3d58424de7f47c.png',
        'Got my new skin! #pubgmobile #glacier',
        false,
        pool
    );
    const res7 = await post.createPost(
        'saifulislam',
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.gq.com%2Fstory%2Fpoor-toad&psig=AOvVaw0NFuqacLQLxUl6HuN8HWY5&ust=1620596222066000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLiSv8OFu_ACFQAAAAAdAAAAABAT',
        'Toad appreciation post',
        false,
        pool
    );
    const res8 = await connections.follow('saifulislam', 'ctp', pool);
    const res9 = await connections.follow('saifulislam', 'gamedia', pool);
    const res10 = await connections.follow('saifulislam', 'ronnycoste', pool);
    const res11 = await connections.follow('ronnycoste', 'ctp', pool);
    const res12 = await connections.follow('ronnycoste', 'gamedia', pool);
    const res13 = await connections.follow('ronnycoste', 'saifulislam', pool);
    const res14 = await connections.follow('ctp', 'saifulislam', pool);
    const res15 = await connections.follow('ctp', 'ronnycoste', pool);
    const res16 = await connections.follow('gamedia', 'saifulislam', pool);
    const res17 = await connections.follow('gamedia', 'ronnycoste', pool);
    const res18 = await connections.follow('gamedia', 'ctp', pool);
}

// inserts mock data
seed();
