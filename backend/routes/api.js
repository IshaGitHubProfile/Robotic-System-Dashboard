const express = require('express');
const router = express.Router();
const Robot = require('../models/Robot');

// Get all robots
router.get('/robots', async (req, res) => {
  try {
    const robots = await Robot.find();
    res.json(robots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one robot
router.get('/robots/:id', getRobot, (req, res) => {
  res.json(res.robot);
});

// Create one robot
router.post('/robots', async (req, res) => {
  const robot = new Robot({
    batteryLevel: req.body.batteryLevel,
    operationalStatus: req.body.operationalStatus,
    activityLogs: req.body.activityLogs
  });
  try {
    const newRobot = await robot.save();
    res.status(201).json(newRobot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one robot
router.patch('/robots/:id', getRobot, async (req, res) => {
  if (req.body.batteryLevel != null) {
    res.robot.batteryLevel = req.body.batteryLevel;
  }
  if (req.body.operationalStatus != null) {
    res.robot.operationalStatus = req.body.operationalStatus;
  }
  if (req.body.activityLogs != null) {
    res.robot.activityLogs = req.body.activityLogs;
  }
  try {
    const updatedRobot = await res.robot.save();
    res.json(updatedRobot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one robot
router.delete('/robots/:id', getRobot, async (req, res) => {
  try {
    await res.robot.deleteOne();
    res.json({ message: 'Robot deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getRobot(req, res, next) {
  let robot;
  try {
    robot = await Robot.findById(req.params.id);
    if (robot == null) {
      return res.status(404).json({ message: 'Robot not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.robot = robot;
  next();
}

module.exports = router;
