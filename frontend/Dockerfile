FROM node:23

WORKDIR /app

# Copy only package files first (cache layer)
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the app
COPY . .

# For dev
CMD ["npm", "run", "dev"]
