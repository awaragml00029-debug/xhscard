# 🐳 Docker 部署指南

## 📋 前提条件

确保已安装：
- Docker (version 20.10+)
- Docker Compose (version 2.0+)

检查安装：
```bash
docker --version
docker compose version
```

---

## 🚀 快速启动

### 方法一：使用 docker-compose（推荐）

```bash
# 1. 构建并启动
docker compose up -d

# 2. 查看日志
docker compose logs -f

# 3. 停止服务
docker compose down
```

### 方法二：使用启动脚本

```bash
# 1. 启动服务
./docker-start.sh

# 2. 查看日志
docker compose logs -f

# 3. 停止服务
docker compose down
```

### 方法三：手动 Docker 命令

```bash
# 1. 构建镜像
docker build -t xhscard-api .

# 2. 运行容器
docker run -d \
  --name xhscard-api \
  -p 7000:7000 \
  -e NODE_ENV=production \
  -e PORT=7000 \
  xhscard-api

# 3. 查看日志
docker logs -f xhscard-api

# 4. 停止容器
docker stop xhscard-api
docker rm xhscard-api
```

---

## 🔧 无 Docker 环境启动

如果系统中没有安装 Docker，可以使用简化启动脚本：

```bash
# 启动服务
./start.sh

# 查看日志
tail -f /tmp/xhscard.log

# 停止服务
./stop.sh
```

---

## 📊 常用命令

### 查看服务状态

```bash
# 查看容器状态
docker compose ps

# 查看实时日志
docker compose logs -f

# 查看最近 100 行日志
docker compose logs --tail=100

# 进入容器
docker compose exec xhscard-api sh
```

### 重启服务

```bash
# 重启容器
docker compose restart

# 重新构建并启动
docker compose up -d --build
```

### 清理资源

```bash
# 停止并删除容器
docker compose down

# 停止并删除容器和镜像
docker compose down --rmi all

# 停止并删除容器、镜像和卷
docker compose down --rmi all -v
```

---

## 🔍 健康检查

容器启动后，自动进行健康检查：

```bash
# 手动检查健康状态
curl http://localhost:7000/health

# 查看容器健康状态
docker inspect --format='{{.State.Health.Status}}' xhscard-api
```

---

## 🛠️ 故障排查

### 1. 端口被占用

```bash
# 查找占用 7000 端口的进程
lsof -i :7000

# 杀死进程
kill -9 <PID>
```

### 2. 容器无法启动

```bash
# 查看详细日志
docker compose logs

# 查看容器状态
docker compose ps -a

# 重新构建
docker compose build --no-cache
docker compose up -d
```

### 3. 构建失败

```bash
# 清理 Docker 缓存
docker system prune -a

# 重新构建
docker compose build --no-cache
```

---

## 📝 环境变量

可以通过 `.env` 文件或 `docker-compose.yml` 配置环境变量：

```yaml
environment:
  - NODE_ENV=production
  - PORT=7000
  - LOG_LEVEL=info
```

---

## 🌐 生产部署

### 使用自定义端口

编辑 `docker-compose.yml`:

```yaml
ports:
  - "8080:7000"  # 宿主机端口:容器端口
```

### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:7000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📚 相关文档

- [API 文档](./API.md)
- [快速开始](./QUICKSTART.md)
- [部署指南](./DEPLOY.md)
- [测试指南](./TESTING-3STEP.md)

---

## 💡 提示

1. **开发环境**：使用 `./start.sh` 启动，方便调试
2. **生产环境**：使用 Docker 部署，更稳定可靠
3. **自动重启**：Docker Compose 配置了 `restart: unless-stopped`
4. **健康检查**：每 30 秒自动检查服务健康状态

---

需要帮助？查看 [README.md](./README.md) 或提交 Issue。
