const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')  
const {MONGOURI} = require('./keys')
app.use(express.static('public'));
if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'));
    const path = require('path')                                 
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
      }); 
}
                                 

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log('Connected to mongodb')
})
mongoose.connection.on('error',(err)=>{
    console.log('error',err)
})


require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

app.listen(PORT,()=>{
    console.log("listening on port",PORT)
})


// const express =require('express')
// const app = express()
// const PORT=5000
// const mongoose =require('mongoose')
// const {MONGOURI} =require('./keys')

// require('./models/user')
// require('./models/post')


// app.use(express.json())
// app.use(require('./routes/auth'))
// app.use(require('./routes/post'))

// mongoose.connect(MONGOURI,{
// useNewUrlParser:true,
// useUnifiedTopology:true
// })
// mongoose.connection.on('connected',()=>{
//     console.log("Connected to mongodb")
// })
// mongoose.connection.on('error',(err)=>{
//     console.log('error',err)
// })
// app.listen(PORT,()=>{
//     console.log("listening on port",PORT)
// })