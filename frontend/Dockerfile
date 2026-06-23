FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Next.js development server runs on port 3000 by default
EXPOSE 3000

CMD ["npm", "run", "dev"]
