# Task Management Application

シンプルで効率的なタスク管理アプリケーション。ReactとFastAPIを使用した現代的なウェブアプリケーションです。

## 機能

- 📅 カレンダーによる開始日・終了日の選択
- ✅ タスクの作成・編集・削除
- 🎯 目標設定と進捗管理
- 📊 プログレスバーによる視覚的な進捗表示
- 🔄 残り日数の自動計算
- 💾 SQLiteによるデータ永続化

## 技術スタック

### フロントエンド
- React 18
- react-datepicker
- date-fns
- Tailwind CSS

### バックエンド
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

## 開発環境のセットアップ

### 前提条件
- Python 3.8以上
- Node.js 16以上
- npm 7以上

### バックエンドのセットアップ
```bash
# 仮想環境の作成と有効化
uv venv
source venv/bin/activate

# 依存関係のインストール
cd backend
pip install -r requirements.txt

# データベースの初期化
python init_db.py

# 開発サーバーの起動
uvicorn main:app --reload
```

### フロントエンドのセットアップ
```bash
# 依存関係のインストール
cd frontend
npm install

# 開発サーバーの起動
npm run dev
```

## プロジェクト構造

```
task-manager/
├── backend/
│   ├── main.py           # FastAPI アプリケーション
│   ├── models.py         # データベースモデル
│   ├── schemas.py        # Pydanticスキーマ
│   └── requirements.txt  # Python依存関係
│
└── frontend/
    ├── src/
    │   ├── components/   # Reactコンポーネント
    │   ├── hooks/        # カスタムフック
    │   ├── utils/        # ユーティリティ関数
    │   └── App.jsx       # メインアプリケーション
    ├── package.json
    └── index.html
```

## API エンドポイント

| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| GET | `/tasks` | タスク一覧の取得 |
| POST | `/tasks` | 新規タスクの作成 |
| PUT | `/tasks/{id}` | タスクの更新 |
| DELETE | `/tasks/{id}` | タスクの削除 |
| GET | `/goals` | 目標一覧の取得 |

## 開発ガイドライン

### コーディング規約
- ESLint/Prettierの設定に従う
- コンポーネントは機能単位で分割
- PropTypesまたはTypeScriptで型を定義

### コミットメッセージ規約
```
feat: 新機能
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正
refactor: リファクタリング
test: テストコード
chore: ビルド・補助ツール
```

## テスト

### バックエンドテスト
```bash
cd backend
pytest
```

### フロントエンドテスト
```bash
cd frontend
npm test
```

## デプロイ

### バックエンド
```bash
# 本番用のデータベース設定
export DATABASE_URL=postgresql://user:password@localhost/dbname

# サーバー起動
uvicorn main:app --host 0.0.0.0 --port 8000
```

### フロントエンド
```bash
# 本番ビルド
npm run build

# 静的ファイルをサーバーにデプロイ
```

## 環境変数

バックエンド (`.env`):
```
DATABASE_URL=sqlite:///./tasks.db
SECRET_KEY=your-secret-key
```

フロントエンド (`.env.local`):
```
VITE_API_URL=http://localhost:8000
```

