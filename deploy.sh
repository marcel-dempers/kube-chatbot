#!/bin/bash

echo "enter your azure bot ID"
read appid

echo "enter your azure bot password"
read appPassword

MICROSOFT_APP_PASSWORD=$(echo -n $appPassword | base64 | tr -d '\n')
MICROSOFT_APP_ID=$(echo -n $appid | base64 | tr -d '\n')

kubectl create ns bots
echo "
kind: Secret
apiVersion: v1
metadata:
  name: chatbot
  namespace: bots
type: Opaque
data:
  MICROSOFT_APP_PASSWORD: $MICROSOFT_APP_PASSWORD
  MICROSOFT_APP_ID: $MICROSOFT_APP_ID
" | kubectl apply  -f -

kubectl apply -f deploy.yaml
