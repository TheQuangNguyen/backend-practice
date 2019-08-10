'use strict';

// Using References (Normalization) => Consistency - if you change one thing like name of author, the course id reflects that. However if you were to query the name, you might have to query twice to get id first and then get name correspond to that id

let author = {
  name: 'John'
}

let course = {
  author: 'id'
}

// Using Embedded Documents (Denormalization) => Query Performance - for each course you have to update the name which can cause human error but if you need the name then you only need to query once

let course = {
  author: {
    name: 'John'
  }
}

// Hybrid => if you want a snapshot of the object like the price of an item in an online shopping cart

let author = {
  name: 'John'
}

let course = {
  author: {
    id: 'ref',
    name: 'Mosh'
  }
}