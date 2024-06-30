# AI Chat APP

AIとチャットを行えるアプリ

回答する内容のロジックは未実装で固定値をランダムで返す（将来的にBedrockから生成したテキストに置き換える）

## 技術スタック

- フロントエンド: React, TypeScript, Vite
- バックエンド: VOICEVOXのDocker版

## セットアップ手順

1. リポジトリをクローンします。

```sh
git clone <リポジトリURL>
cd frontend
pnpm install

2. フロントエンドの依存関係をインストールします。

```sh
pnpm run dev
```

3. フロントエンドアプリケーションを開発モードで起動します。

```sh
pnpm run dev
```

1. 別のターミナルで、VOICEVOXを起動します。

```sh
cd ../backend
docker-compose up
```

## AWSへのデプロイ方法

infraディレクトリにあるproviders.tfのprofileを変更する

デプロイ
```sh

cd infra
terraform apply
```

フロントエンドデプロイ
infra/ecr_push.shのPROFILEとFRONTEND_ECR_URIを変更し、以下のコマンドを実行する

```sh
sh ecr_push.sh
```
