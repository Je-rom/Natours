const express = require('express');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();
  res.status(200).json({
    status: 'success',
    results: allUsers.length,
    message: 'Fetched all users',
    data: {
      allUsers,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'server resource not yet defined',
  });
};

exports.getUserById = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'server resource not yet defined',
  });
};
exports.updateUserById = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'server resource not yet defined',
  });
};
exports.deleteUserById = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'server resource not yet defined',
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
  });
});
