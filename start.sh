#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 XHS Card API 启动脚本${NC}"
echo ""

# 检查端口占用
PORT=7000
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  端口 $PORT 已被占用，正在清理...${NC}"
    lsof -ti:$PORT | xargs kill -9 2>/dev/null
    sleep 2
fi

# 进入 server 目录
cd /home/user/xhscard/server

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 安装依赖...${NC}"
    npm install
fi

# 构建项目
echo -e "${YELLOW}🔨 构建项目...${NC}"
npm run build

# 启动服务
echo ""
echo -e "${GREEN}✨ 启动服务...${NC}"
echo ""

# 使用 nohup 在后台运行
nohup npm start > /tmp/xhscard.log 2>&1 &

# 获取进程 ID
PID=$!
echo $PID > /tmp/xhscard.pid

# 等待服务启动
sleep 3

# 检查服务是否正常启动
if curl -s http://localhost:7000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 服务启动成功！${NC}"
    echo ""
    echo -e "${BLUE}📍 Server: http://localhost:7000${NC}"
    echo -e "${BLUE}📍 Health: http://localhost:7000/health${NC}"
    echo ""
    echo -e "${YELLOW}💡 查看日志: tail -f /tmp/xhscard.log${NC}"
    echo -e "${YELLOW}💡 停止服务: kill \$(cat /tmp/xhscard.pid)${NC}"
    echo -e "${YELLOW}💡 或使用: ./stop.sh${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  服务可能未正常启动，请查看日志:${NC}"
    echo "tail -f /tmp/xhscard.log"
fi
