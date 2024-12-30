#!/bin/bash

# エラーハンドリング
set -e

# 現在のディレクトリを保存
ROOT_DIR=$(pwd)

# バックエンドの起動
echo "Starting backend server..."
cd $ROOT_DIR/backend
source .venv/bin/activate
uvicorn main:app --reload &
BACKEND_PID=$!
cd $ROOT_DIR

# フロントエンドの起動
echo "Starting frontend server..."
cd $ROOT_DIR/frontend
npm start &
FRONTEND_PID=$!
cd $ROOT_DIR

echo "Application started successfully!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"

# Ctrl+C でのクリーンアップ
trap 'kill $BACKEND_PID $FRONTEND_PID; exit 0' SIGINT

# プロセスが終了するのを防ぐ
wait