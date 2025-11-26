#!/bin/bash

echo "🐳 启动 XHS Card API Docker 容器..."
echo ""

# 停止并删除旧容器（如果存在）
echo "📦 清理旧容器..."
docker-compose down 2>/dev/null

# 构建镜像
echo ""
echo "🔨 构建 Docker 镜像..."
docker-compose build

# 启动容器
echo ""
echo "🚀 启动容器..."
docker-compose up -d

# 等待容器启动
echo ""
echo "⏳ 等待服务启动..."
sleep 5

# 检查容器状态
echo ""
echo "📊 容器状态:"
docker-compose ps

# 显示日志
echo ""
echo "📝 最近的日志:"
docker-compose logs --tail=20

echo ""
echo "✅ 完成！"
echo ""
echo "📍 API 地址: http://localhost:7000"
echo "📍 健康检查: http://localhost:7000/health"
echo ""
echo "💡 查看实时日志: docker-compose logs -f"
echo "💡 停止服务: docker-compose down"
