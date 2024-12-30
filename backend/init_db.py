from database import SessionLocal, engine
from models import Base, Goal, Task
from datetime import datetime, timedelta

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 目標の作成
        goals = [
            Goal(name="仕事"),
            Goal(name="勉強"),
            Goal(name="趣味"),
            Goal(name="健康")
        ]
        
        for goal in goals:
            db.add(goal)
        db.commit()

        # タスクの作成
        tasks = [
            Task(
                title="プロジェクト計画の作成",
                description="次期プロジェクトの計画書を作成する",
                start_date=datetime.now(),
                end_date=datetime.now() + timedelta(days=7),
                progress=0,
                goal_id=1
            ),
            Task(
                title="Python学習",
                description="FastAPIの基礎を学ぶ",
                start_date=datetime.now(),
                end_date=datetime.now() + timedelta(days=14),
                progress=0,
                goal_id=2
            ),
            Task(
                title="ジム通い",
                description="週3回のジム通いを継続する",
                start_date=datetime.now(),
                end_date=datetime.now() + timedelta(days=30),
                progress=0,
                goal_id=4
            )
        ]
        
        for task in tasks:
            db.add(task)
        db.commit()

    except Exception as e:
        print(f"エラーが発生しました: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("データベースの初期化を開始します...")
    init_db()
    print("データベースの初期化が完了しました")