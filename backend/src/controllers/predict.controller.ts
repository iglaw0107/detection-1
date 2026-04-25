import express from 'express';


import axios from 'axios';
const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:10000";



export const preditionCrime = async (req, res) => {
    try{
        const response = await axios.post(`${AI_URL}/api/v1/predict`, req.body)
        res.json(response.data);
    }catch(error){
        res.status(400).json({msg:"prediction server error"});
    }
}
