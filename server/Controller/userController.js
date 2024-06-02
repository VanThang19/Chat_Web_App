const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const UserModel = require("../Models/userModel");
const generateToken = require("../Config/generateToken");

// Login
const loginController = expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, password } = req.body;

    const user = await UserModel.findOne({ name });

    if (user && (await user.matchPassword(password))) {
        const response = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        };
        res.json(response);
    } else {
        res.status(401);
        throw new Error("Tên đăng nhập hoặc mật khẩu không đúng !");
    }
});

const registerController = expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // check register
    if (!name || !email || !password) {
        res.status(400).send("Không được bỏ trống dữ liệu, hãy điền đầy đủ thông tin!");
        return;
    }

    // check user đã tồn tại ?
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
        res.status(405).send("Người dùng đã tồn tại!");
        return;
    }

    // check name
    const userNameExist = await UserModel.findOne({ name });
    if (userNameExist) {
        res.status(406).send("Tên người dùng đã tồn tại!");
        return;
    }

    // create user in db
    const user = await UserModel.create({ name, email, password });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).send("Không thể tạo tài khoản!");
    }
});
const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await UserModel.find(keyword).find({
        _id: { $ne: req.user._id },
    });
    res.send(users);
});

module.exports = { loginController, registerController, fetchAllUsersController };