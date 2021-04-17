FROM mongo-express:latest
WORKDIR /app
COPY . .
RUN npm install
ENV mlc_jwtPrivateKey=notSecure
EXPOSE 3001
CMD node index.js
