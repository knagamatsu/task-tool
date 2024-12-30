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

    except Exception as e:
        print(f"エラーが発生しました: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("データベースの初期化を開始します...")
    init_db()
    print("データベースの初期化が完了しました")