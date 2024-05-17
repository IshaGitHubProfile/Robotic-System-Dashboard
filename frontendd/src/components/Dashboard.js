import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'chart.js/auto';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';
const Dashboard = () => {
  const [robots, setRobots] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [editingRobot, setEditingRobot] = useState(null);
  const [updatedBatteryLevel, setUpdatedBatteryLevel] = useState('');
  const [updatedOperationalStatus, setUpdatedOperationalStatus] = useState('');
  const [newRobotBatteryLevel, setNewRobotBatteryLevel] = useState('');
  const [newRobotOperationalStatus, setNewRobotOperationalStatus] = useState('');
  const [newRobotActivityLogs, setNewRobotActivityLogs] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);




  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/robots', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRobots(response.data);
      } catch (error) {
        console.error('Error fetching robots:', error);
      }
    };
    fetchRobots();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/'; 
  };

  const handleDelete = async (robotId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/robots/${robotId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRobots(robots.filter(robot => robot._id !== robotId));
      toast.success('Robot deleted successfully!');
    } catch (error) {
      console.error('Error deleting robot:', error);
      toast.error('Error deleting robot.');
    }
  };

  const handleEdit = (robot) => {
    setEditingRobot(robot);
    setUpdatedBatteryLevel(robot.batteryLevel);
    setUpdatedOperationalStatus(robot.operationalStatus);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedRobot = {
        batteryLevel: updatedBatteryLevel,
        operationalStatus: updatedOperationalStatus
      };
      await axios.patch(`http://localhost:5000/api/robots/${editingRobot._id}`, updatedRobot, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRobots(robots.map(robot => (robot._id === editingRobot._id ? { ...robot, ...updatedRobot } : robot)));
      setEditingRobot(null); // Clear editing state
      toast.success('Robot updated successfully!');
    } catch (error) {
      console.error('Error updating robot:', error);
      toast.error('Error updating robot.');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const newRobot = {
        batteryLevel: newRobotBatteryLevel,
        operationalStatus: newRobotOperationalStatus,
        activityLogs: newRobotActivityLogs.split(',').map(log => log.trim())
      };
      const response = await axios.post('http://localhost:5000/api/robots', newRobot, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRobots([...robots, response.data]);
      setNewRobotBatteryLevel('');
      setNewRobotOperationalStatus('');
      setNewRobotActivityLogs('');
      toast.success('Robot created successfully!');
    } catch (error) {
      console.error('Error creating robot:', error);
      toast.error('Error creating robot.');
    }
  };

  const averageBatteryLife = robots.length
    ? robots.reduce((total, robot) => total + robot.batteryLevel, 0) / robots.length
    : 0;
  const data = {
    labels: robots.map(robot => new Date(robot.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Battery Level',
        data: robots.map(robot => robot.batteryLevel),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const statusCounts = robots.reduce((acc, robot) => {
    if (!acc[robot.operationalStatus]) {
      acc[robot.operationalStatus] = 0;
    }
    acc[robot.operationalStatus]++;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Robot Status',
        data: Object.values(statusCounts),
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'], 
      },
    ],
  };

  return (
    <>
    <div className='all'>
    <div className="container">

      <ToastContainer />
      <h1 className='dash-heading'>Robotic System Dashboard</h1>

      <div className="custom-datepicker-wrapper">
      <DatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        className="custom-datepicker"
      />
    </div>

        <div className='upper-buttons'>
          <div className='upper-left'>
        <button className='upper-btn' id='logout-btn' onClick={handleLogout}>Logout</button>
        </div>
        <div className='upper-right'>
        <button className='upper-btn' onClick={() => setShowCreateForm(true)}>Create New Robot</button>
        
        {showCreateForm && (
          <form onSubmit={handleCreate}>
            <input
              className='input-field'
              type="text"
              placeholder="Battery Level"
              value={newRobotBatteryLevel}
              onChange={e => setNewRobotBatteryLevel(e.target.value)}
              required
            />
            <input
            className='input-field'
              type="text"
              placeholder="Operational Status"
              value={newRobotOperationalStatus}
              onChange={e => setNewRobotOperationalStatus(e.target.value)}
              required
            />
            <input
              type="text"
              className='input-field'
              placeholder="Activity Logs (comma separated)"
              value={newRobotActivityLogs}
              onChange={e => setNewRobotActivityLogs(e.target.value)}
              required
            />
            <button className='upper-btn' type="submit">Create</button>
          </form>
        )}

        </div>
        </div>

      <div className='graphs'>

      <div className="chart-container">
        <h2>Robot Status</h2>
          <Bar className="chart" data={barData} />
      </div>

        <div className="chart-container">
          <h2>Battery Level</h2>
          <Line className="chart" data={data} />
        </div>

        <div className="average-battery-container">
          <h2>Average Battery Life</h2>
          <div className='circle-graph'>
          <CircularProgressbar value={averageBatteryLife} text={`${Math.round(averageBatteryLife)}%`} />
          </div>
        </div>

      </div>

      <div>

        
        <div className='cards'>
        {robots.map(robot => (
          <div className="robot" key={robot._id}>
            <h4>Robot ID: {robot._id}</h4>
        <div className='info'>

            <div className='left'>
               <div style={{ width: '100px', height: '100px', color:'red'}}>
                 <CircularProgressbar className='battery-circle' value={robot.batteryLevel} text={`${robot.batteryLevel}%`} />
               </div>
            </div>

            <div className='right'>
                <p className='status'>Operational Status: {robot.operationalStatus}</p>
                <p className='status'>Activity Logs:</p>
                <ul className='status'>
                   {robot.activityLogs.map((log, index) => (
                   <li className='status' key={index}>{log}</li>
                   ))}
                </ul>
            </div>
            
          </div>
          <div className='btn'>
            <button onClick={() => handleDelete(robot._id)}>Delete</button>
            <button onClick={() => handleEdit(robot)}>Edit</button>
          </div>

          
            {editingRobot && editingRobot._id === robot._id && (
              <form className='update-form' onSubmit={handleUpdate}>
                <input 
                className='update-input-field'
                  type="text"
                  placeholder="Battery Level"
                  value={updatedBatteryLevel}
                  onChange={e => setUpdatedBatteryLevel(e.target.value)}
                  required
                />
                <input
                className='update-input-field'
                  type="text"
                  placeholder="Operational Status"
                  value={updatedOperationalStatus}
                  onChange={e => setUpdatedOperationalStatus(e.target.value)}
                  required
                />
                <button className='update-submit-btn' type="submit">Update</button>
              </form>
            )}
      

          </div>
        ))}
      </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default Dashboard;
