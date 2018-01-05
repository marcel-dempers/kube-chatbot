#!/bin/bash

docker build . -t aimvector/kube-chat-bot:1.0.0

echo "enter your azure bot id:"
read appid

echo "enter your azure bot password:"
read password 

docker rm --force chatbot
docker run --rm --name chatbot --net host \
-e MICROSOFT_APP_PASSWORD=$password \
-e NAME=KubeBot \
-e MICROSOFT_APP_ID=$appid \
-p 3978:3978 \
-v $PWD/src:/usr/src/app \
-v ~/.kube/config:/root/.kube/config \
aimvector/kube-chat-bot:1.0.0