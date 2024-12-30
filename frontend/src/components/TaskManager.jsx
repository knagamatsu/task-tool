import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays } from 'date-fns';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    progress: 0,
    goalId: ''
  });

  // データの取得
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/tasks/');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:8000/goals/');
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchGoals();
  }, []);

  // フォーム送信
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          start_date: formData.startDate.toISOString().split('T')[0],
          end_date: formData.endDate.toISOString().split('T')[0],
          progress: 0,
          goal_id: parseInt(formData.goalId)
        }),
      });

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          startDate: new Date(),
          endDate: new Date(),
          progress: 0,
          goalId: ''
        });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // 進捗の更新
  const handleProgressUpdate = async (taskId, newProgress) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          progress: newProgress
        }),
      });

      fetchTasks();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">タスク管理</h1>

      {/* タスク作成フォーム */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">新規タスク</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              タイトル
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              説明
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                開始日
              </label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => setFormData({...formData, startDate: date})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                終了日
              </label>
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => setFormData({...formData, endDate: date})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              目標
            </label>
            <select
              value={formData.goalId}
              onChange={(e) => setFormData({...formData, goalId: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">目標を選択</option>
              {goals.map(goal => (
                <option key={goal.id} value={goal.id}>
                  {goal.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            タスクを作成
          </button>
        </form>
      </div>

      {/* タスクリスト */}
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <h3 className="text-xl font-bold mb-2">{task.title}</h3>
            <p className="text-gray-600 mb-4">{task.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">開始日: {new Date(task.start_date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">終了日: {new Date(task.end_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  期間: {differenceInDays(new Date(task.end_date), new Date(task.start_date))}日
                </p>
                <p className="text-sm text-gray-600">
                  目標: {goals.find(g => g.id === task.goal_id)?.name}
                </p>
              </div>
            </div>

            <div className="mb-2">
              <span className="text-sm text-gray-600">進捗: {task.progress}%</span>
            </div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${task.progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={task.progress}
                onChange={(e) => handleProgressUpdate(task.id, parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;