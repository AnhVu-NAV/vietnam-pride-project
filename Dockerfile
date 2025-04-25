# Sử dụng nginx nhỏ gọn
FROM nginx:alpine

# Xoá nội dung mặc định của nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy toàn bộ project vào thư mục nginx
COPY . /usr/share/nginx/html
