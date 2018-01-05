FROM node:8.7.0-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash openssh curl

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

RUN mkdir -p /usr/src/app

COPY /src/ /usr/src/app/
WORKDIR /usr/src/app

EXPOSE 3978

CMD ["node", "app.js"]