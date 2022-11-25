"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var book_model_1 = __importDefault(require("./book.model"));
var body_parser_1 = __importDefault(require("body-parser"));
var app = (0, express_1["default"])();
app.use(body_parser_1["default"].json());
var uri = "mongodb://localhost:27017/biblio";
mongoose_1["default"].connect(uri, function (err) {
    if (err)
        console.log(err);
    else
        console.log("Mongo Database connected successfuly");
});
//GETALL
app.get("/books", function (req, resp) {
    book_model_1["default"].find(function (err, books) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
app.get("/books/:id", function (req, resp) {
    book_model_1["default"].findById(req.params.id, function (err, books) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
//POST
app.post("/books", function (req, resp) {
    var book = new book_model_1["default"](req.body);
    book.save(function (err) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
app.put("/books/:id", function (req, resp) {
    book_model_1["default"].findByIdAndUpdate(req.params.id, req.body, function (err) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Book updated succeslully");
    });
});
app["delete"]("/books/:id", function (req, resp) {
    book_model_1["default"].findByIdAndDelete(req.params.id, function (err) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Book deleted succeslully");
    });
});
app.get('/booksParPage', function (req, res) {
    var _a, _b;
    var page = parseInt(((_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) || '1');
    var size = parseInt(((_b = req.query.size) === null || _b === void 0 ? void 0 : _b.toString()) || '5');
    book_model_1["default"].paginate({}, { page: page, limit: size }, function (err, books) {
        if (err)
            res.status(500).send(err);
        else
            res.send(books);
    });
});
app.get('/booksSearch', function (req, res) {
    var _a, _b;
    var search = req.query.search || '';
    var page = parseInt(((_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) || '1');
    var size = parseInt(((_b = req.query.size) === null || _b === void 0 ? void 0 : _b.toString()) || '5');
    book_model_1["default"].paginate({ title: { $regex: ".*(?i)" + search + ".*" } }, { page: page, limit: size }, function (err, books) {
        if (err)
            res.status(500).send(err);
        else
            res.send(books);
    });
});
app.get("/", function (req, resp) {
    resp.send("hello express");
});
app.listen(8089, function () {
    console.log("server started");
});
