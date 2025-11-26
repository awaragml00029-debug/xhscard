#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛑 停止 XHS Card API 服务...${NC}"
echo ""

# 从 PID 文件读取进程 ID
if [ -f /tmp/xhscard.pid ]; then
    PID=$(cat /tmp/xhscard.pid)
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        echo -e "${GREEN}✅ 服务已停止 (PID: $PID)${NC}"
        rm /tmp/xhscard.pid
    else
        echo -e "${YELLOW}⚠️  进程已不存在 (PID: $PID)${NC}"
        rm /tmp/xhscard.pid
    fi
else
    echo -e "${YELLOW}⚠️  未找到 PID 文件，尝试通过端口停止...${NC}"
fi

# 备用方案：通过端口杀死进程
if lsof -Pi :7000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}📍 发现端口 7000 上的进程，正在停止...${NC}"
    lsof -ti:7000 | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✅ 端口已清理${NC}"
else
    echo -e "${GREEN}✅ 端口 7000 已空闲${NC}"
fi

echo ""
echo -e "${GREEN}完成！${NC}"
