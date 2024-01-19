import express from 'express';
import {setExam} from '../controller/examController'
import { studentResponse } from '../controller/studentResponseController';
import checkAuth from '../middleware/checkAuth';
import checkLogin from '../middleware/checkLogin';

const router = express.Router();

router.post('/create-exam',checkLogin,checkAuth ,setExam);
router.post('/start-exam', studentResponse)


export default router;