FROM node:16

WORKDIR /src



COPY package*.json ./
ENV DATABASE_URL="postgresql://postgres:C!7i66nEBf^Ce-f@13.40.76.235:5432/campus-app?schema=public"
RUN yarn install


COPY . .
RUN ls
RUN npx prisma generate
RUN npm run build
VOLUME /data
EXPOSE 5000

CMD ["node", "dist/app.js"]
