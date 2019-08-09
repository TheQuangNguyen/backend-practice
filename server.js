'use strict';

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground') // returns a promise when we connect to mongodb database
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
  isPublished: Boolean
}) // schema types: String, Number, Date, Buffer, Boolean, ObjectID, Array

const Course = mongoose.model('Course', courseSchema); // first argument: singular name of the collection, second argument: schema that defines the shape of this collection. Use Pascal case to name classes

async function createCourse() {
  const course = new Course({
    name: '201d49',
    author: 'John',
    tags: ['html', 'css', 'javascript'],
    isPublished: true
  }) // relational database do not have ability to store array 

  const result = await course.save(); // async operations since it takes some time to access file system to save to database
  console.log(result);
}

async function getCourses() {
  const courses = await Course
    .find({
      isPublished: true
    })
    .limit(10)
    .sort({
      name: 1
    }) // can sort by certain property and 1 indicate ascending order. -1 for descending order
    .select({
      name: 1,
      tags: 1
    }) // select certain properties to be to be returned as result from query
  console.log(courses);
}

// createCourse();
getCourses();