'use strict';

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongo-exercises')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: {
    type: Date,
    default: Date.now
  },
  isPublished: Boolean,
  price: Number
})

const Course = mongoose.model('Course', courseSchema);

////////////////////////////////////////////////// Exercise 1 /////////////////////////////////////////////////////

async function getCourses() {
  const courses = await Course
    .find({
      tags: 'backend'
    })
    .sort({
      name: 1
    })
    .select({
      name: 1,
      author: 1
    });
  console.log(courses);
}

// getCourses();

////////////////////////////////////// Exercise 2 ////////////////////////

async function getCourses2() {
  const courses = await Course
    .find({
      tags: {
        $in: ['frontend', 'backend']
      },
      isPublished: true
    })
    .sort('-price') // you can use string for sort
    .select('name author price'); // you can use string for select

  console.log(courses);
}

// getCourses2();

////////////////////////////////////// Exercise 3 ////////////////////////

async function getCourses3() {
  const courses = await Course
    .find({
      // price: {
      //   $gte: 15
      // },
      // name: /.*by.*/i,
      isPublished: true
    })
    .or([{
        price: {
          $gte: 15
        }
      },
      {
        name: /.*by.*/i
      }
    ])
    .sort('-price') // you can use string for sort
    .select('name author price'); // you can use string for select

  console.log(courses);
}

getCourses3();