import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays, differenceInMilliseconds } from 'date-fns';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    progress: 0,
    goalId: ''
  });

  // タスクと目標の取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, goalsResponse] = await Promise.all([
          fetch('http://localhost:8000/tasks/'),
          fetch('http://localhost:8000/goals/')
        ]);
        
        const [tasksData, goalsData] = await Promise.all([
          tasksResponse.json(),
          goalsResponse.json()
        ]);

        setTasks(tasksData);
        setGoals(goalsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // 日付ベースの進捗を計算
  const calculateDateProgress = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const total = differenceInMilliseconds(end, start);
    const current = differenceInMilliseconds(today, start);
    return Math.min(Math.max(0, (current / total) * 100), 100);
  };

  // フォーム送信処理（作成・更新）
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const taskData = {
      title: formData.title,
      description: formData.description,
      start_date: formData.startDate.toISOString().split('T')[0],
      end_date: formData.endDate.toISOString().split('T')[0],
      progress: formData.progress,
      goal_id: parseInt(formData.goalId),
      status: editingTask?.status || "進行中"  // 編集時は既存のステータスを維持
    };
  
    try {
      const url = editingTask 
        ? `http://localhost:8000/tasks/${editingTask.id}`
        : 'http://localhost:8000/tasks/';
      
      const response = await fetch(url, {
        method: editingTask ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
  
      if (response.ok) {
        // フォームをリセット
        setFormData({
          title: '',
          description: '',
          startDate: new Date(),
          endDate: new Date(),
          progress: 0,
          goalId: ''
        });
        setEditingTask(null);
  
        // タスク一覧を再取得
        const tasksResponse = await fetch('http://localhost:8000/tasks/');
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      } else {
        // エラーレスポンスの内容を確認
        const errorData = await response.json();
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };
  // タスク削除処理
  const handleDelete = async (taskId) => {
    if (!window.confirm('このタスクを削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // 進捗更新のハンドラ
  const handleProgressChange = async (taskId, newProgress) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
  
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          start_date: task.start_date,
          end_date: task.end_date,
          goal_id: task.goal_id,
          status: task.status,
          progress: newProgress
        }),
      });
  
      if (response.ok) {
        const updatedTask = await response.json();
        const updatedTasks = tasks.map(t =>
          t.id === taskId ? updatedTask : t
        );
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // ステータス更新のハンドラ
  const handleStatusChange = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "進行中" ? "完了" : "進行中";
    
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          status: newStatus,
          progress: newStatus === "完了" ? 100 : task.progress
        }),
      });

      if (response.ok) {
        const updatedTasks = tasks.map(t =>
          t.id === taskId 
            ? { ...t, status: newStatus, progress: newStatus === "完了" ? 100 : t.progress } 
            : t
        );
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">タスク管理</h1>

      {/* タスク作成/編集フォーム */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          {editingTask ? 'タスクの編集' : '新規タスク'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">タイトル</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">説明</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">開始日</label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => setFormData({...formData, startDate: date})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">終了日</label>
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => setFormData({...formData, endDate: date})}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">目標</label>
            <select
              value={formData.goalId}
              onChange={(e) => setFormData({...formData, goalId: e.target.value})}
              className="w-full p-2 border rounded"
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

          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editingTask ? '更新' : '作成'}
            </button>
            {editingTask && (
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                キャンセル
              </button>
            )}
          </div>
        </form>
      </div>

      {/* タスク一覧 */}
      <div className="space-y-4">
        {tasks.map(task => {
          const dateProgress = calculateDateProgress(task.start_date, task.end_date);
          const remainingDays = differenceInDays(new Date(task.end_date), new Date());
          
          return (
            <div key={task.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{task.title}</h3>
                  <p className="text-gray-600">
                    目標: {goals.find(g => g.id === task.goal_id)?.name}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setFormData({
                        title: task.title,
                        description: task.description,
                        startDate: new Date(task.start_date),
                        endDate: new Date(task.end_date),
                        progress: task.progress || 0,  // nullの場合に0を設定
                        goalId: task.goal_id.toString(),
                      });
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    編集
                  </button> 
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    削除
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{task.description}</p>

              {/* 進捗表示セクション */}
              <div className="space-y-4">
                {/* 期間表示 */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>期間: {new Date(task.start_date).toLocaleDateString()} - {new Date(task.end_date).toLocaleDateString()}</span>
                    <span>残り{remainingDays}日</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-blue-600"
                      style={{ width: `${dateProgress}%` }}
                    />
                  </div>
                </div>

                {/* 作業の進捗スライダー */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>作業の進捗: {task.progress}%</span>
                    <button
                      onClick={() => handleStatusChange(task.id)}
                      className={`ml-2 px-2 py-1 rounded text-white ${
                        task.status === "完了" ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    >
                      {task.status}
                    </button>
                  </div>
                  {task.status !== "完了" && (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={task.progress}
                      onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value))}
                      className="w-full h-2"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskManager;