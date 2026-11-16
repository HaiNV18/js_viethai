# Những lệnh sẽ chạy khi đưa lên Docker Hub
FROM node:20-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json trước để tận dụng Docker cache
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --omit=dev

# Copy toàn bộ source code vào container
COPY . .

# Mở port 3002
EXPOSE 3002

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
