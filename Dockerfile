# 多阶段构建 - 构建阶段
FROM node:24-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY server/package*.json ./server/
COPY shared/package*.json ./shared/

# 安装依赖
RUN npm install

# 复制源码
COPY . .

# 构建项目
RUN npm run build

# 生产阶段
FROM node:24-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY server/package*.json ./server/
COPY shared/package*.json ./shared/

# 只安装生产依赖
RUN npm install --production

# 从构建阶段复制编译后的文件
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/shared ./shared

# 暴露端口
EXPOSE 7000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=7000

# 启动应用
CMD ["node", "server/dist/index.js"]
