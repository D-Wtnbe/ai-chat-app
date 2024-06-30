# ベースイメージとして Node.js 20 を使用
FROM --platform=linux/arm64 node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# pnpm をインストール
RUN npm install -g pnpm@latest

# package.json と pnpm-lock.yaml をコピー
COPY package.json pnpm-lock.yaml ./

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN pnpm run build

# アプリケーションのポートを開放（Vite のデフォルトポート）
EXPOSE 5173

# 開発サーバーを起動
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]