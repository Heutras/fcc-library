/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const express = require('express');
const router = express.Router();
const Book = require('../models/book'); // Assuming you have a Book model
const mongoose = require('mongoose');

module.exports = function (app) {
  app.route('/api/books')
    .get(async function (req, res) {
      try {
        const books = await Book.find({});
        const response = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        }));
        res.json(response);
      } catch (err) {
        res.status(500).json({ error: 'Could not retrieve books' });
      }
    })
    
    .post(async function (req, res) {
      const title = req.body.title;
      
      if (!title) {
        return res.send('missing required field title');
      }
      
      try {
        const newBook = new Book({
          title: title,
          comments: []
        });
        
        const savedBook = await newBook.save();
        res.json({
          _id: savedBook._id,
          title: savedBook.title
        });
      } catch (err) {
        res.status(500).json({ error: 'Could not save book' });
      }
    })
    
    .delete(async function(req, res) {
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.status(500).json({ error: 'Could not delete books' });
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res) {
      const bookid = req.params.id;
      
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch (err) {
        res.send('no book exists');
      }
    })
    
    .post(async function(req, res) {
      const bookid = req.params.id;
      const comment = req.body.comment;
      
      if (!comment) {
        return res.send('missing required field comment');
      }
      
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        
        book.comments.push(comment);
        await book.save();
        
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch (err) {
        res.send('no book exists');
      }
    })
    
    .delete(async function(req, res) {
      const bookid = req.params.id;
      
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      try {
        const deletedBook = await Book.findByIdAndDelete(bookid);
        if (!deletedBook) {
          return res.send('no book exists');
        }
        
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      }
    });
};
