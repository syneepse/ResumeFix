# Dockerfile for Express.js Backend
FROM node:18-alpine
WORKDIR /app
COPY back-end/package*.json ./
RUN npm install --production
COPY back-end .
# Ensure the uploads directory exists
RUN mkdir -p /app/uploads
VOLUME ["/app/uploads"]
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "src/index.js"]
