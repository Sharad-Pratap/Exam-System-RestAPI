import express from 'express';
import {setExam} from '../controller/examController'
import { startExam } from '../controller/studentResponseController';
import checkAuth from '../middleware/checkAuth';
import checkLogin from '../middleware/checkLogin';
import { submit } from '../controller/submitController';

const router = express.Router();

router.post('/create-exam',checkLogin,checkAuth ,setExam);
router.post('/start-exam', startExam)
router.post('/submit', submit)


export default router;