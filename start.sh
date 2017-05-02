#!/bin/bash
# This file is used to check if the docer instances are running and then run the nodejs app
if docker top 28648123304e &>/dev/null
then
    echo "db container is running!"
else
    docker start 28648123304e
fi

if docker top effe0f8c5620 &>/dev/null
then
    echo "wp is Running"
else
   docker start effe0f8c5620 
fi

export WP_USER=admin
export WP_PASSWORD=admin
cd /root/apps/robaiesh
nodejs app.js $1
echo "DONE!" 
