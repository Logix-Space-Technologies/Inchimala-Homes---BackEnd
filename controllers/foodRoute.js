const express=require("express")
const foodModel=require("../models/foodModel")
const router=express.Router()


//route to food add
router.post('/addfood',(req,res)=>{
    foodModel.insertfood(req.body,(error,results)=>{
        if (error) {
            res.status(500).send('Error inserting new food items'+error)
            return
        }
        res.status(201).send(`food added with ID : ${results.insertId}`)
    })

});

router.post('/searchfood', (req, res) => {
    const { type } = req.body; // Extract type from request body
    if (!type) {
        return res.status(400).json({ error: 'enter the type of food' });
    }

    foodModel.searchFoodByType(type, (error, results) => {
        if (error) {
            res.status(500).send('Error searching for food' + error);
            return;
        }
        res.status(200).send(results); 
    });
});




module.exports=router