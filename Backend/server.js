require('dotenv').config();
let app=require('./src/app');
let ConnectToDB=require('./src/config/db.connection');


ConnectToDB();


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})


