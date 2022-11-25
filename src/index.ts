import express, { Request, Response } from 'express';
import mongoose from "mongoose";
import Book from "./book.model";
import bodyParser from "body-parser"

const app = express();
app.use(bodyParser.json())

const uri = "mongodb://localhost:27017/biblio"
mongoose.connect(uri, (err) => {
    if (err) console.log(err)
    else console.log("Mongo Database connected successfuly")
});

//GETALL
app.get("/books", (req: Request, resp: Response) => {
    Book.find((err, books) => {
        if (err) resp.status(500).send(err);
        else resp.send(books);
    });

});

app.get("/books/:id", (req: Request, resp: Response) => {
    Book.findById(req.params.id, (err: any, books: any) => {
        if (err) resp.status(500).send(err);
        else resp.send(books);
    })
});
//POST
app.post("/books", (req: Request, resp: Response) => {
    let book = new Book(req.body)
    book.save(err => {
        if (err) resp.status(500).send(err);
        else resp.send(book);
    })
});
app.put("/books/:id",(req:Request,resp:Response)=>{
    Book.findByIdAndUpdate(req.params.id,req.body,(err:any)=>{
        if(err) resp.status(500).send(err);
        else resp.send("Book updated succeslully");
    })

});

app.delete("/books/:id",(req:Request,resp:Response)=>{
    Book.findByIdAndDelete(req.params.id,(err:any)=>{
        if(err) resp.status(500).send(err);
        else resp.send("Book deleted succeslully");
    })

});

app.get('/booksParPage',(req:Request,res:Response)=>{
    const page:number = parseInt(req.query.page?.toString()||'1');
    const size:number = parseInt(req.query.size?.toString()||'5');

    Book.paginate({},{page:page,limit:size},(err:any,books:any)=>{
        if(err) res.status(500).send(err);
        else res.send(books);
    });

})

app.get('/booksSearch',(req:Request,res:Response)=>{
    const search = req.query.search || '';
    const page:number = parseInt(req.query.page?.toString()||'1');
    const size:number = parseInt(req.query.size?.toString()||'5');

    Book.paginate({title:{$regex:".*(?i)"+search+".*"}},{page:page,limit:size},(err:any,books:any)=>{
        if(err) res.status(500).send(err);
        else res.send(books);
    });
    
});





app.get("/", (req, resp) => {
    resp.send("hello express")
});

app.listen(8089, () => {
    console.log("server started")
});