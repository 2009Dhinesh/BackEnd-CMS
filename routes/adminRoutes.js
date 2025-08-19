const express = require("express");
const router = express.Router();
const {
  totalStudent,
  complaintsSummary,
  addDepartment,
  getDepartments,
  filterDepartment,
  deleteDepartment,
  updateDepartment,
  addProgramme,
  getProgrammes,
  getProgrammesByDepartment,
  editProgramme,
  deleteProgramme,
  addBlock,
  getBlock,
  getRoomNumbers,
  addRoomNumber,
  getAllUsers
} = require("../controllers/adminController");

const {
  userMiddleware,
  verifySuperAdmin
} = require("../middleware/userMiddleware");

const { createRole, getRoles , updateRole , deleteRole,} = require('../controllers/roleController');

// 📌 Student count
router.get('/students/count', totalStudent);

// 📌 Complaints summary
router.get('/complaints/summary', complaintsSummary);

// 📌 Departments
router.post("/departments", userMiddleware, verifySuperAdmin, addDepartment);
router.get("/departments", userMiddleware, verifySuperAdmin , getDepartments);
router.get("/filterDepartment", filterDepartment);
router.put('/departments/:id', userMiddleware , verifySuperAdmin,updateDepartment);
router.delete('/departments/:id', userMiddleware, verifySuperAdmin,deleteDepartment);

// 📌 Programmes
router.post('/programme', userMiddleware, verifySuperAdmin, addProgramme);
router.get('/getprogramme', userMiddleware, verifySuperAdmin, getProgrammesByDepartment);
router.get('/getprogrammes', userMiddleware, verifySuperAdmin, getProgrammes);

// 📌 Blocks
router.post('/block', userMiddleware, verifySuperAdmin, addBlock);
router.get('/blocks', userMiddleware, verifySuperAdmin, getBlock);

// 📌 Room Numbers
router.post('/roomnumber', userMiddleware, verifySuperAdmin, addRoomNumber);
router.get('/roomnumber', userMiddleware, verifySuperAdmin, getRoomNumbers);

// 📌 Roles
router.post('/roles', createRole);
router.get('/roles', getRoles);
router.put('/roles/:id', userMiddleware, verifySuperAdmin, updateRole);
router.delete('/roles/:id', userMiddleware, verifySuperAdmin, deleteRole);

// user
router.get('/getAllUsers' , userMiddleware,verifySuperAdmin ,getAllUsers);


module.exports = router;
