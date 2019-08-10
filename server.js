'use strict';

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground') // returns a promise when we connect to mongodb database
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  }, // make name property be required, similar to not null in relational . This validation is strictly from mongoose, not built in from mongoDB
  category: {
    type: String,
    enum: ['web', 'mobile', 'network'],
    required: true,
    lowercase: true // automatically converts string to lowercase. there is also uppercase
    //trim: true    This is for if there is padding around the string
  }, // when we create a course, for the category property, it should be one of these value otherwise there will be error
  author: String,
  tags: {
    type: Array,
    validate: {
      isAsync: true, // set true if request is async, then adds callback function to validator function
      validator: function (value, callback) {
        return value && value.length > 0; // checks if the array has at least one value and if in case of null and such since we initialize the value for this property as Array 
      },
      message: 'A course should have at least one tag' // show message when there is error
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    }, // require price property when it is published
    min: 10,
    max: 200, // min and max for number validation
    get: value => Math.round(value),
    set: value => Math.round(value) // round the number when create a course and also when we query the course from database
  }
}) // schema types: String, Number, Date, Buffer, Boolean, ObjectID, Array

const Course = mongoose.model('Course', courseSchema); // first argument: singular name of the collection, second argument: schema that defines the shape of this collection. Use Pascal case to name classes

async function createCourse() {
  try {
    const course = new Course({
      name: '201d49',
      category: 'web',
      author: 'John',
      tags: ['html', 'css', 'javascript'],
      isPublished: true
    }) // relational database do not have ability to store array 

    const result = await course.save(); // async operations since it takes some time to access file system to save to database
    console.log(result);
  } catch (error) {
    console.log(error);
    for (field in error.errors) {
      console.log(field)
    } // .errors holds the properties that are erroneous 
  }
}

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10; // in real world we get these values from queries for api like /api/courses?pageNumber=2&pageSize=10

  // eq (equal)
  // ne(not equal)
  // gt(greater than)
  // gte (greate tahn or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)
  // or
  // and

  const courses = await Course
    // .find({
    // price: {$gte: 10, $lte: 20}      // get courses that are between 10 and 20 dollars
    // price: { $in: [10, 15, 20]}     // query courses that are either 10, 15, or 20 dollars
    // })

    // .find()
    // .or([{
    //   author: 'Jacob'
    // }, {
    //   isPublished: true
    // }])   // used to find courses that has author be Jacob or is 

    // .find({ author: /^Jacob/ })   // use regex to find certain properties

    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize) // implement pagination to get the documents from any given page
    .sort({
      name: 1
    }) // can sort by certain property and 1 indicate ascending order. -1 for descending order
    .select({
      name: 1,
      tags: 1
    }) // select certain properties to be to be returned as result from query
    .count() // return number of documents that match our filter
  console.log(courses);
}

async function updateCourseByQuery(id) {
  // Approach: Query first
  // findById()
  // Modify its properties
  // save()

  // Approach: Update first
  // Update directly
  // Optionally: get the updated document

  const course = await Course.findById(id);

  if (!course) { // if there are no course with the given id, return immediately
    return;
  }

  course.isPublished = true; // you can change properties by doing this way
  course.author = 'Another Author';

  course.set({ // or you can change multiple properties at once by using .set
    isPublished: true,
    author: 'Another Author'
  })

  const result = await course.save();
  console.log(result);
}

async function updateCourseDirectly(id) {
  const result = await Course.update({
    _id: id
  }, {
    $set: {
      author: 'Mosh',
      isPublished: false
    }
  }); // first argument is a query object, second argument is an object of mongo update command and their values 
  console.log(result);

  const course = await Course.findByIdAndUpdate(id, {
    $set: {
      author: 'Mosh',
      isPublished: false
    }
  }, {
    new: true
  }); // similar to .update but returns the original course that was found by the query, if set new: true, then returns the updated course instead
}

async function removeCourse(id) {
  const result = await Course.deleteOne({
    _id: id
  });
}

// createCourse();
// getCourses();