# 버전 지정
FROM node:18.15

# Time Zone 설정
RUN ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
RUN echo Asia/Seoul > /etc/timezone

WORKDIR /app

# 필요 소스 복사
COPY package*.json /app
COPY ./src /app/src
COPY ./public /app/public

# 패키지 설치
RUN npm install

CMD ["npm", "start"]