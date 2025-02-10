const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes'); 
 
app.use(express.json()); 

const createTable = require('./models/userModel').createTable;

(async () => {
    await userModel.createTable(); 
})();

app.use('/api', userRoutes); 
 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
