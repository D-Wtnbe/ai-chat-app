#!/bin/bash

# 変数の設定
PROFILE="hoge"
REGION="ap-northeast-1"
FRONTEND_ECR_URI="hoge"

# AWS CLIの認証
echo "AWS ECRにログインしています..."
aws ecr get-login-password --region $REGION --profile $PROFILE | docker login --username AWS --password-stdin $FRONTEND_ECR_URI

# フロントエンドイメージのビルドとプッシュ
echo "フロントエンドイメージをビルドしています..."
cd "../frontend"  # フロントエンドのディレクトリに移動
if [ ! -f Dockerfile ]; then
    echo "エラー: Dockerfileが見つかりません。カレントディレクトリ: $(pwd)"
    exit 1
fi
docker build --platform linux/arm64 --load -t frontend-image .

echo "フロントエンドイメージをタグ付けしています..."
docker tag frontend-image:latest $FRONTEND_ECR_URI:latest
echo "フロントエンドイメージをプッシュしています..."
docker push $FRONTEND_ECR_URI:latest

echo "イメージのプッシュが完了しました。"